"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useSettings } from "@/lib/settings/SettingsContext";

export default function CidClassicProductDetail({ productId }: { productId: string }) {
  const router = useRouter();
  const { socialIg, socialDiscord } = useSettings();

  const [product, setProduct] = useState<any>(null);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [waNumber, setWaNumber] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.data) {
        const found = json.data.find((p: any) => String(p.id) === String(productId));
        if (found) {
          setProduct(found);
          setStockCount(found.stock_available || 0);
        }
      }
      setLoading(false);
    }
    if (productId) fetchProduct();
  }, [productId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber.trim()) {
      Swal.fire("Error", "Nomor WhatsApp wajib diisi!", "error");
      return;
    }
    
    const cleanedWa = waNumber.replace(/[^0-9]/g, "");
    if (cleanedWa.length < 9) {
      Swal.fire("Error", "Nomor WhatsApp tidak valid!", "error");
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, waNumber: cleanedWa })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat tagihan");
      }

      try {
        const history = JSON.parse(localStorage.getItem("kucaidl_history") || "[]");
        if (!history.find((h: any) => h.invoice === data.invoice_no)) {
          history.unshift({
            invoice: data.invoice_no,
            title: product.title,
            price: product.price,
            timestamp: Date.now(),
            status: "pending",
            credentials: null
          });
          localStorage.setItem("kucaidl_history", JSON.stringify(history.slice(0, 20)));
        }
      } catch (e) {}

      router.push(`/order/${data.invoice_no}`);
    } catch (err: any) {
      Swal.fire("Gagal", err.message, "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="theme-classic-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <link rel="stylesheet" href="/css/cid-classic.css" />
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="theme-classic-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <link rel="stylesheet" href="/css/cid-classic.css" />
        <h1 className="text-danger">Produk Tidak Ditemukan</h1>
        <button onClick={() => router.push("/")} className="btn btn-ghost">Kembali ke Beranda</button>
      </div>
    );
  }

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
              <Link href="/order">Lacak Pesanan</Link>
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

        {/* Mobile Floating Bottom Nav */}
        <div className="mobile-bottom-nav">
          <Link href="/" id="mobile-nav-home">
            <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </Link>
          <Link href="/#produk" id="mobile-nav-produk">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Produk</span>
          </Link>
          <Link href="/order" id="mobile-nav-lacak">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Lacak</span>
          </Link>
        </div>

        <section className="section" style={{ padding: '40px 0', minHeight: 'calc(100vh - 150px)' }}>
          <div className="wrap-sm">
            <button onClick={() => router.push("/#produk")} className="btn btn-ghost btn-sm" style={{ marginBottom: '30px', border: 'none', paddingLeft: 0 }}>
              &larr; KEMBALI KE KATALOG
            </button>

            <div className="product-detail-grid">
              {/* Product Info */}
              <div>
                <div className="card" style={{ padding: '24px', marginBottom: '24px', background: 'var(--surface-2)', border: '1px solid var(--gold-dim)' }}>
                  <div className="product-category" style={{ marginBottom: '10px' }}>{product.category || 'AKUN'}</div>
                  <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>{product.title}</h1>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div className="product-icon" style={{ overflow: 'hidden', padding: product.icon ? 0 : '15px' }}>
                      {product.icon ? (
                        <img src={product.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.title} />
                      ) : (
                        "📦"
                      )}
                    </div>
                    <div>
                      <div className="text-dim" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Harga</div>
                      <div className="product-price" style={{ fontSize: '24px' }}>Rp {product.price.toLocaleString("id-ID")}</div>
                    </div>
                  </div>

                  <div className="border-top" style={{ borderTop: '1px dashed var(--border)', paddingTop: '16px' }}>
                    <div className="text-dim" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Deskripsi Produk</div>
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-line', color: 'var(--text)' }}>
                      {product.description || "Tidak ada deskripsi."}
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '10px', background: 'var(--gold-bg)', color: 'var(--gold)', borderRadius: '4px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Garansi Aman & Instan</div>
                    <div className="text-dim" style={{ fontSize: '11px' }}>Produk dikirim otomatis setelah pembayaran via QRIS berhasil diverifikasi.</div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div>
                <div className="panel" style={{ position: 'sticky', top: '90px' }}>
                  <div className="panel-head">
                    <h2>Checkout</h2>
                    {stockCount > 0 ? (
                       <span className="stock-badge available">TERSEDIA ({stockCount})</span>
                    ) : (
                       <span className="stock-badge empty">HABIS</span>
                    )}
                  </div>
                  <div className="panel-body">
                    {stockCount > 0 ? (
                      <form onSubmit={handleCheckout} className="form-group">
                        <label className="form-label">Nomor WhatsApp <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="081234567890"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value)}
                          required
                        />
                        <div className="form-hint" style={{ marginBottom: '16px' }}>
                          Invoice & data akun akan dikirim melalui nomor ini.
                        </div>

                        <button 
                          type="submit" 
                          className="btn btn-gold w-full btn-lg"
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? "Memproses..." : "BAYAR SEKARANG"}
                        </button>
                      </form>
                    ) : (
                      <div className="notice notice-danger">
                        Produk ini sedang tidak tersedia. Silakan cek kembali nanti atau hubungi admin.
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
