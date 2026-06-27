/**
 * Client-side funnel tracking helper. Fires a fire-and-forget POST to /api/track,
 * which forwards key buyer events to the operator's Telegram. Designed to NEVER
 * affect the UX:
 *  - no-op on the server (SSR safe),
 *  - optional per-session dedup via sessionStorage,
 *  - keepalive POST, never awaited, fully wrapped in try/catch — never throws.
 */

type TrackProps = Record<string, string>;

interface TrackOpts {
  /** When set, the event is sent at most once per browser session for this key. */
  oncePerSessionKey?: string;
}

export function trackClient(event: string, props?: TrackProps, opts?: TrackOpts): void {
  // Browser-only — silent no-op during SSR / build.
  if (typeof window === "undefined") return;

  try {
    const key = opts?.oncePerSessionKey;
    if (key) {
      const storageKey = `track:${key}`;
      try {
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // sessionStorage may be unavailable (privacy mode) — proceed without dedup.
      }
    }

    // Fire-and-forget. keepalive lets the request survive a navigation.
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, props }),
      keepalive: true,
    }).catch(() => {
      // Network failure must never surface to the UI.
    });
  } catch {
    // Any unexpected error is swallowed — tracking must never break the flow.
  }
}
