const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";

export const HEADSHOT_STYLES = {
  corporate:
    "ohwx man, navy blue suit jacket, white dress shirt, neutral light gray studio background, professional three-point lighting, confident expression, sharp focus on face, natural skin texture, shoulders-up portrait headshot, 85mm portrait photography",
  tech:
    "ohwx man, dark navy crewneck, open collar, blurred modern office background, soft window light, approachable expression, shoulders-up portrait headshot, professional photography",
  executive:
    "ohwx man, dark charcoal suit jacket, white dress shirt, dark studio backdrop, Rembrandt lighting, authoritative expression, shoulders-up portrait headshot, professional photography",
  creative:
    "ohwx man, smart casual blazer over white t-shirt, light warm background, soft natural light, relaxed creative expression, shoulders-up portrait headshot, professional photography",
  startup:
    "ohwx man, plain grey t-shirt, clean white background, bright studio light, relaxed confident expression, shoulders-up portrait headshot, professional photography",
  linkedin:
    "ohwx man, light blue dress shirt, no jacket, neutral grey background, soft studio light, natural smile, shoulders-up portrait headshot, professional photography",
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
    const message =
      data?.message ?? data?.error ?? `Astria API request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function createAstrinaTune(imageUrls: string[]): Promise<string> {
  const body = new URLSearchParams();
  body.append("tune[title]", "headshot-user");
  body.append("tune[name]", "man");
  body.append("tune[base_tune_id]", "1504944");
  body.append("tune[preset]", "flux-lora-portrait");
  body.append("tune[face_detection]", "true");
  body.append("tune[steps]", "1000");
  imageUrls.forEach((url) => body.append("tune[image_urls][]", url));

  const res = await fetch(`${BASE}/tunes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAstriaApiKey()}` },
    body,
  });
  const data = await parseAstriaResponse(res);

  if (!data?.id) {
    throw new Error("Astria tune creation returned no tune id");
  }

  return String(data.id);
}

export async function generateAstriaHeadshots(
  tuneId: string,
  _style: HeadshotStyle,
  prompt: string
): Promise<string[]> {
  const body = new URLSearchParams();
  body.append("prompt[text]", `<lora:${tuneId}:1.0> ${prompt}`);
  body.append(
    "prompt[negative_prompt]",
    "beard, facial hair, distorted face, enlarged face, waxy skin, CGI, full body, standing, sitting"
  );
  body.append("prompt[num_images]", "3");
  body.append("prompt[w]", "768");
  body.append("prompt[h]", "1024");
  body.append("prompt[super_resolution]", "true");
  body.append("prompt[face_correct]", "true");
  body.append("prompt[inpaint_faces]", "true");
  body.append("prompt[steps]", "30");

  const res = await fetch(`${BASE}/tunes/${tuneId}/prompts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAstriaApiKey()}` },
    body,
  });
  const data = await parseAstriaResponse(res);
  const promptId = data?.id;

  if (!promptId) {
    throw new Error("Astria prompt creation returned no prompt id");
  }

  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const check = await fetch(`${BASE}/tunes/${tuneId}/prompts/${promptId}`, {
      headers: { Authorization: `Bearer ${getAstriaApiKey()}` },
    });
    const result = await parseAstriaResponse(check);
    const images = result.images ?? result.output?.images;

    if (Array.isArray(images) && images.length > 0) {
      return images
        .map((img: { url?: string }) => img.url)
        .filter((url: unknown): url is string => typeof url === "string" && url.length > 0);
    }
  }

  throw new Error("Astria generation timeout");
}
