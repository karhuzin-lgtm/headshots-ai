import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { cn } from "@/lib/utils";

type SectionIntroProps = {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  dark?: boolean;
};

export function SectionIntro({ label, title, subtitle, className, dark }: SectionIntroProps) {
  return (
    <ScrollReveal className={cn("mx-auto max-w-3xl text-center", className)}>
      {label && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em]",
            dark ? "text-[#c9a96e]" : "text-gray-500"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "mt-4 text-4xl font-normal tracking-tight sm:text-5xl",
          dark ? "text-white" : "text-[#111827]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed",
            dark ? "text-gray-400" : "text-gray-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
