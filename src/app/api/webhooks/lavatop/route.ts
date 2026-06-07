import { NextResponse } from "next/server";
import { WebhookHandler, type PaymentSuccessData } from "lava-top-sdk";

import {
  findPendingUnpaidGeneration,
  getGenerationByPaymentId,
  markGenerationPaid,
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
    console.error("LavaTop webhook: no matching generation", {
      contractId,
      email,
    });
    return;
  }

  // Skip only if generation already started/finished. A `failed` row WITHOUT a
  // tune_id (transient Astria error) is intentionally NOT skipped, so a webhook
  // retry can recover it. startAstriaGeneration is idempotent.
  const alreadyStarted =
    !!generation.tune_id ||
    generation.status === "processing" ||
    generation.status === "done";
  if (alreadyStarted) {
    return;
  }

  const paid = await markGenerationPaid(generation.id);
  if (paid) generation = paid;

  // Throws on Astria failure → webhook returns 5xx → LavaTop retries.
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

  const handler = new WebhookHandler({
    secretKey: secret,
    onPaymentSuccess: handlePaymentSuccess,
  });

  try {
    await handler.handleWebhook(signature, body);
  } catch (error) {
    console.error("LavaTop webhook handling failed:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
