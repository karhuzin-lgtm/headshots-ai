import Image from "next/image";

import { CtaButton } from "@/components/marketing/cta-button";
import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { PRIMARY_CTA } from "@/lib/landing-config";

export function StylesSection() {
  return (
    <section id="styles" className="scroll-mt-24 bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="6 стилей"
          title="Одна загрузка. Шесть профессиональных образов."
          subtitle="Каждый стиль настроен под свой контекст — найм, продажи, выступления, пресса или соцсети."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {DISPLAY_STYLES.map((style, index) => (
            <ScrollReveal key={style.key} delay={index * 0.04}>
              <article className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative overflow-hidden">
                  <Image
                    src={style.photo}
                    alt={`${style.name} — стиль AI-хедшота`}
                    width={480}
                    height={640}
                    className="aspect-[3/4] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 45vw, 320px"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-gray-900">{style.name}</h3>
                  <p className="mt-1 text-sm text-[#9a7b4f]">{style.tagline}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="mt-12 text-center">
          <CtaButton
            href={PRIMARY_CTA.href}
            event="purchase_cta_click"
            eventProps={{ location: "styles" }}
            className="px-8"
          >
            {PRIMARY_CTA.label} →
          </CtaButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
