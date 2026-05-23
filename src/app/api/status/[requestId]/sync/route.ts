import { syncGenerationFromAstria } from "@/lib/generation-complete";
import { getGeneration } from "@/lib/generations-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Manual recovery: pull images from Astria and mark generation done when ready. */
export async function POST(_request: Request, { params }: { params: { requestId: string } }) {
  const generation = await getGeneration(params.requestId);
  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }
  if (!generation.tune_id) {
    return Response.json({ error: "No Astria tune id on this generation." }, { status: 400 });
  }

  try {
    const updated = await syncGenerationFromAstria(params.requestId);
    return Response.json({
      id: updated?.id,
      status: updated?.status,
      outputCount: updated?.output_urls.length ?? 0,
      resultUrl: updated ? `/try/result/${updated.id}` : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
