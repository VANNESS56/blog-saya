"use client";

import { useEffect, useState, useRef } from "react";
import { Box, ChevronLeft, ChevronRight, CheckCircle2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export function OtherProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.data) setProducts(json.data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleOrder = (product: any) => {
    if (product.stock_available <= 0) return;
    router.push(`/product/${product.id}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="products" className="py-20 px-4 md:px-6 relative bg-[#0a0a0a] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase font-mono mb-2">KATALOG</p>
            <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-wide">
              SEMUA PRODUK
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {products.length} produk tersedia — Sistem pengiriman otomatis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-amber-500/20 bg-[#111] flex items-center justify-center text-gray-500 hover:text-amber-400 hover:border-amber-500/50 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-amber-500/20 bg-[#111] flex items-center justify-center text-gray-500 hover:text-amber-400 hover:border-amber-500/50 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-600 text-sm font-mono">
            Belum ada produk tersedia.
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="overflow-x-auto grid grid-rows-2 grid-flow-col auto-cols-[45%] sm:auto-cols-[35%] md:auto-cols-[28%] lg:auto-cols-[23%] gap-3 md:gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((product) => {
              const soldOut = product.stock_available <= 0;
              return (
                <div 
                  key={product.id}
                  onClick={() => handleOrder(product)}
                  className={`snap-start bg-[#111] border rounded-2xl transition-all duration-300 group flex flex-col relative overflow-hidden ${
                    soldOut 
                      ? "border-gray-800/50 opacity-60 cursor-not-allowed" 
                      : "border-gray-800 hover:border-amber-500/40 cursor-pointer shadow-lg hover:shadow-amber-500/5 hover:translate-y-[-4px] active:scale-[0.97]"
                  }`}
                >
                  {/* Top border glow */}
                  {!soldOut && (
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent z-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  )}

                  {/* Product Image */}
                  <div className={`w-full aspect-[4/3] bg-[#0a0a0a] relative overflow-hidden shrink-0 ${soldOut ? "grayscale" : ""}`}>
                    {product.icon && product.icon.startsWith("http") ? (
                      <img 
                        src={product.icon} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#050505]">
                        <Box className="w-10 h-10 text-amber-500/20" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />

                    {soldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                        <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.15em] rounded-md font-mono transform -rotate-12">
                          STOK HABIS
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 z-10">
                      <span className="px-2 py-1 md:px-3 md:py-1.5 bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 text-[8px] md:text-[10px] font-bold tracking-[0.15em] uppercase font-mono rounded-lg shadow-lg">
                        {product.category}
                      </span>
                    </div>

                    {/* Stock Badge */}
                    {!soldOut && (
                      <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 z-10">
                        <span className="px-2 py-1 bg-emerald-500/15 backdrop-blur-md border border-emerald-500/20 text-emerald-400 text-[8px] md:text-[10px] font-bold font-mono rounded-lg">
                          {product.stock_available} stok
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-3 md:p-4 flex flex-col flex-grow">
                    <h3 className="text-white text-[11px] md:text-[14px] font-bold uppercase tracking-wider leading-tight line-clamp-2 mb-1">
                      {product.title}
                    </h3>

                    <p className="text-gray-500 text-[9px] md:text-[11px] leading-relaxed mb-2 flex-grow line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price + Buy */}
                    <div className="mt-auto pt-2 border-t border-gray-800/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`text-[13px] md:text-[18px] font-black font-mono tracking-tight ${soldOut ? "text-gray-600" : "text-amber-400"}`}>
                          Rp {product.price.toLocaleString("id-ID")}
                        </div>
                        {!soldOut ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[8px] md:text-[10px] font-bold uppercase font-mono">
                              READY
                            </span>
                          </div>
                        ) : (
                          <span className="text-red-400 text-[8px] font-bold uppercase font-mono">SOLD OUT</span>
                        )}
                      </div>

                      {!soldOut ? (
                        <button className="w-full flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold hover:bg-amber-500 hover:text-white active:scale-[0.97] transition-all duration-300">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="text-[11px] md:text-[12px]">Beli</span>
                        </button>
                      ) : (
                        <button disabled className="w-full flex items-center justify-center py-2 rounded-xl bg-gray-800/30 border border-gray-700/50 text-gray-500 font-bold cursor-not-allowed">
                          <span className="text-[11px]">Habis</span>
                        </button>
                      )}
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
