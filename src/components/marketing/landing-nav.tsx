"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky-header fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-[#f5f5f5] transition hover:text-[#f5f5f5]/80"
        >
          Headshots
        </Link>
        <Link
          href="/#waitlist"
          className="inline-flex min-h-[44px] items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#f5f5f5]"
        >
          Join waitlist
        </Link>
      </div>
    </header>
  );
}
