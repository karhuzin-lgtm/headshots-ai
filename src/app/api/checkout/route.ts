import { NextResponse } from "next/server";
import Stripe from "stripe";

import { isPlanId, stripeAmountCents } from "@/lib/plans";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { JobRow } from "@/lib/jobs/types";

export const runtime = "nodejs";

function appBaseUrl() {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env) return env;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { jobId?: string };
    const jobId = body.jobId;
    if (!jobId || !/^[0-9a-f-]{36}$/i.test(jobId)) {
      return NextResponse.json({ error: "Invalid job id." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("jobs").select("*").eq("id", jobId).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const job = data as JobRow;
    if (job.status !== "completed") {
      return NextResponse.json({ error: "Generation is not finished yet." }, { status: 400 });
    }
    if (job.paid) {
      return NextResponse.json({ error: "This job is already paid." }, { status: 400 });
    }
    if (!isPlanId(job.plan)) {
      return NextResponse.json({ error: "Invalid plan on job." }, { status: 500 });
    }

    const stripe = getStripe();
    const base = appBaseUrl();
    const amount = stripeAmountCents(job.plan);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: `Headshots — ${job.plan} pack`,
              description: `${job.total_outputs} AI headshots`,
            },
          },
        },
      ],
      success_url: `${base}/results/${jobId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/results/${jobId}`,
      metadata: { jobId },
      payment_intent_data: {
        metadata: { jobId },
      },
    });

    await supabase
      .from("jobs")
      .update({
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
