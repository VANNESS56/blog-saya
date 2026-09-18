const fs = require('fs');
const file = 'src/components/sections/WhatsAppOrder.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add useLanguage import
if (!content.includes('useLanguage')) {
  content = content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { useLanguage } from "@/lib/i18n/LanguageContext";');
}

// Add const { t } = useLanguage();
if (!content.includes('const { t } = useLanguage();')) {
  content = content.replace('export function WhatsAppOrder() {', 'export function WhatsAppOrder() {\n  const { t } = useLanguage();');
}

// Replace texts
const replacements = {
  'Pemesanan Mudah': '{t("wa.easy")}',
  'MANUAL CHECKOUT': '{t("wa.manual")}',
  'Isi detail pesanan di bawah untuk dihubungkan langsung ke admin WhatsApp resmi kami.': '{t("wa.desc")}',
  'KucaiDL Official Store': '{t("wa.store")}',
  'ONLINE & SIAP MELAYANI': '{t("wa.online")}',
  'Beli Produk': '{t("wa.buy")}',
  'Jual Produk': '{t("wa.sell")}',
  'Detail Pengiriman': '{t("wa.shipping")}',
  'Tujuan Pengiriman': '{t("wa.destination")}',
  '>Nama World<': '>{t("wa.world")}<',
  'Owner World / GrowID': '{t("wa.owner")}',
  '>Metode Pengiriman<': '>{t("wa.method")}<',
  'Donation Box (Max 3 BGL)': '{t("wa.donation")}',
  'Display Box': '{t("wa.display")}',
  'Drop Langsung (Trade)': '{t("wa.drop")}',
  'Lokasi Kotak': '{t("wa.location")}',
  'Contoh: Kanan pintu masuk': '{t("wa.locationPh")}',
  'Nomor WhatsApp': '{t("wa.whatsapp")}',
  'Mulai dari 08... atau 628...': '{t("wa.whatsappPh")}',
  '>Pilih Jumlah Produk<': '>{t("wa.amount")}<',
  '>Catatan Tambahan<': '>{t("wa.notes")}<',
  '\\(Opsional\\)': '{t("wa.optional")}',
  'Pesan khusus untuk admin...': '{t("wa.notesPh")}',
  '>Subtotal<': '>{t("wa.subtotal")}<',
  '>Pesanan<': '>{t("wa.order")}<',
  '>Pendapatan<': '>{t("wa.income")}<',
  '>Lanjut ke Pembayaran<': '>{t("wa.btnBuy")}<',
  '>Jual & Hubungi Admin<': '>{t("wa.btnSell")}<'
};

for (const [key, val] of Object.entries(replacements)) {
  if (key.includes('>')) {
    content = content.replace(new RegExp(key, 'g'), val);
  } else if (key === '\\(Opsional\\)') {
    content = content.replace(new RegExp(key, 'g'), val);
  } else if (val.includes('wa.locationPh') || val.includes('wa.whatsappPh') || val.includes('wa.notesPh')) {
    content = content.replace(new RegExp(`placeholder="${key}"`, 'g'), `placeholder={t("${val.match(/"([^"]+)"/)[1]}")}`);
  } else {
    // For normal texts, assume they are inside tags
    content = content.replace(new RegExp(`>${key}<`, 'g'), `>${val}<`);
  }
}

fs.writeFileSync(file, content);
console.log('WhatsAppOrder.tsx localized!');
