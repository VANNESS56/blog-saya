"use client";

import { useState, useEffect } from "react";
import { supabase, type Reputation } from "@/lib/supabase";
import { Send, Activity, MessageSquare } from "lucide-react";

export function LiveReputation() {
  const [reputations, setReputations] = useState<Reputation[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchReputations = async () => {
    const { data } = await supabase.from("reputations").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(15);
    if (data) setReputations(data);
  };

  useEffect(() => {
    fetchReputations();
    const channel = supabase.channel("reputations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reputations" }, fetchReputations)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeName = buyerName.trim().replace(/<[^>]*>/g, "").slice(0, 30);
    const safeMessage = message.trim().replace(/<[^>]*>/g, "").slice(0, 150);
    if (!safeName || !safeMessage) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("reputations").insert({ buyer_name: safeName, message: safeMessage, status: "pending" });
    setIsSubmitting(false);
    if (error) {
      setToast({ message: "Gagal mengirim.", type: "error" });
    } else {
      setToast({ message: "+Rep berhasil dikirim! Menunggu persetujuan admin.", type: "success" });
      setBuyerName(""); setMessage("");
    }
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <section id="reputation" className="py-16 px-4 md:px-6 section-glow">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
            <span className="text-[10px] font-black tracking-[0.16em] text-amber-400/70 uppercase">Live Reputation</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-black text-white tracking-tight">FEEDBACK PEMBELI</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-5 items-start">
          {/* Form */}
          <div className="glass-card rounded-[20px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white">Kirim +Rep</h3>
                <p className="text-[11px] text-gray-600">Beri feedback pengalamanmu</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] pl-1 block mb-1.5">Nama</label>
                <input suppressHydrationWarning type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Misal: kucaidl"
                  className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-gray-700" maxLength={30} required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] pl-1 block mb-1.5">Pesan</label>
                <div className="flex items-start gap-3 bg-black/40 border border-white/[0.06] rounded-xl p-3 focus-within:border-amber-500/30 transition-colors">
                  <span className="text-amber-400 font-black text-[16px] pt-0.5">+Rep</span>
                  <textarea suppressHydrationWarning value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Transaksi mantap!"
                    className="flex-1 bg-transparent text-white text-[14px] focus:outline-none resize-none min-h-[60px] placeholder:text-gray-700" maxLength={150} required />
                </div>
              </div>
              <button suppressHydrationWarning type="submit" disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-amber-500 to-amber-600 text-white font-black py-3.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.3)] hover:translate-y-[-1px] disabled:opacity-50 uppercase tracking-[0.1em] text-[12px]">
                <Send className="w-4 h-4" /> Kirim
              </button>
              {toast && (
                <div className={`p-3 rounded-xl text-[13px] font-medium border ${toast.type === 'success' ? 'bg-emerald-500/8 border-emerald-500/15 text-emerald-400' : 'bg-red-500/8 border-red-500/15 text-red-400'}`}>
                  {toast.message}
                </div>
              )}
            </form>
          </div>

          {/* Feed */}
          <div className="glass-card rounded-[20px] p-6 h-[480px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Recent +Rep
              </h3>
              <span className="text-[11px] text-gray-600"><strong className="text-white text-[16px]">{reputations.length}</strong> rep</span>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3">
              {reputations.map((rep) => (
                <div key={rep.id} className="bg-black/30 border-l-[3px] border-l-amber-500 border border-white/[0.04] rounded-xl p-4 hover:bg-black/40 transition-colors">
                  <p className="text-[14px] font-bold text-white leading-relaxed">
                    <span className="text-amber-400 mr-1">+Rep</span> {rep.message}
                  </p>
                  <div className="flex justify-between items-center text-[11px] text-gray-600 mt-2">
                    <span className="text-gray-400 font-bold">{rep.buyer_name}</span>
                    <span>{new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }).format(new Date(rep.created_at))}</span>
                  </div>
                </div>
              ))}
              {reputations.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-700 text-sm border border-dashed border-gray-800 rounded-xl p-6 text-center">
                  Belum ada reputasi. Jadilah yang pertama!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
