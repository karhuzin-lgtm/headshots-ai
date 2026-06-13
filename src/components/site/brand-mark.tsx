import { cn } from "@/lib/utils";

export function BrandMark({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-block leading-[0.75]", light ? "text-white" : "text-[#10100f]", className)}>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.3em]">Portrait</span>
      <span className="block font-display text-[25px] font-extrabold tracking-[-0.09em]">headshots</span>
      <span className="ml-[49px] block text-[8px] font-medium uppercase tracking-[0.38em] opacity-70">studio</span>
    </span>
  );
}
