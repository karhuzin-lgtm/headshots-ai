import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId;
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const jobId = session.metadata?.jobId;
    if (!jobId) {
      return NextResponse.json({ error: "No job id on session." }, { status: 400 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("jobs")
      .update({
        paid: true,
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ paid: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
