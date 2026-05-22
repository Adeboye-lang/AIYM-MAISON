import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "serif"],
  preload: false,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://maisonaiym.com";

export const metadata: Metadata = {
  title: "Maison AIYM | Nubian Velvet Tanning Mousse for Melanin-Rich Skin",
  description:
    "Nubian Velvet is a luxurious self-tanning mousse formulated specifically for deep, melanin-rich skin. No orange, no ash — just a natural golden warmth. Free UK delivery over £40.",
  keywords: "self tan melanin, tanning mousse dark skin, Nubian Velvet, AIYM, self tanner Black skin, melanin tanner",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Maison AIYM | Nubian Velvet Tanning Mousse",
    description: "The tanning mousse made for melanin-rich skin. Hyaluronic acid enriched, streak-free, vegan & cruelty-free.",
    url: APP_URL,
    siteName: "Maison AIYM",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison AIYM | Nubian Velvet Tanning Mousse",
    description: "The tanning mousse made for melanin-rich skin.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/public/New Logo.png",
    apple: "/public/New Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
