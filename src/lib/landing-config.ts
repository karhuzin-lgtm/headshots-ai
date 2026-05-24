/** Flip to "live" when product opens — updates CTAs site-wide. */
export const LANDING_MODE = "waitlist" as const;

export const PRIMARY_CTA =
  LANDING_MODE === "waitlist"
    ? { href: "/#waitlist", label: "Join early access" }
    : { href: "/try/generate", label: "Get started" };

export const HERO_CTA =
  LANDING_MODE === "waitlist"
    ? { href: "/#waitlist", label: "Claim founding discount" }
    : { href: "/try/generate", label: "Upload your selfies" };
