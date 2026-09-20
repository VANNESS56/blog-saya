"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Headphones, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

interface ChatMessage {
  id: number;
  session_id: string;
  sender: string;
  message: string;
  created_at: string;
}

export function LiveChat() {
  const pathname = usePathname();
  
  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return <LiveChatInner />;
}

function LiveChatInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore session from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("kucaidl_chat");
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

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && nameSubmitted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, nameSubmitted]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (!trimmed) return;

    // Create chat session in Supabase
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ customer_name: trimmed })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create chat session:", error);
      return;
    }

    const sid = data.id;
    setSessionId(sid);
    setNameSubmitted(true);
    sessionStorage.setItem(
      "kucaidl_chat",
      JSON.stringify({ sessionId: sid, customerName: trimmed })
    );

    // Send auto-greeting
    await supabase.from("chat_messages").insert({
      session_id: sid,
      sender: "admin",
      message: `Hai ${trimmed}! 👋 Ada yang bisa kami bantu? Silakan ketik pertanyaan Anda.`,
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || !sessionId || sending) return;

    setSending(true);
    setNewMessage("");

    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender: "customer",
      message: trimmed,
    });

    // Update last_message_at on session
    await supabase
      .from("chat_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", sessionId);

    setSending(false);
    inputRef.current?.focus();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

  return (
    <div className="fixed bottom-[85px] right-[72px] md:bottom-8 md:right-[80px] z-[51] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[340px] max-w-[calc(100vw-32px)] bg-[#111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ height: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">
                  KUCAIDL Support
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-[10px]">Online</span>
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

          {!nameSubmitted ? (
            /* Name Input Form */
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <Headphones className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">
                Halo! 👋
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                Masukkan nama Anda untuk memulai percakapan dengan tim kami.
              </p>
              <form onSubmit={handleNameSubmit} className="w-full space-y-3">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama Anda..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                  maxLength={50}
                />
                <button
                  type="submit"
                  disabled={!customerName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Mulai Chat
                </button>
              </form>
            </div>
          ) : (
            /* Chat Messages Area */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
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
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white/10 text-gray-200 rounded-bl-md"
                      }`}
                    >
                      {msg.message}
                      <div
                        className={`text-[10px] mt-1 ${
                          msg.sender === "customer"
                            ? "text-blue-200"
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
              <form
                onSubmit={handleSendMessage}
                className="shrink-0 p-3 border-t border-white/10 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-10 h-10 shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="w-[52px] h-[52px] md:w-14 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:scale-110 transition-all duration-300 relative group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 scale-100 group-hover:scale-125 transition-transform duration-500" />
        <Headphones className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-20 animate-bounce">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
