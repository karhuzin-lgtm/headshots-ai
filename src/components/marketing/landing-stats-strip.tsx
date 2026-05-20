import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_STATS } from "@/lib/landing-content";

export function LandingStatsStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#080808] py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {LANDING_STATS.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              delay={index * 0.04}
              className="glass-card rounded-2xl px-4 py-6 text-center sm:px-6"
            >
              <p className="font-display text-3xl font-normal tracking-tight text-[#f5f5f5] sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#888]">
                {stat.label}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
