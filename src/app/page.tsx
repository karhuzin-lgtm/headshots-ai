import { WaitlistForm } from "@/components/WaitlistForm";
import { BeforeAfterSection } from "@/components/marketing/before-after-section";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { GalleryMasonry } from "@/components/marketing/gallery-masonry";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { StatsSection } from "@/components/marketing/stats-section";
import { StylesSection } from "@/components/marketing/styles-section";
import { TeamSection } from "@/components/marketing/team-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-[#111827]">
      <LandingHeader />

      <main>
        <LandingHero />
        <BeforeAfterSection />
        <HowItWorksSection />
        <StylesSection />
        <GalleryMasonry />
        <TestimonialsSection />
        <StatsSection />
        <ComparisonSection />
        <PricingSection />
        <TeamSection />

        <section
          id="waitlist"
          className="scroll-mt-24 bg-[#111827] px-5 py-20 text-center sm:px-6 sm:py-28"
        >
          <ScrollReveal className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a96e]">Early access</p>
            <h2 className="mt-4 font-display text-4xl font-normal tracking-tight text-white sm:text-5xl">
              Be ready before the next opportunity.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg font-light leading-relaxed text-gray-400">
              Join the waitlist for priority access. Founding members lock in €29 at launch.
            </p>
            <WaitlistForm
              variant="dark"
              showLabel={false}
              className="mx-auto mt-10 max-w-[480px] text-left"
              submitLabel="Claim founding discount"
            />
          </ScrollReveal>
        </section>

        <FaqSection />
      </main>

      <LandingFooter />
    </div>
  );
}
