"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function JualBeliButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <JualBeliInner />;
}

function JualBeliInner() {
  const [showMenu, setShowMenu] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem("kucaidl_chat");
      if (s) {
        try {
          const p = JSON.parse(s);
          if (p.sessionId) setSessionId(p.sessionId);
        } catch {}
      }
    };
    sync();
    window.addEventListener("storage", sync);
    const interval = setInterval(sync, 1000);
    return () => { window.removeEventListener("storage", sync); clearInterval(interval); };
  }, []);

  const openChat = async (mode: "buy" | "sell") => {
    setShowMenu(false);
    window.dispatchEvent(new Event("open-livechat"));

    setTimeout(async () => {
      const saved = localStorage.getItem("kucaidl_chat");
      let sid = sessionId;
      if (saved) {
        try { sid = JSON.parse(saved).sessionId; } catch {}
      }
      if (!sid) return;

      const message = mode === "buy"
        ? "Halo kak, saya mau beli DL/BGL 🛒"
        : "Halo kak, saya mau jual DL/BGL 💰";

      await supabase.from("chat_messages").insert({ session_id: sid, sender: "customer", message });
      await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sid);
    }, 600);
  };

  return (
    <div className="fixed bottom-[160px] right-4 md:bottom-[155px] md:right-8 z-[51] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto relative">
      {showMenu && (
        <>
          <div className="fixed inset-0 z-[49]" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-[calc(100%+12px)] right-0 w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-[50] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-blue-800 border-b border-white/10">
              <div>
                <p className="text-white text-sm font-bold">Jual Beli DL &amp; BGL</p>
                <p className="text-sky-200 text-[10px]">Pilih transaksi kamu</p>
              </div>
              <button onClick={() => setShowMenu(false)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              <button
                onClick={() => openChat("buy")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#1e293b] border-2 border-sky-400 hover:bg-sky-950 hover:border-sky-300 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]"
              >
                <span className="text-2xl">🛒</span>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Beli DL / BGL</p>
                  <p className="text-sky-400 text-[10px]">Beli dari kami</p>
                </div>
              </button>

              <button
                onClick={() => openChat("sell")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#1e293b] border-2 border-amber-400 hover:bg-amber-950 hover:border-amber-300 transition-all shadow-[0_0_12px_rgba(251,191,36,0.15)] hover:shadow-[0_0_18px_rgba(251,191,36,0.3)]"
              >
                <span className="text-2xl">💰</span>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Jual DL / BGL</p>
                  <p className="text-amber-400 text-[10px]">Jual ke kami</p>
                </div>
              </button>
            </div>

            <div className="px-4 pb-3 text-center">
              <p className="text-white/30 text-[10px]">💬 Chat akan terbuka otomatis</p>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="h-[52px] md:h-14 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-[20px] flex items-center gap-3 shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:scale-105 transition-all duration-300 relative group overflow-hidden"
      >
        <div className="absolute inset-0 rounded-[20px] border-2 border-sky-400/40 scale-100 group-hover:scale-105 transition-transform duration-500" />
        <span className="relative z-10 text-xl">🛒</span>
        <div className="relative z-10 flex flex-col items-start text-left leading-none">
          <span className="font-black text-[13px] tracking-wide">Jual Beli</span>
          <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-wider">DL &amp; BGL</span>
        </div>
      </button>
      </div>
    </div>
  );
}

