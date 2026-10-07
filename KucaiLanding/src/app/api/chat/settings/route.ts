import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULT_BUY_TEXT = `Rate beli ke KucaiDL 🤗
DL : 785
BGL : 78.500

Gopay  = 081367232472 an Desi
Dana    = 081367232472 an Desi
Bank  =  Khusus Bank TF ke QRIS

‼️Payment transfer ke ewallet di atas ya thankyou 🥰

NOTE ❗️ : klo udah tf kirim nama world, growid 

👸 Admin Desi KUCAIDL`;

export async function GET() {
  const keys = ["buy_rate_text", "sell_rate_text", "qris_image_url"];
  const { data: rows } = await supabaseAdmin
    .from("site_settings")
    .select("key, value")
    .in("key", keys);

  const settings: Record<string, string> = {};
  for (const row of rows || []) settings[row.key] = row.value;

  return NextResponse.json({
    buy_rate_text: settings.buy_rate_text || DEFAULT_BUY_TEXT,
    sell_rate_text: settings.sell_rate_text || "",
    qris_image_url: settings.qris_image_url || "",
  });
}
