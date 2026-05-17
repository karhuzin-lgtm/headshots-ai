import { Suspense } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TryFreeClient } from "../try-free-client";

export default function TryGeneratePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="relative">
          <div className="mx-auto max-w-3xl px-5 pb-8 pt-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Beta Access
            </p>
            <h1 className="text-4xl font-normal tracking-tight text-gray-900 sm:text-5xl">
              Create your AI headshots
            </h1>
            <p className="mt-4 text-lg font-light text-gray-500">
              Upload 8-20 selfies and get professional portraits in ~15 minutes.
              We&apos;ll email you when they&apos;re ready.
            </p>
          </div>
          <Suspense fallback={<div className="py-32 text-center text-sm text-muted-foreground">Loading...</div>}>
            <TryFreeClient />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
