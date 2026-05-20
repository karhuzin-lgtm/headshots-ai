import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";

export function StylesSection() {
  return (
    <section id="styles" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">Styles</p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
            Six professional looks
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-[#888]">
            Pick the look that matches your next opportunity — hiring, sales, speaking, or press.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {DISPLAY_STYLES.map((style, index) => (
            <ScrollReveal key={style.key} delay={index * 0.04}>
              <Link
                href="/#waitlist"
                className="glass-card glass-card-hover group block overflow-hidden rounded-2xl"
                aria-label={`${style.name} style`}
              >
                <Image
                  src={style.photo}
                  alt={`${style.name} AI headshot example`}
                  width={720}
                  height={960}
                  className="aspect-[3/4] w-full object-cover object-top"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#f5f5f5]">{style.name}</h3>
                  <p className="mt-1 text-xs text-[#888]">{style.tagline}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
