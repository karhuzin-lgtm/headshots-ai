import { getGeneration } from "@/lib/generations-db";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
  const generation = await getGeneration(params.orderId);

  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  return Response.json({
    id: generation.id,
    status: generation.status,
    inputUrls: generation.input_urls,
    outputUrls: generation.output_urls,
    imageUrl: generation.output_urls[0],
  });
}
