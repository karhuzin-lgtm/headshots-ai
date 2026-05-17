import { NextResponse } from "next/server";

import { generateHeadshotFromReference } from "@/lib/fal-gen";
import { buildGenerationManifest, isPlanId, PLANS } from "@/lib/plans";
import type { JobRow } from "@/lib/jobs/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 120;

const BUCKET_UPLOADS = "uploads";
const BUCKET_GENERATED = "generated";
const CHUNK = 2;

type RouteContext = { params: { jobId: string } };

export async function POST(_request: Request, context: RouteContext) {
  const { jobId } = context.params;
  if (!jobId || !/^[0-9a-f-]{36}$/i.test(jobId)) {
    return NextResponse.json({ error: "Invalid job id." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: row, error: fetchErr } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .maybeSingle();

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    if (!row) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const job = row as JobRow;

    if (job.status === "failed") {
      return NextResponse.json({ done: true, failed: true, error: job.error });
    }
    if (job.status === "completed") {
      return NextResponse.json({
        done: true,
        progress: job.output_paths.length,
        total: job.total_outputs,
      });
    }

    if (!isPlanId(job.plan)) {
      return NextResponse.json({ error: "Invalid job plan." }, { status: 500 });
    }

    const total = PLANS[job.plan].totalOutputs;
    const styles = job.style_keys as string[];
    const inputPaths = job.input_paths ?? [];
    if (inputPaths.length === 0) {
      return NextResponse.json({ error: "Job has no inputs." }, { status: 400 });
    }

    const manifest = buildGenerationManifest(inputPaths.length, styles, total);
    const doneCount = job.output_paths?.length ?? 0;

    if (doneCount >= manifest.length) {
      await supabase
        .from("jobs")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      return NextResponse.json({
        done: true,
        progress: manifest.length,
        total: manifest.length,
      });
    }

    if (job.status === "pending") {
      await supabase
        .from("jobs")
        .update({
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    }

    const slice = manifest.slice(doneCount, doneCount + CHUNK);
    const newPaths: string[] = [];

    for (let i = 0; i < slice.length; i++) {
      const item = slice[i];
      const globalIndex = doneCount + i;
      const inputPath = inputPaths[item.sourceIndex];
      if (!inputPath) throw new Error("Missing input path for manifest item.");

      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET_UPLOADS)
        .createSignedUrl(inputPath, 60 * 30);
      if (signErr || !signed?.signedUrl) {
        throw new Error(signErr?.message ?? "Could not sign input URL for fal.ai.");
      }

      const falUrl = await generateHeadshotFromReference({
        imageUrl: signed.signedUrl,
        style: item.style,
      });

      const imgRes = await fetch(falUrl);
      if (!imgRes.ok) throw new Error(`Failed to download fal output (${imgRes.status}).`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const outPath = `${jobId}/out_${globalIndex}.jpg`;

      const { error: upErr } = await supabase.storage.from(BUCKET_GENERATED).upload(outPath, buf, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (upErr) throw new Error(upErr.message);

      newPaths.push(outPath);
    }

    const merged = [...(job.output_paths ?? []), ...newPaths];
    const completed = merged.length >= manifest.length;

    const { error: updErr } = await supabase
      .from("jobs")
      .update({
        output_paths: merged,
        status: completed ? "completed" : "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (updErr) throw new Error(updErr.message);

    return NextResponse.json({
      done: completed,
      failed: false,
      progress: merged.length,
      total: manifest.length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    try {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("jobs")
        .update({
          status: "failed",
          error: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    } catch {
      /* ignore */
    }
    return NextResponse.json({ error: message, failed: true, done: false }, { status: 500 });
  }
}
