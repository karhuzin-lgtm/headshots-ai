/**
 * Единый источник правды по офферу, цене и CTA лендинга.
 *
 * Цена здесь — только для отображения. Реальная сумма списания задаётся в
 * оффере LavaTop (дашборд). Держи их в соответствии: PRICE_RUB === цена оффера.
 */

/** Цена в рублях (для отображения). Реальное списание — в оффере LavaTop. */
// ВРЕМЕННО 390 ₽ на период тестов (совпадает с оффером LavaTop). Целевая цена — 1290 ₽:
// поменяй обе строки ниже и цену оффера в дашборде LavaTop одновременно.
export const PRICE_RUB = 390;
/** Готовая строка цены для UI. */
export const PRICE_LABEL = "390 ₽";
/** Сколько фото получает пользователь за один заказ. */
export const HEADSHOT_COUNT = 18;
/** Сколько профессиональных стилей в наборе. */
export const STYLE_COUNT = 6;
/** Ориентир по времени готовности. */
export const TURNAROUND = "~20 минут";

/**
 * Куда ведёт главный CTA. По умолчанию — рабочий флоу загрузки/оплаты на
 * /try/generate. Можно переопределить внешней ссылкой через NEXT_PUBLIC_CHECKOUT_URL.
 */
const FALLBACK_GET_STARTED = "/try/generate#choose";

export const GET_STARTED_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim() || FALLBACK_GET_STARTED;

/** True, когда GET_STARTED_URL — внешняя ссылка. */
export const CHECKOUT_IS_EXTERNAL = /^https?:\/\//.test(GET_STARTED_URL);

/**
 * Контакт для командных/корпоративных заказов.
 * TODO: задай реальный контакт через NEXT_PUBLIC_TEAM_CONTACT_URL
 * (Telegram, например https://t.me/username). По умолчанию — рабочий mailto,
 * чтобы кнопка не вела в никуда.
 */
export const TEAM_CONTACT_URL =
  process.env.NEXT_PUBLIC_TEAM_CONTACT_URL?.trim() ||
  "mailto:aleksei@alekseimedia.com?subject=Портреты%20для%20команды";

export const PRIMARY_CTA = { href: GET_STARTED_URL, label: "Создать мои портреты" } as const;
export const HERO_CTA = { href: GET_STARTED_URL, label: "Создать мои портреты" } as const;
export const TEAM_CTA = { href: TEAM_CONTACT_URL, label: "Запросить цену для команды" } as const;

/**
 * Единый оффер на запуск.
 * Держи `headshots` / `styleCount` в соответствии с пайплайном генерации
 * (EXPECTED_HEADSHOT_OUTPUTS в astria-images.ts), а `price` — с оффером LavaTop.
 */
export const LAUNCH_OFFER = {
  name: "Полный набор",
  price: PRICE_LABEL,
  priceNote: "разовый платёж",
  headshots: HEADSHOT_COUNT,
  styleCount: STYLE_COUNT,
  turnaround: TURNAROUND,
  features: [
    "18 фотографий в высоком разрешении",
    "Все 6 профессиональных стилей",
    "Готово за ~20 минут — пришлём на почту",
    "Полные права на использование",
    "Фото и AI-модель удаляем в течение 30 дней",
    "Не понравилось? Бесплатная перегенерация или возврат",
  ],
} as const;
