import { supabaseAdmin } from "@/lib/supabaseAdmin";
import InvoiceClient from "./InvoiceClient";
import CidClassicInvoice from "@/components/themes/CidClassicInvoice";

export const revalidate = 0; // Dynamic rendering

export default async function InvoicePageWrapper({ params }: { params: Promise<{ invoice: string }> }) {
  const { invoice } = await params;
  
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "active_theme")
    .single();

  const activeTheme = data?.value || "cid-dark";

  if (activeTheme === "cid-classic") {
    return <CidClassicInvoice invoice={invoice} />;
  }

  return <InvoiceClient />;
}
