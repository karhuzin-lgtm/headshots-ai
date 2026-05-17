const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";
const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";
const GLOBAL_NEGATIVE_PROMPT =
  "wrong outfit, same clothes as input, casual wear if not startup style, distorted face, extra limbs, bad anatomy, blurry, low quality";

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

function buildStylePrompt(style: (typeof HEADSHOT_STYLES)[HeadshotStyle]): string {
  return [
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

export async function createAstrinaTune(
  imageUrls: string[],
  callbackUrl: string,
  selectedStyle: HeadshotStyle
): Promise<string> {
  const style = HEADSHOT_STYLES[selectedStyle];
  const body = {
    tune: {
      title: "headshot-user",
      name: "person",
      base_tune_id: 1504944,
      model_type: "lora",
      token: "OHWX",
      preset: "flux-lora-portrait",
      face_detection: true,
      steps: 500,
      image_urls: imageUrls,
      callback: callbackUrl,
      prompts_attributes: [{
        text: buildStylePrompt(style),
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
