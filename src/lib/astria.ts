import { collectAstriaImageUrls } from "@/lib/astria-images";
import type { GenerationRow } from "@/lib/generations-db";

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";
const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";
const GLOBAL_NEGATIVE_PROMPT =
  "wrong outfit, same clothes as input, casual wear if not startup style, distorted face, extra limbs, bad anatomy, blurry, low quality, different hairstyle, added hair, receding hairline, beard, facial hair, mustache, bald, changed hair color, swollen face, puffiness";

export const HEADSHOT_STYLES = {
  linkedin: {
    prompt:
      `OHWX person wearing a crisp light blue oxford shirt, clean neutral gray background, soft professional studio lighting, confident friendly expression, professional LinkedIn headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual wear, dark clothing, busy background",
  },
  corporate: {
    prompt:
      `OHWX person wearing a dark navy suit and white dress shirt, clean gray studio background, professional studio lighting, confident business expression, corporate headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual clothing, colorful background",
  },
  executive: {
    prompt:
      `OHWX person wearing a charcoal suit and white dress shirt, dark neutral backdrop, dramatic Rembrandt studio lighting, authoritative professional expression, executive headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, casual wear, bright background, informal clothing",
  },
  tech: {
    prompt:
      `OHWX person wearing a dark navy button-up shirt, modern minimal office with subtle window light, confident approachable expression, tech professional headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, casual t-shirt, hoodie, messy background",
  },
  creative: {
    prompt:
      `OHWX person wearing a smart casual blazer over a white shirt, warm bokeh background with golden atmospheric light, relaxed creative expression, editorial headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, formal suit, dark background, casual clothing",
  },
  startup: {
    prompt:
      `OHWX person wearing a clean white premium t-shirt or minimal hoodie, pure white studio background, natural soft lighting, relaxed confident founder expression, startup headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, formal wear, dark background, busy background",
  },
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;

export const IMAGES_PER_STYLE = 3;
const STYLE_KEYS = Object.keys(HEADSHOT_STYLES) as HeadshotStyle[];
export const EXPECTED_HEADSHOT_COUNT = STYLE_KEYS.length * IMAGES_PER_STYLE;

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
    throw new Error("ASTRIA_API_KEY is not configured");
  }

  return ASTRIA_API_KEY;
}

async function parseAstriaResponse(res: Response): Promise<any> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const details = data ? `: ${JSON.stringify(data)}` : "";
    const message =
      data?.message ??
      data?.error ??
      `Astria API request failed with status ${res.status}${details}`;
    throw new Error(message);
  }

  return data;
}

/** Style keys requested by a generation, validated against HEADSHOT_STYLES. */
function resolveStyleKeys(keys: string[]): HeadshotStyle[] {
  const valid = keys.filter((k): k is HeadshotStyle => k in HEADSHOT_STYLES);
  return valid.length ? valid : STYLE_KEYS;
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
  const imagesPerStyle = Math.max(
    1,
    Math.round(generation.expected_count / styleKeys.length)
  );

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

/** Fetch all generated image URLs for a tune (fallback when webhooks fail). */
export async function fetchTuneOutputUrls(tuneId: string): Promise<string[]> {
  const res = await fetch(`${BASE}/tunes/${tuneId}/prompts`, {
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
