import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Headshots — AI portraits, studio polish",
  description:
    "Upload your photos, choose a look, and receive a full pack of professional AI headshots — crafted for European quality and privacy expectations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
      </body>
    </html>
  );
}
