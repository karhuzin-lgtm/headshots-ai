import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Generation is now gated behind a LavaTop payment. The upload still happens
// here (see ./upload), but kicking off Astria training goes through
// POST /api/payment/create -> LavaTop checkout -> POST /api/webhooks/lavatop.
// This endpoint is kept only to return a clear error if anything still calls it.

export async function GET() {
  return NextResponse.json(
    { error: "Use POST /api/payment/create to start a paid generation." },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct generation is disabled. Start checkout via /api/payment/create.",
    },
    { status: 410 }
  );
}
