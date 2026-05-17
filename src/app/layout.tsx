import type { Metadata } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${figtree.variable} ${instrumentSerif.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
      </body>
    </html>
  );
}
