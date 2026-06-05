/**
 * Central place to configure CTA destinations and the launch offer.
 *
 * The primary CTA points to NEXT_PUBLIC_CHECKOUT_URL when set (the real paid
 * checkout link). Until billing is finalized it falls back to the working
 * generation flow at /try/generate, which really uploads photos and emails
 * back headshots. Set NEXT_PUBLIC_CHECKOUT_URL before driving paid traffic.
 */
const FALLBACK_GET_STARTED = "/try/generate";

export const GET_STARTED_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim() || FALLBACK_GET_STARTED;

/** True when GET_STARTED_URL is an external (paid checkout) link. */
export const CHECKOUT_IS_EXTERNAL = /^https?:\/\//.test(GET_STARTED_URL);

export const TEAM_CONTACT_URL =
  process.env.NEXT_PUBLIC_TEAM_CONTACT_URL?.trim() ||
  "https://wa.me/34627367635?text=Team%20headshots%20package";

export const PRIMARY_CTA = { href: GET_STARTED_URL, label: "Create my headshots" } as const;
export const HERO_CTA = { href: GET_STARTED_URL, label: "Create my headshots" } as const;
export const TEAM_CTA = { href: TEAM_CONTACT_URL, label: "Get a team quote" } as const;

/**
 * Single primary individual offer for launch.
 * Keep `headshots` / `styleCount` in sync with the Executive plan in plans.ts
 * (the backend generation config) and `price` in sync with the billing product.
 */
export const LAUNCH_OFFER = {
  name: "Professional",
  price: "€59",
  priceNote: "one-time, no subscription",
  headshots: 60,
  styleCount: 6,
  turnaround: "~20 minutes",
  features: [
    "60 high-resolution headshots",
    "All 6 professional styles",
    "Ready in ~20 minutes by email",
    "Full commercial usage rights",
    "Photos & AI model deleted within 30 days",
    "Don't love it? Free retrain or full refund",
  ],
} as const;
