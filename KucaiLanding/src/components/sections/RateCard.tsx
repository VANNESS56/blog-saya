"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase, type Rate } from "@/lib/supabase";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

export function RateCard() {
  const { t } = useLanguage();
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    const { data: pData, error: pErr } = await supabase.from("products").select("*");
    const { data: sData, error: sErr } = await supabase.from("settings").select("*");
    if (!pErr && !sErr && pData && sData) {
      const bglBuy = pData.find((p: any) => p.type === "bgl")?.price || 0;
      const dlBuy = pData.find((p: any) => p.type === "dl")?.price || 0;
      const configRow = sData.find((s: any) => s.key === "config");
      let bglSell = 0;
      if (configRow?.value) { try { bglSell = JSON.parse(configRow.value).sellRate || 0; } catch {} }
      const dlSell = Math.floor(bglSell / 100);
      const now = new Date().toISOString();
      setRates([
        { id: 1, item: "BGL", buy_price: bglBuy, sell_price: bglSell, updated_at: now },
        { id: 2, item: "DL", buy_price: dlBuy, sell_price: dlSell, updated_at: now }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
    const channel = supabase.channel("rates-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchRates)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, fetchRates)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const bgl = rates.find((r) => r.item === "BGL");
  const dl = rates.find((r) => r.item === "DL");

  return (
    <section id="products" className="py-14 px-4 md:px-6 section-glow">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-end gap-5 mb-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.16em] text-amber-400/70 uppercase">Produk Unggulan</span>
            <h2 className="text-[clamp(26px,3.5vw,38px)] font-black text-white tracking-tight mt-1">DIAMOND LOCK & BLUE GEM LOCK</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.12em]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
            Harga Live
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Memuat harga...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[bgl, dl].map((rate) => {
              if (!rate) return null;
              const isBgl = rate.item === "BGL";
              return (
                <div key={rate.id}
                  className="glass-card rounded-[18px] flex items-center gap-5 p-5 hover:translate-y-[-2px] transition-all group">
                  {/* Icon */}
                  <div className="w-[68px] h-[68px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/10 flex items-center justify-center">
                    <Image src={isBgl ? "/bgl.png" : "/dl.png"} alt={rate.item} width={44} height={44}
                      className="drop-shadow-lg group-hover:scale-115 transition-transform duration-300" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="text-[16px] font-black text-white">{isBgl ? "Blue Gem Lock" : "Diamond Lock"}</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/15 rounded-md text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Ready
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[13px]">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                        Beli <strong className="text-white text-[15px] ml-0.5">{formatPrice(rate.buy_price)}</strong>
                      </span>
                      <span className="w-px h-4 bg-gray-800" />
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <ArrowUp className="w-3.5 h-3.5 text-violet-400" />
                        Jual <strong className="text-white text-[15px] ml-0.5">{formatPrice(rate.sell_price)}</strong>
                      </span>
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
