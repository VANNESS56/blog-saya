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
            
            <div className="flex gap-2 self-end">
              <button onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x">
            {testimonials.map((t) => (
              <div key={t.id}
                className="flex-none w-[300px] md:w-[380px] bg-[#121826] border border-white/5 rounded-2xl p-5 snap-start hover:border-white/10 transition-colors">
                <div className="flex text-amber-400 mb-3 text-[14px]">
                  {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                </div>
                <h3 className="text-white font-bold text-[15px] mb-6 line-clamp-3">"{t.content || "MANTULL JIWA bgt top"}"</h3>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shrink-0">
                    {t.buyer_name ? t.buyer_name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="text-[13px] text-gray-300 font-medium truncate">
                    <span className="text-white font-bold">{t.buyer_name || "Customer"}</span> 
                    {t.item_bought && <span className="text-gray-400"> • {t.item_bought}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
