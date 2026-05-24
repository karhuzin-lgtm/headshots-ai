import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const stats = [
  {
    number: "~20 minutes",
    label: "From upload to results",
    sub: "Train and generate while you do other things",
  },
  {
    number: "6",
    label: "Professional styles",
    sub: "LinkedIn · Corporate · Executive · Tech · Creative · Startup",
  },
  {
    number: "30 days",
    label: "Then deleted forever",
    sub: "Your photos and model are never stored permanently",
  },
];

export function StatsSection() {
  return (
    <section className="bg-[#faf8f5] py-12 sm:py-16">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-5 sm:grid-cols-3 sm:px-6 lg:px-8">
        {stats.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            delay={index * 0.04}
            className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm sm:text-left"
          >
            <p className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{stat.number}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{stat.label}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.sub}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
