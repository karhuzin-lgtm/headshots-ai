import { fal } from "@fal-ai/client";

const ENDPOINT = "fal-ai/flux/dev/image-to-image" as const;

export const STYLE_PROMPTS: Record<string, string> = {
  linkedin:
    "Professional LinkedIn profile headshot of the same person, soft studio key light, neutral warm gray backdrop, sharp eyes, natural skin texture, business-casual wardrobe, 85mm portrait look, photorealistic, high detail.",
  corporate:
    "Executive corporate headshot of the same person, charcoal or navy jacket, confident relaxed posture, subtle office interior bokeh, cinematic soft contrast, photorealistic business portrait.",
  casual:
    "Approachable casual portrait headshot of the same person, relaxed genuine smile, soft window light, simple natural wardrobe, warm blurred indoor background, lifestyle editorial, photorealistic.",
  professional:
    "Premium studio headshot of the same person, crisp business attire, softbox lighting, clean minimal background, magazine editorial retouching, photorealistic.",
  creative:
    "Creative modern headshot of the same person, expressive confident look, subtle rim light, rich color depth, soft gradient backdrop, contemporary advertising photography, photorealistic.",
};

function ensureFalConfigured() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Missing FAL_KEY environment variable.");
  fal.config({ credentials: key });
}

export async function generateHeadshotFromReference(input: {
  imageUrl: string;
  style: string;
}): Promise<string> {
  ensureFalConfigured();
  const prompt =
    STYLE_PROMPTS[input.style] ??
    STYLE_PROMPTS.professional;

  const result = await fal.subscribe(ENDPOINT, {
    input: {
      image_url: input.imageUrl,
      prompt,
      strength: 0.82,
      num_inference_steps: 28,
      guidance_scale: 3.6,
      output_format: "jpeg",
      enable_safety_checker: true,
    },
    logs: false,
  });

  const url = result.data.images?.[0]?.url;
  if (!url) throw new Error("fal.ai returned no image URL.");
  return url;
}
