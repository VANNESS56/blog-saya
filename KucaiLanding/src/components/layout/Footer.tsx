"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";

export function Footer() {
  const { t } = useLanguage();
  const { waKucaidl } = useSettings();

  return (
    <footer className="border-t-2 border-amber-500/20 bg-[#050505] pt-12 pb-6 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <Image src="/logo.png" alt="KUCAIDL" fill className="object-contain" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <strong className="text-[16px] block leading-none shimmer-text pb-0.5">KUCAIDL</strong>
                <small className="text-[8px] font-black text-amber-500 tracking-[0.14em] uppercase typewriter-text">Growtopia Marketplace</small>
              </div>
            </Link>
            <p className="text-[12px] text-gray-600 leading-relaxed max-w-[220px]">
              {t("foot.desc")}
            </p>
          </div>

          {/* Layanan */}
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.14em] mb-4">Layanan</p>
            <ul className="space-y-2">
              {["Jual Beli DL", "Jual Beli BGL", "Jual Beli Akun GT", "Saluran WhatsApp"].map((item) => (
                <li key={item}>
                  <span className="text-[12px] text-gray-500 hover:text-white transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.14em] mb-4">Informasi</p>
            <ul className="space-y-2">
              {["FAQ", "Testimoni", "Live Reputation", "Cara Order"].map((item) => (
                <li key={item}>
                  <span className="text-[12px] text-gray-500 hover:text-white transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi */}
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.14em] mb-4">Hubungi Kami</p>
            <ul className="space-y-2">
              <li>
                <a href={`https://wa.me/${waKucaidl}`} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] text-gray-500 hover:text-white transition-colors">WhatsApp</a>
              </li>
              <li>
                <a href="https://whatsapp.com/channel/0029VbDJVnn2Jl8I2Lqi792g" target="_blank" rel="noopener noreferrer"
                  className="text-[12px] text-gray-500 hover:text-white transition-colors">Saluran WA</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800/50 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-gray-600">© {new Date().getFullYear()} KUCAIDL. All rights reserved.</p>
          <p className="text-[10px] text-gray-700">Growtopia is a registered trademark of Ubisoft.</p>
        </div>
      </div>
    </footer>
  );
}
