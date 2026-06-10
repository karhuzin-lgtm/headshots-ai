import { AstriaApiError, createAstrinaTune } from "@/lib/astria";
import { buildAstriaCallbackUrl } from "@/lib/generation-complete";
import {
  claimGenerationForProcessing,
  updateGenerationStatus,
  type GenerationRow,
} from "@/lib/generations-db";
import { sendGenerationFailed, sendHeadshotsStarted, sendOwnerAlert } from "@/lib/email";

/**
 * Strip credentials using explicit patterns rather than a suffix-based regex.
 * Covers "Bearer <token>", "api_key=<val>", and JSON fields "token"/"password".
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
 * Only confirmed Astria 4xx rejections are safe to retry — the tune was never
 * started. 5xx, network errors, timeout, and unexpected responses are ambiguous.
 */
function isAmbiguousError(error: unknown): boolean {
  if (error instanceof AstriaApiError) {
    return !error.isRetriable; // 4xx isRetriable=true → safe; 5xx → ambiguous
  }
  // TypeError (fetch failed), TimeoutError, AbortError, and anything else
  // (e.g. "tune creation returned no tune id") are all ambiguous — Astria may
  // have accepted the request before the connection dropped.
  return true;
}

/**
 * Kick off Astria training + portrait generation for a paid generation row.
 *
 * Phase 1 — createAstrinaTune: confirmed Astria 4xx → safe to retry (status=failed).
 *   Any ambiguous outcome (5xx, network, timeout) → ASTRIA_STATUS_UNKNOWN prefix,
 *   which claimGenerationForProcessing refuses to re-claim, blocking duplicate billing.
 *
 * Phase 2 — persist tuneId: if the DB save fails after Astria returned a tuneId,
 *   the tune IS created. We mark ASTRIA_STATUS_UNKNOWN so retry is blocked; the
 *   Astria callback will still arrive and appendGenerationOutputs will complete
 *   the order via image URL delivery.
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

  // Phase 1: call Astria ---------------------------------------------------
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
    }).catch((e) => console.error("persist createError status failed:", e));

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

  // Phase 2: persist tuneId ------------------------------------------------
  // tuneId is known — persist it before doing anything else.
  // If this save fails, the tune IS created on Astria's side. Mark ambiguous
  // so claimGenerationForProcessing blocks retry; the Astria callback will
  // still deliver images via appendGenerationOutputs.
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
    }).catch((e) => console.error("persist saveError status failed:", e));
    await sendOwnerAlert(claimed, `tuneId save failed (tune ${tuneId}): ${message}`).catch(
      (e) => console.error("owner alert email failed:", e)
    );
    throw saveError;
  }

  // Phase 3: notify buyer --------------------------------------------------
  await sendHeadshotsStarted(claimed.email, `/try/result/${claimed.id}`).catch((e) =>
    console.error("started email failed:", e)
  );
}
