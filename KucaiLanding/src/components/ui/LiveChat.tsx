"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Minus, ImagePlus } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

interface ChatMessage {
  id: number;
  session_id: string;
  sender: string;
  message: string;
  image_url?: string;
  created_at: string;
}

const ACCOUNT_AUTO_REPLY = `*kalau jual akun , silahkan kirim ss spek akunnya :*
- backpack
- playtime hour
- supporter / ssupporter
- title ( kalau ada )
- roles kalau level 5 keatas

kalau beli akun , silahkan klik beli dari website ya 🥰

-nanti admin mimin bales secepatnya ditunggu ya 🤗`;

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error("Gagal mengompres gambar"));
            }
          },
          "image/jpeg",
          0.8 // 80% quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export function LiveChat() {
  const pathname = usePathname();
  
  // Don't show on admin or jual-beli pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/jual-beli")) return null;

  return <LiveChatInner />;
}

const renderMessageText = (text: string) => {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*[^*]+\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={j} className="font-bold">{part.slice(1, -1)}</strong>;
          }
          return part;
        })}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
};

function LiveChatInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [storeStatus, setStoreStatus] = useState<"open" | "close">("open");

  // Fetch store status
  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "store_status").single().then(({ data }) => {
      if (data) setStoreStatus(data.value === "close" ? "close" : "open");
    });
    const ch = supabase.channel("livechat_store_status")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings", filter: "key=eq.store_status" }, (payload: any) => {
        if (payload?.new?.value) setStoreStatus(payload.new.value === "close" ? "close" : "open");
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpenLiveChat = () => setIsOpen(true);
    window.addEventListener("open-livechat", handleOpenLiveChat);
    return () => window.removeEventListener("open-livechat", handleOpenLiveChat);
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kucaidl_chat");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sessionId && parsed.customerName) {
          setSessionId(parsed.sessionId);
          setCustomerName(parsed.customerName);
          setNameSubmitted(true);
        }
      } catch {}
    }
  }, []);

  // Fetch existing messages when session is restored
  useEffect(() => {
    if (!sessionId) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);

      // Check if blocked or session deleted
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .select("status")
        .eq("id", sessionId)
        .single();
        
      if (sessionError || !session) {
        // Session not found in DB (maybe deleted by admin)
        localStorage.removeItem("kucaidl_chat");
        setSessionId(null);
        setNameSubmitted(false);
        setMessages([]);
        return;
      }
      if (session?.status === "blocked") setIsBlocked(true);
    }
    fetchMessages();
  }, [sessionId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // If chat is closed and message is from admin, increment unread
          if (msg.sender === "admin") {
            setUnread((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initSession = async () => {
    const randomName = `Customer_${Math.floor(1000 + Math.random() * 9000)}`;
    setCustomerName(randomName);

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ customer_name: randomName })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create chat session:", error);
      return;
    }

    const sid = data.id;
    setSessionId(sid);
    localStorage.setItem(
      "kucaidl_chat",
      JSON.stringify({ sessionId: sid, customerName: randomName })
    );

    // Send auto-greeting
    const { data: greetingMsg } = await supabase.from("chat_messages").insert({
      session_id: sid,
      sender: "admin",
      message: ACCOUNT_AUTO_REPLY,
    }).select("*").single();

    if (greetingMsg) {
      setMessages([greetingMsg]);
    }
  };

  // Auto initialize session when chat opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      initSession();
    }
  }, [isOpen, sessionId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && sessionId) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if ((!trimmed && selectedFiles.length === 0) || !sessionId || sending || uploading) return;

    setSending(true);

    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          let compressedFile = file;
          if (file.type.startsWith("image/")) {
            try {
              compressedFile = await compressImage(file);
            } catch (err) {
              console.error("Gagal compress:", err);
            }
          }
          const formData = new FormData();
          formData.append("file", compressedFile);
          
          try {
            const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
            const result = await res.json();
            if (result.url) {
              await supabase.from("chat_messages").insert({
                session_id: sessionId,
                sender: "customer",
                message: i === 0 ? trimmed : "", // Text caption attached to first image
                image_url: result.url,
              });
            } else if (result.error) {
              alert(`Gagal mengirim foto: ${result.error}`);
            }
          } catch (err: any) {
             alert(`Gagal terhubung ke server (foto mungkin terlalu besar): ${err.message}`);
          }
        }
        await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId);
        setNewMessage("");
        setSelectedFiles([]);

        // Auto-reply for photos
        if (storeStatus === "close") {
          setTimeout(async () => {
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              sender: "admin",
              message: "Toko close , nanti di infokan lagi di saluran wa ya",
            });
          }, 1200);
        } else {
          const hasAutoReply = messages.some(m => m.sender === "admin" && m.message.includes("kalau jual akun"));
          if (!hasAutoReply) {
            setTimeout(async () => {
              await supabase.from("chat_messages").insert({
                session_id: sessionId,
                sender: "admin",
                message: ACCOUNT_AUTO_REPLY,
              });
            }, 1000);
          }
        }
      } catch (err: any) {
        alert(`Terjadi kesalahan: ${err.message}`);
      }
      setUploading(false);
    } else {
      // Only text
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender: "customer",
        message: trimmed,
      });
      await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId);
      setNewMessage("");

      // Auto-reply if store is closed or auto-reply instruction
      if (storeStatus === "close") {
        setTimeout(async () => {
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            sender: "admin",
            message: "Toko close , nanti di infokan lagi di saluran wa ya",
          });
        }, 1200);
      } else {
        const hasAutoReply = messages.some(m => m.sender === "admin" && m.message.includes("kalau jual akun"));
        if (!hasAutoReply) {
          setTimeout(async () => {
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              sender: "admin",
              message: ACCOUNT_AUTO_REPLY,
            });
          }, 1000);
        }
      }
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
    // Reset position when opened
    setPosition({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest("button")) return;
    
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="fixed bottom-[85px] right-4 md:bottom-8 md:right-8 z-[51] flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[340px] max-w-[calc(100vw-32px)] bg-[#111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
          style={{ 
            height: "420px",
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
            touchAction: "none" // Prevent scrolling while dragging on mobile
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 shrink-0 select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                <img src="https://i.ibb.co.com/VW6XwHZv/kucaiaccount.jpg" alt="Kucai" width={32} height={32} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">
                  Kucai Account
                </p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${storeStatus === "close" ? "bg-red-400" : "bg-green-400 animate-pulse"}`} />
                  <span className={`text-[10px] ${storeStatus === "close" ? "text-red-400" : "text-white/70"}`}>
                    {storeStatus === "close" ? "Toko Tutup" : "Online"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!sessionId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-400 text-xs">Menghubungkan ke admin...</p>
            </div>
          ) : (
            /* Chat Messages Area */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                <a
                  href="/jual-beli"
                  className="block p-2.5 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 rounded-xl text-center transition-all group shadow-sm mb-2"
                >
                  <span className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300 flex items-center justify-center gap-1.5">
                    🛒 Mau Jual / Beli DL &amp; BGL? Klik di sini →
                  </span>
                </a>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "customer"
                          ? "bg-amber-600 text-white rounded-br-md"
                          : "bg-white/10 text-gray-200 rounded-bl-md"
                      }`}
                    >
                      {msg.image_url && (
                        <img src={msg.image_url} alt="" className="rounded-lg max-w-full max-h-[200px] object-cover mb-1 cursor-pointer" onClick={() => setPreviewImage(msg.image_url || null)} />
                      )}
                      {msg.message && <span>{renderMessageText(msg.message)}</span>}
                      <div
                        className={`text-[10px] mt-1 ${
                          msg.sender === "customer"
                            ? "text-amber-200"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {isBlocked ? (
                <div className="shrink-0 p-3 border-t border-white/10 text-center">
                  <p className="text-red-400 text-xs font-medium">🚫 Sesi chat ini telah diblokir oleh admin.</p>
                </div>
              ) : (
                <div className="shrink-0 flex flex-col border-t border-white/10">
                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2 p-3 bg-white/5 overflow-x-auto border-b border-white/10">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/20">
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors">
                             <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 flex items-center gap-2"
                  >
                    <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-10 h-10 shrink-0 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={uploading ? "Mengunggah..." : (selectedFiles.length > 0 ? "Tambahkan keterangan..." : "Ketik pesan...")}
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-amber-500 transition-colors"
                      maxLength={500}
                      disabled={uploading}
                    />
                    <button
                      type="submit"
                      disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending || uploading}
                      className="w-10 h-10 shrink-0 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 rounded-xl flex items-center justify-center text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="h-[52px] md:h-14 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-[20px] flex items-center gap-3 shadow-[0_8px_24px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-300 relative group overflow-hidden pointer-events-auto"
      >
        <div className="absolute inset-0 rounded-[20px] border-2 border-amber-500/40 scale-100 group-hover:scale-105 transition-transform duration-500" />
        <div className="relative z-10 flex flex-col items-end text-right leading-none">
          <span className="font-black text-[13px] tracking-wide">Jual Akun GT</span>
          <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-wider">KLIK DISINI</span>
        </div>
        <img src="https://i.ibb.co.com/VW6XwHZv/kucaiaccount.jpg" alt="Chat" width={36} height={36} className="relative z-10 rounded-full w-9 h-9 object-cover border-2 border-amber-400/50 shadow-md" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-20 animate-bounce">
            {unread}
          </span>
        )}
      </button>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 pointer-events-auto" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-500 bg-black/50 w-10 h-10 flex items-center justify-center rounded-full transition-colors z-10 text-xl font-bold"
            >
              ✕
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}
