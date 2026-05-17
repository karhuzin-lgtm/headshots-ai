import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { ALL_STYLE_KEYS, buildGenerationManifest, isPlanId, PLANS } from "@/lib/plans";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET_UPLOADS = "uploads";

function extForFile(file: File): string {
  const t = file.type;
  if (t === "image/png") return "png";
  return "jpg";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const planRaw = String(form.get("plan") ?? "basic");
    if (!isPlanId(planRaw)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    const plan = planRaw;

    const styles = [...ALL_STYLE_KEYS];

    const files = form.getAll("photos").filter((v): v is File => v instanceof File);
    if (files.length < 3 || files.length > 20) {
      return NextResponse.json(
        { error: "Upload 3-20 selfies." },
        { status: 400 }
      );
    }

    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
      }
    }

    const jobId = randomUUID();
    const supabase = getSupabaseAdmin();
    const inputPaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = extForFile(file);
      const path = `${jobId}/input_${i}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await supabase.storage.from(BUCKET_UPLOADS).upload(path, buf, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (upErr) {
        return NextResponse.json(
          { error: `Storage upload failed: ${upErr.message}` },
          { status: 500 }
        );
      }
      inputPaths.push(path);
    }

    const totalOutputs = PLANS[plan].totalOutputs;
    const manifest = buildGenerationManifest(inputPaths.length, styles, totalOutputs);
    if (manifest.length !== totalOutputs) {
      return NextResponse.json({ error: "Manifest size mismatch." }, { status: 500 });
    }

    const { error: insErr } = await supabase.from("jobs").insert({
      id: jobId,
      plan,
      style_keys: styles,
      input_paths: inputPaths,
      output_paths: [],
      total_outputs: totalOutputs,
      status: "pending",
      paid: false,
    });

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ jobId, total: totalOutputs });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("Missing NEXT_PUBLIC_SUPABASE")) {
      return NextResponse.json({ error: "Server is not configured for Supabase." }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
