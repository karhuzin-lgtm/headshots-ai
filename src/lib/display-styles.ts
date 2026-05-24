export const DISPLAY_STYLES = [
  {
    key: "linkedin",
    photo: "/my/linkedin.jpg",
    name: "LinkedIn",
    tagline: "Gets you 3× more replies",
    description:
      "Light blue oxford, clean gray studio. The shot that makes recruiters stop scrolling.",
  },
  {
    key: "corporate",
    photo: "/my/corporate.jpg",
    name: "Corporate",
    tagline: "Closes deals before you speak",
    description: "Dark navy suit, polished backdrop. Instant trust for enterprise clients.",
  },
  {
    key: "executive",
    photo: "/my/executive.jpg",
    name: "Executive",
    tagline: "The face of a decision-maker",
    description:
      "Charcoal suit, deep studio tones. For when you need to walk in and own the room.",
  },
  {
    key: "tech",
    photo: "/my/tech.jpg",
    name: "Tech",
    tagline: "Smart. Not stiff.",
    description:
      "Dark button-up, modern office blur. Serious enough for investors, human enough for users.",
  },
  {
    key: "creative",
    photo: "/my/creative.jpg",
    name: "Creative",
    tagline: "Looks like a €4,000 agency shoot",
    description:
      "Warm bokeh, editorial light. Stands out on every platform — especially Instagram.",
  },
  {
    key: "startup",
    photo: "/my/startup.jpg",
    name: "Startup",
    tagline: "Founder energy, zero budget",
    description:
      "White background, relaxed confidence. Because great ideas deserve great photos.",
  },
] as const;

export const STYLE_NAMES_LINE = DISPLAY_STYLES.map((s) => s.name).join(", ");

export const PRODUCT_STYLE_KEYS = DISPLAY_STYLES.map((s) => s.key);

export type ProductStyleKey = (typeof DISPLAY_STYLES)[number]["key"];
