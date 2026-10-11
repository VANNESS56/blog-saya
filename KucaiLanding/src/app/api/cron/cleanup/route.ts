import { NextResponse } from "next/server";
import { cleanupOldKucaiData } from "@/lib/cleanupOldData";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await cleanupOldKucaiData();
  return NextResponse.json({
    message: "Daily cleanup executed",
    ...result,
    timestamp: new Date().toISOString(),
  });
}
