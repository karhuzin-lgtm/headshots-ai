import { createAstrinaTune } from "@/lib/astria";
import { buildAstriaCallbackUrl } from "@/lib/generation-complete";
import { updateGenerationStatus, type GenerationRow } from "@/lib/generations-db";
import { sendGenerationFailed, sendHeadshotsStarted } from "@/lib/email";

/** Strip anything that looks like a secret before persisting/showing an error. */
function safeErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Неизвестная ошибка генерации";
  return raw
    .replace(/(api[_-]?key|bearer|token)[^,\s]*/gi, "[скрыто]")
    .slice(0, 300);
}

/**
 * Kick off Astria model training + portrait generation for a generation row.
 *
 * Idempotent: callers (e.g. retried payment webhooks) may invoke this more than
 * once, so we skip rows that already started or finished. A `failed` row WITHOUT
 * a tune_id is NOT skipped — that's the recovery path for a transient failure.
 *
 * Throws on Astria failure (after marking failed + notifying the buyer) so the
 * webhook returns 5xx and LavaTop retries.
 */
export async function startAstriaGeneration(
  generation: GenerationRow
): Promise<void> {
  if (
    generation.tune_id ||
    generation.status === "processing" ||
    generation.status === "done"
  ) {
    return;
  }

  try {
    await updateGenerationStatus({ id: generation.id, status: "processing" });
    const callbackUrl = buildAstriaCallbackUrl(generation.id);
    const tuneId = await createAstrinaTune(generation, callbackUrl);
    await updateGenerationStatus({
      id: generation.id,
      status: "processing",
      tuneId,
    });

    // Tune created successfully — now it's safe to tell the buyer we started.
    try {
      await sendHeadshotsStarted(generation.email, `/try/result/${generation.id}`);
    } catch (error) {
      console.error("started email failed:", error);
    }
  } catch (error) {
    const message = safeErrorMessage(error);
    await updateGenerationStatus({
      id: generation.id,
      status: "failed",
      errorMessage: message,
    });
    try {
      await sendGenerationFailed(generation.email, `/try/result/${generation.id}`);
    } catch (mailError) {
      console.error("failed-generation email failed:", mailError);
    }
    throw new Error(`Astria generation failed: ${message}`);
  }
}
