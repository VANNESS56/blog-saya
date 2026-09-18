"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useSettings } from "@/lib/settings/SettingsContext";

const EXPIRY_SECONDS = 5 * 60; // 5 menit

export default function CidClassicInvoice({ invoice }: { invoice: string }) {
  const router = useRouter();
  const { socialIg, socialDiscord } = useSettings();
  
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [credentials, setCredentials] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 5000); // Polling setiap 5 detik
    return () => clearInterval(interval);
  }, [invoice]);

  const fetchOrder = async (isPolling = false) => {
    try {
      const res = await fetch(`/api/order/${invoice}`);
      const json = await res.json();
      
      if (res.ok) {
        setOrderData(json);
        
        // Simpan credential jika ada (dari localstorage atau fetch)
        try {
          const history = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
          const item = history.find((h: any) => h.invoice === invoice);
          if (item?.credentials) {
            setCredentials(item.credentials);
          }
          
          if (json.payment_status === "paid" && item && item.status !== "paid") {
            item.status = "paid";
            localStorage.setItem("kucaidl_history", JSON.stringify(history));
          } else if (json.payment_status === "failed" && item && item.status !== "failed") {
            item.status = "failed";
            localStorage.setItem("kucaidl_history", JSON.stringify(history));
          }
        } catch (e) {}

        if (json.payment_status === "pending") {
          const createdTime = new Date(json.created_at).getTime();
          const now = Date.now();
          const diff = Math.floor((now - createdTime) / 1000);
          const remaining = EXPIRY_SECONDS - diff;
          setTimeLeft(remaining > 0 ? remaining : 0);
        } else {
          setTimeLeft(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) return;
    
    const t = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Tersalin',
      text: 'Data berhasil disalin ke clipboard!',
      timer: 1500,
      showConfirmButton: false,
      background: '#12141a',
      color: '#00ff66'
    });
  };

  if (loading && !orderData) {
    return (
      <div className="theme-classic-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <link rel="stylesheet" href="/css/cid-classic.css" />
        <div className="text-gold font-mono">Loading...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="theme-classic-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <link rel="stylesheet" href="/css/cid-classic.css" />
        <h1 className="text-danger" style={{ marginBottom: '16px' }}>Invoice Tidak Ditemukan</h1>
        <button onClick={() => router.push("/")} className="btn btn-ghost">Kembali ke Beranda</button>
      </div>
    );
  }

  const isPaid = orderData.payment_status === "paid";
  const isExpired = orderData.payment_status === "failed" || (orderData.payment_status === "pending" && timeLeft === 0);
  const isPending = orderData.payment_status === "pending" && (timeLeft === null || timeLeft > 0);

  return (
    <>
      <link rel="stylesheet" href="/css/cid-classic.css" />
      <div className="theme-classic-container">
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="logo">
              KUCAI<b>DL</b>
            </Link>
            <div className="nav-links">
              <Link href="/#produk">Produk</Link>
              <Link href="/order" className="active">Lacak Pesanan</Link>
              {socialDiscord && (
                <a href={socialDiscord} target="_blank" className="nav-social" title="Discord">
                  <svg viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.29,80.4,80.4,0,0,0,6.77-11A68.32,68.32,0,0,1,28.8,77.22c.94-.69,1.84-1.39,2.69-2.1a75.11,75.11,0,0,0,71.3,0c.85.71,1.75,1.41,2.69,2.1a67.8,67.8,0,0,1-11,5.6,79.52,79.52,0,0,0,6.76,11,105.81,105.81,0,0,0,32-16.29C129.24,48.45,123.38,25.62,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
                </a>
              )}
              {socialIg && (
                <a href={socialIg} target="_blank" className="nav-social" title="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              )}
            </div>
          </div>
        </nav>

        <section className="section" style={{ minHeight: 'calc(100vh - 150px)', padding: '60px 0' }}>
          <div className="wrap-xs">
            <button onClick={() => router.push("/")} className="btn btn-ghost btn-sm" style={{ marginBottom: '30px', border: 'none', paddingLeft: 0 }}>
              &larr; KEMBALI KE BERANDA
            </button>

            <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
              {isPaid && (
                <div className="notice notice-gem" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                  <b>✓ PEMBAYARAN BERHASIL</b>
                </div>
              )}
              {isExpired && (
                <div className="notice notice-danger" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                  <b>✕ PEMBAYARAN KEDALUWARSA</b>
                </div>
              )}

              <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>Detail Pesanan</h1>
              <div className="invoice-code" style={{ marginBottom: '30px' }}>{invoice}</div>

              <div style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: '4px', textAlign: 'left', marginBottom: '30px', border: '1px solid var(--border)' }}>
                <div className="text-dim" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Produk</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>{orderData.digital_products?.title}</div>

                <div className="text-dim" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Total Pembayaran</div>
                <div className="text-gold" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>Rp {orderData.amount.toLocaleString("id-ID")}</div>
              </div>

              {isPending && (
                <div className="qris-box">
                  {timeLeft !== null && (
                    <div className={`countdown ${timeLeft <= 60 ? 'urgent' : ''}`} style={{ marginBottom: '16px' }}>
                      {formatTime(timeLeft)}
                    </div>
                  )}
                  <div className="qris-img">
                    <QRCodeSVG value={orderData.qris_string} size={200} />
                  </div>
                  <p className="text-dim" style={{ fontSize: '12px', marginBottom: '16px' }}>
                    Buka aplikasi e-wallet atau m-banking Anda, lalu scan QR di atas untuk membayar.
                  </p>
                  <div className="notice notice-gold" style={{ justifyContent: 'center' }}>
                    <span className="mono" style={{ fontSize: '12px' }}>Menunggu Pembayaran...</span>
                  </div>
                </div>
              )}

              {isExpired && (
                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => router.push("/")} className="btn btn-ghost w-full">Buat Pesanan Baru</button>
                </div>
              )}

              {isPaid && (
                <div style={{ marginTop: '20px' }}>
                  {credentials ? (
                    <div style={{ textAlign: 'left', background: 'var(--surface-2)', padding: '20px', borderRadius: '4px', border: '1px solid var(--gem-dim)' }}>
                      <div className="text-gem" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Data Akun Anda:</div>
                      <pre className="mono" style={{ background: 'var(--bg)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '13px' }}>
                        {credentials}
                      </pre>
                      <button onClick={() => copyToClipboard(credentials)} className="btn btn-gem w-full" style={{ marginTop: '16px' }}>
                        SALIN DATA
                      </button>
                    </div>
                  ) : (
                    <div className="notice notice-gold" style={{ textAlign: 'left', display: 'block' }}>
                      <b style={{ display: 'block', marginBottom: '8px' }}>Stok Sedang Diproses</b>
                      Pembayaran berhasil, namun sistem sedang menyiapkan akun Anda (atau stok kosong sesaat). Silakan hubungi Admin dengan melampirkan nomor Invoice ini.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        
        <footer className="footer">
          <div className="footer-inner">
            <span>© 2026 KUCAIDL — Digital Store</span>
            <span>Pembayaran aman via QRIS · Pengiriman otomatis</span>
          </div>
        </footer>
      </div>
    </>
  );
}
