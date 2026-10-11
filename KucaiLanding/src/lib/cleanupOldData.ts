import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function cleanupOldKucaiData() {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Select chat sessions older than 24 hours
    const { data: oldSessions, error: selectErr } = await supabaseAdmin
      .from("chat_sessions")
      .select("id")
      .lt("created_at", oneDayAgo);

    if (selectErr) {
      console.error("Error selecting old sessions:", selectErr);
      return { success: false, error: selectErr.message };
    }

    if (oldSessions && oldSessions.length > 0) {
      const oldIds = oldSessions.map((s: any) => s.id);

      // 1. Gather all image URLs from messages to clean up physical storage files
      const { data: msgsWithImages } = await supabaseAdmin
        .from("chat_messages")
        .select("image_url")
        .in("session_id", oldIds)
        .not("image_url", "is", null);

      if (msgsWithImages && msgsWithImages.length > 0) {
        const filePaths: string[] = [];
        for (const m of msgsWithImages) {
          if (m.image_url) {
            const parts = m.image_url.split("/kucaidl/");
            if (parts.length > 1) {
              filePaths.push(parts[1]);
            }
          }
        }
        if (filePaths.length > 0) {
          try {
            await supabaseAdmin.storage.from("kucaidl").remove(filePaths);
          } catch (storageErr) {
            console.error("Error removing storage files:", storageErr);
          }
        }
      }

      // 2. Delete messages and sessions
      await supabaseAdmin.from("chat_messages").delete().in("session_id", oldIds);
      await supabaseAdmin.from("chat_sessions").delete().in("id", oldIds);

      return { success: true, count: oldIds.length };
    }

    return { success: true, count: 0 };
  } catch (error: any) {
    console.error("Failed to run cleanupOldKucaiData:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}
