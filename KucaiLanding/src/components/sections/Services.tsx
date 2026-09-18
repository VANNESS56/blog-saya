"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";

const servicesData = [
  {
    itemType: "DL",
    titleKey: "svc.dlSell.title",
    subtitle: "DL → Rupiah",
    descKey: "svc.dlSell.desc",
    tagKey: "svc.tag.dlSell",
    bg: "hover:bg-violet-950/20",
    tagColor: "bg-violet-950/40 text-violet-300",
    border: "hover:border-violet-700/40",
    href: "https://wa.me/6283163349669?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual%20Diamond%20Lock%20(DL)",
  },
  {
    itemType: "ACC",
    titleKey: "svc.dlBuy.title",
    subtitle: "Rupiah ⇄ Akun GT",
    descKey: "svc.dlBuy.desc",
    tagKey: "svc.tag.dlBuy",
    bg: "hover:bg-amber-950/20",
    tagColor: "bg-amber-950/40 text-amber-300",
    border: "hover:border-amber-700/40",
    href: "https://wa.me/6283892385335?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual/Beli%20Akun%20Growtopia",
  },
  {
    itemType: "BGL",
    titleKey: "svc.bglSell.title",
    subtitle: "BGL → Rupiah",
    descKey: "svc.bglSell.desc",
    tagKey: "svc.tag.bglSell",
    bg: "hover:bg-cyan-950/20",
    tagColor: "bg-cyan-950/40 text-cyan-300",
    border: "hover:border-cyan-700/40",
    href: "https://wa.me/6283163349669?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual%20Blue%20Gem%20Lock%20(BGL)",
  },
  {
    itemType: "WA",
    titleKey: "svc.bglBuy.title",
    subtitle: "Official Kucai Account",
    descKey: "svc.bglBuy.desc",
    tagKey: "svc.tag.bglBuy",
    bg: "hover:bg-[#25D366]/10",
    tagColor: "bg-[#25D366]/15 text-[#25D366]",
    border: "hover:border-[#25D366]/30",
    href: "https://whatsapp.com/channel/0029VbD8Wx9545uqEqWnPY3E",
  },
];

export function Services() {
  const { t } = useLanguage();
  const { waKucaidl, waKucaiakun } = useSettings();

  return (
    <section id="services" className="py-24 ">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold text-primary tracking-widest uppercase mb-3">{t("nav.services")}</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-heading text-[2.25rem] md:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight max-w-md">
              {t("svc.title")}
            </h2>
            <p className="text-[14.5px] text-gray-500 max-w-xs leading-relaxed">
              {t("svc.desc")}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicesData.map((s, i) => {
            let finalHref = s.href;
            if (s.itemType === "DL") {
              finalHref = `https://wa.me/${waKucaidl}?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual%20Diamond%20Lock%20(DL)`;
            } else if (s.itemType === "BGL") {
              finalHref = `https://wa.me/${waKucaidl}?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual%20Blue%20Gem%20Lock%20(BGL)`;
            } else if (s.itemType === "ACC") {
              finalHref = `https://wa.me/${waKucaiakun}?text=Halo%20KUCAIDL,%20saya%20ingin%20Jual/Beli%20Akun%20Growtopia`;
            }
            
            return (
            <motion.a
              key={i}
              href={finalHref}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className={`group relative block bg-[#0a0a0a] border border-gray-800 ${s.border} ${s.bg} rounded-2xl p-7 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  {s.itemType === "WA" || s.itemType === "ACC" ? (
                    <div className="w-[36px] h-[36px] relative flex-shrink-0 rounded-xl overflow-hidden shadow-sm border border-amber-700/40 group-hover:scale-110 transition-transform duration-300">
                      <Image 
                        src="/kucai-account.jpg" 
                        alt="Kucai Account Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-[32px] h-[32px] relative flex-shrink-0">
                      <Image 
                        src={s.itemType === "BGL" ? "/bgl.png" : "/dl.png"} 
                        alt={s.itemType}
                        width={32}
                        height={32}
                        className="drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading text-[15px] font-bold text-white leading-tight">{t(s.titleKey)}</h3>
                    <p className="text-[12px] text-gray-500 font-medium">{s.subtitle}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-5">{t(s.descKey)}</p>

              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${s.tagColor}`}>
                {t(s.tagKey)}
              </div>
            </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
