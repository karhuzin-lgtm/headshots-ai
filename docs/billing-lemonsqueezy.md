# Billing: LemonSqueezy migration

## Current state (waitlist phase)

- **Landing CTAs** → `/#waitlist` via `src/lib/landing-config.ts` (`LANDING_MODE = "waitlist"`). Correct until paid launch.
- **`/checkout`** → placeholder page (`src/app/checkout/page.tsx`). No billing UI.
- **Pay-after-generate** (hidden funnel): `results/[jobId]` → `POST /api/checkout` → **Stripe** (`src/app/api/checkout/route.ts`, webhook, verify).
- **`src/lib/plans.ts`** → `stripeAmountCents(plan)` used by Stripe checkout. Plans: Basic €29 / Pro €59 / Executive €99 (founding €19 / €39 / €59 on landing only — apply via LS coupon or separate variants).

Do **not** link landing pricing buttons to `/checkout` until LemonSqueezy is wired.

---

## One-shot Cursor prompt (when LemonSqueezy credentials are ready)

Copy everything below into a new Cursor chat:

```
Integrate LemonSqueezy billing for Headshots AI. Replace Stripe for the pay-after-generate flow; wire /checkout for direct plan purchase when LANDING_MODE is "live".

Context:
- Plans in src/lib/plans.ts: basic (€29, 20 outputs, 2 styles), pro (€59, 40, 4), executive (€99, 60, 6).
- Founding prices on landing: €19 / €39 / €59 — use LemonSqueezy discount codes or separate variant IDs.
- Current Stripe: src/app/api/checkout/route.ts, src/app/api/checkout/verify/route.ts, src/app/api/webhooks/stripe/route.ts, job-results-client.tsx paywall.
- Placeholder: src/app/checkout/page.tsx ("billing not connected").
- Landing: src/lib/landing-config.ts — keep waitlist until I say switch LANDING_MODE to "live".

Tasks:
1. plans.ts — Replace stripeAmountCents with LEMONSQUEEZY_VARIANT_IDS: Record<PlanId, string> (and optional FOUNDING_VARIANT_IDS or coupon codes). Remove or deprecate stripeAmountCents.
2. Env — Document LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET, variant IDs per plan in .env.example.
3. API — New POST /api/checkout (or rename) that creates LemonSqueezy checkout with jobId + plan in custom data; webhook marks jobs.paid = true (mirror stripe webhook behavior).
4. Verify route — After LS redirect, verify order and unlock job (replace Stripe session verify).
5. results/[jobId]/job-results-client.tsx — Point pay button to new checkout API; handle success/cancel URLs.
6. checkout/page.tsx — Real UI: plan picker (basic/pro/executive) → LS checkout, or redirect to LS hosted checkout. Remove "billing not connected" stub.
7. privacy/page.tsx + terms — Replace "Stripe" with "Lemon Squeezy" where payment processor is named.
8. DB — Reuse jobs.paid; rename stripe_checkout_session_id to payment_reference or add lemonsqueezy_order_id column via migration if needed.
9. Do not change waitlist API, auth, or generation pipelines except payment gating.
10. npm run build must pass with zero TS errors.

When done: list env vars I must set in Vercel and which LemonSqueezy dashboard steps (products/variants/webhook URL).
```

---

## Launch checklist (after integration)

- [ ] Create 3 products (or 6 with founding variants) in LemonSqueezy
- [ ] Webhook URL → production `/api/webhooks/lemonsqueezy` (or chosen path)
- [ ] Test: upload → results → pay → download unlocked
- [ ] Set `LANDING_MODE = "live"` in `landing-config.ts`
- [ ] Pricing CTAs → `/checkout?plan=pro` or `/try/generate` as decided
