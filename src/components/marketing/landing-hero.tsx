"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { WaitlistForm } from "@/components/WaitlistForm";
import { TiltCard } from "@/components/marketing/tilt-card";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const heroPhotos = [
  { src: "/man-after.jpg?v=20260517-2", alt: "LinkedIn AI headshot", offset: "-translate-y-5", delay: "0s" },
  { src: "/exec-after.jpg", alt: "Corporate AI headshot", offset: "translate-y-0", delay: "0.8s" },
  { src: "/woman2-after.jpg", alt: "Executive AI headshot", offset: "-translate-y-9", delay: "1.4s" },
];

const avatarSources = [
  "/man-after.jpg?v=20260517-2",
  "/exec-after.jpg",
  "/woman2-after.jpg",
  "/images/corporate.jpg",
  "/images/creative.jpg",
  "/images/fal-1778531810-1.jpg",
];

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_50%_18%,#20205a_0%,#0f0f2e_42%,#0a0a1a_100%)] text-white">
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-indigo-500/35 blur-3xl" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-teal-400/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-400/25 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />

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
            className="text-[3.6rem] font-extrabold leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-[6.5rem]"
            >
            <span className="animate-gradient bg-gradient-to-r from-amber-200 via-fuchsia-300 to-teal-200 bg-clip-text text-transparent">
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
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-4 [perspective:1400px]"
        >
          {heroPhotos.map((photo, index) => (
            <div key={photo.src} className={`animate-float ${photo.offset}`} style={{ animationDelay: photo.delay }}>
              <TiltCard
                glowColor={index === 0 ? "#f59e0baa" : index === 1 ? "#14b8a6aa" : "#a855f7aa"}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_110px_-54px_rgba(0,0,0,0.95)]"
              >
                <Image
                  src={photo.src}
                  width={720}
                  height={960}
                  alt={photo.alt}
                  className="aspect-[3/4] w-full object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 33vw, 260px"
                />
              </TiltCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
