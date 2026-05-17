export type PlanId = "basic" | "pro" | "executive";

export const ALL_STYLE_KEYS = [
  "linkedin",
  "corporate",
  "casual",
  "professional",
  "creative",
] as const;

export type StyleKey = (typeof ALL_STYLE_KEYS)[number];

export const PLAN_ORDER: PlanId[] = ["basic", "pro", "executive"];

export const PLANS: Record<
  PlanId,
  { priceEur: number; totalOutputs: number; styleCount: number; label: string }
> = {
  basic: { priceEur: 29, totalOutputs: 40, styleCount: 2, label: "Basic" },
  pro: { priceEur: 59, totalOutputs: 80, styleCount: 5, label: "Pro" },
  executive: { priceEur: 99, totalOutputs: 120, styleCount: 5, label: "Executive" },
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
  if (plan === "basic") {
    if (selected.length !== 2) return "Basic requires exactly 2 styles.";
    return null;
  }
  if (plan === "pro" || plan === "executive") {
    if (selected.length !== ALL_STYLE_KEYS.length) {
      return "Pro and Executive use all five styles.";
    }
    for (const k of ALL_STYLE_KEYS) {
      if (!set.has(k)) return "Pro and Executive require every style: linkedin, corporate, casual, professional, creative.";
    }
    return null;
  }
  return null;
}

export function stripeAmountCents(plan: PlanId): number {
  return PLANS[plan].priceEur * 100;
}
