import { Suspense } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TryFreeClient } from "./try-free-client";

export default function TryPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="relative">
          <Suspense fallback={<div className="py-32 text-center text-sm text-muted-foreground">Loading...</div>}>
            <TryFreeClient />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
