"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

export function BeforeAfterSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISPLAY_STYLES[activeIndex];

  return (
    <section id="before-after" className="scroll-mt-24 bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Before → After</p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
            One selfie. Six professional looks.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
            Real results from the same casual photo — pick a style and see the difference.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-12 lg:mt-16" delay={0.05}>
          <div className="overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white shadow-[0_24px_60px_-32px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-[1fr_auto_1.15fr] items-stretch gap-0 border-b border-gray-100 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] lg:grid-cols-[minmax(0,280px)_auto_minmax(0,1fr)]">
              <div className="flex flex-col p-4 sm:p-6 lg:p-8">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-xs">
                  Before
                </p>
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200/80">
                  <Image
                    src={MY_BEFORE_PHOTO}
                    alt="Casual selfie before AI headshot"
                    width={480}
                    height={640}
                    className="aspect-[3/4] h-full w-full object-cover object-top"
                    sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 280px"
                    priority
                  />
                </div>
                <p className="mt-3 hidden text-xs text-gray-500 sm:block">Your casual selfie</p>
              </div>

              <div className="flex items-center justify-center px-1 sm:px-3 lg:px-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-md sm:h-12 sm:w-12">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </div>
              </div>

              <div className="flex flex-col p-4 sm:p-6 lg:p-8">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-900 sm:text-xs">
                  After — {active.name}
                </p>
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-900/10 shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full"
                    >
                      <Image
                        src={active.photo}
                        alt={`AI headshot — ${active.name} style`}
                        width={520}
                        height={693}
                        className="aspect-[3/4] h-full w-full object-cover object-top"
                        sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 360px"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-gray-900 shadow-sm backdrop-blur-sm sm:text-xs">
                    {active.name}
                  </span>
                </div>
                <p className="mt-3 hidden text-xs text-gray-500 sm:block">{active.tagline}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-[#fafafa] p-4 sm:p-6 lg:p-8">
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-gray-400 lg:text-left">
                All 6 styles from one upload
              </p>

              <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-wrap lg:overflow-visible [&::-webkit-scrollbar]:hidden">
                {DISPLAY_STYLES.map((style, index) => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      index === activeIndex
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    aria-pressed={index === activeIndex}
                  >
                    {style.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
                {DISPLAY_STYLES.map((style, index) => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group relative overflow-hidden rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
                      index === activeIndex
                        ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-[#fafafa]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`View ${style.name} style`}
                    aria-pressed={index === activeIndex}
                  >
                    <Image
                      src={style.photo}
                      alt=""
                      width={160}
                      height={213}
                      className="aspect-[3/4] w-full object-cover object-top"
                      sizes="(max-width: 640px) 30vw, 120px"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-left text-[10px] font-semibold text-white sm:text-xs">
                      {style.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
