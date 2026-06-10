import { createAstrinaTune } from "@/lib/astria";
import { buildAstriaCallbackUrl } from "@/lib/generation-complete";
import {
  claimGenerationForProcessing,
  updateGenerationStatus,
  type GenerationRow,
} from "@/lib/generations-db";
import { sendGenerationFailed, sendHeadshotsStarted, sendOwnerAlert } from "@/lib/email";

/** Strip anything that looks like a secret before persisting/showing an error. */
function safeErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Неизвестная ошибка генерации";
  return raw
    .replace(/(api[_-]?key|bearer|token)[^,\s]*/gi, "[скрыто]")
    .slice(0, 300);
}

/**
 * Kick off Astria training + portrait generation for a paid generation row.
 *
 * Atomically CLAIMS the row first (status pending/failed + no tune_id) so
 * concurrent webhook deliveries can't start two tunes. A `failed` row without a
 * tune_id is re-claimable — that's the recovery path for a transient failure.
 *
 * Throws on Astria failure (after marking failed + notifying) so the webhook
 * returns 5xx and LavaTop retries.
 */
export async function startAstriaGeneration(
  generation: GenerationRow
): Promise<void> {
  // Whether this is the first attempt (no prior error) — used to avoid spamming
  // the buyer with a "failed" email on every LavaTop retry.
  const isFirstAttempt = !generation.error_message;

  const claimed = await claimGenerationForProcessing(generation.id);
  if (!claimed) {
    // Already processing/done, or another delivery won the claim.
    return;
  }

  try {
    const callbackUrl = buildAstriaCallbackUrl(claimed.id);
    const tuneId = await createAstrinaTune(claimed, callbackUrl);
    await updateGenerationStatus({
      id: claimed.id,
      status: "processing",
      tuneId,
    });

    // Tune created — now safe to tell the buyer we started.
    try {
      await sendHeadshotsStarted(claimed.email, `/try/result/${claimed.id}`);
    } catch (error) {
      console.error("started email failed:", error);
    }
  } catch (error) {
    const message = safeErrorMessage(error);
    await updateGenerationStatus({
      id: claimed.id,
      status: "failed",
      errorMessage: message,
    });

    if (isFirstAttempt) {
      try {
        await sendGenerationFailed(claimed.email, `/try/result/${claimed.id}`);
      } catch (mailError) {
        console.error("failed-generation email failed:", mailError);
      }
    }
    // Always alert the owner so a paid-but-failed order never goes unnoticed.
    try {
      await sendOwnerAlert(claimed, message);
    } catch (alertError) {
      console.error("owner alert email failed:", alertError);
    }

    throw new Error(`Astria generation failed: ${message}`);
  }
}
