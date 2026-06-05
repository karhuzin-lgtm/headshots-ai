import { BeforeAfterSection } from "@/components/marketing/before-after-section";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { CtaButton } from "@/components/marketing/cta-button";
import { FaqSection } from "@/components/marketing/faq-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { StylesSection } from "@/components/marketing/styles-section";
import { TeamSection } from "@/components/marketing/team-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { LAUNCH_OFFER, PRIMARY_CTA } from "@/lib/landing-config";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-[#111827]">
      <LandingHeader />

      <main>
        <LandingHero />
        <BeforeAfterSection />
        <HowItWorksSection />
        <StylesSection />
        <TrustSection />
        <ComparisonSection />
        <PricingSection />
        <TeamSection />

        <section
          id="get-started"
          className="scroll-mt-24 bg-[#111827] px-5 py-20 text-center sm:px-6 sm:py-28"
        >
          <ScrollReveal className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a96e]">Get started</p>
            <h2 className="mt-4 font-display text-4xl font-normal tracking-tight text-white sm:text-5xl">
              Your next headshot is ~20 minutes away.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg font-light leading-relaxed text-gray-400">
              Upload a few selfies and get {LAUNCH_OFFER.headshots} professional headshots across{" "}
              {LAUNCH_OFFER.styleCount} styles — for a one-time {LAUNCH_OFFER.price}.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton
                href={PRIMARY_CTA.href}
                event="checkout_start"
                eventProps={{ location: "final" }}
                variant="onDark"
                className="px-8 text-base"
              >
                {PRIMARY_CTA.label}
              </CtaButton>
              <CtaButton
                href="#teams"
                event="team_cta_click"
                eventProps={{ location: "final" }}
                variant="onDarkGhost"
                className="px-8 text-base"
              >
                Headshots for a team
              </CtaButton>
            </div>
          </ScrollReveal>
        </section>

        <FaqSection />
      </main>

      <LandingFooter />
    </div>
  );
}
