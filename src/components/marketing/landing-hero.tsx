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
    <section className="relative overflow-hidden border-b border-gray-100 bg-white">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-16 pt-12 sm:pb-24 sm:pt-16 md:px-6 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:items-center lg:gap-16">
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
                    className="relative inline-flex h-9 w-9 overflow-hidden rounded-full ring-2 ring-white shadow-sm"
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
              className="font-display mt-7 text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0a0a0a] sm:mt-9 sm:text-6xl sm:leading-[1] lg:text-[4.25rem]"
            >
              <span>Portraits that</span>
              <br />
              <span>read as </span>
              <span className="relative inline-block">
                <span className="relative z-10 font-display italic text-gradient-brass">
                  investment-grade.
                </span>
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.58, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-md text-pretty text-base leading-relaxed tracking-tight text-muted-foreground sm:text-lg"
            >
              Upload 8-20 selfies. We generate your first professional AI headshot — free, no credit
              card. Limited to the first 100 testers.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.58, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-11 w-full max-w-lg"
            >
              <WaitlistForm />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 w-full min-w-0 max-w-4xl justify-self-center lg:order-none lg:max-w-none lg:justify-self-end"
            style={{ perspective: "1200px" }}
          >
            <div className="mx-auto grid w-full max-w-4xl grid-cols-3 gap-3 sm:gap-5">
              {["/man-after.jpg?v=20260517-2", "/exec-after.jpg", "/woman2-after.jpg"].map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  width={720}
                  height={960}
                  className="aspect-[3/4] w-full rounded-3xl object-cover shadow-sm ring-1 ring-gray-100"
                  alt="AI headshot"
                  sizes="(max-width: 1023px) 33vw, 320px"
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
