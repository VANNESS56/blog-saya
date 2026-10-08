"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function JualBeliPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("kucaidl_chat");
    if (s) {
      try { setSessionId(JSON.parse(s).sessionId); } catch {}
    }
  }, []);

  const handleMode = async (mode: "buy" | "sell") => {
    if (sessionId) {
      const msg = mode === "buy" ? "Halo kak, saya mau beli DL/BGL \uD83D\uDED2" : "Halo kak, saya mau jual DL/BGL \uD83D\uDCB0";
      await supabase.from("chat_messages").insert({ session_id: sessionId, sender: "customer", message: msg });
      await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId);
    }
    window.dispatchEvent(new Event("open-livechat"));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0c0805] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center mb-8">
          <img src="https://i.ibb.co.com/VW6XwHZv/kucaiaccount.jpg" alt="Kucai" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-amber-500/30 shadow-2xl object-cover" />
          <h1 className="text-2xl font-black text-white mb-1">Jual Beli DL &amp; BGL</h1>
          <p className="text-white/50 text-sm">Pilih jenis transaksi yang kamu inginkan</p>
        </div>

        <button
          onClick={() => handleMode("buy")}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-[#0f172a] border-2 border-sky-500 hover:bg-sky-950 hover:border-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.25)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">??</div>
          <div className="text-left">
            <p className="text-white font-black text-lg">Beli DL / BGL</p>
            <p className="text-sky-400 text-sm mt-0.5">Beli dari kami dengan harga terbaik</p>
          </div>
        </button>

        <button
          onClick={() => handleMode("sell")}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-[#0f172a] border-2 border-amber-500 hover:bg-amber-950 hover:border-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">??</div>
          <div className="text-left">
            <p className="text-white font-black text-lg">Jual DL / BGL</p>
            <p className="text-amber-400 text-sm mt-0.5">Jual ke kami dengan harga kompetitif</p>
          </div>
        </button>

        <button onClick={() => router.back()} className="w-full text-center text-white/30 hover:text-white/60 text-sm pt-2 transition-colors">
          ? Kembali
        </button>
      </div>
    </div>
  );
}
