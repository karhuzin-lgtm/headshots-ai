import { AstriaApiError, createAstrinaTune } from "@/lib/astria";
import { buildAstriaCallbackUrl } from "@/lib/generation-complete";
import {
  claimGenerationForProcessing,
  updateGenerationStatus,
  type GenerationRow,
} from "@/lib/generations-db";
import { sendGenerationFailed, sendHeadshotsStarted, sendOwnerAlert } from "@/lib/email";

/**
 * Strip secrets using an allowlist approach: replace any recognisable
 * credential pattern rather than trying to scrub the whole string.
 */
function safeErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Неизвестная ошибка генерации";
  return raw
    .replace(/Bearer\s+\S+/gi, "Bearer [скрыто]")
    .replace(/api[_\-]?key[=:\s]+\S+/gi, "[скрыто]")
    .replace(/"token"\s*:\s*"[^"]*"/gi, '"token":"[скрыто]"')
    .replace(/"password"\s*:\s*"[^"]*"/gi, '"password":"[скрыто]"')
    .slice(0, 300);
}

/**
 * Returns true when we cannot determine whether Astria created the tune.
 * Only confirmed 4xx Astria rejections are safe to retry — the tune was
 * never started. Everything else (5xx, network errors, timeout, missing id)
 * is ambiguous: the tune may exist on Astria's side.
 */
function isAmbiguousError(error: unknown): boolean {
  if (error instanceof AstriaApiError) {
    return !error.isRetriable; // 5xx → ambiguous; 4xx → safe to retry
  }
  // TypeError (fetch failed), TimeoutError, AbortError, and any other error
  // (e.g. "tune creation returned no tune id") are all ambiguous.
  return true;
}

/**
 * Kick off Astria training + portrait generation for a paid generation row.
 *
 * Atomically CLAIMS the row first (status pending/failed, no tune_id, paid=true)
 * so concurrent webhook deliveries can't start two tunes.
 *
 * Two distinct failure modes after claiming:
 * - Confirmed Astria rejection (4xx) → status=failed, auto-retry is safe.
 * - Ambiguous result (timeout/network/tune created but save failed) →
 *   status=failed with ASTRIA_STATUS_UNKNOWN prefix → claimGenerationForProcessing
 *   blocks retry to prevent duplicate billing until admin verifies.
 *
 * Throws on failure so the LavaTop webhook returns 5xx and retries.
 */
export async function startAstriaGeneration(
  generation: GenerationRow
): Promise<void> {
  const isFirstAttempt = !generation.error_message;

  const claimed = await claimGenerationForProcessing(generation.id);
  if (!claimed) {
    return;
  }

  // --- Phase 1: call Astria ---------------------------------------------------
  let tuneId: string;
  try {
    const callbackUrl = buildAstriaCallbackUrl(claimed.id);
    tuneId = await createAstrinaTune(claimed, callbackUrl);
  } catch (createError) {
    const message = safeErrorMessage(createError);
    const ambiguous = isAmbiguousError(createError);
    await updateGenerationStatus({
      id: claimed.id,
      status: "failed",
      errorMessage: ambiguous ? `ASTRIA_STATUS_UNKNOWN: ${message}` : message,
    }).catch((e) => console.error("failed to persist createError status:", e));

    if (isFirstAttempt && !ambiguous) {
      await sendGenerationFailed(claimed.email, `/try/result/${claimed.id}`).catch((e) =>
        console.error("failed-generation email failed:", e)
      );
    }
    await sendOwnerAlert(claimed, message).catch((e) =>
      console.error("owner alert email failed:", e)
    );
    throw new Error(`Astria generation failed: ${message}`);
  }

  // --- Phase 2: persist tuneId ------------------------------------------------
  // tuneId is now known. Any save failure here is ambiguous — the tune IS
  // created, so a retry without the UNKNOWN guard would create a second tune.
  try {
    await updateGenerationStatus({
      id: claimed.id,
      status: "processing",
      tuneId,
    });
  } catch (saveError) {
    const message = safeErrorMessage(saveError);
    await updateGenerationStatus({
      id: claimed.id,
      status: "failed",
      errorMessage: `ASTRIA_STATUS_UNKNOWN: tune ${tuneId} created but save failed: ${message}`,
    }).catch((e) => console.error("failed to persist saveError status:", e));
    await sendOwnerAlert(claimed, `tuneId save failed (tune ${tuneId}): ${message}`).catch(
      (e) => console.error("owner alert email failed:", e)
    );
    throw saveError;
  }

  // --- Phase 3: notify buyer --------------------------------------------------
  await sendHeadshotsStarted(claimed.email, `/try/result/${claimed.id}`).catch((e) =>
    console.error("started email failed:", e)
  );
}
