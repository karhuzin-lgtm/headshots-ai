/**
 * Minimal, provider-agnostic analytics.
 *
 * `track()` is safe to call anywhere on the client. It forwards events to any
 * connected provider it detects (GTM dataLayer, Plausible, PostHog) and logs in
 * development. Wire a real provider by injecting its script in layout.tsx — no
 * other code changes required.
 */
export type AnalyticsEvent =
  | "hero_cta_click"
  | "pricing_cta_click"
  | "purchase_cta_click"
  | "team_cta_click"
  | "waitlist_submit"
  | "scroll_to_pricing"
  | "checkout_start";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;

  const w = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
    posthog?: { capture?: (event: string, props?: AnalyticsProps) => void };
  };

  try {
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...props });
    }
    if (typeof w.plausible === "function") {
      w.plausible(event, { props });
    }
    if (w.posthog?.capture) {
      w.posthog.capture(event, props);
    }
  } catch {
    /* analytics must never break the UI */
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
}
