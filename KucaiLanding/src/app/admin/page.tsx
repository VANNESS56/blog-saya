import { cookies } from "next/headers";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";
import { verifySessionToken } from "@/lib/adminAuth";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  const isAuthenticated = sessionCookie
    ? await verifySessionToken(sessionCookie.value)
    : false;

  return (
    <>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
}
