"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

type FaqItem = { q: string; a: string };

export function LandingFaq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">FAQ</p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
            Questions, answered
          </h2>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="glass-card rounded-2xl px-6"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                className="border-white/[0.08]"
              >
                <AccordionTrigger className="text-base font-medium text-[#f5f5f5] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#888]">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
