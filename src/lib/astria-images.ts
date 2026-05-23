/** Expected outputs: 6 styles × 3 images */
export const EXPECTED_HEADSHOT_OUTPUTS = 18;

type AstriaImage = {
  url?: unknown;
};

function urlFromImageEntry(image: unknown): string | null {
  if (typeof image === "string" && image.startsWith("http")) return image;
  if (image && typeof image === "object") {
    const record = image as Record<string, unknown>;
    for (const key of ["url", "image_url", "download_url", "src"]) {
      const value = record[key];
      if (typeof value === "string" && value.startsWith("http")) return value;
    }
  }
  return null;
}

function urlsFromImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map(urlFromImageEntry)
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

/** Extract image URLs from Astria tune/prompt webhook or API payloads. */
export function collectAstriaImageUrls(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];

  const payload = body as {
    tune?: { prompts?: { images?: unknown }[] };
    prompt?: { images?: unknown };
    prompts?: { images?: unknown }[];
    images?: unknown;
    image_urls?: unknown;
  };

  const fromNestedPrompt =
    payload.prompt && typeof payload.prompt === "object"
      ? collectAstriaImageUrls(payload.prompt)
      : [];

  const chunks = [
    ...urlsFromImages(payload.images),
    ...urlsFromImages(payload.image_urls),
    ...fromNestedPrompt,
    ...(payload.prompts?.flatMap((p) => urlsFromImages(p.images)) ?? []),
    ...(payload.tune?.prompts?.flatMap((p) => urlsFromImages(p.images)) ?? []),
  ];

  // Astria headshots-starter sends { prompt: { images: string[] } }
  if ("prompt" in payload && payload.prompt && typeof payload.prompt === "object") {
    chunks.push(...urlsFromImages((payload.prompt as { images?: unknown }).images));
  }

  return Array.from(new Set(chunks));
}
