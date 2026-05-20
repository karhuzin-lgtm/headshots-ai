"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export type FaqItem = { q: string; a: string };

type PremiumFaqProps = {
  heading?: string;
  subheading?: string;
  items: FaqItem[];
};

export function PremiumFaq({
  heading = "Questions, answered",
  subheading = "Everything you need to know before you upload your selfies.",
  items,
}: PremiumFaqProps) {
  const [openItem, setOpenItem] = React.useState<string | null>("item-0");

  return (
    <section id="faq" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="font-display text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#888]">{subheading}</p>
        </ScrollReveal>

        <div className="space-y-3">
          {items.map((item, index) => {
            const value = `item-${index}`;
            const isOpen = openItem === value;

            return (
              <ScrollReveal key={item.q} delay={index * 0.04}>
                <div
                  className={cn(
                    "glass-card overflow-hidden rounded-2xl transition-colors duration-200",
                    isOpen && "border-white/[0.12]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenItem(isOpen ? null : value)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="pr-4 text-base font-medium text-[#f5f5f5] sm:text-[17px]">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#888]"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.08] px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                          <p className="pt-4 text-sm leading-relaxed text-[#888] sm:text-[15px]">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-sm text-[#888]">
            Still have questions?{" "}
            <a
              href="mailto:aleksei@alekseimedia.com"
              className="font-medium text-[#f5f5f5] underline underline-offset-4 transition hover:text-white"
            >
              Email us
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
