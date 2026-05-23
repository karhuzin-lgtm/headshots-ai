"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Lock, Sparkles } from "lucide-react";

import { WaitlistForm } from "@/components/WaitlistForm";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

const ease = [0.16, 1, 0.3, 1] as const;

const trustPoints = [
  { icon: Clock, label: "~15 min to results" },
  { icon: Sparkles, label: "6 pro styles" },
  { icon: Lock, label: "Private & deleted in 30 days" },
];

const styleStrip = [
  { src: "/my/linkedin.jpg", name: "LinkedIn", featured: true },
  { src: "/my/corporate.jpg", name: "Corporate", featured: false },
  { src: "/my/executive.jpg", name: "Executive", featured: false },
  { src: "/my/tech.jpg", name: "Tech", featured: false },
  { src: "/my/creative.jpg", name: "Creative", featured: false },
  { src: "/my/startup.jpg", name: "Startup", featured: false },
];

export function LandingHero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <section className="relative overflow-hidden bg-white text-[#111827]">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(249,250,251,1),transparent_70%)]" />
        <div className="absolute -right-24 top-12 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(243,244,246,0.9),transparent_68%)] blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl lg:max-w-none">
          <motion.div
            {...fade(0)}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium tracking-wide text-gray-600">
              Early access · <span className="text-gray-900">40% off</span> for founding members
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.05)}
            className="max-w-[14ch] text-[2.75rem] font-normal leading-[0.95] tracking-tight text-[#111827] sm:text-6xl lg:text-[4.25rem]"
          >
            Looks like you.
            <br />
            <span className="text-gradient-display">Not like AI.</span>
          </motion.h1>

          <motion.p
            {...fade(0.12)}
            className="mt-6 max-w-lg text-pretty text-lg font-light leading-relaxed text-gray-600 sm:text-[1.125rem] sm:leading-8"
          >
            Upload your selfies. We train a private model on your face — then deliver studio-quality headshots in six
            professional styles. No photographer. No scheduling.
          </motion.p>

          <motion.ul {...fade(0.18)} className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9fafb] text-gray-700 ring-1 ring-gray-100">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div
            {...fade(0.24)}
            className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] sm:p-6"
          >
            <p className="mb-4 text-sm font-medium text-gray-900">Reserve your spot in the first batch</p>
            <WaitlistForm showLabel={false} hideFooter submitLabel="Claim my spot" />
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              No payment now. We&apos;ll email you when your spot opens — founding discount locked in.
            </p>
          </motion.div>
        </div>

        <motion.div {...fade(0.15)} className="relative mx-auto w-full max-w-[420px] lg:max-w-none lg:justify-self-end">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] sm:max-w-[420px]">
            <div className="absolute inset-[8%] rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-50 blur-2xl" />

            <motion.div
              {...fade(0.28)}
              className="absolute left-0 top-[6%] z-20 w-[42%] motion-safe:animate-float"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative -rotate-6">
                <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl shadow-black/10">
                  <Image
                    src={MY_BEFORE_PHOTO}
                    alt="Casual selfie before AI headshot"
                    width={320}
                    height={420}
                    className="aspect-[3/4] w-full object-cover object-top"
                    priority
                    sizes="160px"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                  Your selfie
                </span>
              </div>
            </motion.div>

            <motion.div
              {...fade(0.2)}
              className="absolute right-0 top-[10%] z-10 w-[68%] motion-safe:animate-float"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="ring-brass-pulse relative overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-2xl shadow-black/12">
                <Image
                  src="/my/linkedin.jpg"
                  alt="AI headshot — LinkedIn style"
                  width={520}
                  height={693}
                  className="aspect-[3/4] w-full object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 68vw, 320px"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur-sm">
                  LinkedIn
                </span>
              </div>
            </motion.div>

            <motion.div
              {...fade(0.32)}
              className="absolute bottom-[14%] left-[8%] z-30 w-[46%] motion-safe:animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="relative rotate-3">
                <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl shadow-black/10">
                  <Image
                    src="/my/corporate.jpg"
                    alt="AI headshot — Corporate style"
                    width={360}
                    height={480}
                    className="aspect-[3/4] w-full object-cover object-top"
                    sizes="180px"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700 shadow-md ring-1 ring-gray-100">
                  Corporate
                </span>
              </div>
            </motion.div>

            <div className="absolute bottom-2 right-2 z-40 rounded-full border border-gray-100 bg-white/95 px-3.5 py-2 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-sm">
              +4 more styles
            </div>
          </div>

          <motion.div {...fade(0.36)} className="mt-8 flex justify-center gap-2 sm:gap-2.5">
            {styleStrip.map((style) => (
              <div
                key={style.src}
                className={`overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-white ${
                  style.featured ? "ring-gray-900" : "ring-transparent opacity-75"
                }`}
                title={style.name}
              >
                <Image
                  src={style.src}
                  alt={`${style.name} style preview`}
                  width={72}
                  height={96}
                  className="aspect-[3/4] h-16 w-12 object-cover object-top sm:h-[4.5rem] sm:w-[3.25rem]"
                  sizes="52px"
                />
              </div>
            ))}
          </motion.div>
          <p className="mt-3 text-center text-xs font-medium tracking-wide text-gray-400">All from the same upload</p>
        </motion.div>
      </div>
    </section>
  );
}
