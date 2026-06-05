"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionIntro } from "@/components/marketing/section-intro";

const faqItems = [
  {
    q: "How many photos do I need?",
    a: "8–20 casual selfies work best. Face visible, good lighting, variety in angles. Phone photos are perfect.",
  },
  {
    q: "How long does it take?",
    a: "Approximately 20 minutes from upload to ready. We'll email you — no need to keep the tab open.",
  },
  {
    q: "Are my photos stored?",
    a: "No. Uploads and your personal model are automatically deleted after 30 days. We never train other models on your data.",
  },
  {
    q: "Can I use the headshots commercially?",
    a: "Yes. You own the results — LinkedIn, website, press, business cards, anywhere.",
  },
  {
    q: "What if I don't like the results?",
    a: "If you don't get headshots you'd actually use, we'll retrain your model for free or refund you in full.",
  },
  {
    q: "What exactly do I get and how much is it?",
    a: "One simple price of €59 — a full set of 60 high-resolution headshots across all 6 styles, delivered by email. No subscription, no hidden credits. Teams get volume pricing.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <SectionIntro title="Questions" subtitle="Quick answers before you start." />
        <Accordion type="single" collapsible className="mt-12">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base text-[#111827]">{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
