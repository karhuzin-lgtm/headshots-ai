import { getGeneration } from "@/lib/generations-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { requestId: string } }) {
  const generation = await getGeneration(params.requestId);
  console.log("[status] DB result:", JSON.stringify(generation));

  if (!generation) {
    return Response.json(
      { error: "Generation not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    {
      id: generation.id,
      status: generation.status,
      tuneId: generation.tune_id,
      inputUrls: generation.input_urls,
      outputUrls: generation.output_urls,
      imageUrl: generation.output_urls[0],
      error: generation.error_message,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
