import { getGeneration, updateGenerationStatus } from "@/lib/generations-db";
import { sendHeadshotsReady } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 300;

type AstriaImage = {
  url?: unknown;
};

type AstriaPrompt = {
  images?: AstriaImage[];
};

type AstriaTune = {
  prompts?: AstriaPrompt[];
};

function urlsFromImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => {
      if (typeof image === "string") return image;
      if (image && typeof image === "object" && "url" in image) {
        return (image as AstriaImage).url;
      }
      return null;
    })
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

function collectImageUrls(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];

  const payload = body as {
    tune?: AstriaTune;
    prompt?: AstriaPrompt;
    prompts?: AstriaPrompt[];
    images?: unknown;
  };

  const directImageUrls = urlsFromImages(payload.images);
  const promptImageUrls = urlsFromImages(payload.prompt?.images);
  const promptsImageUrls =
    payload.prompts?.flatMap((prompt) => urlsFromImages(prompt.images)) ?? [];
  const tuneImageUrls =
    payload.tune?.prompts?.flatMap((prompt) => urlsFromImages(prompt.images)) ?? [];

  return [...directImageUrls, ...promptImageUrls, ...promptsImageUrls, ...tuneImageUrls];
}

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const secret = process.env.ASTRIA_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get("x-astria-signature") ?? "";
    if (sig !== secret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  const generationId = url.searchParams.get("generationId");

  if (!generationId) {
    return Response.json({ error: "Missing generationId" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  console.log("[astria webhook] body", JSON.stringify(body));

  const generation = await getGeneration(generationId);
  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  const outputUrls = collectImageUrls(body);
  if (outputUrls.length === 0) {
    return Response.json({ ok: true, message: "No images yet; waiting for prompt callbacks." });
  }

  if (generation.status === "done") {
    return Response.json({ ok: true, count: generation.output_urls.length, alreadyDone: true });
  }

  const combinedOutputUrls = Array.from(new Set([...generation.output_urls, ...outputUrls]));
  const nextStatus = combinedOutputUrls.length >= 3 ? "done" : "processing";
  const updatedGeneration = await updateGenerationStatus({
    id: generationId,
    status: nextStatus,
    outputUrls: combinedOutputUrls,
  });

  if (nextStatus === "done") {
    try {
      await sendHeadshotsReady(
        updatedGeneration.email,
        `/try/result/${updatedGeneration.id}`,
        updatedGeneration.output_urls
      );
    } catch (error) {
      console.error("headshots-ready email failed:", error);
    }
  }

  return Response.json({ ok: true, count: combinedOutputUrls.length, status: nextStatus });
}
