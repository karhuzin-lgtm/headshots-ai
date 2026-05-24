import { Check } from "lucide-react";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const teamPackages = [
  {
    label: "Starter",
    price: "€149",
    people: "Up to 5 people",
    features: [
      "18 headshots per person",
      "6 professional styles each",
      "~20 min per team member",
      "Invoice to company",
      "48h delivery",
    ],
  },
  {
    label: "Team",
    price: "€249",
    people: "Up to 10 people",
    features: [
      "18 headshots per person",
      "6 professional styles each",
      "~20 min per team member",
      "Invoice to company",
      "Priority 24h delivery",
    ],
  },
  {
    label: "Company",
    price: "€399",
    people: "Up to 20 people",
    features: [
      "18 headshots per person",
      "6 professional styles each",
      "Dedicated account manager",
      "Invoice to company",
      "Same-day delivery",
    ],
  },
];

export function TeamSection() {
  return (
    <section id="teams" className="scroll-mt-24 bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="For teams"
          title="One consistent look for your whole team"
          subtitle="Remote team? No problem. Everyone uploads their own photos, you get a uniform professional style across all profiles."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {teamPackages.map((pkg, index) => (
            <ScrollReveal key={pkg.label} delay={index * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{pkg.label}</p>
                <p className="mt-3 text-3xl font-normal tracking-tight text-[#111827]">{pkg.price}</p>
                <p className="mt-1 text-sm text-gray-500">{pkg.people}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-light text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#111827]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/34627367635?text=Team%20headshots%20package"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 block w-full rounded-xl bg-[#111827] py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Get a quote →
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          Invoice to your company. Pay via bank transfer. No credit card needed.
        </p>
      </div>
    </section>
  );
}
