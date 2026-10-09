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
  const [punches, setPunches] = useState<{id: number, x: number, y: number}[]>([]);
  const [prices, setPrices] = useState({ dlBuy: 0, dlSell: 0, bglBuy: 0, bglSell: 0 });
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [storeStatus, setStoreStatus] = useState("buka");
  const [activeRate, setActiveRate] = useState<"DL" | "BGL">("DL");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRate(prev => prev === "DL" ? "BGL" : "DL");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePunchAndNavigate = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setPunches(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setPunches(prev => prev.filter(p => p.id !== id));
    }, 400); // Wait for animation to almost finish before opening tab
  };

  useEffect(() => {
    fetch('/api/growtopia')
      .then(res => res.json())
      .then(data => {
        const parsedOnline = parseInt(data.online_user);
        const formattedOnline = !isNaN(parsedOnline) ? parsedOnline.toLocaleString("id-ID") : data.online_user;
        setGtStats({ online: formattedOnline, wotd: data.wotd });
      })
      .catch(() => setGtStats({ online: "75.000+", wotd: "Harvest Festival" }));
      
    // Fetch prices from Supabase
    import("@/lib/supabase").then(({ supabase }) => {
      const fetchRates = async () => {
        const { data: pData } = await supabase.from("products").select("*");
        const { data: sData } = await supabase.from("settings").select("*");
        if (pData && sData) {
          const bglBuy = pData.find((p: any) => p.type === "bgl")?.price || 0;
          const dlBuy = pData.find((p: any) => p.type === "dl")?.price || 0;
          
          const configRow = sData.find((s: any) => s.key === "config");
          let bglSell = 0;
          let shopOpen = true;
          if (configRow?.value) { 
            try { 
              const parsed = JSON.parse(configRow.value);
              bglSell = parsed.sellRate || 0; 
              if (parsed.storeStatus) shopOpen = parsed.storeStatus === "open";
            } catch {} 
          }
          const dlSell = Math.floor(bglSell / 100);
          setPrices({ bglBuy, bglSell, dlBuy, dlSell });
          setStoreStatus(shopOpen ? "buka" : "tutup");
        }
        setLoadingPrices(false);
      };
      
      fetchRates();
      const channel = supabase.channel("hero-rates")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchRates)
        .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, fetchRates)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    });
  }, []);

  return (
    <section className="pt-[108px] pb-6 px-4 md:px-6 relative">
      {/* Background Image with fade out at bottom */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10" 
           style={{
             backgroundImage: "url('/hero-bg.png')",
             backgroundSize: "cover",
             backgroundPosition: "center top",
             maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
             WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
           }} 
      />

      <div className="max-w-[1320px] mx-auto relative z-10">


        <div className="flex justify-center w-full">
          {/* Main Banner */}
          <div className="relative w-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-[500px]">
            {/* Content: Rate Card Style */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 md:p-10">
              
              {/* Rate Box */}
              <div className="relative bg-[#101010] border border-amber-500 rounded-[24px] p-6 md:p-8 w-full max-w-[800px] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col mt-10">
                
                {/* Diagonal light streaks */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]">
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] blur-md" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] blur-md" />
                </div>

                {/* Title Pill */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#101010] border border-amber-500 px-6 py-1.5 rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(245,158,11,0.3)] z-10 transition-all duration-300">
                  <span className="text-[16px] font-black text-amber-500 tracking-[0.2em] uppercase flex items-center gap-3">
                    <span className="w-3 h-[2px] bg-amber-500"></span>
                    KUCAI{activeRate}
                    <span className="w-3 h-[2px] bg-amber-500"></span>
                  </span>
                </div>

                <div key={activeRate} className="flex flex-col md:flex-row items-center justify-between w-full mt-4 gap-6 relative z-10 animate-[fadeIn_0.5s_ease-out]">
                  {/* Icon */}
                  <div className="flex items-center justify-center md:w-[30%]">
                    <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] relative drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                      <Image src={activeRate === "DL" ? "/dl.png" : "/bgl.png"} alt={activeRate === "DL" ? "Diamond Lock" : "Blue Gem Lock"} fill className="object-contain" />
                    </div>
                  </div>

                  {/* Right Side Content */}
                  <div className="flex flex-col w-full md:w-[70%] gap-4">
                    <div className="flex flex-col mb-1 text-center md:text-left">
                      <h2 className="text-white font-bold text-[22px] tracking-wide">
                        {activeRate === "DL" ? "Diamond Lock" : "Blue Gem Lock"} <span className="text-gray-500 font-medium">{activeRate}</span>
                      </h2>
                    </div>

                    {/* Price Boxes */}
                    <div className="flex gap-4 w-full">
                      {/* KAMU BELI */}
                      <div className="flex-1 bg-[#151515] border border-amber-500 rounded-[12px] py-4 px-2 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1">KAMU BELI</span>
                        <span className="text-amber-500 font-black text-[26px] md:text-[32px] tracking-tight">
                          {loadingPrices ? "..." : `Rp${activeRate === "DL" ? prices.dlBuy : prices.bglBuy}`}
                        </span>
                      </div>

                      {/* KAMU JUAL */}
                      <div className="flex-1 bg-[#151515] border border-amber-500 rounded-[12px] py-4 px-2 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1">KAMU JUAL</span>
                        <span className="text-amber-500 font-black text-[26px] md:text-[32px] tracking-tight">
                          {loadingPrices ? "..." : `Rp${activeRate === "DL" ? prices.dlSell : prices.bglSell}`}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 w-full mt-2">
                      <a href={`https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Beli%20${activeRate}`}
                        onClick={(e) => handlePunchAndNavigate(e, `https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Beli%20${activeRate}`)}
                        className="flex-1 relative overflow-hidden h-[54px] rounded-full bg-gradient-to-r from-[#ffd000] to-[#f59e0b] shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),inset_0_-4px_4px_rgba(0,0,0,0.15),0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all group flex items-center justify-between px-4 md:px-6 border border-white/20">
                        
                        {punches.map(p => (
                          <div key={p.id} className="absolute pointer-events-none z-50 text-4xl drop-shadow-lg" style={{ left: p.x, top: p.y, animation: 'punchEffect 0.4s ease-out forwards' }}>
                            👊
                          </div>
                        ))}

                        <div className="w-8 h-8 rounded-full bg-black/90 flex items-center justify-center text-amber-500 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                        </div>
                        <div className="font-black text-[15px] md:text-[16px] text-black tracking-widest relative z-10">
                          BELI {activeRate}
                        </div>
                        <div className="text-black shrink-0 relative z-10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                      </a>

                      <a href={`https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Jual%20${activeRate}`}
                        onClick={(e) => handlePunchAndNavigate(e, `https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Jual%20${activeRate}`)}
                        className="flex-1 relative overflow-hidden h-[54px] rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-4px_4px_rgba(0,0,0,0.2),0_0_20px_rgba(234,88,12,0.3)] hover:scale-105 transition-all group flex items-center justify-between px-4 md:px-6 border border-white/10">
                        
                        {punches.map(p => (
                          <div key={p.id} className="absolute pointer-events-none z-50 text-4xl drop-shadow-lg" style={{ left: p.x, top: p.y, animation: 'punchEffect 0.4s ease-out forwards' }}>
                            👊
                          </div>
                        ))}

                        <div className="w-8 h-8 rounded-full bg-black/90 flex items-center justify-center text-[#ea580c] shrink-0">
                          <span className="font-black text-[16px]">$</span>
                        </div>
                        <div className="font-black text-[15px] md:text-[16px] text-black tracking-widest relative z-10">
                          JUAL {activeRate}
                        </div>
                        <div className="text-black shrink-0 relative z-10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Info inside box */}
                <div className="flex flex-col items-center gap-2 mt-8 relative z-10">
                  <p className="text-gray-500 text-[11px]">
                    Rate ini berlaku sementara dan bisa berubah sewaktu-waktu.
                  </p>
                  <div className="px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                    <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span className="text-amber-500 font-bold text-[10px] tracking-widest uppercase">
                      VERIFIED STORE
                    </span>
                  </div>
                </div>
              </div>


            </div>

          </div>

        </div>

        {/* Channels Bottom */}
        <div className="flex justify-center mt-6 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-[800px]">
            {/* WhatsApp Channel 1 */}
            <a href="https://whatsapp.com/channel/0029VbDJVnn2Jl8I2Lqi792g" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-[16px] bg-[#0b2418] border border-emerald-900/40 hover:border-emerald-500/40 transition-all group overflow-hidden relative shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-900/10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-[#25D366] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                </div>
                <div>
                  <span className="block text-[9px] font-bold tracking-widest text-emerald-400 uppercase mb-0.5">SALURAN WA</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-[13px] text-white leading-tight">KUCAIDL</strong>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">Jual Beli BGL & DL</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <strong className="text-[10px] text-white">3,8 rb <span className="font-normal text-gray-500">pengikut</span></strong>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors relative z-10 shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </div>
            </a>

            {/* WhatsApp Channel 2 */}
            <a href="https://whatsapp.com/channel/0029VbD8Wx9545uqEqWnPY3E" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-[16px] bg-[#2a1304] border border-amber-900/40 hover:border-amber-500/40 transition-all group overflow-hidden relative shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-900/10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 flex-shrink-0 rounded-[12px] bg-amber-900 flex items-center justify-center overflow-hidden">
                  <Image src="/kucai-account.png" alt="Kucai Account" width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <div>
                  <span className="block text-[9px] font-bold tracking-widest text-amber-400 uppercase mb-0.5">SALURAN WA</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-[13px] text-white leading-tight">KUCAI ACCOUNT</strong>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">Jual Beli Akun GT</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <strong className="text-[10px] text-white">1,5 rb <span className="font-normal text-gray-500">pengikut</span></strong>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors relative z-10 shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
