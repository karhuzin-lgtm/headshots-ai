import { FeatureComparisonTable } from "@/components/marketing/feature-comparison-table";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_COMPARISON } from "@/lib/landing-content";

export function LandingComparison() {
  return (
    <section className="bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <FeatureComparisonTable features={LANDING_COMPARISON} />
        </ScrollReveal>
      </div>
    </section>
  );
}
