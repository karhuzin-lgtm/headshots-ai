import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Headshots — AI-портреты",
    short_name: "Headshots",
    description:
      "Профессиональные AI-портреты студийного качества из ваших селфи примерно за 20 минут. Без фотографа и студии.",
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#111827",
    icons: [],
  };
}
