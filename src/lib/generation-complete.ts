import { fetchTuneOutputUrls } from "@/lib/astria";
import { EXPECTED_HEADSHOT_OUTPUTS, collectAstriaImageUrls } from "@/lib/astria-images";
import { sendHeadshotsReady } from "@/lib/email";
import {
  getGeneration,
  updateGenerationStatus,
  type GenerationRow,
} from "@/lib/generations-db";

export function buildAstriaCallbackUrl(generationId: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(
    /\/$/,
    ""
  );
  const url = new URL(`${appUrl}/api/webhook/astria`);
  url.searchParams.set("generationId", generationId);
  const secret = process.env.ASTRIA_WEBHOOK_SECRET;
  if (secret) {
    url.searchParams.set("webhook_secret", secret);
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

  const headerSig = request.headers.get("x-astria-signature") ?? "";
  const querySecret = new URL(request.url).searchParams.get("webhook_secret") ?? "";
  return headerSig === secret || querySecret === secret;
}

/** Merge new URLs, mark done at 18 outputs, send ready email once. */
export async function mergeGenerationOutputs(
  generationId: string,
  incomingUrls: string[]
): Promise<GenerationRow> {
  const generation = await getGeneration(generationId);
  if (!generation) {
    throw new Error("Generation not found");
  }

  const combined = Array.from(new Set([...generation.output_urls, ...incomingUrls]));
  const target = generation.expected_count || EXPECTED_HEADSHOT_OUTPUTS;
  const nextStatus = combined.length >= target ? "done" : "processing";
  const wasDone = generation.status === "done";

  const updated = await updateGenerationStatus({
    id: generationId,
    status: nextStatus,
    outputUrls: combined,
  });

  if (nextStatus === "done" && !wasDone) {
    try {
      await sendHeadshotsReady(
        updated.email,
        `/try/result/${updated.id}`,
        updated.output_urls
      );
    } catch (error) {
      console.error("headshots-ready email failed:", error);
    }
  }

  return updated;
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
