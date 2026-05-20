"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const heroPhotos = [
  { src: "/avatars/avatar-07.jpg", alt: "LinkedIn AI headshot", delay: 0 },
  { src: "/avatars/avatar-corporate.jpg", alt: "Corporate AI headshot", delay: 0.15 },
  { src: "/avatars/avatar-executive.jpg", alt: "Executive AI headshot", delay: 0.3 },
];

export function LandingHero() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#080808] pt-16 text-[#f5f5f5]">
      <div className="pointer-events-none absolute inset-0 glow-amber-top" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl font-display text-5xl font-normal leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Looks like you.
            <br />
            <span className="text-[#888]">Not like AI.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-md text-lg font-light leading-relaxed text-[#888] sm:text-xl"
          >
            Upload 8–20 selfies. Get studio-quality headshots in 15 minutes.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-xl"
          >
            <WaitlistForm variant="hero" showLabel={false} />
            <p className="mt-5 text-sm text-[#888]">Join 1,200+ professionals waiting</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="animate-float-hero grid grid-cols-3 gap-3 sm:gap-4"
        >
          {heroPhotos.map((photo, index) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 + photo.delay }}
              className="glass-card overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
            >
              <Image
                src={photo.src}
                width={400}
                height={500}
                alt={photo.alt}
                className="aspect-[4/5] w-full object-cover object-top"
                priority={index === 0}
                sizes="(max-width: 1024px) 33vw, 220px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
