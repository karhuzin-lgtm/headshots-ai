import Link from "next/link";

import { BrandMark } from "@/components/site/brand-mark";

export function TryFlowHeader({ step = "Создание портретов" }: { step?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-7">
        <Link href="/" aria-label="Headshots — главная">
          <BrandMark light />
        </Link>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#edc894]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">{step}</span>
        </div>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 transition hover:border-white/35 hover:text-white"
        >
          На главную
        </Link>
      </div>
    </header>
  );
}
