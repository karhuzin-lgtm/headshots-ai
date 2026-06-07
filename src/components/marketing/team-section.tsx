import { Check } from "lucide-react";

import { CtaButton } from "@/components/marketing/cta-button";
import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { TEAM_CTA } from "@/lib/landing-config";

const benefits = [
  "Единый профессиональный образ во всех профилях",
  "Каждый загружает свои селфи — полностью удалённо",
  "Выбор из всех 6 профессиональных стилей",
  "Цена за объём — чем больше человек, тем ниже цена за каждого",
  "Один счёт на компанию, оплата картой или по реквизитам",
];

export function TeamSection() {
  return (
    <section id="teams" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Для команд"
          title="Единый образ для всей команды"
          subtitle="Удалённо или в офисе — каждый загружает свои фото и получает согласованные профессиональные портреты. Напишите количество человек, и мы пришлём расчёт."
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
                Напишите размер команды и предпочтительные стили. Ответим с ценой и сроками — обычно в течение
                одного рабочего дня.
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
