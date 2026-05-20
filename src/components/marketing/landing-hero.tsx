"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";

const heroPhotos = [
  {
    src: "/avatars/avatar-07.jpg",
    alt: "LinkedIn AI headshot",
    className:
      "left-[4%] top-[18%] w-[28%] max-w-[140px] sm:left-[8%] sm:max-w-[160px] lg:left-[12%] lg:max-w-[180px]",
    delay: "0s",
  },
  {
    src: "/avatars/avatar-corporate.jpg",
    alt: "Corporate AI headshot",
    className:
      "right-[4%] top-[22%] w-[32%] max-w-[155px] sm:right-[8%] sm:max-w-[175px] lg:right-[10%] lg:max-w-[200px]",
    delay: "1.5s",
  },
  {
    src: "/avatars/avatar-executive.jpg",
    alt: "Executive AI headshot",
    className:
      "bottom-[14%] left-1/2 w-[30%] max-w-[150px] -translate-x-1/2 sm:bottom-[18%] sm:max-w-[170px]",
    delay: "3s",
  },
];

export function LandingHero() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#080808] pt-16 text-[#f5f5f5]">
      <div className="pointer-events-none absolute inset-0 glow-amber-top" />

      {heroPhotos.map((photo) => (
        <div
          key={photo.src}
          className={`pointer-events-none absolute hidden sm:block ${photo.className}`}
          style={{ animationDelay: photo.delay }}
        >
          <div className="animate-float-hero overflow-hidden rounded-2xl glass-card shadow-2xl shadow-black/50">
            <Image
              src={photo.src}
              width={400}
              height={500}
              alt={photo.alt}
              className="aspect-[4/5] w-full object-cover object-top"
              priority
              sizes="200px"
            />
          </div>
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-normal leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Looks like you.
          <br />
          Not like AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-md text-base font-light leading-relaxed text-[#888] sm:text-lg"
        >
          Upload 8–20 selfies. Get studio-quality headshots in 15 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 w-full max-w-lg"
        >
          <WaitlistForm variant="hero" showLabel={false} />
          <p className="mt-5 text-sm text-[#888]">Join 1,200+ professionals waiting</p>
        </motion.div>

        <div className="mt-12 grid w-full max-w-sm grid-cols-3 gap-2 sm:hidden">
          {heroPhotos.map((photo) => (
            <div
              key={photo.src}
              className="animate-float-hero overflow-hidden rounded-xl glass-card"
              style={{ animationDelay: photo.delay }}
            >
              <Image
                src={photo.src}
                width={120}
                height={150}
                alt={photo.alt}
                className="aspect-[4/5] w-full object-cover object-top"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
