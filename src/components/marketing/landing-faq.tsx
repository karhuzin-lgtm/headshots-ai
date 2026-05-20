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
    <section id="faq" className="scroll-mt-24 bg-[#fafafa] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#0a0a0a] sm:text-5xl">
            Questions, answered
          </h2>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <Accordion type="single" collapsible className="rounded-2xl border border-neutral-200/80 bg-white px-6 shadow-sm">
            {items.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                className="border-neutral-200/80"
              >
                <AccordionTrigger className="text-base font-medium text-[#0a0a0a] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
