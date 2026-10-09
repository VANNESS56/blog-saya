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
                  <strong className="text-[11px] text-white">3,8 rb <span className="font-normal text-gray-400">pengikut</span></strong>
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
                  <strong className="text-[11px] text-white">1,5 rb <span className="font-normal text-gray-400">pengikut</span></strong>
                  <span className="text-[8px] font-bold tracking-widest text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">TERDAFTAR</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors relative z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </a>
        </div>

        <div className="flex justify-center w-full">
          {/* Main Banner */}
          <div className="relative w-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-[500px]">
            {/* Content: Rate Card Style */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 md:p-10">
              
              {/* Rate Box */}
              <div className="bg-[#151b23] border border-white/5 rounded-[24px] p-8 w-full max-w-[640px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative mt-8">
                
                {/* Title */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c2431] border border-white/10 px-5 py-1.5 rounded-full whitespace-nowrap">
                  <span className="text-[11px] font-bold text-gray-300 tracking-widest uppercase">
                    KUCAIDL · HARGA SAAT INI
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4 gap-8 md:gap-4">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className="w-20 h-20 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                      <Image src="/dl.png" alt="Diamond Lock" fill className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[16px]">Diamond Lock</span>
                      <span className="text-gray-500 font-medium text-[14px]">DL</span>
                    </div>
                  </div>

                  {/* Price Boxes */}
                  <div className="flex gap-4 w-full md:w-2/3 justify-end">
                    {/* KAMU BELI */}
                    <div className="flex-1 max-w-[160px] bg-transparent border border-[#1e3a8a] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">KAMU BELI</span>
                      <span className="text-[#38bdf8] font-bold text-3xl">
                        {loadingPrices ? "..." : `Rp${prices.dlBuy}`}
                      </span>
                    </div>

                    {/* KAMU JUAL */}
                    <div className="flex-1 max-w-[160px] bg-transparent border border-[#7f1d1d] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">KAMU JUAL</span>
                      <span className="text-[#38bdf8] font-bold text-3xl">
                        {loadingPrices ? "..." : `Rp${prices.dlSell}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Info inside box */}
                <p className="text-gray-400/80 text-[12px] mt-10 text-center">
                  Rate ini berlaku sementara dan bisa berubah sewaktu-waktu.
                </p>

                {/* Store Status Badge */}
                <div className="mt-5 px-5 py-2 rounded-full border border-[#1e3a8a] bg-[#0f172a] flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${storeStatus === "buka" ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
                  <span className="text-gray-300 text-[12px] font-medium">
                    {storeStatus === "buka" ? "Toko buka — order diproses bot" : "Toko tutup — offline sementara"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 w-full justify-center">
                  <style>{`
                    @keyframes punchEffect {
                      0% { transform: translate(-50%, -50%) scale(0.5) rotate(-20deg); opacity: 1; }
                      50% { transform: translate(-50%, -50%) scale(1.5) rotate(10deg); opacity: 1; }
                      100% { transform: translate(-50%, -50%) scale(2) rotate(20deg); opacity: 0; }
                    }
                  `}</style>
                  <a href={`https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Beli%20DL`}
                    onClick={(e) => handlePunchAndNavigate(e, `https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Beli%20DL`)}
                    className="relative overflow-hidden w-full sm:w-[220px] h-[95px] rounded-[18px] bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.4)] hover:scale-105 hover:-translate-y-1 transition-all group border border-blue-400/50 flex flex-col justify-center px-6">
                    
                    {punches.map(p => (
                      <div key={p.id} className="absolute pointer-events-none z-50 text-4xl drop-shadow-lg" style={{ left: p.x, top: p.y, animation: 'punchEffect 0.4s ease-out forwards' }}>
                        👊
                      </div>
                    ))}
                    
                    <div className="relative z-10">
                      <div className="font-black text-[32px] text-white drop-shadow-md tracking-tight leading-none mb-1.5">
                        BELI DL
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-bold tracking-widest uppercase">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        VIA WHATSAPP
                      </div>
                    </div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[90px] opacity-[0.35] group-hover:scale-110 transition-transform duration-500 pointer-events-none filter drop-shadow-xl brightness-110">
                      <Image src="/dl.png" alt="DL" width={90} height={90} className="object-contain" />
                    </div>
                  </a>

                  <a href={`https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Jual%20DL`}
                    onClick={(e) => handlePunchAndNavigate(e, `https://wa.me/${waKucaidl}?text=Halo%20Admin,%20saya%20mau%20Jual%20DL`)}
                    className="relative overflow-hidden w-full sm:w-[220px] h-[95px] rounded-[18px] bg-gradient-to-r from-blue-800 to-indigo-950 shadow-[0_8px_24px_rgba(30,58,138,0.5)] hover:scale-105 hover:-translate-y-1 transition-all group border border-blue-800/50 flex flex-col justify-center px-6">
                    
                    {punches.map(p => (
                      <div key={p.id} className="absolute pointer-events-none z-50 text-4xl drop-shadow-lg" style={{ left: p.x, top: p.y, animation: 'punchEffect 0.4s ease-out forwards' }}>
                        👊
                      </div>
                    ))}

                    <div className="relative z-10">
                      <div className="font-black text-[32px] text-white drop-shadow-md tracking-tight leading-none mb-1.5">
                        JUAL DL
                      </div>
                      <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-bold tracking-widest uppercase">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        VIA WHATSAPP
                      </div>
                    </div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[90px] opacity-[0.35] group-hover:scale-110 transition-transform duration-500 pointer-events-none filter drop-shadow-xl brightness-110">
                      <Image src="/dl.png" alt="DL" width={90} height={90} className="object-contain" />
                    </div>
                  </a>
                </div>
              </div>


            </div>


          </div>


        </div>
      </div>
    </section>
  );
}
