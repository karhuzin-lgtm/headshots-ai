import { GalleryMasonry } from "@/components/marketing/gallery-masonry";
import { LandingBeforeAfter } from "@/components/marketing/landing-before-after";
import { LandingComparison } from "@/components/marketing/landing-comparison";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingHowItWorks } from "@/components/marketing/landing-how-it-works";
import { LandingNav } from "@/components/marketing/landing-nav";
import { LandingSocialProof } from "@/components/marketing/landing-social-proof";
import { LandingStatsStrip } from "@/components/marketing/landing-stats-strip";
import { PremiumFaq } from "@/components/marketing/premium-faq";
import { StylesSection } from "@/components/marketing/styles-section";
import { LANDING_FAQ } from "@/lib/landing-content";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#080808] text-[#f5f5f5]">
      <LandingNav />

      <main>
        <LandingHero />
        <LandingStatsStrip />
        <LandingBeforeAfter />
        <LandingSocialProof />
        <LandingHowItWorks />
        <StylesSection />
        <GalleryMasonry />
        <LandingComparison />
        <LandingFeatures />
        <PremiumFaq items={LANDING_FAQ} />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
