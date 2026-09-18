"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function AnimatedNumber({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 5000, suffix: "+", labelKey: "stat.s1.label", descKey: "stat.s1.desc" },
  { value: 1000, suffix: "+", labelKey: "stat.s2.label", descKey: "stat.s2.desc", highlight: true },
  { value: 99, suffix: ".9%", labelKey: "stat.s3.label", descKey: "stat.s3.desc" },
  { value: 24, suffix: "/7", labelKey: "stat.s4.label", descKey: "stat.s4.desc", raw: true },
];

export function Statistics() {
  const { t } = useLanguage();

  return (
    <section className="py-16 border-y border-gray-800/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group p-6 rounded-2xl border transition-all duration-300 ${
                stat.highlight
                  ? "bg-primary text-white border-primary shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
                  : "bg-[#0a0a0a] border-gray-800 hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <p className={`font-heading text-[2rem] md:text-[2.5rem] font-extrabold tracking-tight leading-none mb-1 ${stat.highlight ? "text-white" : "text-white"}`}>
                {stat.raw ? `${stat.value}${stat.suffix}` : <AnimatedNumber to={stat.value} suffix={stat.suffix} />}
              </p>
              <p className={`text-[13px] font-semibold mb-0.5 ${stat.highlight ? "text-white/90" : "text-gray-300"}`}>{t(stat.labelKey)}</p>
              <p className={`text-[11.5px] ${stat.highlight ? "text-white/60" : "text-gray-600"}`}>{t(stat.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
