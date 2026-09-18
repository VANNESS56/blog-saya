import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session ? await verifySessionToken(session.value) : false;
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      // ─── Orders ───
      case "fetchOrders": {
        // Auto-expire pending orders older than 5 minutes
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "expired" })
          .eq("payment_status", "pending")
          .lt("created_at", fiveMinAgo);

        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select(`*, digital_products(title)`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return NextResponse.json({ data: orders });
      }

      // ─── Stock ───
      case "fetchStock": {
        const { data: stock, error } = await supabaseAdmin
          .from("product_stock")
          .select(`*, digital_products(title)`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return NextResponse.json({ data: stock });
      }

      case "addStock": {
        const { product_id, credentials_data } = data;
        const { error } = await supabaseAdmin
          .from("product_stock")
          .insert({ product_id, credentials_data, is_sold: false });
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "deleteStock": {
        const { id } = data;
        const { error } = await supabaseAdmin
          .from("product_stock")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      
      case "fetchDigitalProducts": {
        const { data: products, error } = await supabaseAdmin
          .from("digital_products")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        return NextResponse.json({ data: products });
      }

      case "addDigitalProduct": {
        const { category, title, description, price, icon } = data;
        const { error } = await supabaseAdmin
          .from("digital_products")
          .insert({ category, title, description, price, icon, status: "TERSEDIA" });
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "updateDigitalProduct": {
        const { id, category, title, description, price, icon } = data;
        const updates: any = {};
        if (category !== undefined) updates.category = category;
        if (title !== undefined) updates.title = String(title).slice(0, 200);
        if (description !== undefined) updates.description = String(description).slice(0, 1000);
        if (price !== undefined) updates.price = Number(price);
        if (icon !== undefined) updates.icon = icon;
        const { error } = await supabaseAdmin
          .from("digital_products")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "deleteDigitalProduct": {
        const { id } = data;
        const { error } = await supabaseAdmin
          .from("digital_products")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin Ecommerce API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
