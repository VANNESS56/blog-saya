import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Get all products
    const { data: products, error } = await supabaseAdmin
      .from("digital_products")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    // Get stock counts per product
    const enriched = await Promise.all(
      (products || []).map(async (p) => {
        const { count } = await supabaseAdmin
          .from("product_stock")
          .select("*", { count: "exact", head: true })
          .eq("product_id", p.id)
          .eq("is_sold", false);
        return { ...p, stock_available: count || 0 };
      })
    );

    return NextResponse.json({ data: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
