import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { JobRow } from "@/lib/jobs/types";

export const runtime = "nodejs";

const BUCKET_GENERATED = "generated";

type RouteContext = { params: { jobId: string } };

export async function GET(request: Request, context: RouteContext) {
  const { jobId } = context.params;
  const url = new URL(request.url);
  const iRaw = url.searchParams.get("i");
  const i = iRaw == null ? NaN : Number.parseInt(iRaw, 10);

  if (!jobId || !/^[0-9a-f-]{36}$/i.test(jobId) || !Number.isFinite(i) || i < 0) {
    return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("jobs").select("output_paths,paid").eq("id", jobId).maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const row = data as Pick<JobRow, "output_paths" | "paid">;
    if (!row.paid) {
      return NextResponse.json({ error: "Payment required." }, { status: 402 });
    }

    const paths = row.output_paths ?? [];
    const path = paths[i];
    if (!path) return NextResponse.json({ error: "Image index out of range." }, { status: 404 });

    const { data: file, error: dlErr } = await supabase.storage.from(BUCKET_GENERATED).download(path);
    if (dlErr || !file) {
      return NextResponse.json({ error: dlErr?.message ?? "Download failed." }, { status: 500 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="headshot-${jobId}-${i + 1}.jpg"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
