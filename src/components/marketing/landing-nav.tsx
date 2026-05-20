"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { LANDING_NAV_LINKS } from "@/lib/landing-content";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 sm:px-6 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <nav
        className={`sticky-header mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-full border border-white/[0.06] bg-black/60 px-4 backdrop-blur-2xl transition-shadow duration-300 sm:h-16 sm:px-6 ${
          scrolled ? "shadow-lg shadow-black/30" : ""
        }`}
      >
        <Link
          href="/"
          className="shrink-0 font-display text-lg font-semibold tracking-tight text-[#f5f5f5] transition hover:text-white"
        >
          Headshots
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LANDING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#888] transition hover:text-[#f5f5f5]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/#waitlist"
          className="inline-flex shrink-0 min-h-[40px] items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#f5f5f5] sm:min-h-[44px] sm:px-5"
        >
          Join waitlist
        </Link>
      </nav>
    </motion.header>
  );
}
