import Link from "next/link";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { PRIMARY_CTA } from "@/lib/landing-config";
import { PLANS, type PlanId } from "@/lib/plans";

const STYLE_NAMES = "LinkedIn, Corporate, Executive, Tech & Creative";

const FOUNDING_PRICE_EUR: Record<PlanId, number> = {
  basic: 19,
  pro: 39,
  executive: 59,
};

const PLAN_FEATURES: Record<PlanId, string[]> = {
  basic: ["40 headshots", "2 styles of your choice", "High resolution downloads"],
  pro: ["80 headshots", STYLE_NAMES, "High resolution downloads"],
  executive: [
    "120 headshots",
    `All 5 styles + priority queue`,
    "Ready in 4 hours",
    "1 manual retouch included",
  ],
};

const planOrder: PlanId[] = ["basic", "pro", "executive"];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Pricing"
          title="Simple plans when we launch."
          subtitle="Join the waitlist now — founding members lock in 40% off these prices."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {planOrder.map((id, index) => {
            const plan = PLANS[id];
            const founding = FOUNDING_PRICE_EUR[id];
            const isPopular = id === "pro";
            return (
              <ScrollReveal key={id} delay={index * 0.05}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 sm:p-8 ${
                    isPopular
                      ? "border-[#c9a96e]/50 shadow-lg ring-1 ring-[#c9a96e]/30"
                      : "border-gray-200/80 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#111827] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{plan.label}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-normal tracking-tight text-[#111827]">€{founding}</span>
                    <span className="text-sm text-gray-400 line-through">€{plan.priceEur}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#9a7b4f]">Founding member price</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {PLAN_FEATURES[id].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#c9a96e]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={PRIMARY_CTA.href}
                      className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                        isPopular
                          ? "bg-[#111827] text-white hover:bg-black"
                          : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {PRIMARY_CTA.label}
                    </Link>
                    <p className="mt-2 text-center text-xs text-gray-500">No card required</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-gray-500">
          Launch pricing shown. Waitlist members get priority access and the founding discount applied at checkout.
        </p>
      </div>
    </section>
  );
}
