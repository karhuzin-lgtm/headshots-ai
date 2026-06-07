"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Lock, Sparkles } from "lucide-react";

import { CtaButton } from "@/components/marketing/cta-button";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { HERO_CTA } from "@/lib/landing-config";

const ease = [0.16, 1, 0.3, 1] as const;

const trustPoints = [
  { icon: Clock, label: "Готово за ~20 минут" },
  { icon: Sparkles, label: "6 профессиональных стилей" },
  { icon: Lock, label: "Удаляем в течение 30 дней" },
];

export function LandingHero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease },
        };

  return (
    <section className="relative overflow-hidden bg-[#faf8f5]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.12),transparent_70%)]" />
        <div className="absolute -right-32 top-20 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(17,24,39,0.04),transparent_70%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.div
            {...fade(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-white/80 px-3.5 py-1.5 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
            <span className="text-xs font-medium text-gray-700">
              Студийное качество — прямо с телефона
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.05)}
            className="max-w-[15ch] text-[2.65rem] font-normal leading-[1.02] tracking-tight text-[#111827] sm:text-6xl lg:text-[3.75rem]"
          >
            Профессиональные портреты без фотографа.
          </motion.h1>

          <motion.p {...fade(0.1)} className="mt-6 max-w-lg text-lg font-light leading-relaxed text-gray-600">
            Загрузите несколько селфи с телефона — и получите готовый набор профессиональных портретов в 6 стилях
            примерно за 20 минут. Без студии, без записи, без неловкой фотосессии.
          </motion.p>

          <motion.ul {...fade(0.14)} className="mt-8 flex flex-wrap gap-4">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 ring-1 ring-gray-200/80">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(0.18)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaButton
              href={HERO_CTA.href}
              event="hero_cta_click"
              eventProps={{ location: "hero" }}
              className="px-8 text-base"
            >
              {HERO_CTA.label}
            </CtaButton>
            <CtaButton
              href="#pricing"
              event="hero_cta_click"
              eventProps={{ location: "hero_pricing" }}
              variant="secondary"
              className="px-8 text-base"
            >
              Смотреть цены
            </CtaButton>
          </motion.div>

          <motion.p {...fade(0.22)} className="mt-4 text-xs text-gray-500">
            Для LinkedIn, сайта, профилей основателя и команды, прессы и выступлений.
          </motion.p>
        </div>

        <motion.div {...fade(0.12)} className="lg:justify-self-end">
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  );
}
