import { Suspense } from "react";

import { LandingFooter } from "@/components/marketing/landing-footer";
import { TryFlowHeader } from "@/components/try/try-flow-header";
import { TryFreeClient } from "../try-free-client";

export default function TryGeneratePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#faf8f5] text-[#111827]">
      <TryFlowHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.14),transparent_70%)]" />
          <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(17,24,39,0.04),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 pb-6 pt-12 text-center sm:px-6 sm:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Upload & generate</p>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
            Create your headshots
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg font-light leading-relaxed text-gray-600">
            Upload 8–20 selfies from your phone. Get 18 studio-quality headshots across 6 professional styles in
            ~20 minutes.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="relative py-24 text-center text-sm text-gray-500">Loading…</div>
          }
        >
          <TryFreeClient />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}
