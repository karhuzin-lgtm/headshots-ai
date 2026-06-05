# Headshots AI

Professional AI headshots from selfies. Upload a few phone photos, get studio-quality
headshots across 6 styles, delivered by email in ~20 minutes.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Supabase**, **Neon Postgres**,
**fal.ai** + **Astria** (image generation), **Stripe** (billing, in progress), and **Resend** (email).

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

## Scripts

| Script          | Purpose                              |
| --------------- | ------------------------------------ |
| `npm run dev`   | Local dev server                     |
| `npm run build` | Production build (also typechecks)   |
| `npm run start` | Serve the production build           |
| `npm run lint`  | ESLint (`next lint`)                 |

## Architecture: two generation flows

This repo contains two distinct product flows. See
[`docs/codebase-review.md`](docs/codebase-review.md) for the full structural breakdown.

### 1. Free trial (currently the primary, live flow)

The landing page CTAs point here (`NEXT_PUBLIC_CHECKOUT_URL`, default `/try/generate`).

```
/try/generate → /api/try-free(/upload) → Astria training
              → /api/webhook/astria → /api/status/[requestId] → /try/result/[requestId]
```

Backed by Astria (`src/lib/astria*.ts`, `src/lib/generation-complete.ts`) and Neon
(`src/lib/generations-db.ts`). Results emailed via `src/lib/email.ts`.

### 2. Paid flow (in progress — not linked from the homepage yet)

```
/upload (Supabase auth) → /api/jobs → /api/jobs/[jobId]/process (fal.ai)
        → /api/webhook/fal → /results/[jobId] → /api/checkout (Stripe) → /api/webhooks/stripe
```

Backed by fal.ai (`src/lib/fal*.ts`), Supabase (`src/lib/supabase/*`, `jobs` table), and
Stripe. Plans/pricing live in `src/lib/plans.ts`. Billing provider notes:
[`docs/billing.md`](docs/billing.md).

## Configuration

CTA destinations and the launch offer are centralized in `src/lib/landing-config.ts`:

| Env var                       | Effect                                                              |
| ----------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_CHECKOUT_URL`    | Primary "Create my headshots" CTA target (defaults to `/try/generate`) |
| `NEXT_PUBLIC_TEAM_CONTACT_URL`| "Get a team quote" CTA target (defaults to WhatsApp)                |

See `.env.example` for the full list (database, Supabase, fal/Astria keys, Stripe, Resend, Blob).

## Project layout

```
src/app/            Routes (pages + /api route handlers)
src/components/     UI — marketing/, try/, upload/, legal/, auth/, ui/
src/lib/            Domain logic — AI providers, db, billing, marketing config, email
supabase/           SQL migrations + setup notes
docs/               billing.md, codebase-review.md
```

## Analytics

`src/lib/analytics.ts` exposes a provider-agnostic `track()` that forwards to GTM dataLayer /
Plausible / PostHog if present. Wire a provider by injecting its script in `src/app/layout.tsx`;
no other changes needed.
