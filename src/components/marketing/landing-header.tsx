import Link from "next/link";

import { CtaButton } from "@/components/marketing/cta-button";
import { PRIMARY_CTA } from "@/lib/landing-config";

const nav = [
  { href: "#results", label: "Results" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#styles", label: "Styles" },
  { href: "#pricing", label: "Pricing" },
  { href: "#teams", label: "Teams" },
  { href: "#faq", label: "FAQ" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-[#faf8f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em] text-[#111827]">
          Headshots
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <CtaButton
          href={PRIMARY_CTA.href}
          event="hero_cta_click"
          eventProps={{ location: "header" }}
          className="min-h-[40px] px-5"
        >
          {PRIMARY_CTA.label}
        </CtaButton>
      </div>
    </header>
  );
}
