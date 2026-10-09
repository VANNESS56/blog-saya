"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, type Testimonial } from "@/lib/supabase";

export function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
    const channel = supabase.channel("testimonials-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, fetchTestimonials)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  if (testimonials.length === 0) return null;

  return (
    <section id="reviews" className="pt-16 pb-8 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="glass-card rounded-[24px] p-6 md:p-8 border border-white/5 bg-[#0a0f1c]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <span className="bg-sky-500/20 text-sky-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">REVIEW</span>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold text-white tracking-tight mt-3">Kata para pembeli</h2>
              <p className="text-[13px] text-gray-400 mt-1">Review terbaru dari pembeli KucaiDL.</p>
            </div>
          </div>

          <div className="overflow-hidden relative -mx-2 px-2 group">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#0a0f1c] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#0a0f1c] to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-max animate-[ticker_40s_linear_infinite] group-hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div key={`${t.id}-${idx}`}
                  className="flex-none w-[200px] md:w-[240px] bg-[#121826] border border-white/5 rounded-[20px] p-2 mx-2 hover:border-white/10 transition-colors">
                  
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-amber-950/20">
                    {t.image_url ? (
                      <img src={t.image_url} alt={`Testimoni ${t.buyer_name || 'pembeli'}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <div className="flex items-center justify-center h-full text-gray-500 text-xs">No Image</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
