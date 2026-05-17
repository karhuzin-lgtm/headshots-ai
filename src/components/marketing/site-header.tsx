"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

const MOBILE_LINKS = [
  { href: "/#styles", label: "Styles" },
  { href: "/#process", label: "Process" },
  { href: "/#waitlist", label: "Waitlist" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg)]/75 backdrop-blur-2xl backdrop-saturate-150">
      <div className="relative mx-auto flex h-[3.35rem] max-w-[1400px] items-center justify-between gap-3 px-4 md:h-16 md:px-6 lg:px-10">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-foreground"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[color:var(--accent)] text-sm font-bold tracking-tight text-black shadow-[0_0_40px_-16px_var(--accent)] transition group-hover:scale-105">
            <span className="font-display text-[1.05rem] font-normal">H</span>
          </span>
          <span className="hidden min-[380px]:inline">
            <span className="font-display text-[1.08rem] font-normal italic tracking-tight">Headshots</span>
          </span>
        </Link>

        <nav
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:pointer-events-auto md:flex"
          aria-label="Main"
        >
          {MOBILE_LINKS.slice(0, 3).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm font-normal tracking-tight text-muted-foreground transition hover:bg-[color:var(--bg-3)] hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-initial md:gap-3">
          <Link
            href="/#waitlist"
            className="hidden rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-medium tracking-tight text-white transition hover:bg-[color:var(--bg-3)] md:inline-flex"
          >
            Try free
          </Link>
          <button
            type="button"
            className="glass-panel flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

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
            "absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300",
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
              className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-foreground"
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
                className="rounded-xl px-4 py-3.5 text-base font-medium tracking-tight text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="mt-8 border-t border-[color:var(--border)] pt-6 text-sm font-medium tracking-tight text-muted-foreground">
            Launching soon
          </p>
        </div>
      </div>
    </header>
  );
}
