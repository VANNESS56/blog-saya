"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/lib/settings/SettingsContext";

export default function CidClassicOrderSearch() {
  const [invoiceId, setInvoiceId] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();
  const { socialIg, socialDiscord } = useSettings();

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
      setHistory(hist);
    } catch (e) {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = invoiceId.trim();
    if (!trimmed) return;
    router.push(`/order/${trimmed}`);
  };

  return (
    <>
      <link rel="stylesheet" href="/css/cid-classic.css" />
      <div className="theme-classic-container">
        
        {/* Navbar */}
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

            <div className="panel" style={{ padding: '40px 30px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Lacak Pesanan</h1>
                <p className="text-dim">Masukkan kode invoice untuk cek status & data akun Anda.</p>
              </div>

              <form onSubmit={handleSearch} className="form-group" style={{ marginBottom: '40px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="INV-XXXXXXX" 
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '16px', letterSpacing: '1px' }}
                  required
                />
                <button type="submit" className="btn btn-gold btn-lg w-full" style={{ marginTop: '10px' }}>
                  CARI PESANAN
                </button>
              </form>

              {history.length > 0 && (
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '30px' }}>
                  <div className="eyebrow" style={{ marginBottom: '20px' }}>Riwayat Transaksi (Browser Ini)</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                    {history.map((item, idx) => (
                      <div key={idx} className="order-card" style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }} onClick={() => router.push(`/order/${item.invoice}`)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div className="inv">{item.invoice}</div>
                            <div className="name">{item.title}</div>
                            <div className="time">{new Date(item.timestamp).toLocaleString("id-ID")}</div>
                          </div>
                          <div className="r">
                            <span className={`status-badge ${item.status === 'paid' ? 'PAID' : item.status === 'failed' ? 'FAILED' : 'PENDING'}`}>
                              {item.status || 'PENDING'}
                            </span>
                          </div>
                        </div>
                        {item.status === 'paid' && item.credentials && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>
                            <div className="text-gem" style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Data Akun</div>
                            <pre style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: '4px', fontSize: '12px', color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                              {item.credentials}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
