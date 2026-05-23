import Link from "next/link";
import { Suspense } from "react";

import { SiteHeader } from "@/components/marketing/site-header";
import { TryFreeClient } from "../try-free-client";

export default function TryGeneratePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader variant="minimal" />
      <main className="relative flex-1">
        <div className="relative">
          <div className="mx-auto max-w-3xl px-5 pb-8 pt-16 text-center">
            <h1 className="text-4xl font-normal tracking-tight text-gray-900 sm:text-5xl">
              Create your headshots
            </h1>
            <p className="mt-4 text-lg font-light text-gray-500">
              Upload 8-20 selfies. Get studio-quality AI headshots in ~15 minutes.
            </p>
          </div>
          <Suspense fallback={<div className="py-32 text-center text-sm text-muted-foreground">Loading...</div>}>
            <TryFreeClient />
          </Suspense>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 Aleksei Media · headshots.alekseimedia.com</p>
        <p className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/privacy" className="transition hover:text-gray-600">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-gray-600">
            Terms
          </Link>
          <Link href="/legal" className="transition hover:text-gray-600">
            Legal
          </Link>
        </p>
      </footer>
    </div>
  );
}
