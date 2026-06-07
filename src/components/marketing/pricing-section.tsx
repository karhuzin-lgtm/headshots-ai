import { Check } from "lucide-react";
import Link from "next/link";

import { CtaButton } from "@/components/marketing/cta-button";
import { ScrollTracker } from "@/components/marketing/scroll-tracker";
import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LAUNCH_OFFER, PRIMARY_CTA } from "@/lib/landing-config";
import { purchasableTiers, type Tier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
      {children}
    </li>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm sm:p-8",
        tier.popular
          ? "border-[#c9a96e]/50 shadow-xl shadow-black/[0.06]"
          : "border-gray-200/80"
      )}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#111827] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          Популярный выбор
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{tier.tagline}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-normal tracking-tight text-[#111827]">{tier.priceLabel}</span>
        <span className="text-sm text-gray-500">разово</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <Feature key={f}>{f}</Feature>
        ))}
      </ul>
      <CtaButton
        href={`/try/generate?tier=${tier.id}`}
        event="pricing_cta_click"
        eventProps={{ location: "pricing", tier: tier.id }}
        variant={tier.popular ? "primary" : "secondary"}
        fullWidth
        className="mt-8"
      >
        Выбрать
      </CtaButton>
    </div>
  );
}

/** Single launch/test card shown until per-tier LavaTop offers are configured. */
function LaunchCard() {
  return (
    <div className="mx-auto max-w-md">
      <div className="relative flex flex-col rounded-3xl border border-[#c9a96e]/40 bg-white p-8 shadow-xl shadow-black/[0.06] sm:p-10">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#111827] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          Популярный выбор
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{LAUNCH_OFFER.name}</h3>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-normal tracking-tight text-[#111827]">{LAUNCH_OFFER.price}</span>
          <span className="text-sm text-gray-500">{LAUNCH_OFFER.priceNote}</span>
        </div>
        <ul className="mt-8 space-y-3">
          {LAUNCH_OFFER.features.map((f) => (
            <Feature key={f}>{f}</Feature>
          ))}
        </ul>
        <CtaButton
          href={PRIMARY_CTA.href}
          event="pricing_cta_click"
          eventProps={{ location: "pricing" }}
          fullWidth
          className="mt-8 text-base"
        >
          {PRIMARY_CTA.label}
        </CtaButton>
      </div>
    </div>
  );
}

export function PricingSection() {
  const tiers = purchasableTiers();

  return (
    <section id="pricing" className="scroll-mt-24 bg-[#faf8f5] py-20 sm:py-28">
      <ScrollTracker event="scroll_to_pricing" />
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Цены"
          title="Простые тарифы. Всё включено."
          subtitle="Без подписки, кредитов и доплат. Платите один раз и получаете полный набор профессиональных портретов."
        />

        <ScrollReveal className="mt-14">
          {tiers.length === 0 ? (
            <LaunchCard />
          ) : (
            <div
              className={cn(
                "mx-auto grid gap-6",
                tiers.length === 1 && "max-w-md",
                tiers.length === 2 && "max-w-3xl sm:grid-cols-2",
                tiers.length >= 3 && "lg:grid-cols-3"
              )}
            >
              {tiers.map((tier) => (
                <TierCard key={tier.id} tier={tier} />
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Нужны портреты для всей команды?{" "}
            <Link href="#teams" className="font-medium text-[#9a7b4f] underline-offset-2 hover:underline">
              Тарифы для команд →
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
