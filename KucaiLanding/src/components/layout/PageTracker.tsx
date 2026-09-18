"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function PageTracker() {
  useEffect(() => {
    // Memanggil fungsi increment_page_view di Supabase setiap kali halaman dimuat (client-side)
    const trackView = async () => {
      await supabase.rpc("increment_page_view");
    };
    
    // Gunakan strict mode check jika dibutuhkan, tapi untuk tracker sederhana ini cukup jalan sekali
    trackView();
  }, []);

  return null;
}
