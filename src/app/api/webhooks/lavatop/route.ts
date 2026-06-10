import { NextResponse } from "next/server";
import type { PaymentSuccessData } from "lava-top-sdk";

import {
  findPendingUnpaidGeneration,
  getGenerationByPaymentId,
  markGenerationPaid,
  setGenerationPaymentId,
} from "@/lib/generations-db";
import { getLavaWebhookSecret } from "@/lib/lavatop";
import { startAstriaGeneration } from "@/lib/start-generation";

export const runtime = "nodejs";
export const maxDuration = 300;

async function handlePaymentSuccess(data: PaymentSuccessData): Promise<void> {
  const contractId = data.contractId;
  const email = data.buyer?.email?.trim().toLowerCase() ?? "";

  // Match the paid contract back to the pending generation: by stored invoice
  // id first, then fall back to the buyer's most recent unpaid upload.
  let generation =
    (contractId ? await getGenerationByPaymentId(contractId) : null) ??
    (email ? await findPendingUnpaidGeneration(email) : null);

  if (!generation) {
    console.error("LavaTop webhook: no matching generation", { contractId, email });
    return;
  }

  // Skip only if generation already started/finished. A `failed` row WITHOUT a
  // tune_id (transient Astria error) is intentionally NOT skipped, so a webhook
  // retry can recover it. startAstriaGeneration is idempotent (atomic claim).
  const alreadyStarted =
    !!generation.tune_id ||
    generation.status === "processing" ||
    generation.status === "done";
  if (alreadyStarted) {
    return;
  }

  // Persist contractId so a retry matches by payment_id (the email fallback only
  // works while paid=false, which markGenerationPaid below flips).
  // setGenerationPaymentId refuses to overwrite a different existing payment_id
  // (returns false) — treat that as a conflict and skip this webhook event.
  if (contractId && generation.payment_id !== contractId) {
    const saved = await setGenerationPaymentId(generation.id, contractId);
    if (!saved) {
      console.error("LavaTop webhook: payment_id conflict or generation not found", {
        generationId: generation.id,
        contractId,
      });
      return;
    }
    generation = { ...generation, payment_id: contractId };
  }

  // Verify payment_id atomically to prevent one event from activating the
  // wrong generation row. generation.payment_id is set above if contractId arrived.
  const effectivePaymentId = generation.payment_id ?? contractId;
  if (!effectivePaymentId) {
    console.error("LavaTop webhook: no payment_id to verify against", { generationId: generation.id });
    return;
  }
  const paid = await markGenerationPaid(generation.id, effectivePaymentId);
  if (!paid) {
    // Already paid, payment_id mismatch, or not found — skip.
    return;
  }
  generation = paid;

  // Throws on Astria failure → caught by POST → 5xx → LavaTop retries.
  await startAstriaGeneration(generation);
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-api-key") ?? "";
  const body = await request.text();

  let secret: string;
  try {
    secret = getLavaWebhookSecret();
  } catch (error) {
    console.error("LavaTop webhook misconfigured:", error);
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (signature !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // NOTE: we dispatch manually rather than via the SDK's WebhookHandler, because
  // that handler swallows exceptions from onPaymentSuccess (logs + returns), so a
  // failed generation would still 200 and LavaTop would NOT retry. Here a throw
  // propagates → 500 → LavaTop retries → the order can recover.
  let data: PaymentSuccessData & { eventType?: string };
  try {
    data = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    if (data?.eventType === "payment.success") {
      await handlePaymentSuccess(data);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LavaTop webhook handling failed:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
