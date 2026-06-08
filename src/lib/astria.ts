import { collectAstriaImageUrls } from "@/lib/astria-images";
import type { GenerationRow } from "@/lib/generations-db";

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";
const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";
const GLOBAL_NEGATIVE_PROMPT =
  "wrong outfit, same clothes as input, casual wear if not startup style, distorted face, extra limbs, bad anatomy, blurry, low quality, different hairstyle, added hair, receding hairline, beard, facial hair, mustache, bald, changed hair color, swollen face, puffiness, painting, illustration, drawing, sketch, render, 3d render, 3d model, octane render, unreal engine, cgi, cg, video game character, doll, mannequin, action figure, cartoon, anime, stylized, plastic skin, plastic face, rubber skin, waxy skin, wax figure, glossy skin, shiny skin, porcelain skin, airbrushed, over-smoothed skin, smooth skin, poreless skin, retouched, photoshopped, beauty filter, instagram filter, skin smoothing filter, face tune, HDR, oversaturated, overexposed, overprocessed, oversharpened, plastic look, fake looking, artificial, uncanny valley, deformed, asymmetric eyes, crossed eyes, lazy eye, extra fingers, fused fingers, watermark, text, logo, signature";

/** Photorealism anchor — Flux responds better to narrative, photographic phrasing. */
const PHOTOREALISM_PREFIX =
  "RAW unedited photograph, photorealistic, hyper-detailed natural skin with visible pores, fine vellus hair, subtle skin texture, faint blemishes and natural color variation, realistic catchlights in the eyes, sharp focus on the eyes, shot on a full-frame Canon EOS R5 with an 85mm f/1.4 portrait lens, shallow depth of field with creamy bokeh, true-to-life skin tones, soft natural color grading, professional editorial photography, ultra realistic, lifelike";

export const HEADSHOT_STYLES = {
  linkedin: {
    prompt:
      `OHWX person wearing a crisp light blue oxford cotton shirt with a natural collar and visible fabric weave, clean light gray seamless studio backdrop with gentle falloff, soft diffused key light from a large softbox at 45 degrees with a subtle fill, gentle catchlights, confident friendly approachable expression with a slight natural smile, professional LinkedIn headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual wear, dark clothing, busy background, harsh shadows, blown highlights, flat lighting",
  },
  corporate: {
    prompt:
      `OHWX person wearing a tailored dark navy wool suit with a crisp white dress shirt, neutral mid-gray studio background, balanced three-point studio lighting with a soft key and clean fill, even flattering exposure, confident composed business expression, corporate headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual clothing, colorful background, wrinkled suit, harsh flash, flat lighting",
  },
  executive: {
    prompt:
      `OHWX person wearing a charcoal gray tailored suit with a crisp white dress shirt, deep dark gradient backdrop, dramatic Rembrandt lighting with a soft directional key, defined cheekbone shadow and a single catchlight, refined low-key contrast, authoritative confident expression, executive portrait${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, casual wear, bright background, informal clothing, flat lighting, washed out, overexposed",
  },
  tech: {
    prompt:
      `OHWX person wearing a dark navy button-up shirt in soft matte cotton with the top button open, modern minimal office background softly blurred with cool daylight from a large window, natural directional window light with soft shadows, confident relaxed approachable expression, tech professional headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, casual t-shirt, hoodie, messy background, cluttered desk, harsh shadows, flat lighting",
  },
  creative: {
    prompt:
      `OHWX person wearing a smart casual textured wool blazer over an open-collar white shirt, warm softly blurred background with golden bokeh and gentle backlight, soft warm window light wrapping the face with a subtle rim light, relaxed creative thoughtful expression, editorial portrait${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, formal suit, dark background, casual clothing, cold lighting, harsh shadows, flat lighting",
  },
  startup: {
    prompt:
      `OHWX person wearing a clean premium heather-gray crewneck t-shirt in soft cotton, bright clean off-white studio background, soft even natural daylight with a gentle wraparound fill, relaxed confident genuine founder expression with a natural smile, modern startup headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, formal wear, dark background, busy background, logo on shirt, graphic print, harsh shadows",
  },
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;

export const IMAGES_PER_STYLE = 3;
const STYLE_KEYS = Object.keys(HEADSHOT_STYLES) as HeadshotStyle[];
export const EXPECTED_HEADSHOT_COUNT = STYLE_KEYS.length * IMAGES_PER_STYLE;

function buildStylePrompt(style: (typeof HEADSHOT_STYLES)[HeadshotStyle]): string {
  return [
    `${PHOTOREALISM_PREFIX}.`,
    "Same hairstyle, same hairline and the exact same facial features as in the reference photos. Do not add or remove hair.",
    style.prompt,
    "The skin must look real with natural pores, fine texture and authentic tone — never smooth, plastic, waxy or airbrushed.",
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
