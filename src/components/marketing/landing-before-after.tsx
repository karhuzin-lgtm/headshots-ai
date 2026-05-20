import Image from "next/image";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_BEFORE_AFTER } from "@/lib/landing-content";

function PillLabel({ children }: { children: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-full border border-white/[0.08] bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#f5f5f5] backdrop-blur-sm">
      {children}
    </span>
  );
}

export function LandingBeforeAfter() {
  return (
    <section id="results" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Results"
          title="Real transformations"
          subtitle="Everyday selfies become studio-quality headshots — same person, professional polish."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {LANDING_BEFORE_AFTER.map((pair, index) => (
            <ScrollReveal key={pair.before} delay={index * 0.06}>
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-[#888]">
                  {pair.label}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                    <Image
                      src={`${pair.before}?v=20260517-3`}
                      alt={`${pair.label} — before selfie`}
                      width={320}
                      height={400}
                      className="aspect-[4/5] w-full object-cover"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 45vw, 200px"
                    />
                    <PillLabel>Before</PillLabel>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                    <Image
                      src={`${pair.after}?v=20260517-3`}
                      alt={`${pair.label} — AI headshot`}
                      width={320}
                      height={400}
                      className="aspect-[4/5] w-full object-cover"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 45vw, 200px"
                    />
                    <PillLabel>After — AI</PillLabel>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
