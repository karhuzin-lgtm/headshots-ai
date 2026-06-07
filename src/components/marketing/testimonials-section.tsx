import Image from "next/image";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { TESTIMONIALS } from "@/lib/testimonials";

/** Renders nothing until real testimonials are provided (no fabricated reviews). */
export function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionIntro label="Отзывы" title="Что говорят клиенты" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <ScrollReveal key={`${t.name}-${index}`} delay={index * 0.05}>
              <figure className="flex h-full flex-col rounded-2xl border border-gray-100 bg-[#faf8f5] p-6 shadow-sm">
                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700">«{t.quote}»</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-white">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <span>
                    <span className="block text-sm font-semibold text-[#111827]">{t.name}</span>
                    <span className="block text-xs text-gray-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
