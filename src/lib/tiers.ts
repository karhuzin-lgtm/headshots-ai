import type { ProductStyleKey } from "@/lib/display-styles";

/**
 * Единый источник правды по тарифам. Управляет:
 *  - параметрами Astria (стили, фото на стиль, super_resolution, steps),
 *  - тем, что показывается в прайсинге и на странице загрузки,
 *  - выбором оффера LavaTop (offerEnvKey).
 *
 * ВАЖНО: priceLabel — только отображение. Реальное списание = цена оффера
 * LavaTop. Держи их в синхроне: цена оффера LAVATOP_OFFER_ID_<TIER> == priceRub.
 * Тариф появляется в прайсинге, только когда задан его оффер (см. purchasableTiers).
 */

export type TierId = "basic" | "pro" | "premium";

export type Tier = {
  id: TierId;
  name: string;
  tagline: string;
  priceRub: number;
  priceLabel: string;
  popular: boolean;
  styleKeys: ProductStyleKey[];
  imagesPerStyle: number;
  expectedCount: number; // derived = styleKeys.length * imagesPerStyle
  superResolution: boolean;
  inferenceSteps: number;
  trainingSteps: number;
  features: string[];
  /** Имя env-переменной с оффером LavaTop для этого тарифа. */
  offerEnvKey: string;
};

const ALL_STYLES: ProductStyleKey[] = [
  "linkedin",
  "corporate",
  "executive",
  "tech",
  "creative",
  "startup",
];

function makeTier(t: Omit<Tier, "expectedCount">): Tier {
  return { ...t, expectedCount: t.styleKeys.length * t.imagesPerStyle };
}

export const TIERS: Record<TierId, Tier> = {
  basic: makeTier({
    id: "basic",
    name: "Базовый",
    tagline: "Для резюме и LinkedIn",
    priceRub: 390, // ТЕСТ (целевая 790). Меняй вместе с ценой оффера LavaTop.
    priceLabel: "390 ₽",
    popular: false,
    styleKeys: ["linkedin", "corporate", "executive", "tech"],
    imagesPerStyle: 3,
    superResolution: false,
    inferenceSteps: 30,
    trainingSteps: 500,
    features: [
      "12 фотографий",
      "4 профессиональных стиля",
      "Готово за ~20 минут — пришлём на почту",
      "Полные права на использование",
    ],
    offerEnvKey: "LAVATOP_OFFER_ID_BASIC",
  }),
  pro: makeTier({
    id: "pro",
    name: "Профи",
    tagline: "Все образы в HD-качестве",
    priceRub: 390, // ТЕСТ (целевая 1490). Меняй вместе с ценой оффера LavaTop.
    priceLabel: "390 ₽",
    popular: true,
    styleKeys: ALL_STYLES,
    imagesPerStyle: 3,
    superResolution: true,
    inferenceSteps: 35,
    trainingSteps: 500,
    features: [
      "18 фотографий в HD",
      "Все 6 профессиональных стилей",
      "Улучшенное качество (HD-апскейл)",
      "Готово за ~20 минут — пришлём на почту",
      "Полные права на использование",
    ],
    offerEnvKey: "LAVATOP_OFFER_ID_PRO",
  }),
  premium: makeTier({
    id: "premium",
    name: "Премиум",
    tagline: "Максимум кадров для выбора",
    priceRub: 390, // ТЕСТ (целевая 2990). Меняй вместе с ценой оффера LavaTop.
    priceLabel: "390 ₽",
    popular: false,
    styleKeys: ALL_STYLES,
    imagesPerStyle: 6,
    superResolution: true,
    inferenceSteps: 40,
    trainingSteps: 600,
    features: [
      "36 фотографий в HD",
      "Все 6 профессиональных стилей",
      "Максимальное качество",
      "Приоритетная обработка",
      "Готово за ~20 минут — пришлём на почту",
      "Полные права на использование",
    ],
    offerEnvKey: "LAVATOP_OFFER_ID_PREMIUM",
  }),
};

export const TIER_ORDER: TierId[] = ["basic", "pro", "premium"];
export const DEFAULT_TIER: TierId = "pro";

export function isTierId(v: unknown): v is TierId {
  return v === "basic" || v === "pro" || v === "premium";
}

export function getTier(id: string | null | undefined): Tier {
  return isTierId(id) ? TIERS[id] : TIERS[DEFAULT_TIER];
}

/**
 * Тарифы, у которых задан собственный оффер LavaTop (server-only).
 * Пока owner не создал отдельные офферы, возвращает пусто → UI показывает
 * один тестовый тариф по PRICE_LABEL (см. landing-config). Так цена на сайте
 * никогда не расходится с реальным списанием.
 */
export function purchasableTiers(): Tier[] {
  return TIER_ORDER.map((id) => TIERS[id]).filter((t) => !!process.env[t.offerEnvKey]);
}
