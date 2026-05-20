import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_STEPS } from "@/lib/landing-content";

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="How it works"
          title="Three steps to studio-quality portraits"
          subtitle="No photographer. No scheduling. Upload from your phone and get results by email."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {LANDING_STEPS.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 0.06} className="glass-card rounded-2xl p-8">
              <p className="font-display text-7xl font-normal leading-none text-[#f5f5f5] opacity-20">
                {step.n}
              </p>
              <h3 className="mt-6 text-xl font-medium tracking-tight text-[#f5f5f5]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#888]">{step.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
