import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PannessTV | Portal Berita Terkini & Terpercaya Indonesia",
    template: "%s | PannessTV"
  },
  description: "PannessTV menyajikan berita terkini, akurat, dan mendalam seputar Ekonomi, Teknologi, Sains, dan Gaya Hidup dari seluruh penjuru Indonesia.",
  keywords: ["berita terkini", "news indonesia", "ekonomi", "teknologi", "imlek 2026", "investasi", "sains", "portal berita", "pannesstv"],
  authors: [{ name: "Redaksi PannessTV" }],
  openGraph: {
    title: "PannessTV | Berita Terkini Indonesia",
    description: "Portal berita paling update dan terpercaya.",
    url: "https://pannesstv.com",
    siteName: "PannessTV",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PannessTV | Berita Terkini",
    description: "Berita akurat dan mendalam.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/30`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
