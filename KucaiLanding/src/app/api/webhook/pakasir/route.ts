import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  const secret = process.env.PAKASIR_WEBHOOK_SECRET;
  if (!secret) {
    // If no secret configured, fall back to API key verification
    return false;
  }
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    console.log("Pakasir Webhook Received:", JSON.stringify(body));

    // --- FIX #1: Webhook Signature Validation ---
    const signature = req.headers.get("x-pakasir-signature") || req.headers.get("x-signature");
    const hasWebhookSecret = !!process.env.PAKASIR_WEBHOOK_SECRET;

    if (hasWebhookSecret) {
      if (!verifyWebhookSignature(rawBody, signature)) {
        console.error("Invalid webhook signature! Possible spoofing attempt.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    } else {
      // Fallback: validate using API key if sent, plus project slug
      const apiKeyHeader = req.headers.get("x-api-key") || body.api_key;
      const expectedApiKey = process.env.PAKASIR_API_KEY;
      if (expectedApiKey && apiKeyHeader !== expectedApiKey) {
        // Also verify project slug
        if (body.project !== process.env.PAKASIR_PROJECT) {
          console.error("Invalid project or API key in webhook");
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
    }

    const { order_id, status, project } = body;

    // Validate project slug
    if (project !== process.env.PAKASIR_PROJECT) {
      console.log("Invalid project:", project, "expected:", process.env.PAKASIR_PROJECT);
      return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    }

    // Accept both "completed" and "paid"
    if (status !== "completed" && status !== "paid") {
      return NextResponse.json({ success: true, message: "Ignored non-paid status" });
    }

    // 1. Get the order
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("invoice_no", order_id)
      .single();

    if (oErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ success: true, message: "Already paid" });
    }

    if (order.payment_status === "expired") {
      return NextResponse.json({ success: false, message: "Order expired" });
    }

    // Auto-expire if older than 5 minutes
    const createdAt = new Date(order.created_at).getTime();
    if (Date.now() - createdAt > 5 * 60 * 1000) {
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "expired" })
        .eq("id", order.id)
        .eq("payment_status", "pending");
      return NextResponse.json({ success: false, message: "Order expired" });
    }

    // --- FIX #2: Atomic Stock Assignment via RPC ---
    // Try to claim stock atomically to prevent race conditions
    let assignedStockId = null;
    const { data: claimedStock, error: rpcErr } = await supabaseAdmin
      .rpc("claim_stock", { p_product_id: order.product_id });

    if (!rpcErr && claimedStock) {
      assignedStockId = claimedStock;
    } else {
      // Fallback: try the old way if RPC doesn't exist yet
      const { data: stock, error: sErr } = await supabaseAdmin
        .from("product_stock")
        .select("id")
        .eq("product_id", order.product_id)
        .eq("is_sold", false)
        .limit(1)
        .single();

      if (!sErr && stock) {
        const { error: updateStockErr } = await supabaseAdmin
          .from("product_stock")
          .update({ is_sold: true })
          .eq("id", stock.id)
          .eq("is_sold", false); // double-check to reduce race window

        if (!updateStockErr) {
          assignedStockId = stock.id;
        }
      }
    }

    // 3. Update Order
    const { error: updateOrderErr } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        stock_id: assignedStockId,
        completed_at: new Date().toISOString()
      })
      .eq("id", order.id)
      .eq("payment_status", "pending"); // only update if still pending (idempotent)

    if (updateOrderErr) {
      console.error("Failed to update order status:", updateOrderErr);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Webhook Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
