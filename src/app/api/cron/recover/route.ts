import { syncGenerationFromAstria } from "@/lib/generation-complete";
import { findRecoverableGenerations } from "@/lib/generations-db";
import { startAstriaGeneration } from "@/lib/start-generation";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * Autonomous order-recovery sweep (Vercel Cron).
 *
 * The webhook + browser-poll are the happy paths, but neither is guaranteed:
 *  - Astria's completion webhook can be missed/mis-delivered, and the buyer is
 *    told they can close the tab — so the browser poller may never run.
 *  - A paid order whose Astria create failed gets stuck `failed` with no tune,
 *    and LavaTop's webhook retries expire.
 *
 * This sweep is the safety net: for each stuck paid order, re-drive it. With no
 * tune yet → restart (idempotent atomic claim). With a tune → sync from Astria
 * (pulls finished images, flips processing/failed → done, sends the ready mail).
 *
 * Guarded by CRON_SECRET. Vercel Cron sends it as `Authorization: Bearer …`
 * when the env var is set; a `?secret=` query is also accepted for manual runs.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Fail closed: an unguarded endpoint could be spammed to trigger Astria work.
    console.error("CRON_SECRET is not set — refusing to run recovery sweep.");
    return false;
  }
  const url = new URL(request.url);
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("secret") ??
    "";
  return provided === secret;
}

async function runSweep() {
  const stuck = await findRecoverableGenerations();
  const results: Array<{ id: string; action: string; status?: string; error?: string }> = [];

  // Sequential on purpose: low volume, and we don't want to fan out many
  // concurrent Astria calls from a single cron invocation.
  for (const generation of stuck) {
    try {
      if (!generation.tune_id) {
        // No tune yet (failed create / never started). Re-drive from scratch.
        await startAstriaGeneration(generation);
        results.push({ id: generation.id, action: "restarted" });
      } else {
        // Tune exists — pull whatever Astria has finished.
        const updated = await syncGenerationFromAstria(generation.id);
        results.push({ id: generation.id, action: "synced", status: updated?.status });
      }
    } catch (error) {
      // startAstriaGeneration rethrows on Astria failure (after marking failed +
      // alerting the owner). Swallow here so one bad order doesn't abort the
      // whole sweep — it'll be retried next tick (until the 24h window closes).
      results.push({
        id: generation.id,
        action: "error",
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return { scanned: stuck.length, results };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const summary = await runSweep();
  return Response.json({ ok: true, ...summary }, { headers: { "Cache-Control": "no-store" } });
}

// Allow POST too (some schedulers prefer it).
export const POST = GET;
