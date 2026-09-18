import { supabaseAdmin } from "@/lib/supabaseAdmin";
import OrderSearchClient from "./OrderSearchClient";
import CidClassicOrderSearch from "@/components/themes/CidClassicOrderSearch";

export const revalidate = 0; // Dynamic rendering

export default async function OrderSearchPageWrapper() {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "active_theme")
    .single();

  const activeTheme = data?.value || "cid-dark";

  if (activeTheme === "cid-classic") {
    return <CidClassicOrderSearch />;
  }

  return <OrderSearchClient />;
}
