import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  checkRateLimit,
  verifyCredentials,
  createSessionToken,
} from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (await verifyCredentials(username, password)) {
      const token = createSessionToken();
      const dotIndex = token.indexOf(".");
      const hmac = token.substring(dotIndex + 1);
      
      const userAgent = req.headers.get("user-agent") || "Unknown Device";

      const { error } = await supabaseAdmin.from("admin_sessions").insert({
        token_hash: hmac,
        device_info: userAgent,
        ip_address: ip
      });

      if (error) {
        console.error("Failed to store session", error);
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
      }

      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  
  if (sessionCookie) {
    const dotIndex = sessionCookie.value.indexOf(".");
    if (dotIndex !== -1) {
      const hmac = sessionCookie.value.substring(dotIndex + 1);
      await supabaseAdmin.from("admin_sessions").delete().eq("token_hash", hmac);
    }
  }

  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
