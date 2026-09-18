"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Box, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Zap, Clock, Package, Tag } from "lucide-react";
import Swal from "sweetalert2";

export default function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [waNumber, setWaNumber] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.data) {
        const found = json.data.find((p: any) => String(p.id) === String(productId));
        if (found) {
          setProduct(found);
          setStockCount(found.stock_available || 0);
        }
      }
      setLoading(false);
    }
    if (productId) fetchProduct();
  }, [productId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber.trim()) {
      Swal.fire("Error", "Nomor WhatsApp wajib diisi!", "error");
      return;
    }
    
    const cleanedWa = waNumber.replace(/[^0-9]/g, "");
    if (cleanedWa.length < 9) {
      Swal.fire("Error", "Nomor WhatsApp tidak valid!", "error");
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, waNumber: cleanedWa })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat tagihan");
      }

      try {
        const history = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
        if (!history.find((h: any) => h.invoice === data.invoice_no)) {
          history.unshift({
            invoice: data.invoice_no,
            title: product.title,
            price: product.price,
            timestamp: Date.now(),
            status: "pending",
            credentials: null
          });
          localStorage.setItem("kucaidl_history", JSON.stringify(history.slice(0, 20)));
        }
      } catch (e) {}

      router.push(`/order/${data.invoice_no}`);
    } catch (err: any) {
      Swal.fire("Gagal", err.message, "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-6">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h1>
        <button onClick={() => router.push("/")} className="text-primary hover:underline flex items-center gap-2 mt-4">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Back button */}
        <button onClick={() => router.push("/#produk")} className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-10 transition-colors text-sm font-mono tracking-wide group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> KEMBALI KE KATALOG
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT: Product Info (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Product Image & Title Card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden glass-card">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <div className="flex items-start gap-5 mb-6">
                {/* Product Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-background border border-border rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  {product.icon && product.icon.startsWith("http") ? (
                    <img src={product.icon} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="w-10 h-10 text-primary/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase font-mono rounded-md mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-foreground text-2xl md:text-3xl font-black uppercase tracking-wide leading-tight">
                    {product.title}
                  </h1>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-border pt-6">
                <h3 className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase mb-3 font-mono">DESKRIPSI PRODUK</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {product.description || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            {/* Features / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 glass-card">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-bold mb-0.5">Garansi Aman</p>
                  <p className="text-muted-foreground text-[10px] leading-snug">100% produk asli & bergaransi</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 glass-card">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-bold mb-0.5">Pengiriman Instan</p>
                  <p className="text-muted-foreground text-[10px] leading-snug">Otomatis setelah pembayaran</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 glass-card">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-bold mb-0.5">24/7 Support</p>
                  <p className="text-muted-foreground text-[10px] leading-snug">Bantuan via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Checkout Panel (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-8 glass-card">
              {/* Panel Header */}
              <div className="bg-primary/5 px-6 py-5 border-b border-border">
                <h3 className="text-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Checkout
                </h3>
              </div>

              <div className="p-6 space-y-5">
                {/* Price Summary */}
                <div className="bg-background border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground text-xs font-mono flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Harga Produk
                    </span>
                  </div>
                  <div className="text-primary text-2xl md:text-3xl font-black font-mono tracking-tight">
                    Rp {product.price.toLocaleString("id-ID")}
                  </div>
                </div>

                {stockCount > 0 ? (
                  <>
                    {/* Checkout Form */}
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div>
                        <label className="block text-muted-foreground text-xs font-bold mb-2 uppercase tracking-wider">
                          Nomor WhatsApp <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-muted-foreground font-mono text-sm">+62</span>
                          </div>
                          <input
                            type="tel"
                            placeholder="81234567890"
                            value={waNumber}
                            onChange={(e) => setWaNumber(e.target.value)}
                            className="w-full pl-14 pr-4 py-3.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                          />
                        </div>
                        <p className="text-muted-foreground text-[10px] mt-2 leading-snug">
                          Invoice & data akun akan dikirim melalui nomor ini.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isCheckingOut}
                        className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg"
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" /> BAYAR SEKARANG
                          </>
                        )}
                      </button>
                    </form>

                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground text-[10px] text-center leading-relaxed font-mono">
                        Pembayaran via QRIS • Powered by Pakasir
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 text-center">
                    <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
                    <h3 className="text-destructive font-bold text-sm uppercase tracking-wider mb-1">STOK HABIS</h3>
                    <p className="text-muted-foreground text-xs">Produk ini sedang tidak tersedia. Silakan cek kembali nanti atau hubungi admin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
