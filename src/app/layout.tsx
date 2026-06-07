import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import { CookieNotice } from "@/components/legal/cookie-notice";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://headshots.alekseimedia.com"),
  title: "AI-хедшоты — профессиональные портреты из ваших селфи | Headshots",
  description:
    "Загрузите несколько селфи с телефона и получите профессиональные хедшоты студийного качества примерно за 20 минут. 6 стилей: LinkedIn, корпоративный, руководитель, технологичный, креативный, стартап. Без фотографа, студии и записи.",
  openGraph: {
    title: "AI-хедшоты — профессиональные портреты из ваших селфи",
    description: "Хедшоты студийного качества из селфи с телефона. ~20 минут. 6 профессиональных стилей.",
    url: "https://headshots.alekseimedia.com",
    siteName: "Headshots",
    locale: "ru_RU",
    images: [{ url: "/my/linkedin.jpg", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-хедшоты — профессиональные портреты из ваших селфи",
    description: "Хедшоты студийного качества из селфи с телефона примерно за 20 минут.",
    images: ["/my/linkedin.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
