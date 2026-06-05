# Codebase structure review

_Date: 2026-06-05 · Scope: repository structure, organization, legacy drift. No copy/positioning/business-logic changes._

Every item below is backed by a real grep/usage check, not assumption.

## Overall verdict

- **Healthy Next.js 14 MVP with mixed product eras.** Two complete generation pipelines coexist: a live free trial (Astria) and a paid flow being wired (fal.ai + Stripe + Supabase auth).
- **Structure is mostly clear; the drift is at the edges** — a few orphan files, tracked test fixtures in the repo root, and three parallel header implementations.
- **`src/lib` is a flat catch-all** mixing AI providers, two databases, billing, and marketing config. Works fine today, but domain grouping would help as it grows.
- **Docs are thin, not wrong** — no root README; `docs/` only covers billing.

## Current primary flow

The flow reachable from the live landing page (homepage CTAs → `GET_STARTED_URL`, default `/try/generate`):

1. `/try/generate` (`app/try/generate/page.tsx`, `app/try/try-free-client.tsx`)
2. → `POST /api/try-free/upload` then `POST /api/try-free` (`lib/astria.ts`, `lib/astria-images.ts`, `lib/generation-complete.ts`)
3. → Astria training → `POST /api/webhook/astria`
4. → polled via `/api/status/[requestId]` (+ `/sync`)
5. → results at `/try/result/[requestId]` (`result-client.tsx`), delivered by email (`lib/email.ts`)

This is the **current primary user path**. Decided from: homepage CTA target (`lib/landing-config.ts` → `/try/generate`), and the only flow with no auth wall.

### Second flow (paid, being built — not legacy)

Reachable only by direct URL today (not linked from the homepage):

- `/upload` (Supabase-auth gated via `lib/supabase/middleware.ts`) → `POST /api/jobs` → `POST /api/jobs/[jobId]/process` (`lib/fal-gen.ts`, `lib/fal.ts`, `lib/jobs/types.ts`) → `POST /api/webhook/fal` → `/results/[jobId]` (`job-results-client.tsx`) → Stripe `POST /api/checkout` (+ `/verify`) → `POST /api/webhooks/stripe`.

This is the **future paid product** ("payment being added now"), not dead code. It should not be removed without an explicit decision.

### Third subsystem (waitlist — now UI-less)

- `POST /api/waitlist` (+ `/unsubscribe`), `lib/waitlist-db.ts`, `components/WaitlistForm.tsx`, `components/legal/legal-consent-fields.tsx`. After the landing rewrite, **no page renders `WaitlistForm`** anymore (the backend still exists).

## Confirmed issues (verified by code)

1. **Orphan component — `src/components/marketing/social-proof-avatars.tsx`.** Defined but imported nowhere (only self-match). Leftover from the marketing rewrite. → _Removed in this pass._
2. **Tracked test fixtures in repo root — `tmp-test-upload/`, `tmp-test-upload-small/`.** 20 `.jpg` files (~7 MB), tracked by git (`git ls-files`), not in `.gitignore`, and referenced by zero source files. → _Removed from git + ignored in this pass._
3. **Orphan UI — `src/components/WaitlistForm.tsx`.** No importers after the landing rewrite. The rest of the waitlist subsystem (`/api/waitlist`, `waitlist-db.ts`, unsubscribe route, confirmation email) is still live. _Kept — see "requires product decision."_
4. **Orphan lib — `src/lib/db-migrate.ts`** (`migrateGenerationsSchema`). No caller in `src/`, no npm script. Likely a one-off manual migration helper. _Kept (harmless) — documented._
5. **Webhook route naming inconsistency.** `/api/webhook/astria` and `/api/webhook/fal` (singular) vs `/api/webhooks/stripe` (plural). These are externally-configured URLs (Astria/fal/Stripe dashboards), so renaming is not a silent change.
6. **Three header + two footer implementations** for one product:
   - `marketing/landing-header.tsx` + `marketing/landing-footer.tsx` → `/`
   - `marketing/site-header.tsx` + `marketing/site-footer.tsx` → `/checkout`, `/results/[jobId]`, `/upload`
   - `try/try-flow-header.tsx` (+ reuses `landing-footer`) → `/try/generate`, `/try/result`
7. **Two databases / mixed data layer.** Neon (`lib/generations-db.ts`, `lib/db-migrate.ts`, try-free flow) and Supabase (`lib/supabase/*`, `jobs` table, paid flow). `src/lib` is flat and mixes domains: AI (`astria*`, `fal*`), data (`generations-db`, `waitlist-db`, `supabase/*`), billing (`plans`), marketing (`landing-config`, `display-styles`, `my-photos`, `analytics`), infra (`email`, `utils`).
8. **Docs hygiene.** No root `README.md`. `supabase/README.md` is mostly accurate but slightly stale ("anon key reserved for future"). → _Root README added in this pass._

> Note: the deleted testimonials previously referenced `/avatars/*.jpg` assets that do not exist in `public/` (only `public/my/` exists). Confirmed there is no remaining reference to those paths.

## Top 5 recommended changes (by impact / effort)

1. **Document & decide the relationship between the two generation pipelines** (Astria free trial vs fal paid). Highest clarity win. Low code effort, but it's a product decision. Capture it in the README's "Architecture" section once decided.
2. **Consolidate the 3 headers / 2 footers** into one `<SiteChrome variant=…>` (or a single header + single footer with props). Medium effort, removes the most duplicated UI in the repo.
3. **Group `src/lib` into domain folders** — e.g. `lib/ai/` (astria*, fal*), `lib/db/` (generations-db, waitlist-db, db-migrate, supabase/*), `lib/billing/` (plans), `lib/marketing/` (landing-config, display-styles, my-photos, analytics). Mechanical but touches many imports — do in one dedicated PR.
4. **Unify webhook routes under `/api/webhooks/*`.** Low code effort; must be paired with updating the Astria/fal dashboard URLs, so coordinate — do not rename silently.
5. **Add an `npm run typecheck` script** (`tsc --noEmit`) and a short `scripts/` note. Currently only `dev/build/start/lint` exist; type errors are only caught via `build`.

## Safe changes done now (this pass)

- Deleted orphan `src/components/marketing/social-proof-avatars.tsx`.
- Removed tracked test fixtures `tmp-test-upload/` and `tmp-test-upload-small/` from git and added `tmp-test-upload*/` to `.gitignore`.
- Added root `README.md` (project overview, both flows, env, setup, scripts).
- Added this `docs/codebase-review.md`.

All low-risk: no route, component-in-use, or business logic touched. Verified with `npm run lint` and `npm run build`.

## Changes that require a product decision (left untouched)

- **Waitlist subsystem.** Remove `WaitlistForm` + `/api/waitlist` + `waitlist-db` entirely, or keep as a fallback capture? It's currently UI-less.
- **Paid `/upload` + Stripe flow.** Is this the canonical paid path, or will billing move to Lemon Squeezy/Paddle (see `docs/billing.md`)? Affects whether `/api/checkout`, `/api/webhooks/stripe`, and `stripeAmountCents` stay.
- **Webhook route rename** (`webhook` → `webhooks`) — needs external dashboard coordination.
- **Header/footer consolidation** and **`src/lib` re-domaining** — mechanical refactors that touch many files; worth doing but should be isolated PRs with sign-off.
- **`db-migrate.ts`** — keep as a manual migration helper or delete? Left in place (harmless).
