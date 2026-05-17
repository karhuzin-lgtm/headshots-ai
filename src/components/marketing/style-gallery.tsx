"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { TiltCard } from "@/components/marketing/tilt-card";

const styles = [
  {
    id: "linkedin",
    title: "LinkedIn",
    tagline: "Gets you recruiter callbacks",
    src: "/man-after.jpg?v=20260517-2",
    accent: "#0077b5",
  },
  {
    id: "corporate",
    title: "Corporate",
    tagline: "Board-room ready",
    src: "/exec-after.jpg",
    accent: "#1a1a2e",
  },
  {
    id: "executive",
    title: "Executive",
    tagline: "Commands authority",
    src: "/woman2-after.jpg",
    accent: "#7c3aed",
  },
  {
    id: "tech",
    title: "Tech",
    tagline: "Built for builders",
    src: "/images/corporate.jpg",
    accent: "#0d9488",
  },
  {
    id: "creative",
    title: "Creative",
    tagline: "Stands out in the feed",
    src: "/images/creative.jpg",
    accent: "#f59e0b",
  },
  {
    id: "startup",
    title: "Startup",
    tagline: "Founder energy",
    src: "/images/fal-1778531810-1.jpg",
    accent: "#ec4899",
  },
];

export function StyleGallery() {
  return (
    <section id="styles" className="relative overflow-hidden bg-[#0a0a1a] py-24 text-white">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-5xl font-extrabold tracking-[-0.05em] sm:text-6xl">
            Pick your style.
          </h2>
          <p className="mt-5 text-lg font-light text-white/65">
            6 styles. One perfect headshot.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-3">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/try?style=${style.id}`} aria-label={`Try ${style.title} style`}>
                <TiltCard
                  glowColor={`${style.accent}99`}
                  className="group glass-card relative aspect-[3/4] overflow-hidden rounded-3xl"
                >
                  <Image
                    src={style.src}
                    alt={`${style.title} AI headshot style`}
                    width={720}
                    height={960}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 opacity-70 mix-blend-screen"
                    style={{
                      background: `linear-gradient(145deg, transparent 35%, ${style.accent}55 100%)`,
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                    <p
                      className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: `${style.accent}cc` }}
                    >
                      {style.tagline}
                    </p>
                    <h3 className="text-3xl font-extrabold tracking-[-0.04em]">{style.title}</h3>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/try"
            className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0a0a1a] shadow-[0_0_45px_-18px_rgba(245,158,11,0.9)] transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Start free →
          </Link>
        </div>
      </div>
    </section>
  );
}
