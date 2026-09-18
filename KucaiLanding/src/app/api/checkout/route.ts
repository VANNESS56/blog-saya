import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --- FIX #3: Rate Limiting for Checkout ---
const checkoutAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_CHECKOUT_PER_MIN = 5;
const CHECKOUT_WINDOW_MS = 60 * 1000;

function checkCheckoutRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = checkoutAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    checkoutAttempts.set(ip, { count: 1, resetAt: now + CHECKOUT_WINDOW_MS });
    return true;
  }

  if (attempt.count >= MAX_CHECKOUT_PER_MIN) return false;
  attempt.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkCheckoutRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
        { status: 429 }
      );
    }

    const { productId, waNumber } = await req.json();

    if (!productId || !waNumber) {
      return NextResponse.json({ error: "Product ID dan Nomor WA wajib diisi" }, { status: 400 });
    }

    // Sanitize waNumber
    const cleanWa = String(waNumber).replace(/[^0-9]/g, "");
    if (cleanWa.length < 9 || cleanWa.length > 15) {
      return NextResponse.json({ error: "Nomor WhatsApp tidak valid" }, { status: 400 });
    }

    // 1. Get Product Details
    const { data: product, error: pErr } = await supabaseAdmin
      .from("digital_products")
      .select("*")
      .eq("id", productId)
      .single();

    if (pErr || !product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // 2. Check Stock
    const { count, error: sErr } = await supabaseAdmin
      .from("product_stock")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId)
      .eq("is_sold", false);

    if (sErr || count === null || count === 0) {
      return NextResponse.json({ error: "Maaf, stok produk ini sedang kosong" }, { status: 400 });
    }

    // --- FIX #4: Secure Invoice ID ---
    const randomPart = crypto.randomBytes(12).toString("base64url");
    const invoiceNo = `INV-${randomPart}`;

    const amount = product.price;
    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT;

    if (!apiKey || !projectSlug) {
      return NextResponse.json({ error: "Konfigurasi Pakasir belum di-set di server" }, { status: 500 });
    }

    // 4. Call Pakasir API
    const pakasirRes = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: projectSlug,
        order_id: invoiceNo,
        amount: amount,
        api_key: apiKey
      }),
    });

    const pakasirData = await pakasirRes.json();

    if (!pakasirRes.ok || !pakasirData.payment || !pakasirData.payment.payment_number) {
      console.error("Pakasir API Error:", pakasirData);
      return NextResponse.json({ error: "Gagal membuat tagihan pembayaran dari gateway" }, { status: 500 });
    }

    const qrisString = pakasirData.payment.payment_number;

    // 5. Save to Database
    const { error: insertErr } = await supabaseAdmin.from("orders").insert({
      invoice_no: invoiceNo,
      product_id: productId,
      customer_wa: cleanWa,
      amount: amount,
      payment_method: "qris",
      qris_string: qrisString,
      payment_status: "pending"
    });

    if (insertErr) {
      console.error("DB Insert Error:", insertErr);
      return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
    }

    return NextResponse.json({ success: true, invoice_no: invoiceNo });

  } catch (error: any) {
    console.error("Checkout Exception:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
