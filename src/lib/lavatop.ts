import {
  Currency,
  FeedItemType,
  FeedVisibility,
  LavaClient,
  Language,
  LogLevel,
} from "lava-top-sdk";

import { DEFAULT_TIER, type Tier } from "@/lib/tiers";

/**
 * LavaTop payment integration.
 *
 * - createInvoice() hits POST https://gate.lava.top/api/v2/invoice and returns a
 *   hosted `paymentUrl` we redirect the buyer to.
 * - The v2 invoice API expects an OFFER id (not the product id shown in the
 *   dashboard URL). We accept either a raw UUID or a product URL in
 *   LAVATOP_OFFER_ID and resolve it to a real offer id via the products API,
 *   falling back to the raw UUID if resolution is unavailable.
 */

const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** Cookie holding the pending generation id across the LavaTop checkout redirect. */
export const PENDING_GENERATION_COOKIE = "pending_generation_id";

export function getLavaApiKey(): string {
  const key = process.env.LAVATOP_API_KEY;
  if (!key) {
    throw new Error("Missing LAVATOP_API_KEY env var");
  }
  return key;
}

export function getLavaWebhookSecret(): string {
  const secret = process.env.LAVATOP_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing LAVATOP_WEBHOOK_SECRET env var");
  }
  return secret;
}

/**
 * Offer reference for a tier: the tier's own env var, falling back to the single
 * LAVATOP_OFFER_ID so testing on one offer (e.g. 390 ₽) works before per-tier
 * offers are created.
 */
function getOfferRefForTier(tier: Tier): string {
  const own = process.env[tier.offerEnvKey]?.trim();
  if (own) return own;
  // Only the default tier may fall back to the single shared LAVATOP_OFFER_ID
  // (testing on one offer). Other tiers must have their own offer, so the price
  // charged can never diverge from the tier being fulfilled.
  if (tier.id === DEFAULT_TIER) {
    const fallback = process.env.LAVATOP_OFFER_ID?.trim();
    if (fallback) return fallback;
  }
  throw new Error(
    `Missing LavaTop offer for tier "${tier.id}". Set ${tier.offerEnvKey}.`
  );
}

/** Pull a bare UUID out of a product URL or return the trimmed value as-is. */
function extractUuid(value: string): string {
  const match = value.match(UUID_RE);
  return match ? match[0] : value.trim();
}

let cachedClient: LavaClient | null = null;

export function getLavaClient(): LavaClient {
  if (cachedClient) return cachedClient;
  cachedClient = new LavaClient({
    apiKey: getLavaApiKey(),
    webhookSecretKey: process.env.LAVATOP_WEBHOOK_SECRET ?? "",
    logging: { level: LogLevel.WARN, format: "json" },
  });
  return cachedClient;
}

// Cache resolved offer ids per raw configured reference (offer URL/UUID).
const offerIdCache = new Map<string, string>();

/**
 * Resolve a tier's configured product/offer reference to a usable offer id.
 * Cached per reference for the lifetime of the lambda instance.
 */
export async function resolveOfferId(tier: Tier): Promise<string> {
  const ref = getOfferRefForTier(tier);
  const cached = offerIdCache.get(ref);
  if (cached) return cached;

  const id = extractUuid(ref);

  let apiFailed = false;
  try {
    const client = getLavaClient();
    const products = await client.getProducts(
      undefined,
      FeedItemType.PRODUCT,
      undefined,
      FeedVisibility.ALL,
      false
    );

    for (const rawItem of products.items ?? []) {
      // The live API returns product fields directly on the item
      // (item.id / item.offers), although the SDK's types nest them under
      // item.data. Support both shapes.
      const data = ((rawItem as { data?: unknown }).data ?? rawItem) as {
        id?: string;
        offers?: Array<{
          id: string;
          prices?: Array<{ currency?: string }>;
        }>;
      };
      const offers = data.offers ?? [];

      // The configured id is already an offer id.
      const directOffer = offers.find((offer) => offer.id === id);
      if (directOffer) {
        offerIdCache.set(ref, directOffer.id);
        return directOffer.id;
      }

      // The configured id is the product id — pick its RUB offer (we charge RUB).
      if (data.id === id && offers.length > 0) {
        const rubOffer = offers.find((offer) =>
          (offer.prices ?? []).some((price) => price.currency === Currency.RUB)
        );
        const resolved = (rubOffer ?? offers[0]).id;
        offerIdCache.set(ref, resolved);
        return resolved;
      }
    }
  } catch (error) {
    apiFailed = true;
    console.error(
      "LavaTop: offer resolution via products API failed, using configured id directly.",
      error
    );
  }

  // Products API succeeded but the offer wasn't found: cache the configured id.
  // If the API itself failed, do NOT cache — retry resolution on the next call
  // so a transient outage doesn't pin a wrong id for the lambda's lifetime.
  if (apiFailed) {
    return id;
  }

  offerIdCache.set(ref, id);
  return id;
}

export type CreatedInvoice = {
  invoiceId: string;
  paymentUrl: string;
};

/**
 * Payment currency. RUB routes through card acquiring (smart_glocal), so buyers
 * can pay by card. USD/EUR on this account only expose PayPal. Override with
 * LAVATOP_CURRENCY if a card provider is later connected for other currencies.
 */
function getPaymentCurrency(): Currency {
  const raw = (process.env.LAVATOP_CURRENCY ?? "RUB").toUpperCase();
  if (raw === "USD") return Currency.USD;
  if (raw === "EUR") return Currency.EUR;
  return Currency.RUB;
}

/**
 * Create a one-time payment invoice for the headshots product.
 * Returns the hosted payment URL to redirect the buyer to.
 */
export async function createPaymentInvoice(input: {
  email: string;
  tier: Tier;
  currency?: Currency;
}): Promise<CreatedInvoice> {
  const client = getLavaClient();
  const offerId = await resolveOfferId(input.tier);
  const currency = input.currency ?? getPaymentCurrency();

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, 200 * 2 ** (attempt - 1))
      );
    }
    try {
      const invoice = await client.createOneTimePayment(
        input.email,
        offerId,
        currency,
        undefined,
        Language.RU
      );

      if (!invoice?.paymentUrl) {
        throw new Error("LavaTop did not return a payment URL");
      }

      return { invoiceId: invoice.id, paymentUrl: invoice.paymentUrl };
    } catch (error) {
      lastError = error;
      console.error(
        `LavaTop createOneTimePayment failed (attempt ${attempt + 1}/3):`,
        error
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("LavaTop createOneTimePayment failed", { cause: lastError });
}
