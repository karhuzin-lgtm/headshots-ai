"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-3.35rem)] overflow-hidden border-b border-[color:var(--border)] bg-[radial-gradient(circle_at_50%_20%,oklch(12%_0.02_260),oklch(8%_0.008_260)_62%)]">
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -5 }}
        animate={{ opacity: 0.7, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-12 top-28 hidden w-52 overflow-hidden rounded-2xl shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 md:block lg:left-16 lg:w-64"
      >
        <Image
          src="/man-before.jpg?v=20260517-2"
          width={720}
          height={960}
          alt=""
          className="aspect-[3/4] w-full object-cover"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 5 }}
        animate={{ opacity: 0.86, y: 0, rotate: 2 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -right-10 bottom-20 hidden w-56 overflow-hidden rounded-2xl shadow-[0_30px_100px_-36px_rgba(0,0,0,0.95)] ring-1 ring-white/10 md:block lg:right-16 lg:w-72"
      >
        <Image
          src="/man-after.jpg?v=20260517-2"
          width={720}
          height={960}
          alt=""
          className="aspect-[3/4] w-full object-cover"
          priority
        />
      </motion.div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3.35rem)] w-full max-w-[1180px] flex-col items-center justify-center px-4 py-20 text-center md:px-6 lg:px-10">
        <div className="max-w-4xl">
            <motion.h1
              {...fadeUp}
            transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.65rem] font-normal leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-[72px]"
            >
            Professional headshots.
              <br />
            In 10 minutes.
            </motion.h1>

            <motion.p
              {...fadeUp}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-2xl text-pretty text-lg font-light leading-relaxed tracking-tight text-muted-foreground sm:text-xl"
            >
            Upload your phone selfies, choose a visual direction, and receive editorial-grade AI headshots that look like you.
            </motion.p>

            <motion.div
              {...fadeUp}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-10 w-full max-w-xl"
            >
            <WaitlistForm variant="dark" />
            <p className="mt-5 text-sm text-muted-foreground">
              No credit card · Results in 10 minutes · Free for early users
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
