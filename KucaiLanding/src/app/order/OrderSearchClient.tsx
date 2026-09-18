"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, FileText, History, ExternalLink, Key } from "lucide-react";

export default function OrderSearchClient() {
  const [invoiceId, setInvoiceId] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
      setHistory(hist);
    } catch (e) {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = invoiceId.trim();
    if (!trimmed) return;
    router.push(`/order/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <button onClick={() => router.push("/")} className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-8 transition-colors text-sm font-mono tracking-wide group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> KEMBALI KE BERANDA
        </button>

        <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden glass-card">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h1 className="text-foreground text-2xl font-black uppercase tracking-wide text-center mb-2">
            Lacak Pesanan
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Masukkan nomor Invoice untuk melihat status pesanan dan data akun Anda.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="INV-aBcDeFgHiJkL..."
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all uppercase tracking-wider shadow-lg"
            >
              <Search className="w-5 h-5" /> CARI PESANAN
            </button>
          </form>

          {history.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <History className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest font-mono">Riwayat Transaksi</h3>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3 group"
                  >
                    <div 
                      onClick={() => router.push(`/order/${item.invoice}`)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-primary font-mono">{item.invoice}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
                            item.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {item.status || "Pending"}
                          </span>
                        </div>
                        <div className="text-foreground font-bold text-sm mb-0.5">{item.title}</div>
                        <div className="text-muted-foreground text-[11px]">{new Date(item.timestamp).toLocaleString("id-ID")}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors shrink-0">
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>

                    {item.status === 'paid' && item.credentials && (
                      <div className="mt-1 pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5 mb-2 text-emerald-500">
                          <Key className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Data Akun</span>
                        </div>
                        <div className="bg-card rounded-lg p-3 border border-emerald-500/10">
                          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                            {item.credentials}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
