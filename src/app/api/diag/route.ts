import { NextResponse } from "next/server";
import { FeedItemType, FeedVisibility, Currency } from "lava-top-sdk";
import { getLavaClient, resolveOfferId } from "@/lib/lavatop";
import { TIER_ORDER, TIERS } from "@/lib/tiers";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  const secret = process.env.TEST_GENERATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "not available" }, { status: 404 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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
      const resolvedOfferId = await resolveOfferId(tier);
      tierStatus[id] = { set: true, resolvedOfferId };
    } catch (err) {
      tierStatus[id] = { set: true, resolveError: String(err).slice(0, 200) };
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

  return NextResponse.json(result);
}
