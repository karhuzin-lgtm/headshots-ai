import Image from "next/image";
import Link from "next/link";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";

export function StylesSection() {
  return (
    <section id="styles" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Styles"
          title="Six professional looks"
          subtitle="Pick the look that matches your next opportunity — hiring, sales, speaking, fundraising, or press."
        />

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {DISPLAY_STYLES.map((style, index) => (
            <ScrollReveal key={style.key} delay={index * 0.04}>
              <Link
                href="/#waitlist"
                className="glass-card glass-card-hover group block overflow-hidden rounded-2xl"
                aria-label={`${style.name} style — ${style.tagline}`}
              >
                <Image
                  src={style.photo}
                  alt={`${style.name} AI headshot — ${style.tagline}`}
                  width={720}
                  height={960}
                  className="aspect-[3/4] w-full object-cover object-top"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#f5f5f5]">{style.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[#888]">{style.tagline}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#888]/90">
                    {style.description}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center" delay={0.08}>
          <Link
            href="/#waitlist"
            className="inline-flex min-h-[44px] items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-2.5 text-sm font-semibold text-[#f5f5f5] transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Choose your look — join early access
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
