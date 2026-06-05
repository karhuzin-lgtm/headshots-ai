import { Check } from "lucide-react";

import { CtaButton } from "@/components/marketing/cta-button";
import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { TEAM_CTA } from "@/lib/landing-config";

const benefits = [
  "One consistent, professional look across every profile",
  "Each person uploads their own selfies — fully remote",
  "Choose from all 6 professional styles",
  "Volume pricing — the more seats, the lower the per-person rate",
  "Single invoice to your company, pay by card or bank transfer",
];

export function TeamSection() {
  return (
    <section id="teams" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="For teams"
          title="One consistent look for your whole team"
          subtitle="Remote or in-office, everyone uploads their own photos and gets matching, professional headshots. Tell us your headcount and we'll send a quote."
        />

        <ScrollReveal className="mt-12">
          <div className="grid items-center gap-8 rounded-3xl border border-gray-100 bg-[#faf8f5] p-8 shadow-sm sm:p-10 lg:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#111827]" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-start gap-4 border-t border-gray-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm font-light text-gray-600">
                Tell us your team size and preferred styles. We&apos;ll reply with pricing and timing — usually
                within one business day.
              </p>
              <CtaButton
                href={TEAM_CTA.href}
                event="team_cta_click"
                eventProps={{ location: "teams" }}
                className="px-7"
              >
                {TEAM_CTA.label}
              </CtaButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
