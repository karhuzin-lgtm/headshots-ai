import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";

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
    "Upload 8-20 phone selfies and get studio-quality professional headshots in 15 minutes. LinkedIn, Corporate, Executive, Tech, Creative, and Startup styles. No photographer needed.",
  openGraph: {
    title: "AI Headshots — Professional portraits from your selfies",
    description: "Studio-quality headshots from phone selfies. 15 minutes. 6 styles.",
    url: "https://headshots.alekseimedia.com",
    siteName: "Headshots AI",
    images: [{ url: "/avatars/avatar-07.jpg", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Headshots — Professional portraits from your selfies",
    description: "Studio-quality headshots from phone selfies in 15 minutes.",
    images: ["/avatars/avatar-07.jpg"],
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
      </body>
    </html>
  );
}
