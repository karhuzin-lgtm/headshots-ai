"use client";

import { useEffect } from "react";

import { trackClient } from "@/lib/track-client";

/**
 * Invisible client tracker: notifies the operator (once per browser session) that
 * a visitor opened the page. Mounted inside the otherwise-server landing component.
 */
export function VisitTracker({ path = "/" }: { path?: string }) {
  useEffect(() => {
    trackClient("site_visit", { path }, { oncePerSessionKey: "visit_home" });
  }, [path]);

  return null;
}
