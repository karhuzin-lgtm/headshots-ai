import Link from "next/link";
import { Check } from "lucide-react";

import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_CTA_BULLETS } from "@/lib/landing-content";

export function LandingCta() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 glow-amber-center" />
      <div className="relative mx-auto max-w-3xl">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">
            Early access
          </p>
          <h2 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
            Your professional headshot is one upload away
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-[#888]">
            Join the waitlist now. We&apos;ll email you when your spot opens and lock in your
            founding member discount.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 max-w-lg" delay={0.08}>
          <WaitlistForm variant="hero" showLabel={false} />
        </ScrollReveal>

        <ScrollReveal className="mt-10" delay={0.12}>
          <ul className="mx-auto grid max-w-md gap-3">
            {LANDING_CTA_BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[#888]"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f5f5f5]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal className="mt-8 text-center" delay={0.16}>
          <Link
            href="/try/generate"
            className="text-sm text-[#888] underline underline-offset-4 transition hover:text-[#f5f5f5]"
          >
            Already have access? Try the beta upload →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
