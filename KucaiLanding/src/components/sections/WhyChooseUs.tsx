"use client";

import { Zap, ShieldCheck, DollarSign, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const features = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "100% Aman", desc: "Setiap transaksi dijamin keamanannya. Proses transparan dari awal hingga akhir.", gradient: "from-emerald-500 to-emerald-600" },
  { icon: <Zap className="w-5 h-5" />, title: "Proses Instan", desc: "Pengiriman DL & BGL langsung ke world kamu dalam hitungan menit.", gradient: "from-amber-500 to-amber-600" },
  { icon: <DollarSign className="w-5 h-5" />, title: "Harga Terbaik", desc: "Rate paling kompetitif di pasaran dengan update otomatis secara real-time.", gradient: "from-violet-500 to-violet-600" },
  { icon: <Award className="w-5 h-5" />, title: "Seller Terpercaya", desc: "Sudah melayani 1000+ transaksi sukses. Reputasi terjaga sejak hari pertama.", gradient: "from-rose-500 to-rose-600" },
];

export function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section id="trust" className="py-16 px-4 md:px-6 section-glow">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] font-black tracking-[0.16em] text-amber-400/70 uppercase">Kenapa Kami?</span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-black text-white tracking-tight mt-2">KEUNGGULAN KUCAIDL</h2>
          <p className="text-[13px] text-gray-600 mt-3 max-w-md mx-auto">Kami berdedikasi memberikan pengalaman transaksi terbaik untuk setiap pemain Growtopia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i}
              className="glass-card rounded-[18px] p-6 hover:translate-y-[-4px] transition-all duration-300 group cursor-default">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[12px] text-gray-500 leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
