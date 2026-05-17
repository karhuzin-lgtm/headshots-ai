import { fal } from "@fal-ai/client";

let _initialized = false;
function initFal() {
  if (!_initialized && process.env.FAL_KEY) {
    fal.config({ credentials: process.env.FAL_KEY });
    _initialized = true;
  }
}

export const STYLE_PROMPTS = {
  corporate:
    "navy blue suit jacket, white dress shirt, neutral light gray studio background, professional three-point lighting, confident expression, sharp focus, natural skin texture, professional headshot photography",
  tech_casual:
    "dark navy crewneck sweater, open collar, blurred modern office background, soft window light, approachable expression, natural skin texture, professional headshot photography",
  executive:
    "dark charcoal suit jacket, white dress shirt, dark studio backdrop, Rembrandt lighting, authoritative expression, natural skin texture, professional headshot photography",
  creative:
    "smart casual blazer over white t-shirt, light warm background, soft natural light, relaxed creative expression, natural skin texture, professional headshot photography",
  startup:
    "plain grey t-shirt, clean white background, bright studio light, relaxed confident expression, natural skin texture, professional headshot photography",
  linkedin:
    "light blue dress shirt, no jacket, neutral grey background, soft studio light, natural smile, natural skin texture, professional headshot photography",
} as const;

export type HeadshotStyle = keyof typeof STYLE_PROMPTS;

export async function uploadReferencePhoto(file: File): Promise<string> {
  initFal();
  return await fal.storage.upload(file);
}

export async function generateHeadshotsWithPulid(
  referenceUrl: string,
  style: HeadshotStyle
): Promise<string> {
  initFal();
  const result = (await fal.subscribe("fal-ai/flux-pulid", {
    input: {
      reference_image_url: referenceUrl,
      prompt: STYLE_PROMPTS[style],
      negative_prompt:
        "distorted face, waxy skin, blurred eyes, CGI, 3d render, beard, facial hair, enlarged head, wrong anatomy",
      image_size: "portrait_4_3",
      num_inference_steps: 28,
      guidance_scale: 4.5,
      id_weight: 1.0,
      enable_safety_checker: true,
    },
    logs: false,
  })) as { data: { images?: { url: string }[] } };
  const url = result.data.images?.[0]?.url;
  if (!url) throw new Error(`No image for style ${style}`);
  return url;
}
