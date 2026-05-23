import Image from "next/image";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="scroll-mt-24 bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Before → After</p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
            One selfie. Six professional looks.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
            The same casual photo — transformed into studio-quality headshots across every style.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-12 lg:mt-16" delay={0.05}>
          <div className="mx-auto max-w-6xl">
            {/* Mobile: before on top, styles below. Desktop: side by side */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              {/* Before — full photo, no crop */}
              <div className="mx-auto w-full max-w-[280px] shrink-0 lg:mx-0 lg:max-w-[320px] lg:pt-8">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 lg:text-left">
                  Before
                </p>
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-2 shadow-lg">
                  <Image
                    src={MY_BEFORE_PHOTO}
                    alt="Casual selfie before AI headshot"
                    width={600}
                    height={800}
                    className="h-auto w-full rounded-xl"
                    sizes="(max-width: 1024px) 280px, 320px"
                    priority
                  />
                </div>
                <p className="mt-3 text-center text-sm text-gray-500 lg:text-left">Your casual selfie</p>
              </div>

              {/* Connector — mobile */}
              <div className="flex flex-col items-center gap-2 lg:hidden">
                <div className="h-8 w-px bg-gray-300" />
                <span className="text-xs font-medium uppercase tracking-widest text-gray-400">becomes</span>
                <div className="h-8 w-px bg-gray-300" />
              </div>

              {/* Connector — desktop only */}
              <div className="hidden shrink-0 flex-col items-center justify-center pt-24 lg:flex">
                <div className="h-px w-8 bg-gray-300" />
                <span className="my-3 text-xs font-medium uppercase tracking-widest text-gray-400">becomes</span>
                <div className="h-px w-8 bg-gray-300" />
              </div>

              {/* After — all 6 styles at once */}
              <div className="min-w-0 flex-1">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-900 lg:text-left">
                  After — 6 styles
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {DISPLAY_STYLES.map((style) => (
                    <figure key={style.key} className="group">
                      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md transition-shadow group-hover:shadow-lg">
                        <Image
                          src={style.photo}
                          alt={`AI headshot — ${style.name} style`}
                          width={400}
                          height={533}
                          className="aspect-[3/4] w-full object-cover object-top"
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                        />
                      </div>
                      <figcaption className="mt-2.5 text-center text-sm font-medium text-gray-900 sm:text-left">
                        {style.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
