import { BadgeCheck, Clock, Lock, RefreshCcw } from "lucide-react";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const items = [
  {
    icon: Lock,
    title: "Private by design",
    body: "Your uploads and your personal AI model are automatically deleted within 30 days. We never use your photos to train other models.",
  },
  {
    icon: BadgeCheck,
    title: "You own the results",
    body: "Full commercial usage rights. Use your headshots on LinkedIn, your website, press, business cards — anywhere.",
  },
  {
    icon: RefreshCcw,
    title: "Happy or refunded",
    body: "If you don't get headshots you'd actually use, we'll retrain your model for free or refund you in full.",
  },
  {
    icon: Clock,
    title: "No studio, no waiting",
    body: "Upload from your phone. Results arrive by email in about 20 minutes. No appointments, no travel.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Why trust us"
          title="Your photos and money, handled with care"
          subtitle="A real product with clear policies — not a black box."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }, index) => (
            <ScrollReveal key={title} delay={index * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#111827]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-gray-500">{body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
