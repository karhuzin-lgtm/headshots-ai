import { NextResponse } from "next/server";
import { FeedItemType, FeedVisibility, Currency } from "lava-top-sdk";
import { getLavaClient, resolveOfferId, createPaymentInvoice } from "@/lib/lavatop";
import { TIER_ORDER, TIERS, getTier, isTierId } from "@/lib/tiers";
import {
  countRecentUnpaidGenerations,
  findRateLimitedGeneration,
} from "@/lib/generations-db";

export const runtime = "nodejs";
export const maxDuration = 30;

function checkAuth(request: Request): NextResponse | null {
  const secret = process.env.TEST_GENERATE_SECRET;
  if (!secret) return NextResponse.json({ error: "not available" }, { status: 404 });
  const auth = request.headers.get("authorization") ?? "";
  // Constant-time compare: pad to equal length so length itself isn't a timing signal.
  const expected = `Bearer ${secret}`;
  const padLen = Math.max(auth.length, expected.length);
  const a = auth.padEnd(padLen, "\0");
  const b = expected.padEnd(padLen, "\0");
  let diff = 0;
  for (let i = 0; i < padLen; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  if (diff !== 0) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: Request) {
  const denied = checkAuth(request);
  if (denied) return denied;

  const result: Record<string, unknown> = {};

  // For each tier: env var set + which offer UUID resolves to.
  const tierStatus: Record<string, { set: boolean; resolvedOfferId?: string; resolveError?: string }> = {};
  for (const id of TIER_ORDER) {
    const tier = TIERS[id];
    const set = !!process.env[tier.offerEnvKey];
    if (!set) {
      tierStatus[id] = { set: false };
      continue;
    }
    try {
      const resolved = await resolveOfferId(tier);
      tierStatus[id] = { set: true, resolvedOfferId: resolved };
    } catch (err) {
      console.error(`[diag] resolveOfferId ${id}:`, err);
      tierStatus[id] = { set: true, resolveError: "resolve failed — see server logs" };
    }
  }
  result.tiers = tierStatus;

  // List LavaTop products — expose only offer IDs and RUB prices (no secrets).
  try {
    const client = getLavaClient();
    const products = await client.getProducts(
      undefined,
      FeedItemType.PRODUCT,
      undefined,
      FeedVisibility.ALL,
      false
    );
    const items = products.items ?? [];
    result.lavaTopOk = true;
    result.lavaTopOffers = items.flatMap((rawItem) => {
      const data = ((rawItem as { data?: unknown }).data ?? rawItem) as {
        id?: string;
        offers?: Array<{ id: string; prices?: Array<{ currency?: string; amount?: number }> }>;
      };
      return (data.offers ?? []).map((o) => ({
        offerId: o.id,
        rubPrice: (o.prices ?? []).find((p) => p.currency === Currency.RUB)?.amount ?? null,
      }));
    });
  } catch (err) {
    console.error("[diag] LavaTop getProducts failed:", err);
    result.lavaTopOk = false;
    result.lavaTopOffers = [];
  }

  // Optional: check rate-limit state for a specific email.
  const url = new URL(request.url);
  const queryEmail = url.searchParams.get("email");
  if (queryEmail) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (EMAIL_RE.test(queryEmail)) {
      try {
        const [rateLimited, recentUnpaid] = await Promise.all([
          findRateLimitedGeneration(queryEmail),
          countRecentUnpaidGenerations(queryEmail, 15),
        ]);
        result.emailDiag = {
          email: queryEmail,
          rateLimitedGenerationId: rateLimited?.id ?? null,
          rateLimitedStatus: rateLimited?.status ?? null,
          recentUnpaid15min: recentUnpaid,
          wouldBlock: !!rateLimited || recentUnpaid >= 5,
        };
      } catch (err) {
        result.emailDiag = { error: String(err) };
      }
    }
  }

  return NextResponse.json(result);
}

// POST /api/diag — try creating a LavaTop invoice for a given tier and return
// the exact error message or success. Useful when Vercel logs are unavailable.
export async function POST(request: Request) {
  const denied = checkAuth(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const tierId =
    body && typeof body === "object" && "tier" in body
      ? (body as { tier: unknown }).tier
      : null;
  if (!isTierId(tierId)) {
    return NextResponse.json(
      { error: "pass {tier: 'basic'|'pro'|'premium'}" },
      { status: 400 }
    );
  }
  const tier = getTier(tierId);

  let offerId: string;
  try {
    offerId = await resolveOfferId(tier);
  } catch (err) {
    return NextResponse.json({
      ok: false,
      stage: "resolveOfferId",
      offerId: null,
      error: String(err),
    });
  }

  // Accept an optional test email from the request body; default is a canary
  // address that LavaTop will reject — useful only to confirm the offer exists.
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rawEmail =
    body && typeof body === "object" && "email" in body
      ? (body as { email: unknown }).email
      : null;
  const testEmail =
    typeof rawEmail === "string" && EMAIL_RE.test(rawEmail)
      ? rawEmail
      : "diag-test@headshots.internal";

  try {
    const invoice = await createPaymentInvoice({
      email: testEmail,
      tier,
    });
    return NextResponse.json({
      ok: true,
      stage: "createOneTimePayment",
      offerId,
      invoiceId: invoice.invoiceId,
      paymentUrl: invoice.paymentUrl.slice(0, 80) + "...",
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      stage: "createOneTimePayment",
      offerId,
      error: String(err),
    });
  }
}
