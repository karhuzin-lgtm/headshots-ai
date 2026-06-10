import { collectAstriaImageUrls } from "@/lib/astria-images";
import type { GenerationRow } from "@/lib/generations-db";

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";

/**
 * Typed error for Astria API failures. isRetriable=true means Astria confirmed
 * rejection (4xx) — the tune was never created, auto-retry is safe.
 * isRetriable=false (5xx) means the tune may have been created — treat as
 * ASTRIA_STATUS_UNKNOWN and block automatic retry.
 */
export class AstriaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly isRetriable: boolean
  ) {
    super(message);
    this.name = "AstriaApiError";
  }
}

/**
 * Thrown for local validation errors that occur before any Astria request is
 * made — confirmed pre-fetch failures where auto-retry is safe once the
 * underlying data is fixed (e.g. unknown style key, bad expectedCount).
 */
export class AstriaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AstriaValidationError";
  }
}

// Flux does not respond to negative prompts — avoid-clauses are embedded in
// the positive text as "not X" or "do not wear X" per Astria docs.
const PHOTO_SPECS =
  ", 85mm portrait lens, shallow depth of field, sharp focus on eyes, natural skin texture, photorealistic";
const HEADSHOT_CROP_SUFFIX = ", face and shoulders framing, close-up portrait";

export const HEADSHOT_STYLES = {
  linkedin: {
    prompt:
      `OHWX person in a crisp light blue oxford shirt, neutral gray background, soft professional studio lighting, confident friendly expression, professional LinkedIn headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "t-shirt, hoodie, casual or dark clothing",
  },
  corporate: {
    prompt:
      `OHWX person in a dark navy suit and white dress shirt, clean gray studio background, professional studio lighting, confident business expression, corporate headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "t-shirt, hoodie, casual clothing",
  },
  executive: {
    prompt:
      `OHWX person in a charcoal suit and white dress shirt, dark neutral backdrop, dramatic Rembrandt studio lighting, authoritative professional expression, executive headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "t-shirt, casual wear, informal clothing",
  },
  tech: {
    prompt:
      `OHWX person in a dark navy button-up shirt, modern minimal office with subtle window light, confident approachable expression, tech professional headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "suit and tie, casual t-shirt, hoodie",
  },
  creative: {
    prompt:
      `OHWX person in a smart casual blazer over a white shirt, warm bokeh background with golden atmospheric light, relaxed creative expression, editorial headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "t-shirt, formal suit",
  },
  startup: {
    prompt:
      `OHWX person in a clean white premium t-shirt or minimal hoodie, pure white studio background, natural soft lighting, relaxed confident founder expression, startup headshot${PHOTO_SPECS}${HEADSHOT_CROP_SUFFIX}`,
    avoidOutfit: "suit, tie, formal wear",
  },
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;

export const IMAGES_PER_STYLE = 3;
const STYLE_KEYS = Object.keys(HEADSHOT_STYLES) as HeadshotStyle[];
export const EXPECTED_HEADSHOT_COUNT = STYLE_KEYS.length * IMAGES_PER_STYLE;

function buildStylePrompt(style: (typeof HEADSHOT_STYLES)[HeadshotStyle]): string {
  return [
    style.prompt,
    "Same hairstyle and hair length as the reference photos.",
    `Do not copy clothing from the reference photos. Do not wear ${style.avoidOutfit}.`,
    "Realistic professional photograph. Not digital art, CGI, cartoon, or illustration.",
  ].join(" ");
}

function getAstriaApiKey(): string {
  if (!ASTRIA_API_KEY) {
    throw new AstriaValidationError("ASTRIA_API_KEY is not configured");
  }

  return ASTRIA_API_KEY;
}

// Codes where Astria provably rejected the request before any tune was created.
// 4xx codes NOT in this set (e.g. 408 Request Timeout) are ambiguous — Astria
// may have processed the request and timed out sending the response.
const ASTRIA_SAFE_REJECTION_CODES = new Set([400, 401, 403, 422]);

async function parseAstriaResponse(res: Response): Promise<any> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const details = data ? `: ${JSON.stringify(data)}` : "";
    const message =
      data?.message ??
      data?.error ??
      `Astria API request failed with status ${res.status}${details}`;
    throw new AstriaApiError(
      message,
      res.status,
      ASTRIA_SAFE_REJECTION_CODES.has(res.status)
    );
  }

  return data;
}

/** Style keys requested by a generation, validated against HEADSHOT_STYLES. */
function resolveStyleKeys(keys: string[]): HeadshotStyle[] {
  const unknown = keys.filter((k) => !Object.hasOwn(HEADSHOT_STYLES, k));
  if (unknown.length) {
    throw new AstriaValidationError(`resolveStyleKeys: unknown style keys [${unknown.join(",")}]`);
  }
  const deduped = Array.from(new Set(keys)) as HeadshotStyle[];
  if (!deduped.length) {
    throw new AstriaValidationError("resolveStyleKeys: style_keys is empty");
  }
  return deduped;
}

/**
 * Build the per-style num_images array that sums exactly to expected_count.
 * Distributes the remainder across the first styles to avoid rounding drift.
 * Requires expectedCount >= styleCount so every style gets at least 1 image.
 */
function distributeImages(expectedCount: number, styleCount: number): number[] {
  if (!Number.isSafeInteger(expectedCount) || expectedCount < styleCount) {
    throw new AstriaValidationError(
      `expected_count (${expectedCount}) must be a safe integer >= styleCount (${styleCount})`
    );
  }
  const base = Math.floor(expectedCount / styleCount);
  const remainder = expectedCount % styleCount;
  return Array.from({ length: styleCount }, (_, i) => (i < remainder ? base + 1 : base));
}

/**
 * Creates one Astria tune and queues the generation's styles. Photo count,
 * styles, HD upscale and step counts come from the generation's tier snapshot.
 */
export async function createAstrinaTune(
  generation: Pick<
    GenerationRow,
    | "input_urls"
    | "style_keys"
    | "expected_count"
    | "super_resolution"
    | "inference_steps"
    | "training_steps"
  >,
  callbackUrl: string
): Promise<string> {
  const styleKeys = resolveStyleKeys(generation.style_keys);
  const imagesPerStyleArr = distributeImages(generation.expected_count, styleKeys.length);
  const trainingSteps = generation.training_steps > 0 ? generation.training_steps : 500;
  const inferenceSteps = generation.inference_steps > 0 ? generation.inference_steps : 30;

  const body = {
    tune: {
      title: "headshot-user",
      name: "person",
      base_tune_id: 1504944,
      model_type: "lora",
      token: "OHWX",
      preset: "flux-lora-portrait",
      face_detection: true,
      steps: trainingSteps,
      image_urls: generation.input_urls,
      callback: callbackUrl,
      prompts_attributes: styleKeys.map((key, i) => ({
        text: buildStylePrompt(HEADSHOT_STYLES[key]),
        callback: callbackUrl,
        num_images: imagesPerStyleArr[i],
        w: 640,
        h: 768,
        super_resolution: generation.super_resolution,
        face_correct: true,
        steps: inferenceSteps,
      })),
    },
  };

  const res = await fetch(`${BASE}/tunes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAstriaApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // Runs inside the LavaTop webhook — don't let a hung Astria call hold it open.
    signal: AbortSignal.timeout(60_000),
  });
  const data = await parseAstriaResponse(res);

  if (!data?.id) {
    throw new Error("Astria tune creation returned no tune id");
  }

  return String(data.id);
}

const TUNE_ID_RE = /^\d+$/;

/** Fetch all generated image URLs for a tune (fallback when webhooks fail). */
export async function fetchTuneOutputUrls(tuneId: string): Promise<string[]> {
  if (!TUNE_ID_RE.test(tuneId)) {
    throw new Error(`Invalid tuneId format: ${tuneId}`);
  }
  const res = await fetch(`${BASE}/tunes/${encodeURIComponent(tuneId)}/prompts`, {
    headers: {
      Authorization: `Bearer ${getAstriaApiKey()}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(30_000),
  });
  const data = await parseAstriaResponse(res);
  const prompts = Array.isArray(data) ? data : [];

  const urls = prompts.flatMap((prompt) => collectAstriaImageUrls(prompt));
  return Array.from(new Set(urls));
}
