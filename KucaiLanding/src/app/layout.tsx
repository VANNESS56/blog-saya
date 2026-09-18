import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kucaidl.com"),
  title: "KUCAIDL | Jual Beli Diamond Lock & Blue Gem Lock Terpercaya",
  description:
    "Platform terpercaya untuk transaksi Diamond Lock (DL) dan Blue Gem Lock (BGL) Growtopia dengan proses otomatis, aman, harga terbaik, dan pelayanan 24/7.",
  keywords: [
    "Growtopia",
    "Diamond Lock",
    "Blue Gem Lock",
    "Jual DL",
    "Beli DL",
    "Jual BGL",
    "Beli BGL",
    "KUCAIDL",
    "Growtopia DL Terpercaya",
    "Rate DL Growtopia",
    "Harga DL hari ini",
    "Beli DL otomatis",
    "Jual BGL cepat cair",
  ],
  authors: [{ name: "KUCAIDL" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "KUCAIDL | Jual Beli Diamond Lock & Blue Gem Lock Terpercaya",
    description:
      "Platform terpercaya untuk transaksi Diamond Lock (DL) dan Blue Gem Lock (BGL) dengan proses otomatis, aman, harga terbaik, dan pelayanan profesional.",
    url: "https://kucaidl.com",
    siteName: "KUCAIDL",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "KUCAIDL Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KUCAIDL | Jual Beli DL & BGL Terpercaya",
    description: "Transaksi DL dan BGL Growtopia aman, cepat, dan otomatis.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SettingsProvider } from "@/lib/settings/SettingsContext";
import { Analytics } from "@vercel/analytics/next";
import { MobileNav } from "@/components/layout/MobileNav";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 0; // Disable cache so theme changes apply instantly

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active theme globally
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "active_theme")
    .single();

  const activeTheme = data?.value || "cid-dark";
  const themeClass = activeTheme !== "cid-dark" && activeTheme !== "cid-classic" ? `theme-${activeTheme}` : "";

  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`min-h-full flex flex-col font-body ${themeClass}`} suppressHydrationWarning>
        <SettingsProvider>
          <LanguageProvider>
            {children}
            <FloatingWhatsApp />
            <MobileNav />
          </LanguageProvider>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
