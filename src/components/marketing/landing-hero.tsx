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
    <section className="relative min-h-dvh overflow-hidden bg-[#0a0a0a] pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,120,140,0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.08),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-5xl font-normal leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Looks like you.
            <br />
            <span className="text-white/55">Not like AI.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-md text-lg font-light leading-relaxed text-white/60 sm:text-xl"
          >
            Upload 8–20 selfies. Get studio-quality headshots in 15 minutes.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-xl"
          >
            <WaitlistForm variant="hero" showLabel={false} />
            <p className="mt-5 text-sm text-white/45">Join 1,200+ professionals waiting</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {heroPhotos.map((photo, index) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 + photo.delay }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40"
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
