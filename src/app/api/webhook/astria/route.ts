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

function collectImageUrls(body: unknown): string[] {
  const tune = (body && typeof body === "object" && "tune" in body
    ? (body as { tune?: AstriaTune }).tune
    : body) as AstriaTune | undefined;

  return (
    tune?.prompts
      ?.flatMap((prompt) => prompt.images ?? [])
      .map((image) => image.url)
      .filter((url): url is string => typeof url === "string" && url.length > 0) ?? []
  );
}

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
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
    await updateGenerationStatus({
      id: generationId,
      status: "failed",
      errorMessage: "Astria webhook returned no generated images.",
    });
    return Response.json({ error: "No generated images" }, { status: 422 });
  }

  const completedGeneration = await updateGenerationStatus({
    id: generationId,
    status: "done",
    outputUrls,
  });

  try {
    await sendHeadshotsReady(
      completedGeneration.email,
      `/try/result/${completedGeneration.id}`,
      completedGeneration.output_urls
    );
  } catch (error) {
    console.error("headshots-ready email failed:", error);
  }

  return Response.json({ ok: true, count: outputUrls.length });
}
