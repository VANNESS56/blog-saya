"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingCart, LayoutGrid, ShoppingBag, Receipt, MessageSquare, Star, PlayCircle, HelpCircle, Headphones } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";

const bottomNavLeft = [
  { label: "Home", href: "#home", icon: LayoutGrid, active: true },
  { label: "Beli", href: "#products", icon: ShoppingBag, active: false },
  { label: "Cek Pesanan", href: "/order", icon: Receipt, active: false },
];

const bottomNavRight = [
  { label: "Testimoni", href: "#reviews", icon: MessageSquare },
  { label: "Reputasi", href: "#reputation", icon: Star },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
  { label: "Bantuan", href: "#bantuan", icon: Headphones },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { waKucaidl, waCta } = useSettings();
  const activeWa = waCta || waKucaidl;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Ticker */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[34px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 flex items-center overflow-hidden shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
        <div className="flex gap-8 whitespace-nowrap min-w-max animate-[ticker_30s_linear_infinite] text-[11px] font-black uppercase tracking-widest text-amber-950">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.1")}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.2")}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.3")}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.4")}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.5")}</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-950"></span> {t("tick.6")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <header
        className={`fixed top-[34px] left-0 right-0 z-[90] transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg"
            : "bg-[#030303]/95 backdrop-blur-md border-b border-amber-900/30"
        }`}
      >
        {/* Top Tier */}
        <div className="max-w-[1320px] mx-auto h-[64px] px-4 md:px-6 flex items-center justify-between gap-4 md:gap-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 min-w-max">
            <div className="relative w-[40px] h-[40px] rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="KUCAIDL" fill className="object-contain" />
            </div>
            <div>
              <strong className="text-[18px] tracking-tight block leading-none text-white font-black drop-shadow-sm">KUCAIDL</strong>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[700px] hidden md:block">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Cari Diamond Lock..." 
                className="w-full bg-white text-black text-[13px] font-medium rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ShoppingCart className="text-gray-300 hover:text-white cursor-pointer hidden sm:block" size={22} />
            
            {/* Lang Toggle */}
            <div className="hidden md:flex items-center gap-0.5 bg-[#101010] border border-gray-800 p-0.5 rounded-lg">
              <button
                suppressHydrationWarning
                onClick={() => setLang("id")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-all ${lang === "id" ? "text-white bg-gray-800" : "text-gray-500 hover:text-white"}`}
              >
                <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-[18px] h-[13px] rounded-sm object-cover" /> ID
              </button>
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/${activeWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center h-[38px] px-6 rounded-lg font-bold text-[13px] text-white bg-gradient-to-b from-amber-500 to-amber-600 hover:brightness-110 transition-all"
            >
              Order Now
            </a>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Bottom Tier (Desktop Only) */}
        <div className="max-w-[1320px] mx-auto h-[48px] px-4 md:px-6 hidden lg:flex items-center justify-between border-t border-gray-800">
          {/* Left Links */}
          <div className="flex items-center gap-2">
            {bottomNavLeft.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[13px] font-bold transition-all ${
                  link.active 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={16} className={link.active ? 'text-white' : 'text-gray-400'} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-6">
            {bottomNavRight.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-amber-400 transition-colors"
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-900/20 bg-[#050505] p-4 flex flex-col gap-2 shadow-2xl">
            {/* Mobile Search */}
            <div className="relative w-full mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="text" placeholder="Cari Item Growtopia..." className="w-full bg-white text-black text-sm rounded-lg pl-10 pr-4 py-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {[...bottomNavLeft, ...bottomNavRight].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/5"
                >
                  <link.icon size={14} className="text-amber-500" />
                  {link.label}
                </Link>
              ))}
            </div>

            <a
              href={`https://wa.me/${activeWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center h-[42px] bg-amber-500 text-white rounded-lg font-bold text-[14px]"
            >
              Order via WhatsApp
            </a>
          </div>
        )}
      </header>
    </>
  );
}
