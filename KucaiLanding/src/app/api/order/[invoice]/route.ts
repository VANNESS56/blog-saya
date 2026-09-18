import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const EXPIRY_MINUTES = 5;

export async function GET(req: Request, { params }: { params: Promise<{ invoice: string }> }) {
  try {
    const invoice = (await params).invoice;

    // 1. Fetch Order
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        digital_products (
          title,
          price,
          icon
        )
      `)
      .eq("invoice_no", invoice)
      .single();

    if (oErr || !order) {
      return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 });
    }

    // 2. Auto-expire pending orders older than 5 minutes
    if (order.payment_status === "pending") {
      const createdAt = new Date(order.created_at).getTime();
      const now = Date.now();
      const elapsed = now - createdAt;

      if (elapsed > EXPIRY_MINUTES * 60 * 1000) {
        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "expired" })
          .eq("id", order.id)
          .eq("payment_status", "pending");

        order.payment_status = "expired";
      }
    }

    // 3. If Paid, fetch stock credentials
    let credentials_data = null;
    if (order.payment_status === "paid" && order.stock_id) {
      const { data: stock, error: sErr } = await supabaseAdmin
        .from("product_stock")
        .select("credentials_data")
        .eq("id", order.stock_id)
        .single();
      
      if (!sErr && stock) {
        credentials_data = stock.credentials_data;
      }
    }

    return NextResponse.json({
      order: order,
      credentials_data: credentials_data
    });

  } catch (error: any) {
    console.error("Fetch Order Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
