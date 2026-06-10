import crypto from "crypto";

import { fetchTuneOutputUrls } from "@/lib/astria";
import { collectAstriaImageUrls } from "@/lib/astria-images";
import { sendHeadshotsReady } from "@/lib/email";
import {
  appendGenerationOutputs,
  getGeneration,
  type GenerationRow,
} from "@/lib/generations-db";

/** Per-generation token so the global secret never travels in a callback URL. */
function astriaToken(generationId: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(generationId).digest("hex");
}

export function buildAstriaCallbackUrl(generationId: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(
    /\/$/,
    ""
  );
  const url = new URL(`${appUrl}/api/webhook/astria`);
  url.searchParams.set("generationId", generationId);
  const secret = process.env.ASTRIA_WEBHOOK_SECRET;
  if (secret) {
    // HMAC(secret, generationId) — leaks in logs are scoped to one generation,
    // not the global secret, and can't be replayed for other orders.
    url.searchParams.set("webhook_secret", astriaToken(generationId, secret));
  }
  return url.toString();
}

export function isAstriaWebhookAuthorized(request: Request): boolean {
  const secret = process.env.ASTRIA_WEBHOOK_SECRET;
  // Fail closed: without a configured secret the webhook would accept forged
  // completions (fake images, spam emails). Require the secret to be set.
  if (!secret) {
    console.error(
      "ASTRIA_WEBHOOK_SECRET is not set — rejecting Astria webhook. Configure it in env."
    );
    return false;
  }

  const params = new URL(request.url).searchParams;
  const generationId = params.get("generationId") ?? "";
  const provided =
    params.get("webhook_secret") ?? request.headers.get("x-astria-signature") ?? "";
  if (!generationId || !provided) return false;

  const expected = astriaToken(generationId, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Atomically merge new URLs, flip to done at expected_count, send ready email once. */
export async function mergeGenerationOutputs(
  generationId: string,
  incomingUrls: string[]
): Promise<GenerationRow> {
  const result = await appendGenerationOutputs(generationId, incomingUrls);
  if (!result) {
    // Already done (no-op) or missing.
    const existing = await getGeneration(generationId);
    if (!existing) throw new Error("Generation not found");
    return existing;
  }

  const { row, becameDone } = result;
  if (becameDone) {
    try {
      await sendHeadshotsReady(row.email, `/try/result/${row.id}`, row.output_urls);
    } catch (error) {
      console.error("headshots-ready email failed:", error);
    }
  }

  return row;
}

/** Pull finished images from Astria when webhooks were missed. */
export async function syncGenerationFromAstria(
  generationId: string
): Promise<GenerationRow | null> {
  const generation = await getGeneration(generationId);
  if (!generation?.tune_id || generation.status === "done" || generation.status === "failed") {
    return generation;
  }

  const astriaUrls = await fetchTuneOutputUrls(generation.tune_id);
  if (astriaUrls.length === 0) {
    return generation;
  }

  if (astriaUrls.length <= generation.output_urls.length) {
    return generation;
  }

  return mergeGenerationOutputs(generationId, astriaUrls);
}
