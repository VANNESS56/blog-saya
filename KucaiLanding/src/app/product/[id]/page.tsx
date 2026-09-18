import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductDetailClient from "./ProductDetailClient";
import CidClassicProductDetail from "@/components/themes/CidClassicProductDetail";

export const revalidate = 0; // Dynamic rendering

export default async function ProductPageWrapper({ params }: { params: { id: string } }) {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "active_theme")
    .single();

  const activeTheme = data?.value || "cid-dark";

  if (activeTheme === "cid-classic") {
    return <CidClassicProductDetail productId={params.id} />;
  }

  return <ProductDetailClient />;
}
