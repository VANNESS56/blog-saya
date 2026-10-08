"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ImagePlus, X, ArrowLeft } from "lucide-react";

type Mode = null | "buy" | "sell";
type Step = "select" | "name" | "chat";

interface Msg { id: string; sender: string; message: string; image_url?: string; created_at: string; }

export default function JualBeliPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState<Step>("select");
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSelectMode = (m: Mode) => {
    setMode(m);
    setStep("name");
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ customer_name: name.trim() })
      .select("id")
      .single();
    if (error || !data) return;
    const sid = data.id;
    setSessionId(sid);
    const greeting = mode === "buy"
      ? "Halo! ?? Kamu mau beli DL/BGL ya? Silakan ceritakan kebutuhanmu, min akan bantu segera!"
      : "Halo! ?? Kamu mau jual DL/BGL ya? Silakan kirim detail akun atau itemmu, min akan cek secepatnya!";
    await supabase.from("chat_messages").insert({ session_id: sid, sender: "admin", message: greeting });
    const { data: msgs } = await supabase.from("chat_messages").select("*").eq("session_id", sid).order("created_at");
    setMessages(msgs || []);
    setStep("chat");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || sending) return;
    setSending(true);
    const { data: msg } = await supabase.from("chat_messages")
      .insert({ session_id: sessionId, sender: "customer", message: input.trim() })
      .select("*").single();
    if (msg) setMessages(prev => [...prev, msg]);
    await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId);
    setInput("");
    setSending(false);
  };

  if (step === "chat" && sessionId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col max-w-lg mx-auto">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-[#0f0f1a]">
          <button onClick={() => router.back()} className="text-white/50 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-600/20"><img src="https://i.ibb.co.com/VW6XwHZv/kucaiaccount.jpg" className="w-full h-full object-cover" /></div>
          <div>
            <p className="text-white font-bold text-sm">Kucai Account</p>
            <p className="text-emerald-400 text-[10px]">? Online</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${mode === "buy" ? "bg-sky-500/20 text-sky-400" : "bg-amber-500/20 text-amber-400"}`}>
              {mode === "buy" ? "?? BELI" : "?? JUAL"}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === "customer" ? "bg-sky-600 text-white rounded-br-md" : "bg-[#1e1e2e] text-gray-200 rounded-bl-md border border-white/5"}`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-3 flex items-center gap-2 border-t border-white/10 bg-[#0f0f1a]">
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-sky-500 transition-colors"
          />
          <button type="submit" disabled={!input.trim() || sending}
            className="w-10 h-10 shrink-0 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-700 rounded-xl flex items-center justify-center text-white transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <button onClick={() => setStep("select")} className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${mode === "buy" ? "bg-sky-500/20" : "bg-amber-500/20"}`}>{mode === "buy" ? "??" : "??"}</div>
            <h1 className="text-xl font-black text-white">{mode === "buy" ? "Beli DL / BGL" : "Jual DL / BGL"}</h1>
            <p className="text-white/50 text-sm mt-1">Masukkan namamu untuk melanjutkan</p>
          </div>
          <form onSubmit={handleNameSubmit} className="space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu..."
              autoFocus maxLength={50}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-sky-500 transition-colors" />
            <button type="submit" disabled={!name.trim()}
              className={`w-full ${mode === "buy" ? "bg-sky-600 hover:bg-sky-700" : "bg-amber-600 hover:bg-amber-700"} disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-sm`}>
              Mulai Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-end px-4 pb-6">
        <div className="bg-[#1c1c28] text-white text-sm px-4 py-3 rounded-2xl rounded-bl-sm max-w-[80%] border border-white/5 shadow-lg">
          Halo! ?? Selamat datang di <strong>Kucai Account</strong>. Mau <strong>jual</strong> atau <strong>beli</strong>?
        </div>
      </div>
      <div className="px-4 pb-8 flex gap-3 justify-center">
        <button onClick={() => handleSelectMode("buy")}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1c2a3a] border-2 border-sky-500 text-white font-bold text-sm hover:bg-sky-900/50 hover:border-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-95">
          ??? Beli DL/BGL
        </button>
        <button onClick={() => handleSelectMode("sell")}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2a1c00] border-2 border-amber-500 text-white font-bold text-sm hover:bg-amber-900/50 hover:border-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95">
          ?? Jual DL/BGL
        </button>
      </div>
    </div>
  );
}
