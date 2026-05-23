import { collectAstriaImageUrls } from "@/lib/astria-images";
import { isAstriaWebhookAuthorized, mergeGenerationOutputs } from "@/lib/generation-complete";
import { getGeneration } from "@/lib/generations-db";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!isAstriaWebhookAuthorized(request)) {
    console.warn("[astria webhook] unauthorized — check ASTRIA_WEBHOOK_SECRET / callback URL");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const generationId = url.searchParams.get("generationId");

  if (!generationId) {
    return Response.json({ error: "Missing generationId" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  console.log("[astria webhook] generationId=", generationId, "keys=", body && typeof body === "object" ? Object.keys(body as object) : []);

  const generation = await getGeneration(generationId);
  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  const outputUrls = collectAstriaImageUrls(body);
  if (outputUrls.length === 0) {
    return Response.json({ ok: true, message: "No images yet; waiting for prompt callbacks." });
  }

  if (generation.status === "done") {
    return Response.json({ ok: true, count: generation.output_urls.length, alreadyDone: true });
  }

  const updated = await mergeGenerationOutputs(generationId, outputUrls);

  return Response.json({
    ok: true,
    count: updated.output_urls.length,
    status: updated.status,
  });
}
