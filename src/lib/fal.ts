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

export async function uploadReferencePhotos(files: File[]): Promise<string[]> {
  initFal();
  return await Promise.all(files.slice(0, 4).map((file) => fal.storage.upload(file)));
}

export async function generateHeadshotsWithPulid(
  referenceUrls: string[],
  style: HeadshotStyle
): Promise<string[]> {
  initFal();
  const result = (await fal.subscribe("fal-ai/pulid", {
    input: {
      reference_images: referenceUrls.map((url) => ({ image_url: url })),
      prompt: STYLE_PROMPTS[style],
      negative_prompt:
        "distorted face, elongated face, thin face, waxy skin, CGI, beard, facial hair",
      image_size: { width: 768, height: 1024 },
      num_images: 3,
      num_inference_steps: 4,
      guidance_scale: 1.2,
      id_scale: 0.8,
      mode: "fidelity",
    },
    logs: false,
  })) as { data: { images?: { url: string }[] } };
  const urls = result.data.images?.map((image) => image.url).filter(Boolean) ?? [];
  if (urls.length === 0) throw new Error(`No images for style ${style}`);
  return urls;
}
