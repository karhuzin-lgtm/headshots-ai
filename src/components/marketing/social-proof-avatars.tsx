import Image from "next/image";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const avatarSources = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-05.jpg",
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
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 text-center text-white">
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Join professionals already on the waitlist
          </h2>
          <p className="mt-4 text-lg font-light text-white/60">
            Be among the first to get AI headshots that actually look like you.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 grid max-w-xl gap-3" delay={0.05}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex justify-center">
              {avatarSources.slice(row * 4, row * 4 + 4).map((src, index) => (
                <div
                  key={src}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-white/10 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] ${
                    index === 0 ? "" : "-ml-4"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-8" delay={0.08}>
        <p className="font-display text-5xl font-extrabold tracking-[-0.05em]">
          <span className="text-[#c9a96e]">
            1,200+
          </span>
        </p>
        <p className="mt-2 text-sm font-light text-white/55">
          professionals waiting to upload 8-20 selfies and get early access
        </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
