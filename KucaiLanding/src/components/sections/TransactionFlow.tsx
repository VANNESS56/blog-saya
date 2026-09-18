"use client";

import { motion } from "framer-motion";
import { MessageCircle, ListChecks, CreditCard, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const steps = [
  {
    number: "01",
    titleKey: "flow.s1.title",
    descKey: "flow.s1.desc",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "text-amber-400 bg-amber-950/40 border-amber-900/50",
  },
  {
    number: "02",
    titleKey: "flow.s3.title",
    descKey: "flow.s3.desc",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-amber-400 bg-amber-950/40 border-amber-900/50",
  },
  {
    number: "03",
    titleKey: "flow.s4.title",
    descKey: "flow.s4.desc",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50",
  },
];

export function TransactionFlow() {
  const { t } = useLanguage();

  return (
    <section className="py-24 border-t border-gray-800/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-16"
        >
          <p className="text-[12px] font-semibold text-primary tracking-widest uppercase mb-3">{t("flow.eyebrow")}</p>
          <h2 className="font-heading text-[2.25rem] md:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight">
            {t("flow.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-sm"
            >
              <p className="font-heading text-[3rem] font-extrabold text-white/[0.04] leading-none absolute top-4 right-5 select-none">
                {step.number}
              </p>

              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${step.color} mb-5`}>
                {step.icon}
              </div>

              <h3 className="font-heading text-[15px] font-bold text-white mb-2 tracking-tight">{t(step.titleKey)}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{t(step.descKey)}</p>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-gray-700" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
