"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ArrowLeft } from "lucide-react";

type Msg = { id: string; sender: "admin" | "customer"; message: string; created_at?: string; image_url?: string; };

export default function JualBeliPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [jualBeliReply, setJualBeliReply] = useState<string | null>(null);
  const [isFreeChat, setIsFreeChat] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [worldName, setWorldName] = useState("");
  const [growId, setGrowId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "jual_beli_reply").single().then(({ data }) => {
      if (data) setJualBeliReply(data.value);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions]);

  // On Mount: Load saved session
  useEffect(() => {
    const saved = localStorage.getItem("kucaidl_session");
    if (saved) {
      setSessionId(saved);
      setShowOptions(localStorage.getItem("kucaidl_options") === "true");
      setIsFreeChat(localStorage.getItem("kucaidl_free") === "true");
      supabase.from("chat_messages").select("*").eq("session_id", saved).order("created_at", { ascending: true })
        .then(({ data }) => {
           if (data && data.length > 0) {
             setMessages([{ id: "init", sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" }, ...data]);
           }
        });
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("kucaidl_session", sessionId);
      localStorage.setItem("kucaidl_options", showOptions ? "true" : "false");
      localStorage.setItem("kucaidl_free", isFreeChat ? "true" : "false");
    } else {
      localStorage.removeItem("kucaidl_session");
      localStorage.removeItem("kucaidl_options");
      localStorage.removeItem("kucaidl_free");
    }
  }, [sessionId, showOptions, isFreeChat]);

  // Subscribe to messages
  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase.channel(`kucaidl-chat-${sessionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${sessionId}` }, (payload: any) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Msg];
        });
      }).subscribe();
      
    return () => { supabase.removeChannel(ch); }
  }, [sessionId]);

  const handleSelectMode = async (mode: "buy" | "sell") => {
    setShowOptions(false);

    const { data: sessionData } = await supabase
      .from("chat_sessions")
      .insert({ customer_name: `Customer_${Math.floor(Math.random() * 10000)}` })
      .select("id").single();

    if (!sessionData) return;
    const sid = sessionData.id;
    setSessionId(sid);

    const customerText = mode === "buy" ? "Bang, saya mau beli DL 🙏" : "Bang, saya mau jual DL 🙏";

    await supabase.from("chat_messages").insert([
      { session_id: sid, sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" },
      { session_id: sid, sender: "customer", message: customerText }
    ]);

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "customer", message: customerText }]);

    const adminReply = mode === "buy"
      ? (jualBeliReply || "Rate beli ke KucaiDL 🤗\nDL : 785\nBGL : 78.500\n\nGopay = 081367232472 an Desi\nDana = 081367232472 an Desi\nBank = Khusus Bank TF ke QRIS\n\n‼️Payment transfer ke ewallet di atas ya thankyou 🥰\n\nNOTE ❗️ : klo udah tf kirim nama world, growid \n\n👸 Admin Desi KUCAIDL")
      : "Silakan kirimkan screenshot spek akun atau jumlah DL/BGL yang mau dijual ya, admin akan segera merespon! 👇";

    const { data: replyMsg } = await supabase.from("chat_messages")
      .insert({ session_id: sid, sender: "admin", message: adminReply })
      .select("*").single();

    if (replyMsg) {
      setMessages(prev => [...prev, replyMsg]);

      if (mode === "buy") {
        const { data: qrisMsg } = await supabase.from("chat_messages")
          .insert({ session_id: sid, sender: "admin", message: "[QRIS_IMAGE]" })
          .select("*").single();
        if (qrisMsg) setMessages(prev => [...prev, qrisMsg]);
      }
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

  const handleSelectProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setProofFiles(Array.from(files).slice(0, 2));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || proofFiles.length === 0) return;
    if (!worldName.trim() || !growId.trim()) return alert("Nama World dan GrowID wajib diisi!");

    setUploading(true);
    let uploadedUrls: string[] = [];

    for (let i = 0; i < proofFiles.length; i++) {
      const file = proofFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
        const result = await res.json();
        if (result.url) {
          uploadedUrls.push(result.url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const caption = `World: ${worldName.trim()}\nGrowID: ${growId.trim()}`;

    if (uploadedUrls.length > 0) {
      for (let i = 0; i < uploadedUrls.length; i++) {
        const { data: msg } = await supabase.from("chat_messages").insert({
          session_id: sessionId,
          sender: "customer",
          message: i === 0 ? caption : "",
          image_url: uploadedUrls[i],
        }).select("*").single();
        if (msg) setMessages(prev => [...prev, msg]);
      }
    } else {
      // Fallback if no images succeeded
      const { data: msg } = await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender: "customer",
        message: caption,
      }).select("*").single();
      if (msg) setMessages(prev => [...prev, msg]);
    }

    await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId);
    setUploading(false);
    setProofFiles([]);
    setIsFreeChat(true); // Unlock chat

    // Auto replies
    const { data: reply1 } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender: "admin",
      message: "Terima kasih! 🙏 Mimin cek transferan kamu dulu ya 🥰"
    }).select("*").single();
    if (reply1) setMessages(prev => [...prev, reply1]);

    const { data: reply2 } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender: "admin",
      message: "Setelah cek  , mimin akan proses drop ke world mu estimasi 1 - 5 menit 🙏\nsesuai antrian ✌️"
    }).select("*").single();
    if (reply2) setMessages(prev => [...prev, reply2]);
  };

  const handleCancelTransaction = () => {
    setSessionId(null);
    setIsFreeChat(false);
    setShowOptions(true);
    setProofFiles([]);
    setWorldName("");
    setGrowId("");
    setMessages([{ id: "init", sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" }]);
  };

  const renderMessageText = (msg: Msg) => {
    if (msg.image_url) {
      return (
        <div className="flex flex-col space-y-2">
          <img src={msg.image_url} alt="Proof" className="w-full h-auto max-w-[200px] rounded-lg border border-white/10" />
          {msg.message && <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.message}</p>}
        </div>
      );
    }
    if (msg.message === "[QRIS_IMAGE]") {
      const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/qris.jpg";
        link.download = "QRIS_KucaiDL.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      return (
        <div className="w-[240px] md:w-[280px] -mx-4 -my-3 flex flex-col">
          <img src="/qris.jpg" alt="QRIS Kucai DL" className="w-full h-auto object-cover rounded-t-[19px] border-b border-white/5" />
          <div className="p-3 bg-[#111928] rounded-b-[19px] rounded-bl-sm">
            <button onClick={handleDownload} className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
              Simpan gambar QR
            </button>
            <p className="text-[10px] text-white/40 mt-2 text-center leading-relaxed px-1">
              Di HP: simpan dulu, lalu pilih dari galeri saat bayar di aplikasi bank/e-wallet.
            </p>
          </div>
        </div>
      );
    }

    if (msg.sender === "admin" && msg.message.includes("=")) {
      const lines = msg.message.split("\n");
      return (
        <div className="space-y-1">
          {lines.map((line, i) => {
            const match = line.match(/^(.+?)\s*=\s*(.+)$/);
            // Don't treat purely informational lines with = as payment cards if they're too long or contain certain keywords
            if (match && line.trim().length > 3 && !line.toLowerCase().includes("klo udah tf") && !line.includes("==")) {
              const provider = match[1].trim();
              const value = match[2].trim();
              const numMatch = value.match(/\d{10,}/);
              const copyText = numMatch ? numMatch[0] : null;

              return (
                <div key={i} className="flex items-center justify-between gap-3 bg-[#0b101a] p-3 rounded-xl border border-white/5 shadow-inner mt-3 mb-3">
                  <div className="text-xs">
                    <span className="font-bold text-white">{provider}</span><br />
                    <span className="text-white/60">{value}</span>
                  </div>
                  {copyText && (
                    <button onClick={() => navigator.clipboard.writeText(copyText)} className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/20 text-sky-400 rounded-lg text-xs font-bold transition-colors active:scale-95 shrink-0">
                      Salin
                    </button>
                  )}
                </div>
              );
            }
            return <p key={i} className="min-h-[1rem] leading-relaxed">{line}</p>;
          })}
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
              <div className={`whitespace-pre-wrap max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-[20px] text-sm leading-relaxed shadow-sm ${msg.sender === "customer"
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
          ) : !isFreeChat ? (
            <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto">
              {proofFiles.length > 0 ? (
                <form onSubmit={handleSubmitProof} className="bg-[#111928] p-4 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-sm font-semibold text-white/80 mb-2">📸 {proofFiles.length} foto dipilih</p>
                  <div>
                    <input type="text" value={worldName} onChange={e => setWorldName(e.target.value)} required placeholder="Isi Nama World" className="w-full bg-[#1e2b40] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-500 transition-colors" />
                  </div>
                  <div>
                    <input type="text" value={growId} onChange={e => setGrowId(e.target.value)} required placeholder="Isi Nama GrowID" className="w-full bg-[#1e2b40] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-sky-500 transition-colors" />
                  </div>
                  <button type="submit" disabled={uploading} className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 rounded-xl text-white text-sm font-bold transition-colors disabled:opacity-50 mt-2">
                    {uploading ? "Mengirim..." : "Kirim Bukti & Data"}
                  </button>
                  <button type="button" onClick={() => setProofFiles([])} disabled={uploading} className="w-full py-2 text-white/50 hover:text-white/80 text-xs transition-colors">
                    Batal pilih foto
                  </button>
                </form>
              ) : (
                <>
                  <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleSelectProof} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                    📸 Ambil / pilih foto bukti (Maks 2)
                  </button>
                  <button onClick={handleCancelTransaction} disabled={uploading} className="w-full py-3 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 rounded-2xl text-red-200 text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                    ❌ Batalkan transaksi
                  </button>
                </>
              )}
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
