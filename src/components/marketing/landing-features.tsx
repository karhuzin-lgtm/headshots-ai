import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_FEATURES } from "@/lib/landing-content";

export function LandingFeatures() {
  return (
    <section className="bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Why Headshots"
          title="Built for professionals who care how they look online"
          subtitle="Your photo is often the first trust signal. Make it intentional, polished, and unmistakably you."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {LANDING_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal
                key={feature.title}
                delay={index * 0.04}
                className="glass-card glass-card-hover flex gap-5 rounded-2xl p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#f5f5f5]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-[#f5f5f5]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#888]">{feature.body}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
