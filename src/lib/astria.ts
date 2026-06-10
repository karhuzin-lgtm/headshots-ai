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

// 4xx codes where Astria has confirmed the request was rejected before any tune
// was created — safe for the caller to auto-retry once the input is corrected.
const ASTRIA_SAFE_REJECTION_CODES = new Set([400, 401, 403, 422, 429]);

const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";
const GLOBAL_NEGATIVE_PROMPT =
  "wrong outfit, same clothes as input, casual wear if not startup style, distorted face, extra limbs, bad anatomy, blurry, low quality, different hairstyle, added hair, receding hairline, beard, facial hair, mustache, bald, changed hair color, swollen face, puffiness";

export const HEADSHOT_STYLES = {
  linkedin: {
    prompt: `OHWX person wearing a crisp light blue oxford shirt, clean neutral gray background, soft professional studio lighting, confident friendly expression, professional LinkedIn headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual wear, dark clothing, busy background",
  },
  corporate: {
    prompt: `OHWX person wearing a dark navy suit and white dress shirt, clean gray studio background, professional studio lighting, confident business expression, corporate headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual clothing, colorful background",
  },
  executive: {
    prompt: `OHWX person wearing a charcoal suit and white dress shirt, dark neutral backdrop, dramatic Rembrandt studio lighting, authoritative professional expression, executive headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, casual wear, bright background, informal clothing",
  },
  tech: {
    prompt: `OHWX person wearing a dark navy button-up shirt, modern minimal office with subtle window light, confident approachable expression, tech professional headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, casual t-shirt, hoodie, messy background",
  },
  creative: {
    prompt: `OHWX person wearing a smart casual blazer over a white shirt, warm bokeh background with golden atmospheric light, relaxed creative expression, editorial headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, formal suit, dark background, casual clothing",
  },
  startup: {
    prompt: `OHWX person wearing a clean white premium t-shirt or minimal hoodie, pure white studio background, natural soft lighting, relaxed confident founder expression, startup headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, formal wear, dark background, busy background",
  },
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;
export const IMAGES_PER_STYLE = 3;
const STYLE_KEYS = Object.keys(HEADSHOT_STYLES) as HeadshotStyle[];
export const EXPECTED_HEADSHOT_COUNT = STYLE_KEYS.length * IMAGES_PER_STYLE;

export const VALID_STYLE_KEYS: ReadonlySet<string> = new Set(STYLE_KEYS);

function buildStylePrompt(style: (typeof HEADSHOT_STYLES)[HeadshotStyle]): string {
  return [
    "Same hairstyle and facial features as in the reference photos. Do not add or remove hair.",
    style.prompt,
    "The outfit must match this style exactly and should not copy the clothing from the input selfies.",
    `Avoid: ${style.negative}, ${GLOBAL_NEGATIVE_PROMPT}.`,
  ].join(" ");
}

function getAstriaApiKey(): string {
  if (!ASTRIA_API_KEY) {
    throw new AstriaValidationError("ASTRIA_API_KEY is not configured");
  }
  return ASTRIA_API_KEY;
}

async function parseAstriaResponse(res: Response): Promise<any> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const details = data ? `: ${JSON.stringify(data)}` : "";
    const message =
      (typeof data?.message === "string" ? data.message : null) ??
      (typeof data?.error === "string" ? data.error : null) ??
      `Astria API request failed with status ${res.status}${details}`;
    throw new AstriaApiError(
      message,
      res.status,
      ASTRIA_SAFE_REJECTION_CODES.has(res.status)
    );
  }
  return data;
}

function resolveStyleKeys(keys: string[]): HeadshotStyle[] {
  const unique = [...new Set(keys)];
  if (unique.length === 0) {
    throw new AstriaValidationError("No style keys provided.");
  }
  const invalid = unique.filter((k) => !VALID_STYLE_KEYS.has(k));
  if (invalid.length > 0) {
    throw new AstriaValidationError(
      `Unknown style keys: ${invalid.join(", ")}. Valid: ${STYLE_KEYS.join(", ")}`
    );
  }
  return unique as HeadshotStyle[];
}

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
  const count = generation.expected_count;
  if (!Number.isSafeInteger(count) || count <= 0 || count > 200) {
    throw new AstriaValidationError(
      `expected_count must be a positive integer ≤ 200, got: ${count}`
    );
  }
  const styleKeys = resolveStyleKeys(generation.style_keys);
  if (count % styleKeys.length !== 0) {
    throw new AstriaValidationError(
      `expected_count (${count}) must be divisible by the number of styles (${styleKeys.length})`
    );
  }
  const imagesPerStyle = count / styleKeys.length;

  const body = {
    tune: {
      title: "headshot-user",
      name: "person",
      base_tune_id: 1504944,
      model_type: "lora",
      token: "OHWX",
      preset: "flux-lora-portrait",
      face_detection: true,
      steps: generation.training_steps || 500,
      image_urls: generation.input_urls,
      callback: callbackUrl,
      prompts_attributes: styleKeys.map((key) => ({
        text: buildStylePrompt(HEADSHOT_STYLES[key]),
        callback: callbackUrl,
        num_images: imagesPerStyle,
        w: 640,
        h: 768,
        super_resolution: generation.super_resolution,
        face_correct: true,
        steps: generation.inference_steps || 30,
      })),
    },
  };

  const apiKey = getAstriaApiKey();
  let res: Response;
  try {
    res = await fetch(`${BASE}/tunes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    // Network error or timeout after the request may have reached Astria — tune
    // status is unknown; block auto-retry to avoid duplicate creation/billing.
    throw new AstriaApiError(
      `ASTRIA_STATUS_UNKNOWN: network error during tune creation: ${err instanceof Error ? err.message : String(err)}`,
      0,
      false
    );
  }
  const data = await parseAstriaResponse(res);

  if (!data?.id) {
    // POST succeeded but no id returned — tune may have been created; block retry.
    throw new AstriaApiError(
      "ASTRIA_STATUS_UNKNOWN: Astria tune creation returned no tune id",
      res.status,
      false
    );
  }

  return String(data.id);
}

export async function fetchTuneOutputUrls(tuneId: string): Promise<string[]> {
  if (!/^\d+$/.test(tuneId)) {
    throw new AstriaValidationError(`Invalid tuneId format: ${tuneId}`);
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
