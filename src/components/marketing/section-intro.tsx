import { ScrollReveal } from "@/components/marketing/scroll-reveal";

type SectionIntroProps = {
  label?: string;
  title: string;
  subtitle?: string;
};

export function SectionIntro({ label, title, subtitle }: SectionIntroProps) {
  return (
    <ScrollReveal className="mx-auto max-w-3xl text-center">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">{label}</p>
      )}
      <h2 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-[#888]">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
