const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";
const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";

export const HEADSHOT_STYLES = {
  corporate:
    `sks man, navy blue suit jacket, white dress shirt, neutral light gray studio background, professional three-point lighting, confident expression, sharp focus on face, natural skin texture, shoulders-up portrait headshot, 85mm portrait photography${HEADSHOT_CROP_SUFFIX}`,
  tech:
    `sks man, dark navy crewneck, open collar, blurred modern office background, soft window light, approachable expression, shoulders-up portrait headshot, professional photography${HEADSHOT_CROP_SUFFIX}`,
  executive:
    `sks man, dark charcoal suit jacket, white dress shirt, dark studio backdrop, Rembrandt lighting, authoritative expression, shoulders-up portrait headshot, professional photography${HEADSHOT_CROP_SUFFIX}`,
  creative:
    `sks man, smart casual blazer over white t-shirt, light warm background, soft natural light, relaxed creative expression, shoulders-up portrait headshot, professional photography${HEADSHOT_CROP_SUFFIX}`,
  startup:
    `sks man, plain grey t-shirt, clean white background, bright studio light, relaxed confident expression, shoulders-up portrait headshot, professional photography${HEADSHOT_CROP_SUFFIX}`,
  linkedin:
    `sks man, light blue dress shirt, no jacket, neutral grey background, soft studio light, natural smile, shoulders-up portrait headshot, professional photography${HEADSHOT_CROP_SUFFIX}`,
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;

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

export async function createAstrinaTune(
  imageUrls: string[],
  callbackUrl: string,
  selectedStyle: HeadshotStyle
): Promise<string> {
  const prompt = HEADSHOT_STYLES[selectedStyle];
  const body = {
    tune: {
      title: "headshot-user",
      name: "man",
      base_tune_id: 1504944,
      model_type: "lora",
      token: "sks",
      preset: "flux-lora-portrait",
      face_detection: true,
      steps: 500,
      image_urls: imageUrls,
      callback: callbackUrl,
      prompts_attributes: [{
        text: prompt,
        callback: callbackUrl,
        num_images: 3,
        w: 640,
        h: 768,
        super_resolution: true,
        face_correct: true,
        steps: 30,
      }],
    },
  };

  const res = await fetch(`${BASE}/tunes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAstriaApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await parseAstriaResponse(res);

  if (!data?.id) {
    throw new Error("Astria tune creation returned no tune id");
  }

  return String(data.id);
}
