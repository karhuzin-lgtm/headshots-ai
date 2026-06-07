export const DISPLAY_STYLES = [
  {
    key: "linkedin",
    photo: "/my/linkedin.jpg",
    name: "LinkedIn",
    tagline: "Больше откликов от рекрутеров",
    description:
      "Голубая рубашка, чистый серый фон. Кадр, на котором рекрутер остановится.",
  },
  {
    key: "corporate",
    photo: "/my/corporate.jpg",
    name: "Корпоративный",
    tagline: "Доверие с первого взгляда",
    description: "Тёмно-синий костюм, выверенный фон. Мгновенное доверие для клиентов.",
  },
  {
    key: "executive",
    photo: "/my/executive.jpg",
    name: "Руководитель",
    tagline: "Лицо, принимающее решения",
    description:
      "Угольный костюм, глубокие тона студии. Когда нужно войти и владеть ситуацией.",
  },
  {
    key: "tech",
    photo: "/my/tech.jpg",
    name: "Технологичный",
    tagline: "Серьёзно, но по-человечески",
    description:
      "Тёмная рубашка, размытый современный офис. Серьёзно для инвесторов, по-человечески для пользователей.",
  },
  {
    key: "creative",
    photo: "/my/creative.jpg",
    name: "Креативный",
    tagline: "Как со студийной съёмки",
    description:
      "Тёплое боке, редакторский свет. Выделяется на любой платформе — особенно в соцсетях.",
  },
  {
    key: "startup",
    photo: "/my/startup.jpg",
    name: "Стартап",
    tagline: "Энергия фаундера",
    description:
      "Белый фон, спокойная уверенность. Потому что хорошие идеи заслуживают хороших фото.",
  },
] as const;

export const STYLE_NAMES_LINE = DISPLAY_STYLES.map((s) => s.name).join(", ");

export const PRODUCT_STYLE_KEYS = DISPLAY_STYLES.map((s) => s.key);

export type ProductStyleKey = (typeof DISPLAY_STYLES)[number]["key"];
