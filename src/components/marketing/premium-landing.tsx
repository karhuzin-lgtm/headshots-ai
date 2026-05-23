"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { WaitlistForm } from "@/components/WaitlistForm";
import { DISPLAY_STYLES } from "@/lib/display-styles";

const HERO_PHOTOS = [
  { src: "/avatars/avatar-07.jpg", alt: "LinkedIn headshot", x: "8%", y: "6%", z: 30, delay: 0 },
  { src: "/avatars/avatar-19.jpg", alt: "Corporate headshot", x: "52%", y: "0%", z: 40, delay: 0.12 },
  { src: "/avatars/avatar-executive.jpg", alt: "Executive headshot", x: "68%", y: "38%", z: 35, delay: 0.22 },
  { src: "/avatars/avatar-creative.jpg", alt: "Creative headshot", x: "4%", y: "48%", z: 25, delay: 0.18 },
  { src: "/avatars/avatar-startup.jpg", alt: "Startup headshot", x: "38%", y: "58%", z: 45, delay: 0.28 },
] as const;

const STATS = [
  { value: "~15 min", label: "Upload to ready" },
  { value: "6", label: "Pro styles" },
  { value: "18", label: "Photos per run" },
  { value: "40%", label: "Founding discount" },
] as const;

const TICKER = DISPLAY_STYLES.map((s) => s.name);

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-mesh absolute -left-[20%] top-[-30%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(243,244,246,0.95),transparent_68%)] blur-3xl" />
      <div className="landing-mesh-alt absolute -right-[15%] bottom-[-25%] h-[65%] w-[65%] rounded-full bg-[radial-gradient(circle,rgba(249,250,251,0.9),transparent_70%)] blur-3xl" />
      <div className="landing-grid absolute inset-0 opacity-[0.35]" />
      <div className="landing-shine absolute inset-0" />
    </div>
  );
}

function PhotoShowcase({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative mx-auto h-full w-full max-w-[520px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease }}
        className="absolute inset-[12%] rounded-[2rem] border border-gray-100/80 bg-white/60 shadow-[0_40px_100px_-40px_rgba(17,24,39,0.22)] backdrop-blur-sm"
      />

      {HERO_PHOTOS.map((photo, index) => (
        <motion.div
          key={photo.src}
          className="absolute w-[38%] sm:w-[36%]"
          style={{ left: photo.x, top: photo.y, zIndex: photo.z }}
          initial={{ opacity: 0, y: 28, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.35 + photo.delay, ease }}
        >
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                    rotate: [0, index % 2 === 0 ? 1.2 : -1.2, 0],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : {
                    duration: 5 + index * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: photo.delay * 2,
                  }
            }
            className="overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0_24px_60px_-28px_rgba(17,24,39,0.28)] ring-1 ring-gray-100/80 sm:rounded-3xl"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={480}
              height={640}
              className="aspect-[3/4] w-full object-cover object-top"
              priority={index < 2}
              sizes="(max-width: 768px) 38vw, 200px"
            />
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease }}
        className="absolute bottom-[6%] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-gray-100 bg-white/95 px-4 py-2 text-xs font-medium text-gray-600 shadow-lg backdrop-blur-md"
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 landing-pulse" />
        Studio-quality · trained on your face
      </motion.div>
    </div>
  );
}

function StyleTicker({ reducedMotion }: { reducedMotion: boolean }) {
  const items = [...TICKER, ...TICKER];

  return (
    <div className="relative mt-6 overflow-hidden rounded-full border border-gray-100 bg-[#f9fafb]/80 py-2.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f9fafb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f9fafb] to-transparent" />
      <motion.div
        className="flex w-max gap-8 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "linear" }
        }
      >
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="flex items-center gap-8">
            {name}
            <span className="text-gray-300">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function PremiumLanding() {
  const reducedMotion = useReducedMotion();
  const [spotlight, setSpotlight] = useState(0);
  const highlights = [
    "Private model on your face",
    "6 styles · 3 photos each",
    "No studio. No scheduling.",
  ];

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setSpotlight((v) => (v + 1) % highlights.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reducedMotion, highlights.length]);

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-white text-[#111827]">
      <AnimatedMesh />

      <header className="relative z-20 shrink-0 border-b border-gray-100/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-[-0.03em] sm:text-xl"
          >
            Headshots
          </Link>
          <div className="hidden items-center gap-6 text-xs font-medium text-gray-500 sm:flex">
            <span>6 professional styles</span>
            <span className="h-3 w-px bg-gray-200" />
            <span>Ready in ~15 minutes</span>
          </div>
          <Link
            href="#waitlist"
            className="group inline-flex min-h-[40px] items-center gap-1 rounded-full bg-[#0a0a0a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#222] sm:px-5 sm:text-sm"
          >
            Get 40% off
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <section className="relative z-20 flex min-h-0 flex-1 flex-col justify-center bg-gradient-to-b from-white via-white/95 to-white/88 px-4 py-4 sm:px-6 sm:py-5 lg:max-w-[52%] lg:bg-transparent lg:px-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gray-100 bg-white/90 px-3 py-1.5 text-xs text-gray-500 shadow-sm backdrop-blur-sm sm:mb-5"
          >
            <Sparkles className="h-3.5 w-3.5 text-gray-400" />
            <span>
              <strong className="font-semibold text-[#111827]">1,200+</strong> on early access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="font-display text-[2rem] font-normal leading-[0.95] tracking-[-0.03em] text-[#111827] sm:text-5xl lg:text-[3.35rem] xl:text-6xl"
          >
            <span className="text-gradient-display">Looks like you.</span>
            <br />
            <span className="relative mt-1 inline-block">
              Not like AI.
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#111827] via-gray-400 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease }}
            className="mt-4 max-w-md text-sm font-light leading-relaxed text-gray-600 sm:mt-5 sm:text-base lg:text-[17px]"
          >
            We train a private model on your face — not a generic filter. Studio-quality
            headshots in fifteen minutes. No photographer, no scheduling.
          </motion.p>

          <div className="mt-3 h-5 overflow-hidden sm:mt-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={spotlight}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease }}
                className="text-xs font-medium tracking-wide text-gray-500 sm:text-sm"
              >
                {highlights[spotlight]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            id="waitlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-5 w-full max-w-lg sm:mt-6"
          >
            <WaitlistForm showLabel={false} />
          </motion.div>

          <div className="hidden sm:block">
            <StyleTicker reducedMotion={!!reducedMotion} />
          </div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 grid grid-cols-4 gap-1.5 sm:mt-5 sm:gap-2 lg:mt-6"
          >
            {STATS.map((stat, index) => (
              <motion.li
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.06, duration: 0.5, ease }}
                className="rounded-xl border border-gray-100 bg-white/80 px-2 py-2 text-center shadow-sm backdrop-blur-sm sm:rounded-2xl sm:px-4 sm:py-3.5"
              >
                <p className="font-display text-base font-semibold tracking-tight text-[#111827] sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 sm:text-[11px]">
                  {stat.label}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section className="pointer-events-none absolute inset-x-0 bottom-14 top-14 z-0 opacity-[0.42] sm:bottom-16 sm:opacity-55 lg:pointer-events-auto lg:relative lg:inset-auto lg:bottom-auto lg:top-auto lg:z-10 lg:min-h-0 lg:flex-[0.95] lg:opacity-100">
          <div className="h-full lg:py-4">
            <PhotoShowcase reducedMotion={!!reducedMotion} />
          </div>
        </section>
      </main>

      <footer className="relative z-20 shrink-0 border-t border-gray-100/80 bg-white/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-[11px] text-gray-500 sm:flex-row sm:text-xs">
          <p>© 2026 Aleksei Media</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link href="/privacy" className="transition hover:text-[#111827]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#111827]">
              Terms
            </Link>
            <a
              href="mailto:aleksei@alekseimedia.com"
              className="transition hover:text-[#111827]"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
