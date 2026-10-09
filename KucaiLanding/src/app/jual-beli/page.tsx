"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ArrowLeft } from "lucide-react";

type Msg = { id: string; sender: "admin" | "customer"; message: string; created_at?: string; image_url?: string; };

type SavedPayout = {
  method: string;
  accountNo: string;
  accountName: string;
};

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
  const [sellReply, setSellReply] = useState<string | null>(null);
  const [paymentMethodList, setPaymentMethodList] = useState<string[]>(["Gopay", "Dana", "OVO", "BCA", "Mandiri"]);
  const [isFreeChat, setIsFreeChat] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [trxMode, setTrxMode] = useState<"buy" | "sell">("buy");
  const [worldName, setWorldName] = useState("");
  const [growId, setGrowId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [savedPayouts, setSavedPayouts] = useState<SavedPayout[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kucaidl_saved_payouts");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedPayouts(parsed);
        }
      } catch (e) {}
    }
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Fetch initial values
    supabase.from("site_settings").select("key, value").in("key", ["jual_beli_reply", "sell_reply", "payment_methods"]).then(({ data }) => {
      if (data) {
        data.forEach(item => {
          if (item.key === "jual_beli_reply") setJualBeliReply(item.value);
          if (item.key === "sell_reply") setSellReply(item.value);
          if (item.key === "payment_methods" && item.value) {
            setPaymentMethodList(item.value.split(",").map((s: string) => s.trim()).filter(Boolean));
          }
        });
      }
    });

    // Subscribe to realtime changes
    const settingsChannel = supabase.channel('public:site_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload: any) => {
        const { key, value } = payload.new;
        if (key === "jual_beli_reply") setJualBeliReply(value);
        if (key === "sell_reply") setSellReply(value);
        if (key === "payment_methods" && value) {
          setPaymentMethodList(value.split(",").map((s: string) => s.trim()).filter(Boolean));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
    };
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
      const savedMode = localStorage.getItem("kucaidl_trxMode");
      if (savedMode === "sell" || savedMode === "buy") setTrxMode(savedMode);
      
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
      localStorage.setItem("kucaidl_trxMode", trxMode);
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
        
        if (payload.new.sender === "admin") {
          // Play sound if possible
          try {
            const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch(e) {}

          // Browser Notification popup if tab is hidden
          if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
            new Notification("Pesan Baru - Kucai DL", {
              body: "Admin membalas pesan kamu!",
              icon: "/icon.png"
            });
          }

          if (payload.new.message.includes("Udah Di Drop ya Cai") || payload.new.message.includes("Udah Di tranfer ya Cai")) {
            setIsFreeChat(false);
            setShowOptions(true);
            if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }
        }
      }).subscribe();
      
    // Handle tab switching / screen wake up to refetch missing messages
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        supabase.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true })
          .then(({ data }) => {
            if (data && data.length > 0) {
              setMessages([{ id: "init", sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" }, ...data]);
            }
          });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => { 
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      supabase.removeChannel(ch); 
    }
  }, [sessionId]);

  const handleSelectMode = async (mode: "buy" | "sell") => {
    setShowOptions(false);
    setIsFreeChat(false);
    setTrxMode(mode);

    let sid = sessionId;
    if (!sid) {
      const { data: sessionData } = await supabase
        .from("chat_sessions")
        .insert({ customer_name: `Customer_${Math.floor(Math.random() * 10000)}` })
        .select("id").single();
      if (!sessionData) return;
      sid = sessionData.id;
      setSessionId(sid);
      
      const { data: initMsg } = await supabase.from("chat_messages").insert([
        { session_id: sid, sender: "admin", message: "Halo! 👋 Selamat datang di Kucai DL. Mau jual atau beli?" },
      ]).select("*").single();
      
      if (initMsg) {
        setMessages([initMsg]);
      }
    } else {
      await supabase.from("chat_sessions").update({ status: 'active', last_message_at: new Date().toISOString() }).eq("id", sid);
    }

    const customerText = mode === "buy" ? "Bang, saya mau beli DL 🙏" : "Bang, saya mau jual DL 🙏";

    const { data: msgCst } = await supabase.from("chat_messages").insert([
      { session_id: sid, sender: "customer", message: customerText }
    ]).select("*").single();

    if (msgCst) {
      setMessages(prev => [...prev, msgCst]);
    } else {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "customer", message: customerText }]);
    }

    const { data: ssData } = await supabase.from("site_settings").select("value").eq("key", "store_status").single();
    const isStoreClose = ssData && ssData.value === "close";

    const adminReply = isStoreClose 
      ? "Toko close , nanti di infokan lagi di saluran wa ya"
      : (mode === "buy" ? "[PROMO_BELI]" : "[PROMO_JUAL]");

    const { data: replyMsg } = await supabase.from("chat_messages")
      .insert({ session_id: sid, sender: "admin", message: adminReply })
      .select("*").single();

    if (replyMsg) {
      setMessages(prev => [...prev, replyMsg]);

      if (mode === "buy" && !isStoreClose) {
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
    if (trxMode === "buy" && (!worldName.trim() || !growId.trim())) {
      return alert("Nama World dan GrowID wajib diisi!");
    }
    if (trxMode === "sell" && (!paymentMethod || !worldName.trim() || !growId.trim())) {
      return alert("Metode Pembayaran, Nomor Rekening, dan Atas Nama wajib diisi!");
    }

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

    const caption = trxMode === "buy"
      ? `World: ${worldName.trim()}\nGrowID: ${growId.trim()}`
      : `Metode: ${paymentMethod}\nNo Rek/Wallet: ${worldName.trim()}\nAtas Nama: ${growId.trim()}`;

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

    if (trxMode === "sell") {
      const newPayout = { method: paymentMethod, accountNo: worldName.trim(), accountName: growId.trim() };
      const exists = savedPayouts.find(p => p.method === newPayout.method && p.accountNo === newPayout.accountNo);
      if (!exists) {
        const updated = [newPayout, ...savedPayouts].slice(0, 5);
        setSavedPayouts(updated);
        localStorage.setItem("kucaidl_saved_payouts", JSON.stringify(updated));
      }
    }

    // Auto replies
    const replyText1 = trxMode === "buy" 
      ? "Terima kasih! 🙏 Mimin cek transferan kamu dulu ya 🥰"
      : "pembayaran sedang di proses \nmohon menunggu 1-10 menit yaa\nThankyou sudah menunggu 🥰✌️";

    const { data: reply1 } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender: "admin",
      message: replyText1
    }).select("*").single();
    if (reply1) setMessages(prev => [...prev, reply1]);

    if (trxMode === "buy") {
      const { data: reply2 } = await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender: "admin",
        message: "Setelah cek  , mimin akan proses drop ke world mu estimasi 1 - 5 menit 🙏\nsesuai antrian ✌️"
      }).select("*").single();
      if (reply2) setMessages(prev => [...prev, reply2]);
    }
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

  const formatText = (text: string) => {
    // Parse URLs, *bold*, _italic_, ~strike~
    let html = text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline break-all">$1</a>')
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<del>$1</del>");
      
    // Don't replace \n with <br/> if the parent already handles whitespace-pre-wrap or if we split by \n
    return <span dangerouslySetInnerHTML={{ __html: html }} className="break-words" />;
  };

  const renderMessageText = (msg: Msg, msgIdx: number) => {
    let displayMessage = msg.message || "";

    if (msg.image_url) {
      return (
        <div className="flex flex-col space-y-2">
          <img src={msg.image_url} alt="Proof" className="w-full h-auto max-w-[200px] rounded-lg border border-white/10" />
          {displayMessage && <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{displayMessage}</p>}
        </div>
      );
    }
    if (displayMessage === "[QRIS_IMAGE]") {
      const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/qris.jpg";
        link.download = "QRIS_KucaiDL.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      return (
        <div className="w-[240px] md:w-[280px] flex flex-col gap-3">
          <div className="text-[13px] leading-relaxed text-gray-200">
            ‼️ <strong>QRIS untuk tf dari bank yg ga bisa tf ke e-wallet</strong><br/>
            ‼️ <strong>QRIS untuk tf dari Ewallet yg belum premium</strong>
            <br/><br/>
            <span className="text-blue-400">✔</span> Pembelian di bawah 100k gratis tax .<br/>
            <span className="text-blue-400">✔</span> Biaya 1% jika pembelian di atas 500k .
          </div>
          
          <div className="bg-white rounded-xl p-2 pb-0 w-[160px]">
            <img src="/qris.jpg" alt="QRIS Kucai DL" className="w-full h-auto rounded-lg border border-gray-100" />
          </div>

          <button onClick={handleDownload} className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-lg text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
            Simpan gambar QR
          </button>
        </div>
      );
    }

    // Dynamically replace promo messages with the latest admin settings
    if (msg.sender === "admin") {
      let isBuyPromo = displayMessage === "[PROMO_BELI]" || displayMessage.includes("Rate beli ke KucaiDL") || displayMessage.includes("Payment transfer ke ewallet");
      let isSellPromo = displayMessage === "[PROMO_JUAL]" || displayMessage.includes("MINIM SELL") || displayMessage.includes("Rate Jual ke KucaiDL");
      let isStoreCloseMsg = displayMessage.includes("Toko close");
      
      // Fallback: reliably identify legacy promo messages based on the previous message
      if (!isBuyPromo && !isSellPromo && !isStoreCloseMsg && msgIdx > 0) {
        const prevMsg = messages[msgIdx - 1];
        if (prevMsg && prevMsg.sender === "customer") {
          if (prevMsg.message === "Bang, saya mau beli DL 🙏") isBuyPromo = true;
          else if (prevMsg.message === "Bang, saya mau jual DL 🙏") isSellPromo = true;
        }
      }

      if (isBuyPromo) {
        displayMessage = jualBeliReply || "Rate beli ke KucaiDL 🤗\nDL : 785\nBGL : 78.500\n\nGopay = 081367232472 an Desi\nDana = 081367232472 an Desi\nBank = Khusus Bank TF ke QRIS\n\n‼️Payment transfer ke ewallet di atas ya thankyou 🥰\n\nNOTE ❗️ : klo udah tf kirim nama world, growid \n\n👸 Admin Desi KUCAIDL";
      } else if (isSellPromo) {
        displayMessage = sellReply || "MINIM SELL 30 DL YAH 🥰\n\nRate Jual ke KucaiDL\nDL : Rp750\nBGL : Rp75.000\n\n❗️ Kalo udah drop dl nya, send ss sama kirim nomor pembayar dan atas nama \n\n[WORLD_CARD:POSZIO|deleteALVIN]";
      }
    }
    if (msg.sender === "admin" && displayMessage.includes("=")) {
      const lines = displayMessage.split("\n");
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
                <div key={i} className="flex items-center justify-between gap-3 bg-[#0b141a] p-2.5 rounded-xl border border-white/5 shadow-inner my-1.5">
                  <div className="text-xs">
                    <span className="font-bold text-white">{provider}</span><br />
                    <span className="text-white/60">{value}</span>
                  </div>
                  {copyText && (
                    <button onClick={() => navigator.clipboard.writeText(copyText)} className="px-3 py-1.5 bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/40 border border-[#0ea5e9]/20 text-[#0ea5e9] rounded-lg text-xs font-bold transition-colors active:scale-95 shrink-0">
                      Salin
                    </button>
                  )}
                </div>
              );
            }
            return <p key={i} className="min-h-[0.5rem] leading-relaxed">{formatText(line)}</p>;
          })}
        </div>
      );
    }

    if (displayMessage.includes("[WORLD_CARD:")) {
      const worldCardRegex = /\[WORLD_CARD:(.*?)\|(.*?)\]/;
      const match = displayMessage.match(worldCardRegex);
      if (match) {
        const before = displayMessage.slice(0, match.index);
        const after = displayMessage.slice(match.index! + match[0].length);
        const world = match[1];
        const owner = match[2];
        const copyText = `World: ${world} | Owner: ${owner}`;
        
        return (
          <div className="space-y-2.5">
            {before.trim() && <div className="whitespace-pre-wrap leading-relaxed">{formatText(before.trim())}</div>}
            
            <div className="bg-[#0b141a] border border-white/5 rounded-xl p-3.5 shadow-inner mt-1 mb-1">
              <div className="flex flex-col gap-2 font-mono text-[14px] font-bold tracking-wide">
                <div className="text-white">🌎 WORLD : <span className="text-[#0ea5e9]">{world}</span></div>
                <div className="text-white">🤴 OWNER : <span className="text-[#0ea5e9]">{owner}</span></div>
              </div>
            </div>

            {after.trim() && <div className="whitespace-pre-wrap leading-relaxed">{formatText(after.trim())}</div>}
          </div>
        );
      }
    }

    return <div className="whitespace-pre-wrap leading-relaxed">{formatText(displayMessage)}</div>;
  };

  return (
    <div className="min-h-screen bg-[#0b141a] flex justify-center">
      <div className="w-full max-w-2xl bg-[#0b141a] flex flex-col min-h-screen relative shadow-2xl md:border-x border-white/5">

        {/* Header with WhatsApp-style Notes */}
        <div className="flex flex-col sticky top-0 z-50 border-b border-white/5 bg-[#0b141a]/95 backdrop-blur-md">
          <div className="flex items-center gap-4 px-5 pt-4 pb-2 relative">
            <button onClick={() => router.push("/")} className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-blue-900/20 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-lg border-2 border-blue-500 relative z-10">
              <img src="/kucaidl-profile.jpg" className="w-full h-full object-cover" alt="Kucai DL" />
            </div>
            <div>
              <h1 className="text-white font-bold text-[15px] leading-tight">Kucai DL</h1>
              <p className="text-blue-400 text-xs flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" /> Online
              </p>
            </div>
          </div>
          
          <div className="px-5 pb-4 relative z-0">
            {/* Tail Circles */}
            <div className="absolute -top-1 left-[64px] flex flex-col items-center gap-[3px]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#202c33] border border-white/5"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#202c33] border border-white/5 -ml-3"></div>
            </div>
            
            <div className="bg-[#202c33] border border-white/5 rounded-full px-4 py-2 inline-flex items-center gap-2.5 relative shadow-lg ml-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-white/90 text-[11px] font-bold tracking-wide uppercase">UPDATE / INFO DI SALURAN WA YA 🥰</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative">
          {/* Wallpaper Layer */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" 
            style={{ 
              backgroundImage: "url('/wa-bg.png')", 
              backgroundRepeat: "repeat",
              backgroundSize: "400px",
              backgroundAttachment: "local"
            }} 
          />
          <div className="relative z-10 text-center pb-2">
            <span className="bg-blue-900/20 text-blue-200/50 text-[10px] font-medium px-3 py-1 rounded-full">Hari ini</span>
          </div>

          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`relative z-10 flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[85%] md:max-w-[75%] px-4 pt-3 pb-6 rounded-[20px] text-sm leading-relaxed shadow-sm ${msg.sender === "customer"
                  ? "bg-[#0ea5e9] text-white rounded-br-sm"
                  : "bg-[#1f2c34] text-gray-100 rounded-bl-sm border border-white/5"
                }`}>
                {renderMessageText(msg, idx)}
                <div suppressHydrationWarning className={`absolute bottom-1.5 right-3 text-[10px] ${msg.sender === "customer" ? "text-white/70" : "text-white/40"}`}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Inline Buttons moved to bottom keyboard */}

          <div ref={bottomRef} />
        </div>

        {/* Input Area / Keyboard Options */}
        <div className="p-4 bg-[#0b141a] border-t border-white/5 sticky bottom-0 z-10">
          {showOptions ? (
            <div className="flex gap-2 w-full max-w-4xl mx-auto">
              <button onClick={() => handleSelectMode("buy")} className="flex-1 py-4 bg-[#202c33] hover:bg-blue-900/30 border border-white/5 rounded-2xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                🛒 Beli DL/BGL
              </button>
              <button onClick={() => handleSelectMode("sell")} className="flex-1 py-4 bg-[#202c33] hover:bg-blue-900/30 border border-white/5 rounded-2xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                💰 Jual DL/BGL
              </button>
            </div>
          ) : !isFreeChat ? (
            <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto">
              {proofFiles.length > 0 ? (
                <form onSubmit={handleSubmitProof} className="bg-[#202c33] p-4 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-sm font-semibold text-white/80 mb-2">📸 {proofFiles.length} foto dipilih</p>
                  {trxMode === "buy" ? (
                    <>
                      <div>
                        <input type="text" value={worldName} onChange={e => setWorldName(e.target.value)} required placeholder="Isi Nama World" className="w-full bg-[#202c33] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div>
                        <input type="text" value={growId} onChange={e => setGrowId(e.target.value)} required placeholder="Isi Nama GrowID" className="w-full bg-[#202c33] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                         <div 
                           className="w-full bg-[#202c33] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors cursor-pointer flex justify-between items-center"
                           onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                         >
                           <span className={paymentMethod ? "text-white" : "text-white/50"}>{paymentMethod || "Pilih Metode Pembayaran"}</span>
                           <span className="text-white/30 text-xs">▼</span>
                         </div>
                         {showPaymentOptions && (
                           <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#202c33] border border-white/5 rounded-xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-20">
                             <input 
                               type="text" 
                               value={searchPayment} 
                               onChange={e => setSearchPayment(e.target.value)} 
                               placeholder="Cari metode (Gopay, Dana...)" 
                               className="w-full bg-[#202c33] border-b border-white/10 px-4 py-3 text-white text-sm outline-none"
                               autoFocus
                             />
                             <div className="max-h-72 overflow-y-auto pb-2">
                               {savedPayouts.length > 0 && !searchPayment && (
                                 <div className="mb-2">
                                   <div className="px-4 py-2 text-[10px] font-bold text-white/40 uppercase tracking-wider bg-white/5">Tersimpan</div>
                                   {savedPayouts.map((p, idx) => (
                                     <div 
                                       key={idx} 
                                       onClick={() => { 
                                         setPaymentMethod(p.method || ""); 
                                         setWorldName(p.accountNo || "");
                                         setGrowId(p.accountName || "");
                                         setShowPaymentOptions(false); 
                                       }}
                                       className="px-4 py-3 hover:bg-[#0088cc]/20 text-white text-sm cursor-pointer transition-colors border-b border-white/5 font-medium flex justify-between items-center"
                                     >
                                       <span>{p.method} <span className="text-white/50 text-xs tracking-wider">{((p.accountNo || "").length > 5 ? (p.accountNo || "").substring(0,2) + "•".repeat(4) + (p.accountNo || "").slice(-3) : (p.accountNo || ""))}</span></span>
                                       <span className="text-white/40 text-xs max-w-[100px] truncate">{p.accountName}</span>
                                     </div>
                                   ))}
                                   <div 
                                     onClick={() => { setSavedPayouts([]); localStorage.removeItem("kucaidl_saved_payouts"); }}
                                     className="px-4 py-3 hover:bg-red-900/30 text-red-400 text-sm cursor-pointer transition-colors border-b border-white/5"
                                   >
                                     Hapus payout tersimpan...
                                   </div>
                                 </div>
                               )}

                               <div className="px-4 py-2 text-[10px] font-bold text-white/40 uppercase tracking-wider bg-white/5">
                                 {savedPayouts.length > 0 && !searchPayment ? "Lainnya (Tulis Sendiri)" : "Daftar Metode"}
                               </div>
                               {paymentMethodList
                                 .filter(p => p.toLowerCase().includes(searchPayment.toLowerCase()))
                                 .map(p => (
                                   <div 
                                     key={p} 
                                     onClick={() => { setPaymentMethod(p); setShowPaymentOptions(false); setSearchPayment(""); }}
                                     className="px-4 py-3 hover:bg-[#0088cc]/20 text-white text-sm cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                   >
                                     {p}
                                   </div>
                                 ))}
                               {paymentMethodList.filter(p => p.toLowerCase().includes(searchPayment.toLowerCase())).length === 0 && (
                                 <div className="px-4 py-3 text-white/40 text-sm text-center">Tidak ditemukan</div>
                               )}
                             </div>
                           </div>
                         )}
                      </div>
                      <div>
                        <input type="text" value={worldName} onChange={e => setWorldName(e.target.value)} required placeholder="Nomor Rekening / E-Wallet" className="w-full bg-[#202c33] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div>
                        <input type="text" value={growId} onChange={e => setGrowId(e.target.value)} required placeholder="Atas Nama" className="w-full bg-[#202c33] border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors" />
                      </div>
                    </>
                  )}
                  <button type="submit" disabled={uploading} className="w-full py-3.5 bg-[#00a884] hover:bg-[#00bfa5] rounded-xl text-white text-sm font-bold transition-colors disabled:opacity-50 mt-2">
                    {uploading ? "Mengirim..." : "Kirim Bukti & Data"}
                  </button>
                  <button type="button" onClick={() => setProofFiles([])} disabled={uploading} className="w-full py-2 text-white/50 hover:text-white/80 text-xs transition-colors">
                    Batal pilih foto
                  </button>
                </form>
              ) : (
                <>
                  <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleSelectProof} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full py-4 bg-[#00a884] hover:bg-[#00bfa5] rounded-[24px] text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                    📸 Ambil / pilih foto bukti (Maks 2)
                  </button>
                  <button onClick={handleCancelTransaction} disabled={uploading} className="w-full py-3 bg-[#4a1622] hover:bg-[#5a1b28] rounded-[24px] text-[#f9d7d9] text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
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
                className="flex-1 bg-[#1f2c34] border border-white/5 rounded-[20px] px-5 py-3.5 text-white text-sm placeholder-gray-500 outline-none focus:border-[#0ea5e9] focus:bg-[#2a3942] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending || !sessionId}
                className="w-12 h-12 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-[#1f2c34] disabled:text-gray-500 rounded-[20px] flex items-center justify-center text-white transition-all shadow-lg disabled:shadow-none mb-[1px]"
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
