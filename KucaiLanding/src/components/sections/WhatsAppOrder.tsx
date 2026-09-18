"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/settings/SettingsContext";

type TxType = "beli" | "jual";

export function WhatsAppOrder() {
  const { t } = useLanguage();
  const { waKucaidl } = useSettings();
  
  const [txType, setTxType] = useState<TxType>("beli");
  const [bglQty, setBglQty] = useState(0);
  const [dlQty, setDlQty] = useState(0);

  // Prices State
  const [bglPrice, setBglPrice] = useState(0);
  const [dlPrice, setDlPrice] = useState(0);

  useEffect(() => {
    async function fetchPrices() {
      const { data: pData } = await supabase.from("products").select("*");
      const { data: sData } = await supabase.from("settings").select("*");
      
      let buyBgl = 0;
      let buyDl = 0;
      let sellBgl = 0;
      let sellDl = 0;

      if (pData) {
        buyBgl = pData.find((p: any) => p.type === "bgl")?.price || 0;
        buyDl = pData.find((p: any) => p.type === "dl")?.price || 0;
      }
      if (sData) {
        const configRow = sData.find((s: any) => s.key === "config");
        if (configRow?.value) {
          try { 
            sellBgl = JSON.parse(configRow.value).sellRate || 0; 
            sellDl = Math.floor(sellBgl / 100);
          } catch {}
        }
      }

      if (txType === "beli") {
        setBglPrice(buyBgl);
        setDlPrice(buyDl);
      } else {
        setBglPrice(sellBgl);
        setDlPrice(sellDl);
      }
    }
    fetchPrices();
  }, [txType]);

  const subtotal = (bglQty * bglPrice) + (dlQty * dlPrice);
  const hasItems = bglQty > 0 || dlQty > 0;

  const handleClearCart = () => {
    setBglQty(0);
    setDlQty(0);
  };

  const handleCheckout = () => {
    if (!hasItems) return;

    const phone = waKucaidl;
    let text = `Halo Admin KUCAIDL, saya ingin melakukan transaksi:\n\n`;
    text += `Tipe: ${txType === "beli" ? "BELI" : "JUAL"}\n\n`;
    text += `Produk:\n`;
    if (bglQty > 0) text += `- ${bglQty} Blue Gem Lock (BGL) × Rp ${bglPrice.toLocaleString("id-ID")} = Rp ${(bglQty * bglPrice).toLocaleString("id-ID")}\n`;
    if (dlQty > 0) text += `- ${dlQty} Diamond Lock (DL) × Rp ${dlPrice.toLocaleString("id-ID")} = Rp ${(dlQty * dlPrice).toLocaleString("id-ID")}\n`;
    text += `\nTotal: Rp ${subtotal.toLocaleString("id-ID")}\n`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  return (
    <section id="whatsapp-order" className="py-20 px-4 md:px-6 relative section-glow">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[800px]">
          <div className="text-left mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black tracking-[0.16em] text-emerald-400/70 uppercase">{t("wa.easy")}</span>
            </div>
            <h2 className="text-[clamp(28px,4vw,42px)] font-black text-white tracking-tight">{t("wa.manual")}</h2>
            <p className="text-[13px] text-gray-500 mt-3 max-w-lg leading-relaxed">
              Pilih produk, tambahkan ke keranjang, lalu checkout langsung via WhatsApp.
            </p>
          </div>

          {/* MAIN CHECKOUT CARD */}
          <div suppressHydrationWarning className="glass-card rounded-[24px] overflow-hidden border border-amber-500/30 bg-[#070707] shadow-2xl relative">
          
          {/* Header Store Profile */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-black overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Image src="/icon.png" alt="KUCAIDL" width={48} height={48} className="object-contain p-1" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-white leading-tight">{t("wa.store")}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[11px] font-bold text-emerald-400 tracking-wider">{t("wa.online")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Type Toggle Beli / Jual - Pill Switch */}
          <div className="px-6 py-5 border-b border-white/5 bg-black/40">
            <div className="relative flex rounded-full border border-white/10 bg-[#0a0a18] p-1 overflow-hidden">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out ${
                  txType === "beli"
                    ? "left-1 bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : "left-[calc(50%+3px)] bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                }`}
              />
              <button suppressHydrationWarning
                onClick={() => setTxType("beli")}
                className={`relative z-10 flex-1 py-3 rounded-full font-bold text-[15px] tracking-wide transition-colors duration-300 ${
                  txType === "beli" ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Beli
              </button>
              <button suppressHydrationWarning
                onClick={() => setTxType("jual")}
                className={`relative z-10 flex-1 py-3 rounded-full font-bold text-[15px] tracking-wide transition-colors duration-300 ${
                  txType === "jual" ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Jual
              </button>
            </div>
          </div>

          {/* PRODUCT CARDS */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* BGL Card */}
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1025] to-[#080a18] p-5 flex flex-col items-center text-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative w-16 h-16 rounded-xl bg-[#111535]/80 border border-white/10 flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
                  <Image src="/bgl.png" alt="BGL" width={36} height={36} className="drop-shadow-[0_2px_8px_rgba(100,180,255,0.5)]" />
                </div>
                <h5 className="text-[13px] font-black text-white uppercase tracking-wider mb-1">Blue Gem Lock</h5>
                <span className="text-[15px] font-bold text-amber-400 mb-4">Rp {bglPrice.toLocaleString("id-ID")}</span>
                
                {bglQty === 0 ? (
                  <button suppressHydrationWarning
                    onClick={() => setBglQty(1)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[13px] hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.4)] active:scale-[0.97]"
                  >
                    + Tambah
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between bg-[#0a0a18] border border-white/10 rounded-xl p-1">
                    <button suppressHydrationWarning onClick={() => setBglQty(Math.max(0, bglQty - 1))} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Minus className="w-4 h-4" /></button>
                    <input suppressHydrationWarning type="number" readOnly value={bglQty} className="w-12 bg-transparent text-center text-white font-bold text-[16px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button suppressHydrationWarning onClick={() => setBglQty(bglQty + 1)} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                )}
              </div>

              {/* DL Card */}
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1025] to-[#080a18] p-5 flex flex-col items-center text-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative w-16 h-16 rounded-xl bg-[#111535]/80 border border-white/10 flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
                  <Image src="/dl.png" alt="DL" width={32} height={32} className="drop-shadow-[0_2px_8px_rgba(100,220,255,0.5)]" />
                </div>
                <h5 className="text-[13px] font-black text-white uppercase tracking-wider mb-1">Diamond Lock</h5>
                <span className="text-[15px] font-bold text-amber-400 mb-4">Rp {dlPrice.toLocaleString("id-ID")}</span>

                {txType === "jual" && (
                  <span className="text-[11px] text-red-400/80 font-bold mb-2">Min. 50 DL</span>
                )}

                {dlQty === 0 ? (
                  <button suppressHydrationWarning
                    onClick={() => setDlQty(txType === "jual" ? 50 : 1)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[13px] hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.4)] active:scale-[0.97]"
                  >
                    + Tambah
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between bg-[#0a0a18] border border-white/10 rounded-xl p-1">
                    <button suppressHydrationWarning onClick={() => setDlQty(Math.max(txType === "jual" ? 50 : 0, dlQty - 1))} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Minus className="w-4 h-4" /></button>
                    <input suppressHydrationWarning type="number" readOnly value={dlQty} className="w-12 bg-transparent text-center text-white font-bold text-[16px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button suppressHydrationWarning onClick={() => setDlQty(dlQty + 1)} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KERANJANG (CART) */}
          <div className="mx-6 mb-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0c0e1a] to-[#080a14] overflow-hidden">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-white" />
                <h4 className="text-[16px] font-black text-white">Keranjang</h4>
              </div>
              {hasItems && (
                <button suppressHydrationWarning
                  onClick={handleClearCart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[12px] font-bold hover:bg-amber-500/25 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Kosong
                </button>
              )}
            </div>

            {/* Cart Items */}
            <div className="px-5 py-4 space-y-3">
              {!hasItems ? (
                <div className="text-center py-6">
                  <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-[13px] text-gray-500">Keranjang kosong. Tambahkan produk di atas.</p>
                </div>
              ) : (
                <>
                  {bglQty > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-black/30">
                      <div>
                        <strong className="text-[14px] text-white block">BLUE GEM LOCK</strong>
                        <span className="text-[12px] text-gray-400">Rp {bglPrice.toLocaleString("id-ID")} / item</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-[#0a0a18] border border-white/10 rounded-lg p-0.5">
                          <button suppressHydrationWarning onClick={() => setBglQty(Math.max(0, bglQty - 1))} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-8 text-center text-white font-bold text-[14px]">{bglQty}</span>
                          <button suppressHydrationWarning onClick={() => setBglQty(bglQty + 1)} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="text-[14px] font-bold text-amber-400 min-w-[90px] text-right">Rp {(bglQty * bglPrice).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  )}

                  {dlQty > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-black/30">
                      <div>
                        <strong className="text-[14px] text-white block">DIAMOND LOCK</strong>
                        <span className="text-[12px] text-gray-400">Rp {dlPrice.toLocaleString("id-ID")} / item</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-[#0a0a18] border border-white/10 rounded-lg p-0.5">
                          <button suppressHydrationWarning onClick={() => setDlQty(Math.max(txType === "jual" ? 50 : 0, dlQty - 1))} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-8 text-center text-white font-bold text-[14px]">{dlQty}</span>
                          <button suppressHydrationWarning onClick={() => setDlQty(dlQty + 1)} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="text-[14px] font-bold text-amber-400 min-w-[90px] text-right">Rp {(dlQty * dlPrice).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Total */}
            {hasItems && (
              <div className="px-5 py-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-black text-white">Total</span>
                  <span className="text-[18px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-lg">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            {hasItems && (
              <div className="px-5 pb-5">
                <button suppressHydrationWarning
                  onClick={handleCheckout}
                  className="w-full h-[54px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-[15px] rounded-2xl transition-all shadow-[0_8px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.35)] hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout via WA
                </button>
              </div>
            )}
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}
