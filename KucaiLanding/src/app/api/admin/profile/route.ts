import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, hashPassword } from "@/lib/adminAuth";
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
    const { action, data } = await req.json();

    switch (action) {
      case "getSessions": {
        const { data: sessions, error } = await supabaseAdmin
          .from("admin_sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Return current session info to highlight it
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("admin_session")?.value;
        const currentHmac = sessionToken ? sessionToken.substring(sessionToken.indexOf(".") + 1) : "";

        return NextResponse.json({ success: true, data: sessions, currentSession: currentHmac });
      }

      case "revokeSession": {
        if (!data?.id) return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        const { error } = await supabaseAdmin
          .from("admin_sessions")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "updateCredentials": {
        if (!data?.username || !data?.password) {
          return NextResponse.json({ error: "Username and password required" }, { status: 400 });
        }
        
        const newPasswordHash = hashPassword(data.password);
        
        const { error: userError } = await supabaseAdmin
          .from("site_settings")
          .upsert({ key: "admin_username", value: data.username, description: "Username untuk login Admin Dashboard" });
          
        const { error: passError } = await supabaseAdmin
          .from("site_settings")
          .upsert({ key: "admin_password_hash", value: newPasswordHash, description: "Password Admin (Hashed)" });

        if (userError || passError) throw userError || passError;
        
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Profile API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
