"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const heroPhotos = [
  { src: "/avatars/avatar-07.jpg", alt: "LinkedIn AI headshot example", offset: "md:-translate-y-5", delay: "0s" },
  { src: "/avatars/avatar-19.jpg", alt: "Corporate AI headshot example", offset: "md:translate-y-0", delay: "0.8s" },
  { src: "/avatars/avatar-10.jpg", alt: "Executive AI headshot example", offset: "md:-translate-y-8", delay: "1.4s" },
];

const avatarSources = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-creative.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-10.jpg",
];

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-white text-[#111827]">
      <div className="pointer-events-none absolute right-0 top-0 -z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(243,244,246,0.8),transparent_65%)] blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {avatarSources.map((src, index) => (
                <span
                  key={src}
                  className={`relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm ${
                    index > 3 ? "hidden sm:inline-flex" : "inline-flex"
                  }`}
                >
                  <Image src={src} alt="" width={56} height={56} className="h-full w-full object-cover" sizes="40px" />
                </span>
              ))}
            </div>
            <p className="text-sm font-light text-gray-500">1,200+ professionals joined early access</p>
          </motion.div>

          <h1 className="max-w-3xl text-5xl font-normal leading-[0.92] tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
            Looks like you.
            <br />
            Not like AI.
          </h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-md text-pretty text-lg font-light leading-relaxed text-gray-600 sm:text-xl"
          >
            We train a private AI model on your face — not a generic filter. The result: headshots colleagues won&apos;t question. No studio, no scheduling.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-xl"
          >
            <WaitlistForm showLabel={false} />
            <p className="mt-5 text-sm text-gray-500">
              Join waitlist → skip the queue → 40% off at launch · ready in 15 min
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
        >
          {heroPhotos.map((photo, index) => (
            <div key={photo.src} className={`motion-safe:animate-float ${photo.offset}`} style={{ animationDelay: photo.delay }}>
              <div className="max-h-[280px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/10 sm:max-h-none">
                <Image
                  src={photo.src}
                  width={720}
                  height={960}
                  alt={photo.alt}
                  className="aspect-[3/4] w-full object-cover object-top"
                  priority={index === 0}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
