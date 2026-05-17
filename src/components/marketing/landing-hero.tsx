"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const heroPhotos = [
  { src: "/avatars/avatar-07.jpg", alt: "LinkedIn AI headshot", offset: "-translate-y-5", delay: "0s" },
  { src: "/avatars/avatar-05.jpg", alt: "Corporate AI headshot", offset: "translate-y-0", delay: "0.8s" },
  { src: "/avatars/avatar-10.jpg", alt: "Executive AI headshot", offset: "-translate-y-8", delay: "1.4s" },
];

const avatarSources = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-05.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-10.jpg",
];

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,hsl(36_30%_20%/0.18),transparent_52%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {avatarSources.map((src) => (
                <span key={src} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/70 bg-white/10">
                  <Image src={src} alt="" width={56} height={56} className="h-full w-full object-cover" />
                </span>
              ))}
            </div>
            <p className="text-sm font-light text-white/65">1,200+ professionals waiting</p>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.75, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3.6rem] font-extrabold leading-[0.9] tracking-[-0.065em] text-white sm:text-7xl lg:text-[6.5rem]"
            >
            <span className="text-[#f4ead6] drop-shadow-[0_0_32px_rgba(201,169,110,0.22)]">
              Professional headshots.
            </span>
            <br />
            <span>In 10 minutes.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl text-pretty text-xl font-light leading-relaxed text-white/68"
          >
            Join the waitlist, upload 8-20 selfies, and get colorful, studio-grade AI headshots across six professional styles.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-xl"
          >
            <WaitlistForm variant="dark" showLabel={false} />
            <p className="mt-5 text-sm text-white/50">
              Join waitlist → upload 8-20 photos → get your headshots free
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-4"
        >
          {heroPhotos.map((photo, index) => (
            <div key={photo.src} className={`animate-float ${photo.offset}`} style={{ animationDelay: photo.delay }}>
              <div className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.04] shadow-[0_40px_90px_-55px_rgba(0,0,0,0.95)]">
                <Image
                  src={photo.src}
                  width={720}
                  height={960}
                  alt={photo.alt}
                  className="aspect-[3/4] w-full object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 33vw, 260px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
