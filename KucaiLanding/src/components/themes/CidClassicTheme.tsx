import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import Image from "next/image";

export async function CidClassicTheme() {
  // Fetch digital products (accounts etc) from admin dashboard instead of DL/BGL
  const { data: rawProducts } = await supabaseAdmin.from("digital_products").select("*").order("id", { ascending: true });
  
  // Get stock counts for each product
  const products = await Promise.all(
    (rawProducts || []).map(async (p) => {
      const { count } = await supabaseAdmin
        .from("product_stock")
        .select("*", { count: "exact", head: true })
        .eq("product_id", p.id)
        .eq("is_sold", false);
      return { ...p, stock_available: count || 0 };
    })
  );

  const { data: siteSettings } = await supabaseAdmin.from("site_settings").select("*");
  const waKucaidl = siteSettings?.find(s => s.key === "wa_kucaidl")?.value || "";
  const socialDiscord = siteSettings?.find(s => s.key === "social_discord")?.value || "";
  const socialIg = siteSettings?.find(s => s.key === "social_instagram")?.value || "";

  // Split logic: top 2 for featured, rest for regular
  const featuredProducts = products.slice(0, 2);
  const otherProducts = products.slice(2);

  return (
    <>
      <link rel="stylesheet" href="/css/cid-classic.css" />
      <div className="theme-classic-container">
        
        {/* Navbar */}
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="logo">
              <div className="logo-mark"><span></span><span></span><span></span><span></span></div>
              KUCAI<b>DL</b>
            </Link>
            <div className="nav-links">
              <Link href="#produk">Produk</Link>
              <Link href="/order">Lacak Pesanan</Link>
              <Link href="#pesanan-saya">Pesanan Saya</Link>
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
          <Link href="/" id="mobile-nav-home" className="active">
            <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </Link>
          <Link href="#produk" id="mobile-nav-produk">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Produk</span>
          </Link>
          <Link href="/order" id="mobile-nav-lacak">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Lacak</span>
          </Link>
          <Link href="#pesanan-saya" id="mobile-nav-pesanan">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Pesanan</span>
          </Link>
        </div>

        {/* Hero */}
        <section className="hero" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, var(--gold-bg), transparent)" }}>
          <div className="wrap">
            <div className="eyebrow">🌿 KUCAIDL Digital Store</div>
            <h1>Belanja Item GT<br/><span className="text-gold">Cepat, Aman, Otomatis</span></h1>
            <p>Proxy, akun, currency, dan item langka Growtopia. Bayar QRIS → produk terkirim otomatis ke kamu.</p>
            <div className="hero-actions">
              <Link href="#produk" className="btn btn-gold btn-lg">🛒 Lihat Semua Produk</Link>
              <Link href="/order" className="btn btn-ghost btn-lg">🔍 Lacak Pesanan</Link>
            </div>
          </div>
        </section>

        {/* Featured & Regular Products */}
        <section className="section" id="produk" style={{ paddingTop: '48px' }}>
          <div className="wrap">
            
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <>
                <div className="section-head" style={{ marginBottom: '20px' }}>
                  <div>
                    <div className="eyebrow">Produk Unggulan</div>
                    <h2>Pilihan Terpopuler</h2>
                  </div>
                </div>
                <div className="featured-products-container">
                  {featuredProducts.map((prod: any) => (
                    <Link href={`/product/${prod.id}`} key={prod.id} className="featured-card">
                      <div className="feat-badge">🌟 UNGGULAN</div>
                      <div className="feat-icon" style={{ overflow: 'hidden' }}>
                        {prod.icon ? (
                          <img src={prod.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={prod.title} />
                        ) : (
                          <i className="lucide-package" />
                        )}
                      </div>
                      <div className="feat-info">
                        <div className="feat-cat">{prod.category || 'AKUN'}</div>
                        <div className="feat-name">{prod.title}</div>
                        <div className="feat-price">Rp {prod.price.toLocaleString("id-ID")}</div>
                        <p className="feat-desc">{prod.description || 'Barang berkualitas pengiriman instant.'}</p>
                        <div className="feat-actions">
                          <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                            Tersedia ({prod.stock_available})
                          </span>
                          <span className="btn btn-gold btn-sm" style={{ pointerEvents: 'none' }}>Beli Sekarang</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Regular Products */}
            {otherProducts.length > 0 && (
              <>
                <div style={{ marginBottom: '20px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                  <div className="eyebrow" style={{ marginTop: '24px' }}>Produk Lainnya</div>
                </div>
                <div className="product-grid">
                  {otherProducts.map((prod: any) => (
                    <Link href={`/product/${prod.id}`} key={prod.id} className="product-card">
                      <div className="product-icon" style={{ overflow: 'hidden', padding: prod.icon ? 0 : '15px' }}>
                        {prod.icon ? (
                          <img src={prod.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={prod.title} />
                        ) : (
                          "📦"
                        )}
                      </div>
                      <div className="product-category">{prod.category || 'AKUN'}</div>
                      <div className="product-name">{prod.title}</div>
                      <div className="product-desc">{prod.description}</div>
                      <div className="product-footer">
                        <span className="product-price">Rp {prod.price.toLocaleString("id-ID")}</span>
                        <span className="stock-badge available">Tersedia</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

          </div>
        </section>

        {/* How it works */}
        <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="wrap">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="eyebrow">Cara Beli</div>
              <h2>Mudah dalam 3 Langkah</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛍️</div>
                <h3 className="text-gold" style={{ marginBottom: '8px' }}>1. Pilih Produk</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-dim)' }}>Pilih produk yang kamu mau, tentukan jumlahnya, masukkan kontak WA/email.</p>
              </div>
              <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📱</div>
                <h3 className="text-gold" style={{ marginBottom: '8px' }}>2. Bayar QRIS</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-dim)' }}>Scan QRIS dari aplikasi e-wallet atau mobile banking manapun. Batas waktu 10 menit.</p>
              </div>
              <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚡</div>
                <h3 className="text-gold" style={{ marginBottom: '8px' }}>3. Terima Produk</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-dim)' }}>Produk dikirim otomatis setelah pembayaran terverifikasi. Lacak pesanan kapan saja.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Track CTA */}
        <section className="section">
          <div className="wrap-xs" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Sudah Bayar?</div>
            <h2 style={{ marginBottom: '12px' }}>Lacak Pesanan Kamu</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '28px' }}>Masukkan kode invoice untuk cek status & ambil produk kamu.</p>
            <form action="/order" method="GET" style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
              <input name="invoice" type="text" className="form-input" placeholder="INV-XXXXXXXX" style={{ flex: 1 }} />
              <button className="btn btn-gold" type="submit">Cek</button>
            </form>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <span>© 2026 KUCAIDL — Digital Store</span>
            <span>Pembayaran aman via QRIS · Pengiriman otomatis</span>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <div className="wa-widget-container">
          <a href={`https://wa.me/${waKucaidl}?text=Hai%20Kak%2C%20saya%20ingin%20bertanya...`} target="_blank" rel="noopener noreferrer" className="wa-float-btn" title="Chat WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
