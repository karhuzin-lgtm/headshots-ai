import { NextResponse } from "next/server";

import type { JobRow } from "@/lib/jobs/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = { params: { jobId: string } };

export async function GET(_request: Request, context: RouteContext) {
  const { jobId } = context.params;
  if (!jobId || !/^[0-9a-f-]{36}$/i.test(jobId)) {
    return NextResponse.json({ error: "Invalid job id." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id,status,plan,total_outputs,output_paths,paid,error,style_keys,input_paths,stripe_checkout_session_id"
      )
      .eq("id", jobId)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const row = data as JobRow;
    const progress = row.output_paths?.length ?? 0;
    const paymentRequired = row.status === "completed" && !row.paid;

    return NextResponse.json({
      id: row.id,
      status: row.status,
      plan: row.plan,
      progress,
      total: row.total_outputs,
      paid: row.paid,
      paymentRequired,
      error: row.error,
      styleKeys: row.style_keys,
      outputCount: progress,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("Missing NEXT_PUBLIC_SUPABASE")) {
      return NextResponse.json({ error: "Server is not configured for Supabase." }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
