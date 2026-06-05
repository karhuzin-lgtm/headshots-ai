"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { PRIMARY_CTA } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

const MOBILE_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#styles", label: "Styles" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "minimal" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMinimal = variant === "minimal";

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky-header sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/85 backdrop-blur-2xl backdrop-saturate-150">
      <div className="relative mx-auto flex h-[3.35rem] max-w-[1400px] items-center justify-between gap-3 px-4 md:h-16 md:px-6 lg:px-10">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-foreground"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0a0a0a] text-sm font-bold tracking-tight text-white shadow-sm transition group-hover:scale-105">
            <span className="font-display text-[1.05rem] font-semibold">H</span>
          </span>
          <span className={cn(isMinimal ? "inline" : "hidden min-[380px]:inline")}>
            <span className="font-display text-[1.08rem] font-semibold tracking-tight">Headshots</span>
          </span>
        </Link>

        {!isMinimal && (
          <nav
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:pointer-events-auto md:flex"
            aria-label="Main"
          >
            {MOBILE_LINKS.slice(0, 3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3.5 py-3 text-sm font-normal tracking-tight text-muted-foreground transition hover:bg-gray-100 hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-initial md:gap-3">
          {isMinimal ? (
            <Link
              href="/"
              className="hidden text-sm font-medium tracking-tight text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              ← Back to headshots.alekseimedia.com
            </Link>
          ) : (
            <>
              <Link
                href={PRIMARY_CTA.href}
                className="hidden min-h-[44px] items-center rounded-full bg-[#0a0a0a] px-4 py-2 text-sm font-medium tracking-tight text-white transition hover:bg-[#222] md:inline-flex"
              >
                {PRIMARY_CTA.label}
              </Link>
              <button
                type="button"
                className="glass-panel flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-foreground md:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {!isMinimal && (
        <div
          id="mobile-nav"
          className={cn(
            "fixed inset-0 z-[60] md:hidden",
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          aria-hidden={!menuOpen}
        >
          <button
            type="button"
            className={cn(
              "absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-300",
              menuOpen ? "opacity-100" : "opacity-0"
            )}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={cn(
              "glass-panel-strong absolute right-0 top-0 z-[70] flex h-full w-[min(100%,20rem)] flex-col px-4 pb-8 pt-6 transition-transform duration-300 ease-out",
              menuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-foreground">Menu</span>
              <button
                type="button"
                className="glass-panel flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-foreground"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
              {MOBILE_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-4 py-3.5 text-base font-medium tracking-tight text-muted-foreground transition hover:bg-gray-100 hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Link
              href={PRIMARY_CTA.href}
              onClick={() => setMenuOpen(false)}
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0a0a0a] px-5 text-sm font-semibold text-white transition hover:bg-[#222]"
            >
              {PRIMARY_CTA.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
