"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";
import { MARKETING_AVATARS } from "@/lib/marketing-images";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[min(72vh,760px)] w-[min(130vw,880px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-[hsl(36_42%_42%/0.22)] via-[hsl(28_30%_18%/0.12)] to-transparent blur-[100px] animate-shimmer-slow" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[hsl(22_35%_22%/0.15)] blur-[90px]" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[hsl(40_28%_28%/0.12)] blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-16 pt-12 sm:pb-24 sm:pt-16 md:px-6 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-20">
          <div className="order-1 max-w-xl lg:order-none lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <div
                className="flex -space-x-2.5"
                role="img"
                aria-label="Collage of professional customers"
              >
                {MARKETING_AVATARS.map((src) => (
                  <span
                    key={src}
                    className="relative inline-flex h-9 w-9 overflow-hidden rounded-full ring-2 ring-[hsl(28_12%_7%)] shadow-lg shadow-black/30"
                  >
                    <Image
                      src={src}
                      alt=""
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium tracking-tight text-muted-foreground">
                Be first to know when we launch
              </p>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-7 text-[2.35rem] font-normal leading-[1.06] tracking-[-0.02em] sm:mt-9 sm:text-5xl sm:leading-[1.04] lg:text-[3.35rem]"
            >
              <span className="text-gradient-display">Portraits that</span>
              <br />
              <span className="text-gradient-display">read as </span>
              <span className="relative inline-block">
                <span className="relative z-10 font-display italic text-gradient-brass">
                  investment-grade.
                </span>
                <span
                  className="absolute -inset-x-2 -inset-y-1 -z-0 rounded-2xl bg-primary/15 blur-2xl"
                  aria-hidden
                />
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.58, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-md text-pretty text-base leading-relaxed tracking-tight text-muted-foreground sm:text-lg"
            >
              Upload 10-20 selfies. We generate your first professional AI headshot — free, no credit
              card. Limited to the first 100 testers.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.58, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-11 w-full max-w-lg"
            >
              <WaitlistForm variant="dark" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 w-full min-w-0 max-w-lg justify-self-center lg:order-none lg:max-w-none lg:justify-self-end"
            style={{ perspective: "1200px" }}
          >
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
              {["/man-after.jpg", "/exec-after.jpg", "/woman2-after.jpg"].map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  width={420}
                  height={560}
                  className="aspect-[3/4] w-full rounded-2xl object-cover"
                  alt="AI headshot"
                  sizes="(max-width: 1023px) 33vw, 180px"
                  priority={index === 0}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              AI-generated from phone selfies
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
