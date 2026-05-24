import { PRODUCT_STYLE_KEYS, type ProductStyleKey } from "@/lib/display-styles";

export type PlanId = "basic" | "pro" | "executive";

export const ALL_STYLE_KEYS = PRODUCT_STYLE_KEYS;

export type StyleKey = ProductStyleKey;

export const PLAN_ORDER: PlanId[] = ["basic", "pro", "executive"];

export const PLANS: Record<
  PlanId,
  { priceEur: number; totalOutputs: number; styleCount: number; label: string }
> = {
  basic: { priceEur: 29, totalOutputs: 20, styleCount: 2, label: "Basic" },
  pro: { priceEur: 59, totalOutputs: 40, styleCount: 4, label: "Pro" },
  executive: { priceEur: 99, totalOutputs: 60, styleCount: 6, label: "Executive" },
};

export function isPlanId(v: string | null | undefined): v is PlanId {
  return v === "basic" || v === "pro" || v === "executive";
}

/** Distribute total outputs across the selected styles evenly (+ remainder to first slots). */
export function buildGenerationManifest(
  inputCount: number,
  styles: string[],
  totalOutputs: number
): Array<{ style: string; sourceIndex: number }> {
  if (inputCount < 1 || styles.length < 1 || totalOutputs < 1) return [];
  const base = Math.floor(totalOutputs / styles.length);
  let rem = totalOutputs - base * styles.length;
  const out: Array<{ style: string; sourceIndex: number }> = [];
  let idx = 0;
  for (const style of styles) {
    const n = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem -= 1;
    for (let k = 0; k < n; k++) {
      out.push({ style, sourceIndex: idx % inputCount });
      idx++;
    }
  }
  return out;
}

export function validateStyleSelection(plan: PlanId, selected: string[]): string | null {
  const set = new Set(selected);
  if (selected.length !== set.size) return "Duplicate styles are not allowed.";
  for (const s of selected) {
    if (!ALL_STYLE_KEYS.includes(s as StyleKey)) return `Unknown style: ${s}`;
  }
  const required = PLANS[plan].styleCount;
  if (selected.length !== required) {
    return `${PLANS[plan].label} requires exactly ${required} style${required === 1 ? "" : "s"}.`;
  }
  return null;
}

/** @deprecated Temporary Stripe helper — replace with provider checkout IDs. See docs/billing.md */
export function stripeAmountCents(plan: PlanId): number {
  return PLANS[plan].priceEur * 100;
}

export function stylesForPlan(plan: PlanId): string[] {
  return ALL_STYLE_KEYS.slice(0, PLANS[plan].styleCount);
}
