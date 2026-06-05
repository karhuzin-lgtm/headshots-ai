"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "onDark" | "onDarkGhost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#111827] text-white hover:bg-black",
  secondary: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
  onDark: "bg-white text-[#111827] hover:bg-gray-100",
  onDarkGhost: "border border-white/20 text-white hover:bg-white/10",
};

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  event: AnalyticsEvent;
  eventProps?: AnalyticsProps;
  variant?: Variant;
  className?: string;
  fullWidth?: boolean;
};

export function CtaButton({
  href,
  children,
  event,
  eventProps,
  variant = "primary",
  className,
  fullWidth = false,
}: CtaButtonProps) {
  const isExternal = /^https?:\/\/|^mailto:/.test(href);
  const base = cn(
    "inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-sm font-semibold transition",
    VARIANTS[variant],
    fullWidth && "w-full",
    className
  );

  const onClick = () => track(event, eventProps);

  if (isExternal) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className={base}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={base}>
      {children}
    </Link>
  );
}
