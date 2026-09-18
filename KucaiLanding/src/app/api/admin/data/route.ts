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
      // ─── Dashboard ───
      case "fetchDashboardStats": {
        const [accounts, testimonials, products, settings, pageViews] =
          await Promise.all([
            supabaseAdmin
              .from("accounts")
              .select("*", { count: "exact", head: true })
              .eq("status", "available"),
            supabaseAdmin
              .from("testimonials")
              .select("*", { count: "exact", head: true }),
            supabaseAdmin.from("products").select("*"),
            supabaseAdmin.from("settings").select("*"),
            supabaseAdmin
              .from("page_views")
              .select("view_count")
              .eq("id", 1)
              .single(),
          ]);

        let bglSell = 0;
        if (settings.data) {
          const configRow = settings.data.find(
            (s: any) => s.key === "config"
          );
          if (configRow?.value) {
            try {
              bglSell = JSON.parse(configRow.value).sellRate || 0;
            } catch {}
          }
        }

        return NextResponse.json({
          accounts: accounts.count || 0,
          testimonials: testimonials.count || 0,
          bglRate: bglSell,
          dlRate: Math.floor(bglSell / 100),
          visitors: pageViews.data?.view_count || 0,
        });
      }

      // ─── Accounts ───
      case "fetchAccounts": {
        const { data: accounts } = await supabaseAdmin
          .from("accounts")
          .select("*")
          .order("created_at", { ascending: false });
        return NextResponse.json({ data: accounts });
      }
      case "addAccount": {
        const { error } = await supabaseAdmin.from("accounts").insert({
          title: String(data.title || "").slice(0, 200),
          price: Number(data.price),
          description: String(data.description || "").slice(0, 500),
          image_url: data.image_url,
          status: "available",
        });
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }
      case "deleteAccount": {
        const { error } = await supabaseAdmin
          .from("accounts")
          .delete()
          .eq("id", Number(data.id));
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      // ─── Testimonials ───
      case "fetchTestimonials": {
        const { data: testimonials } = await supabaseAdmin
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });
        return NextResponse.json({ data: testimonials });
      }
      case "addTestimonial": {
        const { error } = await supabaseAdmin.from("testimonials").insert({
          buyer_name: "-",
          item_bought: "-",
          content: "",
          image_url: data.image_url,
          rating: 5,
        });
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }
      case "deleteTestimonial": {
        const { error } = await supabaseAdmin
          .from("testimonials")
          .delete()
          .eq("id", Number(data.id));
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      // ─── Reputations ───
      case "fetchReputations": {
        const { data: reputations } = await supabaseAdmin
          .from("reputations")
          .select("*")
          .order("created_at", { ascending: false });
        return NextResponse.json({ data: reputations });
      }
      case "updateReputationStatus": {
        const allowedStatuses = ["approved", "rejected", "pending"];
        if (!allowedStatuses.includes(data.status)) {
          return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 }
          );
        }
        const { error } = await supabaseAdmin
          .from("reputations")
          .update({ status: data.status })
          .eq("id", Number(data.id));
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }
      case "deleteReputation": {
        const { error } = await supabaseAdmin
          .from("reputations")
          .delete()
          .eq("id", Number(data.id));
        if (error)
          return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
      }

      // ─── Settings ───
      case "fetchSettings": {
        const [products, settings, siteSettings] = await Promise.all([
          supabaseAdmin.from("products").select("*"),
          supabaseAdmin.from("settings").select("*"),
          supabaseAdmin.from("site_settings").select("*"),
        ]);
        return NextResponse.json({
          products: products.data,
          settings: settings.data,
          siteSettings: siteSettings.data,
        });
      }
      case "saveSettings": {
        const { buyBgl, buyDl, sellBgl, waKucaidl, waKucaiakun } = data;

        await supabaseAdmin
          .from("products")
          .update({ price: Number(buyBgl) })
          .eq("type", "bgl");
        await supabaseAdmin
          .from("products")
          .update({ price: Number(buyDl) })
          .eq("type", "dl");

        const { data: sData } = await supabaseAdmin
          .from("settings")
          .select("*")
          .eq("key", "config")
          .single();
        let configVal: any = {};
        if (sData?.value) {
          try {
            configVal = JSON.parse(sData.value);
          } catch {}
        }
        configVal = { ...configVal, sellRate: Number(sellBgl) };
        if (sData) {
          await supabaseAdmin
            .from("settings")
            .update({ value: JSON.stringify(configVal) })
            .eq("key", "config");
        } else {
          await supabaseAdmin
            .from("settings")
            .insert({ key: "config", value: JSON.stringify(configVal) });
        }

        // Sanitize WhatsApp numbers (digits only)
        const sanitizePhone = (v: string) => v.replace(/[^0-9]/g, "");
        if (waKucaidl) {
          await supabaseAdmin.from("site_settings").upsert({
            key: "wa_kucaidl",
            value: sanitizePhone(waKucaidl),
            description: "Nomor WhatsApp Utama (KUCAIDL)",
          });
        }
        if (waKucaiakun) {
          await supabaseAdmin.from("site_settings").upsert({
            key: "wa_kucaiakun",
            value: sanitizePhone(waKucaiakun),
            description: "Nomor WhatsApp Akun (KucaiAkun)",
          });
        }

        return NextResponse.json({ success: true });
      }

      case "updateTheme": {
        const { theme } = data;
        if (!theme) return NextResponse.json({ error: "Theme required" }, { status: 400 });
        
        await supabaseAdmin.from("site_settings").upsert({
          key: "active_theme",
          value: theme,
          description: "Active website theme (e.g. cid-dark, minimalist, gaming)"
        });
        
        return NextResponse.json({ success: true });
      }

      case "saveThemeSettings": {
        const { social_instagram, social_discord, wa_cta } = data;
        
        if (social_instagram !== undefined) {
          await supabaseAdmin.from("site_settings").upsert({
            key: "social_instagram",
            value: social_instagram,
            description: "Link Instagram"
          });
        }
        
        if (social_discord !== undefined) {
          await supabaseAdmin.from("site_settings").upsert({
            key: "social_discord",
            value: social_discord,
            description: "Link Discord"
          });
        }
        
        if (wa_cta !== undefined) {
          await supabaseAdmin.from("site_settings").upsert({
            key: "wa_cta",
            value: wa_cta,
            description: "WhatsApp Floating CTA (Phone Number)"
          });
        }
        
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
