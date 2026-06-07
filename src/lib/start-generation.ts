import { createAstrinaTune } from "@/lib/astria";
import { buildAstriaCallbackUrl } from "@/lib/generation-complete";
import { updateGenerationStatus, type GenerationRow } from "@/lib/generations-db";
import { sendHeadshotsStarted } from "@/lib/email";

/**
 * Kick off Astria model training + headshot generation for a generation row.
 *
 * Idempotent: callers (e.g. retried payment webhooks) may invoke this more than
 * once, so we skip rows that have already started or finished.
 *
 * Throws on Astria failure after marking the row as failed.
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
    await sendHeadshotsStarted(generation.email, `/try/result/${generation.id}`);
  } catch (error) {
    console.error("headshots-started email failed:", error);
  }

  try {
    await updateGenerationStatus({ id: generation.id, status: "processing" });
    const callbackUrl = buildAstriaCallbackUrl(generation.id);
    const tuneId = await createAstrinaTune(generation.input_urls, callbackUrl);
    await updateGenerationStatus({
      id: generation.id,
      status: "processing",
      tuneId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Astria generation error";
    await updateGenerationStatus({
      id: generation.id,
      status: "failed",
      errorMessage: message,
    });
    throw new Error(`Astria generation failed: ${message}`);
  }
}
