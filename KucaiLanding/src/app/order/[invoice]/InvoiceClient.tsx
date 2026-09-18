"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Copy, Loader2, ArrowLeft, AlertTriangle, XCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";

const EXPIRY_SECONDS = 5 * 60; // 5 minutes

export default function InvoiceClient() {
  const params = useParams();
  const router = useRouter();
  const invoice = params.invoice as string;

  const [orderData, setOrderData] = useState<any>(null);
  const [credentials, setCredentials] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/order/${invoice}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data.order);
        setCredentials(data.credentials_data);

        // Calculate remaining time
        if (data.order.payment_status === "pending") {
          const createdAt = new Date(data.order.created_at).getTime();
          const elapsed = Math.floor((Date.now() - createdAt) / 1000);
          const remaining = EXPIRY_SECONDS - elapsed;
          setTimeLeft(remaining > 0 ? remaining : 0);
        }
        
        try {
          const history = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
          const index = history.findIndex((h: any) => h.invoice === invoice);
          if (index !== -1) {
            history[index].status = data.order.payment_status;
            if (data.credentials_data) history[index].credentials = data.credentials_data;
            localStorage.setItem("kucaidl_history", JSON.stringify(history));
          } else {
            history.unshift({
              invoice: invoice,
              title: data.order.digital_products?.title || "Produk Digital",
              price: data.order.amount,
              timestamp: new Date(data.order.created_at).getTime(),
              status: data.order.payment_status,
              credentials: data.credentials_data || null
            });
            localStorage.setItem("kucaidl_history", JSON.stringify(history.slice(0, 20)));
          }
        } catch(e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [invoice]);

  // Initial fetch + polling
  useEffect(() => {
    if (invoice) {
      fetchOrder();
      const interval = setInterval(() => {
        if (orderData?.payment_status === "pending") {
          fetchOrder();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [invoice, orderData?.payment_status, fetchOrder]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    if (orderData?.payment_status !== "pending") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          fetchOrder(); // Re-fetch to get expired status
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, orderData?.payment_status, fetchOrder]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Tersalin ke clipboard!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading && !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invoice Tidak Ditemukan</h1>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const isPaid = orderData.payment_status === "paid";
  const isExpired = orderData.payment_status === "expired";
  const isPending = orderData.payment_status === "pending";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 py-12 px-4 md:px-6 flex flex-col items-center">
        <div className="max-w-xl w-full">
          <button onClick={() => router.push("/")} className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-8 transition-colors text-sm font-mono tracking-wide group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> KEMBALI KE BERANDA
          </button>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden glass-card">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Status Badge */}
            {isPaid && (
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> LUNAS
                </span>
              </div>
            )}
            {isExpired && (
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> EXPIRED
                </span>
              </div>
            )}
            
            <div className="text-center mb-8 pt-4">
              <h1 className="text-foreground text-2xl font-black uppercase tracking-wide mb-2">
                Detail Pesanan
              </h1>
              <p className="text-muted-foreground font-mono text-sm">{invoice}</p>
            </div>

            <div className="bg-background border border-border rounded-xl p-5 mb-8">
              <h3 className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">Produk</h3>
              <p className="text-foreground font-bold text-lg mb-4">{orderData.digital_products?.title}</p>
              
              <h3 className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">Total Pembayaran</h3>
              <p className="text-primary text-2xl font-black font-mono">
                Rp {orderData.amount.toLocaleString("id-ID")}
              </p>
            </div>

            {/* PENDING — Show QR + Countdown */}
            {isPending && (
              <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl mb-6">
                <h3 className="text-gray-900 font-black text-xl mb-2 uppercase">Scan QRIS</h3>
                
                {/* Countdown Timer */}
                {timeLeft !== null && (
                  <div className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-full ${
                    timeLeft <= 60 
                      ? "bg-red-50 text-red-600 border border-red-200" 
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold font-mono">
                      {timeLeft <= 0 ? "00:00" : formatTime(timeLeft)}
                    </span>
                    <span className="text-xs">tersisa</span>
                  </div>
                )}

                <div className="bg-white p-2 rounded-lg border-2 border-gray-100 shadow-sm mb-4">
                  <QRCodeSVG value={orderData.qris_string} size={200} />
                </div>
                <p className="text-gray-500 text-sm text-center max-w-xs mb-4">
                  Buka aplikasi e-wallet atau m-banking Anda, lalu scan QR di atas untuk membayar.
                </p>
                
                <div className="w-full flex items-center justify-center gap-2 text-primary bg-primary/10 p-3 rounded-lg mt-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-semibold">Menunggu Pembayaran...</span>
                </div>
              </div>
            )}

            {/* EXPIRED */}
            {isExpired && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center mb-6">
                <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h2 className="text-destructive text-xl font-bold mb-2">Pembayaran Kedaluwarsa</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Waktu pembayaran 5 menit telah habis. Silakan buat pesanan baru jika masih ingin membeli.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl font-bold text-sm transition-colors"
                >
                  Buat Pesanan Baru
                </button>
              </div>
            )}

            {/* PAID */}
            {isPaid && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-emerald-400 text-xl font-bold mb-6">Pembayaran Berhasil!</h2>
                
                {credentials ? (
                  <div className="text-left bg-background border border-border rounded-lg p-4">
                    <p className="text-muted-foreground text-sm mb-2 font-bold">Data Akun Anda:</p>
                    <pre className="text-primary font-mono text-sm whitespace-pre-wrap break-all p-3 bg-card rounded border border-border">
                      {credentials}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(credentials)}
                      className="mt-4 w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-bold"
                    >
                      <Copy className="w-4 h-4" /> SALIN DATA
                    </button>
                  </div>
                ) : (
                  <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-left">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-primary font-bold mb-1">Stok Sedang Diproses</p>
                        <p className="text-muted-foreground text-sm">
                          Pembayaran Anda berhasil, tetapi sistem sedang menyiapkan akun Anda (atau stok kosong sesaat). 
                          Silakan hubungi Admin dengan melampirkan nomor Invoice ini.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-xs font-mono">
                Simpan URL halaman ini atau nomor Invoice untuk melacak status pesanan Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
