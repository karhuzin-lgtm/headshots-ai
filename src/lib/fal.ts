import { fal } from "@fal-ai/client";
import JSZip from "jszip";

const TRAIN_ENDPOINT = "fal-ai/flux-lora-fast-training" as const;
const GENERATE_ENDPOINT = "fal-ai/flux-lora" as const;
const TRIGGER_PHRASE = "OHWX person";

export const STYLE_PROMPTS = {
  corporate:
    "OHWX person, professional corporate headshot, navy business suit, crisp white shirt, neutral gray seamless background, soft studio lighting with subtle catchlight, confident professional expression, sharp focus, photorealistic",
  tech_casual:
    "OHWX person, modern tech professional headshot, smart casual attire, blurred contemporary office background, natural window light mixed with studio fill, approachable confident expression, sharp focus, photorealistic",
  executive:
    "OHWX person, executive portrait photography, dark charcoal suit, white shirt, classic dark studio backdrop, Rembrandt lighting setup, authoritative expression, dramatic depth, photorealistic",
  creative:
    "OHWX person, creative professional headshot, stylish contemporary outfit, shallow depth of field bokeh background, golden hour mixed with studio lighting, warm color grade, expressive natural smile, photorealistic",
  startup:
    "OHWX person, startup founder headshot, business casual attire, clean white or off-white background, bright airy studio lighting, confident relaxed expression, modern editorial style, photorealistic",
  linkedin:
    "OHWX person, professional LinkedIn headshot photo, business formal attire, neutral gray background, soft studio lighting, natural skin tones, sharp focus, photorealistic",
} as const;

export type FreeHeadshotStyle = keyof typeof STYLE_PROMPTS;

export function isFreeHeadshotStyle(value: unknown): value is FreeHeadshotStyle {
  return typeof value === "string" && value in STYLE_PROMPTS;
}

function ensureFalConfigured() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Missing FAL_KEY environment variable.");
  fal.config({ credentials: key });
}

function fileExtension(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/heic") return "heic";
  if (file.type === "image/heif") return "heif";
  const extension = file.name.toLowerCase().match(/\.(jpe?g|png|webp|heic|heif)$/)?.[1];
  if (extension) return extension === "jpeg" ? "jpg" : extension;
  return "jpg";
}

export async function createTrainingZip(files: File[]): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    zip.file(`selfie_${i + 1}.${fileExtension(file)}`, Buffer.from(await file.arrayBuffer()));
    zip.file(
      `selfie_${i + 1}.txt`,
      `portrait photo of ${TRIGGER_PHRASE}, professional AI headshot reference`
    );
  }

  const zipBytes = await zip.generateAsync({ type: "uint8array" });
  const zipArrayBuffer = zipBytes.buffer.slice(
    zipBytes.byteOffset,
    zipBytes.byteOffset + zipBytes.byteLength
  ) as ArrayBuffer;

  return new Blob([zipArrayBuffer], { type: "application/zip" });
}

export async function trainLoRA(input: {
  imagesDataUrl: string;
  webhookUrl: string;
}): Promise<string> {
  ensureFalConfigured();

  const trainingInput = {
      images_data_url: input.imagesDataUrl,
      data_archive_format: "zip",
      trigger_phrase: TRIGGER_PHRASE,
      create_masks: true,
      subject_crop: true,
      steps: 1000,
    } as any;

  const submitted = await fal.queue.submit(TRAIN_ENDPOINT, {
    input: trainingInput,
    webhookUrl: input.webhookUrl,
  });

  return submitted.request_id;
}

export function getLoraPathFromTrainingResult(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const file = (data as { diffusers_lora_file?: unknown }).diffusers_lora_file;
  if (typeof file === "string") return file;
  if (file && typeof file === "object" && "url" in file) {
    const url = (file as { url?: unknown }).url;
    return typeof url === "string" ? url : null;
  }
  return null;
}

export async function generateHeadshots(
  loraPath: string,
  style: FreeHeadshotStyle
): Promise<string[]> {
  ensureFalConfigured();

  const generationInput = {
    prompt: STYLE_PROMPTS[style],
    negative_prompt:
      "cartoon, anime, painting, low quality, blurry, distorted, glitch, artificial colors, oversaturated",
    loras: [{ path: loraPath, scale: 1 }],
    image_size: "portrait_4_3",
    num_images: 3,
    num_inference_steps: 28,
    guidance_scale: 3.5,
    output_format: "jpeg",
    enable_safety_checker: true,
  } as any;

  const result = await fal.subscribe(GENERATE_ENDPOINT, {
    input: generationInput,
    logs: false,
  });

  const urls =
    result.data.images
      ?.map((image) => image.url)
      .filter((url): url is string => typeof url === "string") ?? [];

  if (urls.length === 0) throw new Error("fal.ai returned no generated images.");
  return urls;
}
