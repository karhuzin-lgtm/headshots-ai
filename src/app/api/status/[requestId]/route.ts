import { syncGenerationFromAstria } from "@/lib/generation-complete";
import { getGeneration } from "@/lib/generations-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { requestId: string } }) {
  let generation = await getGeneration(params.requestId);

  if (!generation) {
    return Response.json(
      { error: "Generation not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (generation.status === "processing" && generation.tune_id) {
    try {
      const synced = await syncGenerationFromAstria(params.requestId);
      if (synced) generation = synced;
    } catch (error) {
      console.error("[status] Astria sync failed:", error);
    }
  }

  // Generation is gated behind a LavaTop payment: a `pending` + unpaid row is
  // waiting for the buyer to complete checkout.
  const awaitingPayment =
    !generation.paid && generation.status === "pending" && !generation.tune_id;

  return Response.json(
    {
      id: generation.id,
      status: generation.status,
      tuneId: generation.tune_id,
      inputUrls: generation.input_urls,
      outputUrls: generation.output_urls,
      imageUrl: generation.output_urls[0],
      error: generation.error_message,
      paid: generation.paid,
      awaitingPayment,
      paymentUrl: awaitingPayment ? generation.payment_url : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
