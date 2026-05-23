import Image from "next/image";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { MY_STYLE_PHOTOS } from "@/lib/my-photos";

export function SocialProofAvatars() {
  return (
    <section className="relative min-h-[200px] overflow-hidden bg-white py-16 text-center text-[#111827] sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
            One face. Six professional looks.
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-gray-500">
            Every style below is generated from the same casual selfies.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-3" delay={0.05}>
          {MY_STYLE_PHOTOS.map((src) => (
            <div
              key={src}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md sm:h-24 sm:w-24"
            >
              <Image
                src={src}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover object-top"
                loading="lazy"
                sizes="96px"
              />
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
