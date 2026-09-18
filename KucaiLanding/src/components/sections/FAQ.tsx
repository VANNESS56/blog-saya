"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const faqs = [
  { qKey: "faq.q1.q", aKey: "faq.q1.a" },
  { qKey: "faq.q2.q", aKey: "faq.q2.a" },
  { qKey: "faq.q3.q", aKey: "faq.q3.a" },
  { qKey: "faq.q4.q", aKey: "faq.q4.a" },
  { qKey: "faq.q5.q", aKey: "faq.q5.a" },
];

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_580px] gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-[12px] font-semibold text-primary tracking-widest uppercase mb-3">{t("faq.eyebrow")}</p>
            <h2 className="font-heading text-[2.25rem] md:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight mb-5">
              {t("faq.title")}
            </h2>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-8 max-w-xs">
              {t("faq.desc")}
            </p>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-gray-800">
              <p className="text-[13.5px] font-semibold text-white mb-1">{t("faq.help.title")}</p>
              <p className="text-[12.5px] text-gray-500 mb-4">{t("faq.help.desc")}</p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {t("faq.help.link")}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Accordion className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-gray-800 py-1"
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold font-heading text-white hover:text-primary transition-colors py-4 hover:no-underline">
                    {t(faq.qKey)}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13.5px] text-gray-500 leading-relaxed pb-4">
                    {t(faq.aKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
