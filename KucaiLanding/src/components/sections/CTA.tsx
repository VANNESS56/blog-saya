"use client";

import { Search, FileText } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CTA() {
  const [invoiceId, setInvoiceId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = invoiceId.trim();
    if (!trimmed) return;
    router.push(`/order/${trimmed}`);
  };

  return (
    <section id="contact" className="py-16 px-4 md:px-6">
      <div className="max-w-[800px] mx-auto">
        <div className="relative overflow-hidden rounded-[24px] glass-card p-10 md:p-16 text-center border border-amber-500/10">
          {/* Decorative glows */}
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] bg-amber-600/[0.04] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <FileText className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-[clamp(24px,4vw,36px)] font-black text-white tracking-tight leading-tight mb-4 uppercase">
              Lacak Pesanan Anda
            </h2>

            <p className="text-[13px] md:text-[14px] text-gray-400 leading-relaxed mb-8 max-w-md">
              Masukkan nomor Invoice (format: INV-XXXX) untuk melihat status pesanan dan mendapatkan data akun Anda.
            </p>

            <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="INV-1789..."
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-gray-700 font-mono text-center sm:text-left"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-[58px] px-8 bg-gradient-to-b from-amber-500 to-amber-600 text-white font-black rounded-xl shadow-[0_8px_24px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(245,158,11,0.35)] transition-all text-[14px] uppercase tracking-[0.1em] shrink-0"
              >
                Cek Invoice
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
