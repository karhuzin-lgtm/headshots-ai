import Image from "next/image";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

export function BeforeAfterSection() {
  return (
    <section id="results" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Real results"
          title="Same selfie. Six professional looks."
          subtitle="No stock photos — these are actual outputs from one casual upload."
        />

        <ScrollReveal className="mt-14" delay={0.05}>
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              <div className="mx-auto w-full max-w-[280px] shrink-0 lg:mx-0 lg:max-w-[300px]">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 lg:text-left">
                  Before
                </p>
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-[#faf8f5] p-2 shadow-md">
                  <Image
                    src={MY_BEFORE_PHOTO}
                    alt="Casual selfie before AI headshot"
                    width={600}
                    height={800}
                    className="h-auto w-full rounded-xl"
                    sizes="(max-width: 1024px) 280px, 300px"
                    priority
                  />
                </div>
                <p className="mt-3 text-center text-sm text-gray-500 lg:text-left">Your casual selfie</p>
              </div>

              <div className="flex flex-col items-center gap-2 lg:hidden">
                <div className="h-6 w-px bg-gray-300" />
                <span className="text-xs font-medium uppercase tracking-widest text-[#9a7b4f]">becomes</span>
                <div className="h-6 w-px bg-gray-300" />
              </div>

              <div className="hidden shrink-0 flex-col items-center justify-center pt-20 lg:flex">
                <div className="h-px w-10 bg-gray-200" />
                <span className="my-3 text-xs font-medium uppercase tracking-widest text-[#9a7b4f]">becomes</span>
                <div className="h-px w-10 bg-gray-200" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-900 lg:text-left">
                  After
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {DISPLAY_STYLES.map((style) => (
                    <figure key={style.key}>
                      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <Image
                          src={style.photo}
                          alt={`AI headshot — ${style.name}`}
                          width={400}
                          height={533}
                          className="aspect-[3/4] w-full object-cover object-top"
                          sizes="(max-width: 640px) 45vw, 200px"
                        />
                      </div>
                      <figcaption className="mt-2 text-center text-sm font-medium text-gray-900 sm:text-left">
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
