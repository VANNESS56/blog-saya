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

  const [showForm, setShowForm] = useState(false);

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
      setTimeout(() => setShowForm(false), 2000);
    }
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <section id="reputation" className="pb-16 pt-4 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="glass-card rounded-[24px] p-6 md:p-8 border border-white/5 bg-[#0a0f1c] flex flex-col lg:flex-row gap-10 lg:items-center">
          
          {/* Left Side: Info */}
          <div className="flex-none lg:w-[35%]">
            <div className="text-emerald-400 font-bold text-[13px] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live reputation
            </div>
            <h2 className="text-white font-black text-[clamp(28px,3vw,36px)] tracking-tight mb-2 leading-tight">
              {(reputations.length * 153) + 95000} Total +Rep
            </h2>
            <p className="text-gray-400 text-[14px] mb-6">Reputasi terbaru dari transaksi KucaiDL.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-[13px] font-bold rounded-lg transition-colors shadow-lg active:scale-95">
                Beri +Rep
              </button>
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[13px] font-bold rounded-lg border border-white/10 transition-colors active:scale-95">
                Lihat semua
              </button>
            </div>
          </div>

          {/* Right Side: Grid of Pills */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2.5">
              {reputations.map(rep => (
                <div key={rep.id} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-default group">
                  <span className="text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">+rep kucaidl</span>
                  <span className="text-gray-300 max-w-[120px] truncate">{rep.message}</span>
                  <span className="text-white font-bold max-w-[80px] truncate">{rep.buyer_name}</span>
                </div>
              ))}
              {reputations.length === 0 && (
                <div className="text-gray-500 text-sm">Belum ada reputasi yang ditampilkan.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white">Kirim +Rep</h3>
                <p className="text-[11px] text-gray-500">Beri feedback pengalamanmu</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1 block mb-1.5">Nama</label>
                <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Misal: kucaidl"
                  className="w-full bg-[#162032] border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600" maxLength={30} required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1 block mb-1.5">Pesan</label>
                <div className="flex items-start gap-3 bg-[#162032] border border-white/10 rounded-xl p-3 focus-within:border-amber-500/50 transition-colors">
                  <span className="text-amber-400 font-black text-[15px] pt-0.5">+Rep</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Transaksi mantap!"
                    className="flex-1 bg-transparent text-white text-[14px] focus:outline-none resize-none min-h-[60px] placeholder:text-gray-600" maxLength={150} required />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] disabled:opacity-50 text-[13px] mt-2">
                <Send className="w-4 h-4" /> KIRIM SEKARANG
              </button>
              
              {toast && (
                <div className={`p-3 rounded-xl text-[13px] font-medium border text-center ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {toast.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
