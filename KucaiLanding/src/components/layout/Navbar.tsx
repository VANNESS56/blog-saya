"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";

const navLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Produk", href: "#products" },
  { label: "Lacak Pesanan", href: "/order" },
  { label: "Testimoni", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { waKucaidl, waCta, socialIg, socialDiscord } = useSettings();
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
            ? "glass-card border-b !border-amber-500/20"
            : "bg-[#030303]/80 backdrop-blur-md border-b border-amber-900/20"
        }`}
      >
        <div className="max-w-[1320px] mx-auto h-[68px] px-4 md:px-6 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 min-w-[160px]">
            <div className="relative w-[50px] h-[50px] rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="KUCAIDL" fill className="object-contain" />
            </div>
            <div>
              <strong className="text-[19px] tracking-tight block leading-none shimmer-text font-black drop-shadow-sm">KUCAIDL</strong>
              <small className="text-[9px] font-black tracking-[0.18em] uppercase text-amber-500 mt-0.5 block">
                Growtopia Marketplace
              </small>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2.5 rounded-lg hover:text-white hover:bg-amber-500/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Lang Toggle */}
            <div className="hidden md:flex items-center gap-0.5 bg-white/5 border border-gray-800 p-0.5 rounded-lg">
              <button
                suppressHydrationWarning
                onClick={() => setLang("id")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${lang === "id" ? "text-white bg-amber-500/20" : "text-gray-500 hover:text-white"}`}
              >
                <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-3.5 h-[10px] rounded-sm object-cover" /> ID
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setLang("en")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${lang === "en" ? "text-white bg-amber-500/20" : "text-gray-500 hover:text-white"}`}
              >
                <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-3.5 h-[10px] rounded-sm object-cover" /> EN
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setLang("cn")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${lang === "cn" ? "text-white bg-amber-500/20" : "text-gray-500 hover:text-white"}`}
              >
                <img src="https://flagcdn.com/w20/cn.png" alt="CN" className="w-3.5 h-[10px] rounded-sm object-cover" /> CN
              </button>
            </div>

            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-3 mx-1">
              {socialDiscord && (
                <a href={socialDiscord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all" title="Discord">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.29,80.4,80.4,0,0,0,6.77-11A68.32,68.32,0,0,1,28.8,77.22c.94-.69,1.84-1.39,2.69-2.1a75.11,75.11,0,0,0,71.3,0c.85.71,1.75,1.41,2.69,2.1a67.8,67.8,0,0,1-11,5.6,79.52,79.52,0,0,0,6.76,11,105.81,105.81,0,0,0,32-16.29C129.24,48.45,123.38,25.62,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                </a>
              )}
              {socialIg && (
                <a href={socialIg} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all" title="Instagram">
                  <svg className="w-[21px] h-[21px] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/${activeWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 h-[40px] px-5 rounded-lg font-black text-[12px] text-white bg-gradient-to-b from-amber-500 to-amber-600 border border-amber-400/40 shadow-[0_8px_22px_rgba(245,158,11,0.25)] hover:translate-y-[-1px] hover:brightness-110 transition-all uppercase tracking-wider"
            >
              Order Now
            </a>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-900/20 bg-[#050505] p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[13px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${activeWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center h-11 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold text-[14px] transition-all"
            >
              Order via WhatsApp
            </a>
          </div>
        )}
      </header>
    </>
  );
}
