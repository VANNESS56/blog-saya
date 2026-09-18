"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SettingsContextType {
  waKucaidl: string;
  waKucaiakun: string;
  socialIg: string;
  socialDiscord: string;
  waCta: string;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [waKucaidl, setWaKucaidl] = useState<string>("6283163349669");
  const [waKucaiakun, setWaKucaiakun] = useState<string>("6283892385335");
  const [socialIg, setSocialIg] = useState<string>("");
  const [socialDiscord, setSocialDiscord] = useState<string>("");
  const [waCta, setWaCta] = useState<string>("6283163349669");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("key, value");
        if (data && !error) {
          data.forEach((setting) => {
            if (setting.key === "wa_kucaidl") {
              setWaKucaidl(setting.value);
            } else if (setting.key === "wa_kucaiakun") {
              setWaKucaiakun(setting.value);
            } else if (setting.key === "social_instagram") {
              setSocialIg(setting.value);
            } else if (setting.key === "social_discord") {
              setSocialDiscord(setting.value);
            } else if (setting.key === "wa_cta") {
              setWaCta(setting.value);
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Setup realtime subscription
    const channel = supabase.channel("site-settings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, fetchSettings)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ waKucaidl, waKucaiakun, socialIg, socialDiscord, waCta, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
