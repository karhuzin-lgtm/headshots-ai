import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import { CookieNotice } from "@/components/legal/cookie-notice";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://headshots.alekseimedia.com"),
  title: "AI Headshots — Professional portraits from your selfies | Headshots",
  description:
    "Upload a few phone selfies and get studio-quality professional headshots in about 20 minutes. LinkedIn, Corporate, Executive, Tech, Creative, and Startup styles. No photographer, no studio, no scheduling.",
  openGraph: {
    title: "AI Headshots — Professional portraits from your selfies",
    description: "Studio-quality headshots from phone selfies. ~20 minutes. 6 professional styles.",
    url: "https://headshots.alekseimedia.com",
    siteName: "Headshots AI",
    images: [{ url: "/my/linkedin.jpg", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Headshots — Professional portraits from your selfies",
    description: "Studio-quality headshots from phone selfies in about 20 minutes.",
    images: ["/my/linkedin.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
