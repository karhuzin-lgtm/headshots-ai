import { fal } from "@fal-ai/client";
import JSZip from "jszip";

const TRAIN_ENDPOINT = "fal-ai/flux-lora-portrait-trainer" as const;
const GENERATE_ENDPOINT = "fal-ai/flux-lora" as const;
const TRIGGER_PHRASE = "OHWX person";
const STYLE_PROMPT_SUFFIX =
  ", natural skin texture with subtle pores, consistent soft studio lighting, authentic facial expression, sharp eyes with natural light reflections, real photograph quality";

export const STYLE_PROMPTS = {
  corporate:
    `OHWX person, navy blue suit jacket, white dress shirt, no tie, neutral light gray studio background, professional three-point lighting, confident expression, sharp focus, Canon portrait lens${STYLE_PROMPT_SUFFIX}`,
  tech_casual:
    `OHWX person, dark navy crewneck sweater, no jacket, blurred modern office background, soft window light, approachable expression, sharp focus${STYLE_PROMPT_SUFFIX}`,
  executive:
    `OHWX person, dark charcoal suit jacket, white dress shirt, dark studio backdrop, Rembrandt lighting, authoritative expression${STYLE_PROMPT_SUFFIX}`,
  creative:
    `OHWX person, black turtleneck, cream colored background, soft natural light, artistic expression${STYLE_PROMPT_SUFFIX}`,
  startup:
    `OHWX person, grey t-shirt, white background, bright studio light, relaxed confident expression${STYLE_PROMPT_SUFFIX}`,
  linkedin:
    `OHWX person, light blue dress shirt, no jacket, neutral grey background, soft studio light, natural smile${STYLE_PROMPT_SUFFIX}`,
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
      "distorted face, enlarged face, waxy skin, porcelain skin, oversaturated, over-smoothed skin, blurred eyes, artificial colors, CGI, 3d render, illustration, cartoon, deformed hands, extra fingers, wrong anatomy",
    loras: [{ path: loraPath, scale: 1 }],
    image_size: "portrait_4_3",
    num_images: 3,
    num_inference_steps: 32,
    guidance_scale: 3.2,
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
