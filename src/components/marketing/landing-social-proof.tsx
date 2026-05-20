import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const COMPANIES = ["Google", "Stripe", "Apple", "Meta", "Amazon"] as const;

export function LandingSocialProof() {
  return (
    <section className="border-y border-white/[0.06] bg-[#080808] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-sm font-medium text-[#888]">
            Professionals from top companies are already on the waitlist
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {COMPANIES.map((name) => (
              <span
                key={name}
                className="font-display text-xl font-normal tracking-tight text-white/25 sm:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
