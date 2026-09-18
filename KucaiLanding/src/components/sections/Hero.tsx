"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";
import { MessageCircle } from "lucide-react";

export function Hero() {
  const { t } = useLanguage();
  const { waKucaidl } = useSettings();

  const [gtStats, setGtStats] = useState({ online: "Loading...", wotd: "Loading..." });

  useEffect(() => {
    fetch('/api/growtopia')
      .then(res => res.json())
      .then(data => {
        const parsedOnline = parseInt(data.online_user);
        const formattedOnline = !isNaN(parsedOnline) ? parsedOnline.toLocaleString("id-ID") : data.online_user;
        setGtStats({ online: formattedOnline, wotd: data.wotd });
      })
      .catch(() => setGtStats({ online: "75.000+", wotd: "Harvest Festival" }));
  }, []);

  return (
    <section className="pt-[108px] pb-6 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* WhatsApp Channel 1 */}
          <a href="https://whatsapp.com/channel/0029VbDJVnn2Jl8I2Lqi792g" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-[18px] border border-emerald-500/20 bg-gradient-to-r from-emerald-950 to-emerald-900/50 hover:border-emerald-500/40 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 flex-shrink-0 rounded-[14px] bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
              </div>
              <div>
                <span className="block text-[10px] font-black tracking-widest text-emerald-400 uppercase mb-0.5">SALURAN WA</span>
                <strong className="block text-[14px] text-white leading-tight mb-0.5">KUCAIDL</strong>
                <span className="block text-[11px] text-gray-400">Jual Beli BGL & DL</span>
                <div className="flex items-center gap-1.5 mt-2">
                  <strong className="text-[11px] text-white">2,4 rb <span className="font-normal text-gray-400">pengikut</span></strong>
                  <span className="text-[8px] font-bold tracking-widest text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">TEREKAM</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors relative z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </a>

          {/* WhatsApp Channel 2 */}
          <a href="https://whatsapp.com/channel/0029VbD8Wx9545uqEqWnPY3E" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-[18px] border border-amber-500/20 bg-gradient-to-r from-amber-950 to-amber-900/50 hover:border-amber-500/40 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 flex-shrink-0 rounded-[14px] bg-amber-900 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] overflow-hidden border border-amber-500/30">
                <Image src="/kucai-account.png" alt="Kucai Account" width={48} height={48} className="object-cover w-full h-full" />
              </div>
              <div>
                <span className="block text-[10px] font-black tracking-widest text-amber-400 uppercase mb-0.5">SALURAN WA</span>
                <strong className="block text-[14px] text-white leading-tight mb-0.5">KUCAI ACCOUNT</strong>
                <span className="block text-[11px] text-gray-400">Jual Beli Akun GT</span>
                <div className="flex items-center gap-1.5 mt-2">
                  <strong className="text-[11px] text-white">1,2 rb <span className="font-normal text-gray-400">pengikut</span></strong>
                  <span className="text-[8px] font-bold tracking-widest text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">TERDAFTAR</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors relative z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-4">
          {/* Main Banner */}
          <div className="relative min-h-[440px] lg:min-h-[500px] rounded-[24px] overflow-hidden glass-card !border-amber-400/40 shadow-[0_22px_70px_rgba(245,158,11,0.2)]">
            {/* Bright Patterned Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(255,255,255,0.2),transparent_50%)]" />

            {/* Tokodl-style diagonal repeating lines */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
              backgroundImage: "repeating-linear-gradient(118deg, transparent 0 32px, rgba(255,255,255,0.7) 33px 34px)"
            }} />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 lg:p-14 max-w-[640px] flex flex-col justify-center h-full text-white">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.16em] uppercase text-white/90">
                  MARKETPLACE GROWTOPIA | OFFICIAL KUCAIDL WEBSITE
                </span>
              </div>

              <h1 className="text-[clamp(36px,5.5vw,72px)] font-black leading-[0.95] tracking-[-0.03em] text-white mb-6 drop-shadow-lg">
                Beli atau Jual
                <br />
                <span className="text-amber-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">BGL & DL</span>
                <br />
                dengan Mudah.
              </h1>

              <p className="text-[15px] leading-[1.7] text-white/90 font-medium max-w-[480px] mb-8 drop-shadow-md">
                KUCAIDL menyediakan dua cara transaksi. Gunakan checkout website untuk membeli BGL/DL, atau gunakan WhatsApp untuk transaksi beli maupun jual langsung dengan CS kami.
              </p>

              <div className="flex gap-3 flex-wrap">
                <a href={`https://wa.me/${waKucaidl}`}
                  className="inline-flex items-center gap-2.5 h-[46px] px-6 rounded-xl font-black text-[12px] text-amber-900 bg-white border border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-all uppercase tracking-[0.12em]">
                  <MessageCircle className="w-4.5 h-4.5 text-amber-500" />
                  Order via WhatsApp
                </a>
                <a href="#products"
                  className="inline-flex items-center h-[46px] px-6 rounded-xl font-black text-[12px] text-white bg-black/20 backdrop-blur-sm border border-white/30 hover:bg-black/30 hover:border-white/50 transition-all uppercase tracking-[0.12em]">
                  Lihat Produk
                </a>
              </div>
            </div>

            {/* Floating items */}
            <div className="absolute z-[2] right-[-5%] bottom-[-5%] w-[min(55%,400px)] pointer-events-none opacity-20 mix-blend-overlay rotate-[-5deg]">
              <Image src="/logo.png" alt="KUCAIDL" width={400} height={400} />
            </div>
            <div className="absolute z-[3] right-[5%] top-[10%] w-[110px] pointer-events-none" style={{ animation: "float 6s ease-in-out infinite" }}>
              <Image src="/bgl.png" alt="BGL" width={110} height={110} className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] rotate-[8deg]" />
            </div>
            <div className="absolute z-[3] right-[30%] bottom-[12%] w-[90px] pointer-events-none" style={{ animation: "float 6s ease-in-out infinite 2s" }}>
              <Image src="/dl.png" alt="DL" width={90} height={90} className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]" />
            </div>
          </div>

          {/* Side Cards */}
          <div className="grid gap-4">
            <div className="relative min-h-[240px] rounded-[24px] overflow-hidden glass-card p-7 flex flex-col justify-between border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-teal-900/60 to-[#041a14]/90 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(16,185,129,0.25),transparent_60%)]" />
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
                  <span className="text-[9px] font-black tracking-[0.16em] text-emerald-300 uppercase">Live Rate & Stok</span>
                </div>
                <h3 className="text-[24px] font-black text-white leading-[1.1] max-w-[220px]">
                  Harga Real-Time Terupdate
                </h3>
                <p className="text-[12px] text-emerald-100/70 leading-relaxed mt-2 max-w-[250px]">
                  Rate otomatis diperbarui setiap saat dari database kami.
                </p>
              </div>
              <div className="absolute right-[-10px] bottom-[-20px] w-[140px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Image src="/dl.png" alt="DL" width={140} height={140} className="drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            <div className="relative min-h-[240px] rounded-[24px] overflow-hidden glass-card p-7 flex flex-col justify-between border-amber-500/30 bg-gradient-to-br from-amber-950/80 via-yellow-900/60 to-[#1a1105]/90 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.25),transparent_60%)]" />
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black tracking-[0.16em] text-violet-300 uppercase flex items-center gap-1.5">
                    Growtopia Live Stats
                  </span>
                </div>
                <h3 className="text-[28px] font-black text-white leading-[1.1] mt-2">
                  {gtStats.online}
                </h3>
                <p className="text-[12px] text-violet-200 font-bold mb-3 uppercase tracking-wider">
                  Players Online
                </p>
                <div className="mt-4 pt-3 border-t border-violet-500/30">
                  <span className="block text-[10px] text-violet-300/70 uppercase tracking-widest font-bold mb-1">World of the Day</span>
                  <span className="block text-[14px] font-black text-amber-400">{gtStats.wotd}</span>
                </div>
              </div>
              <div className="absolute right-[-10px] bottom-[-20px] w-[140px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Image src="/bgl.png" alt="BGL" width={140} height={140} className="drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
