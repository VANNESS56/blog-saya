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
    <section id="reviews" className="py-14 px-4 md:px-6 section-glow">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-end gap-5 mb-8">
          <div>
            <span className="text-[12px] font-black tracking-[0.16em] text-amber-400/70 uppercase">Testimoni</span>
            <h2 className="text-[clamp(26px,3.5vw,38px)] font-black text-white tracking-tight mt-1">| Bukti Transaksi</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")}
              className="w-9 h-9 rounded-xl glass-card !p-0 flex items-center justify-center text-gray-500 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")}
              className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
          {testimonials.map((t) => (
            <div key={t.id}
              className="flex-none w-[260px] glass-card rounded-[18px] overflow-hidden group">
              {/* Image */}
              <div className="relative w-full aspect-[3/4] bg-amber-950/20 overflow-hidden">
                {t.image_url ? (
                  <img
                    src={t.image_url}
                    alt={`Testimoni ${t.buyer_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm font-bold">
                    No Image
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
