"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type ComparisonFeature = {
  name: string;
  ai: string;
  traditional: string;
};

type FeatureComparisonTableProps = {
  title?: string;
  subtitle?: string;
  features: ComparisonFeature[];
  aiLabel?: string;
  traditionalLabel?: string;
  className?: string;
};

export function FeatureComparisonTable({
  title = "AI headshots vs. traditional photography",
  subtitle = "Studio-quality portraits without the studio price or wait.",
  features,
  aiLabel = "AI headshots",
  traditionalLabel = "Traditional photographer",
  className,
}: FeatureComparisonTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.08] px-6 py-8 text-center sm:px-8">
          <h3 className="font-display text-2xl font-normal tracking-tight text-[#f5f5f5] sm:text-3xl">
            {title}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#888] sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="hidden border-b border-white/[0.08] bg-white/[0.02] md:grid md:grid-cols-3 md:gap-4 md:px-6 md:py-5">
          <span className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">
            Feature
          </span>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-[#f5f5f5]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f5f5]">
              {aiLabel}
            </span>
          </div>
          <span className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">
            {traditionalLabel}
          </span>
        </div>

        <div className="divide-y divide-white/[0.08]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              className={cn(
                "transition-colors duration-200",
                hoveredRow === index && "bg-white/[0.03]"
              )}
            >
              <div className="grid gap-4 p-5 md:grid-cols-3 md:items-center md:px-6 md:py-5">
                <p className="text-sm font-medium text-[#f5f5f5]">{feature.name}</p>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                  <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-[#f5f5f5]">
                    <Check className="h-4 w-4 shrink-0" />
                    {feature.ai}
                  </p>
                </div>
                <p className="text-center text-sm text-[#888] md:text-left">{feature.traditional}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-white/[0.08] px-6 py-6 text-center">
          <Link
            href="/#waitlist"
            className="inline-flex min-h-[44px] items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#f5f5f5]"
          >
            Join early access
          </Link>
        </div>
      </div>
    </div>
  );
}
