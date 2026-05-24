# Billing integration (later)

Payment provider is **not chosen yet** — likely **Lemon Squeezy** or **Paddle**. Do not hardcode one provider in product copy or plan config; use a thin abstraction when wiring checkout.

## Current state (waitlist phase)

- **Landing CTAs** → `/#waitlist` via `src/lib/landing-config.ts` (`LANDING_MODE = "waitlist"`).
- **`/checkout`** → placeholder; directs to waitlist until billing is live.
- **Pay-after-generate** (test/hidden funnel): `results/[jobId]` → `POST /api/checkout` → **Stripe** (legacy spike — replace when provider is picked).
- **`src/lib/plans.ts`** → `PLANS` holds EUR prices and output limits; `stripeAmountCents()` is temporary Stripe glue only.

Do **not** link landing pricing buttons to `/checkout` until billing is connected.

## When you pick a provider

### Shared tasks (any provider)

1. **`plans.ts`** — Add provider-agnostic fields, e.g. `checkoutPriceId: Record<PlanId, string>` or env-based map. Keep `priceEur` as display truth. Deprecate `stripeAmountCents`.
2. **`/checkout`** — Plan picker → hosted checkout for chosen provider.
3. **API** — `POST /api/checkout` creates checkout session with `jobId` + `plan` in metadata; webhook sets `jobs.paid = true`.
4. **Verify** — Return URL handler unlocks job after successful payment.
5. **`results/[jobId]`** — Paywall button calls new checkout API.
6. **DB** — Prefer generic `payment_provider`, `payment_reference` (migrate off `stripe_checkout_session_id`).
7. **Legal** — Name the actual processor in privacy/terms (Lemon Squeezy *or* Paddle *or* other).
8. **Founding €19 / €39 / €59** — Coupon, separate price IDs, or pre-checkout discount — provider-specific.

### Lemon Squeezy–specific

- Env: `LEMONSQUEEZY_API_KEY`, store ID, variant IDs per plan, webhook secret.
- Webhook: e.g. `/api/webhooks/lemonsqueezy`.

### Paddle–specific

- Env: `PADDLE_API_KEY`, price IDs per plan, webhook secret.
- Webhook: e.g. `/api/webhooks/paddle`.
- Billing API differs from LS — implement behind same internal `createCheckout({ plan, jobId })` interface.

## Suggested abstraction (minimal)

```ts
// src/lib/billing/index.ts — implement one adapter when provider is chosen
export type BillingProvider = "lemonsqueezy" | "paddle";

export async function createCheckoutSession(input: {
  plan: PlanId;
  jobId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; reference: string }>;
```

## Launch checklist

- [ ] Choose provider (LS vs Paddle) — tax/VAT, EU, merchant of record
- [ ] Create 3 products / prices (optional founding variants)
- [ ] Webhook → production, mark `jobs.paid`
- [ ] Test: upload → results → pay → download
- [ ] Set `LANDING_MODE = "live"` in `landing-config.ts`
- [ ] Remove or gate legacy Stripe routes if unused
