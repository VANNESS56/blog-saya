"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ArrowLeft } from "lucide-react";

type Msg = { id: string; sender: "admin" | "customer"; message: string; created_at?: string; };

export default function JualBeliPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions]);

  const handleSelectMode = async (mode: "buy" | "sell") => {
    setShowOptions(false);
    
    const { data: sessionData } = await supabase
      .from("chat_sessions")
      .insert({ customer_name: `Customer_${Math.floor(Math.random()*10000)}` })
      .select("id").single();
      
    if (!sessionData) return;
    const sid = sessionData.id;
    setSessionId(sid);
    
    const customerText = mode === "buy" ? "Bang, saya mau beli DL \uD83D\uDE4F" : "Bang, saya mau jual DL \uD83D\uDE4F";
    
    await supabase.from("chat_messages").insert([
      { session_id: sid, sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" },
      { session_id: sid, sender: "customer", message: customerText }
    ]);
    
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "customer", message: customerText }]);

    const adminReply = mode === "buy"
      ? "Rate beli ke KucaiDL \uD83E\uDD17\nDL : 785\nBGL : 78.500\n\nGopay  = 081367232472 an Desi\nDana    = 081367232472 an Desi\nBank  =  Khusus Bank TF ke QRIS\n\n\u203C\uFE0FPayment transfer ke ewallet di atas ya thankyou \uD83E\uDD70\n\nNOTE \u2757\uFE0F : klo udah tf kirim nama world, growid \n\n\uD83D\uDC78 Admin Desi KUCAIDL"
      : "Silakan kirimkan screenshot spek akun atau jumlah DL/BGL yang mau dijual ya, admin akan segera merespon! \uD83D\uDC47";
      
    const { data: replyMsg } = await supabase.from("chat_messages")
      .insert({ session_id: sid, sender: "admin", message: adminReply })
      .select("*").single();
      
    if (replyMsg) {
      setMessages(prev => [...prev, replyMsg]);
    }
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

  const renderMessageText = (msg: Msg) => {
    if (msg.sender === "admin" && msg.message.includes("Rate beli ke KucaiDL")) {
      return (
        <div className="space-y-3">
          <p>Rate beli ke KucaiDL \uD83E\uDD17<br/>DL : 785<br/>BGL : 78.500</p>
          <div className="bg-[#0b101a] border border-white/5 rounded-xl p-3 space-y-2 shadow-inner">
            <p className="text-white/70 text-xs font-medium mb-2">Silakan transfer ke sini ya:</p>
            {["Gopay", "Dana"].map(provider => (
              <div key={provider} className="flex items-center justify-between gap-3 bg-[#131b2c] p-2.5 rounded-lg border border-white/5">
                 <div className="text-xs">
                   <span className="font-bold text-white">{provider}</span><br/>
                   <span className="text-white/60">081367232472 a.n. Desi</span>
                 </div>
                 <button onClick={() => navigator.clipboard.writeText("081367232472")} className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/20 text-sky-400 rounded-lg text-xs font-bold transition-colors active:scale-95">Salin</button>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 bg-[#131b2c] p-2.5 rounded-lg border border-white/5">
               <div className="text-xs">
                 <span className="font-bold text-white">Bank</span><br/>
                 <span className="text-white/60">Khusus Bank TF ke QRIS</span>
               </div>
            </div>
          </div>
          <p>\u203C\uFE0FPayment transfer ke ewallet di atas ya thankyou \uD83E\uDD70<br/><br/>NOTE \u2757\uFE0F : klo udah tf kirim nama world, growid <br/><br/>\uD83D\uDC78 Admin Desi KUCAIDL</p>
        </div>
      );
    }
    return msg.message;
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex justify-center">
      <div className="w-full max-w-2xl bg-[#0a0f1c] flex flex-col min-h-screen relative shadow-2xl md:border-x border-white/5">
        
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-[#0d1424]/95 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => router.push("/")} className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-lg">
            <img src="https://i.ibb.co.com/VW6XwHZv/kucaiaccount.jpg" className="w-full h-full object-cover" alt="Kucai" />
          </div>
          <div>
            <h1 className="text-white font-bold text-[15px] leading-tight">Kucai DL</h1>
            <p className="text-emerald-400 text-xs flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Online
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="text-center pb-2">
            <span className="bg-white/5 text-white/40 text-[10px] font-medium px-3 py-1 rounded-full">Hari ini</span>
          </div>

          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
              <div className={`whitespace-pre-wrap max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-[20px] text-sm leading-relaxed shadow-sm ${
                msg.sender === "customer" 
                ? "bg-sky-600 text-white rounded-br-sm" 
                : "bg-[#162032] text-gray-100 rounded-bl-sm border border-white/5"
              }`}>
                {renderMessageText(msg)}
              </div>
            </div>
          ))}

          {/* Inline Buttons moved to bottom keyboard */}
          
          <div ref={bottomRef} />
        </div>

        {/* Input Area / Keyboard Options */}
        <div className="p-4 bg-[#0d1424] border-t border-white/5 sticky bottom-0 z-10">
          {showOptions ? (
            <div className="flex gap-2 w-full max-w-4xl mx-auto">
               <button onClick={() => handleSelectMode("buy")} className="flex-1 py-4 bg-[#1e2b40] hover:bg-[#25354e] border border-white/5 rounded-2xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                  🛒 Beli DL/BGL
               </button>
               <button onClick={() => handleSelectMode("sell")} className="flex-1 py-4 bg-[#1e2b40] hover:bg-[#25354e] border border-white/5 rounded-2xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                  💰 Jual DL/BGL
               </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto relative">
              <input
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                disabled={!sessionId}
                placeholder="Ketik pesan..."
                className="flex-1 bg-[#162032] border border-white/10 rounded-[20px] px-5 py-3.5 text-white text-sm placeholder-gray-500 outline-none focus:border-sky-500 focus:bg-[#1a263a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || sending || !sessionId}
                className="w-12 h-12 shrink-0 bg-sky-600 hover:bg-sky-500 disabled:bg-[#1e293b] disabled:text-gray-500 rounded-[20px] flex items-center justify-center text-white transition-all shadow-lg disabled:shadow-none mb-[1px]"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}
