import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CidDarkTheme } from "@/components/themes/CidDarkTheme";
import { MinimalistTheme } from "@/components/themes/MinimalistTheme";
import { GamingTheme } from "@/components/themes/GamingTheme";
import { CidClassicTheme } from "@/components/themes/CidClassicTheme";

export const revalidate = 0; // Disable cache so theme changes apply instantly

export default async function Home() {
  // Fetch active theme from database
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "active_theme")
    .single();

  const activeTheme = data?.value || "cid-dark";

  // Render the appropriate theme component
  switch (activeTheme) {
    case "cid-classic":
      return <CidClassicTheme />;
    case "minimalist":
      return <MinimalistTheme />;
    case "gaming":
      return <GamingTheme />;
    case "cid-dark":
    default:
      return <CidDarkTheme />;
  }
}
