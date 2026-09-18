"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function SocialMedia() {
  const { t } = useLanguage();
  const [socials, setSocials] = useState({ ig: "Loading...", tt: "Loading..." });

  useEffect(() => {
    fetch('/api/socials')
      .then(res => res.json())
      .then(data => setSocials({ ig: data.ig, tt: data.tt }))
      .catch(() => setSocials({ ig: "19.5K", tt: "1.2K" }));
  }, []);

  return (
    <section className="py-8 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto bg-[#08122a] border border-[#1e293b] rounded-[24px] p-6 md:p-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 mb-6 border-b border-blue-900/30 pb-4">
          <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">
            Social Media
          </span>
          <h2 className="text-[24px] md:text-[28px] font-black text-white tracking-tight mt-1">
            Ikuti Kucaidl
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          
          {/* Instagram */}
          <a href="https://instagram.com/kucaidlofficial" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-between p-4 md:p-5 rounded-[16px] bg-[#0c1838] border border-blue-500/20 hover:border-blue-500/50 hover:bg-[#11224d] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[12px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px]">
                <div className="w-full h-full bg-[#0c1838] rounded-[10px] flex items-center justify-center">
                  <Image src="/ig-logo.png" alt="IG Logo" width={32} height={32} className="rounded-md object-contain" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] md:text-[18px] font-bold text-white">Instagram</h3>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#45A9FF] shrink-0" fill="currentColor">
                    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.05l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12z" />
                    <path fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="m7.5 12.5 3 3 6-7" />
                  </svg>
                </div>
                <span className="text-[12px] text-gray-400">@kucaidlofficial</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] md:text-[24px] font-black text-white">{socials.ig}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Pengikut</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* TikTok */}
          <a href="https://tiktok.com/@kucaidl" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-between p-4 md:p-5 rounded-[16px] bg-[#0c1838] border border-blue-500/20 hover:border-blue-500/50 hover:bg-[#11224d] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[12px] bg-black p-[2px] border border-gray-800">
                <div className="w-full h-full bg-[#0c1838] rounded-[10px] flex items-center justify-center">
                  <Image src="/tiktok-logo.png" alt="TikTok Logo" width={32} height={32} className="rounded-md object-contain" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] md:text-[18px] font-bold text-white">TikTok</h3>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#45A9FF] shrink-0" fill="currentColor">
                    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.05l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12z" />
                    <path fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="m7.5 12.5 3 3 6-7" />
                  </svg>
                </div>
                <span className="text-[12px] text-gray-400">@kucaidl</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] md:text-[24px] font-black text-white">{socials.tt}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Pengikut</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
