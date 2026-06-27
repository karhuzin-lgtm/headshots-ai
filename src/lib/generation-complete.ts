import crypto from "crypto";

import { fetchTuneCompletion } from "@/lib/astria";
import { collectAstriaImageUrls } from "@/lib/astria-images";
import { sendHeadshotsReady } from "@/lib/email";
import {
  appendGenerationOutputs,
  finalizePartialGeneration,
  getGeneration,
  type GenerationRow,
} from "@/lib/generations-db";
import { esc, notifyOperator } from "@/lib/notify";

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

/**
 * Once-per-order side effects for a done transition: operator alert + ready
 * email. MUST be called only with becameDone=true (the atomic single transition),
 * so the email/notify never duplicate across racing callbacks/polls/cron.
 *
 * `partial` flags an under-delivered finalization (fewer than expected_count) so
 * the operator alert distinguishes a short order that needs a manual look.
 */
async function onGenerationDone(row: GenerationRow, partial: boolean): Promise<void> {
  if (partial) {
    notifyOperator(
      `⚠️ Заказ закрыт частично: ${row.output_urls.length} из ${row.expected_count} фото\n` +
        `Email: ${esc(row.email)}`
    );
  } else {
    notifyOperator(
      `✅ Портреты готовы\nEmail: ${esc(row.email)}\nФото: ${row.output_urls.length}`
    );
  }
  try {
    await sendHeadshotsReady(row.email, `/try/result/${row.id}`, row.output_urls);
  } catch (error) {
    console.error("headshots-ready email failed:", error);
  }
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
    // becameDone is the atomic once-per-order transition to done — fire here so
    // the alert never duplicates across partial Astria callbacks or sync polls.
    await onGenerationDone(row, false);
  }

  return row;
}

/**
 * Pull finished images from Astria when webhooks were missed, and finalize
 * under-delivered orders so a paid buyer never gets stuck in `processing`.
 *
 * Flow:
 *  1. Fetch current images + completion signal from Astria.
 *  2. Merge any new images. A full set (>= expected_count) finalizes normally
 *     via mergeGenerationOutputs (unchanged happy path).
 *  3. If still short but we have >=1 image AND (Astria says all prompts are done
 *     OR the hard timeout elapsed), finalize the partial result atomically once.
 *  4. 0 images → leave as-is for the existing failed/recover path (never mark a
 *     paid order done with an empty gallery).
 */
export async function syncGenerationFromAstria(
  generationId: string
): Promise<GenerationRow | null> {
  const generation = await getGeneration(generationId);
  if (!generation?.tune_id || generation.status === "done" || generation.status === "failed") {
    return generation;
  }

  const completion = await fetchTuneCompletion(generation.tune_id);

  // Step 1: merge any newly-arrived images. This may reach expected_count and
  // finalize through the normal full-completion path. Compare by SET membership,
  // not count: Astria can return the same number of URLs with a different set
  // (e.g. a rotated/replaced URL), and a count-only check would skip the merge
  // and risk closing the order with a stale set below.
  let current = generation;
  const stored = new Set(current.output_urls);
  const hasNewUrl = completion.imageUrls.some((url) => !stored.has(url));
  if (hasNewUrl) {
    current = await mergeGenerationOutputs(generationId, completion.imageUrls);
    if (current.status === "done") return current;
  }

  // Step 2: full set already? Nothing more to do (covers the case where the merge
  // above was a no-op because images were already stored).
  if (current.output_urls.length >= current.expected_count) {
    return current;
  }

  // Step 3: under-delivered. Finalize with what we have ONLY when we have at
  // least one image and Astria is done (or the hard timeout fired). 0 images is
  // a failure, not a partial — leave it for the failed/recover path.
  if (current.output_urls.length >= 1) {
    const result = await finalizePartialGeneration({
      id: generationId,
      astriaConfirmedDone: completion.allPromptsDone,
    });
    if (result) {
      if (result.becameDone) {
        await onGenerationDone(result.row, true);
      }
      return result.row;
    }
  }

  return current;
}
