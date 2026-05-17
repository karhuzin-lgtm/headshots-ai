import Image from "next/image";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const avatarSources = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-creative.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-09.jpg",
  "/avatars/avatar-10.jpg",
  "/avatars/avatar-11.jpg",
  "/avatars/avatar-12.jpg",
  "/avatars/avatar-14.jpg",
  "/avatars/avatar-16.jpg",
  "/avatars/avatar-19.jpg",
];

export function SocialProofAvatars() {
  return (
    <section className="relative min-h-[200px] overflow-hidden bg-white py-16 text-center text-[#111827] sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
            Join professionals already on the waitlist
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-gray-500">
            Be among the first to get AI headshots that actually look like you.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 grid max-w-xl gap-3" delay={0.05}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex justify-center">
              {avatarSources.slice(row * 4, row * 4 + 4).map((src, index) => (
                <div
                  key={src}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md ${
                    index === 0 ? "" : "-ml-4"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-8" delay={0.08}>
        <p className="font-display text-4xl font-normal tracking-tight text-[#111827]">
          <span>
            1,200+
          </span>
        </p>
        <p className="mt-2 text-sm font-light text-gray-500">
          professionals on the waitlist
        </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
