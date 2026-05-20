"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky-header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-white transition hover:text-white/80"
        >
          Headshots
        </Link>
        <Link
          href="/#waitlist"
          className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 bg-[#f5f0e8] px-5 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-white"
        >
          Join waitlist
        </Link>
      </div>
    </header>
  );
}
