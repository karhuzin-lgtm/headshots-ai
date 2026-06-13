import Link from "next/link";

import { BrandMark } from "@/components/site/brand-mark";

export function LegalPageHeader() {
  return (
    <header className="border-b border-black/10 bg-[#edede7]">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="На главную">
          <BrandMark />
        </Link>
        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
        >
          На главную
        </Link>
      </div>
    </header>
  );
}
