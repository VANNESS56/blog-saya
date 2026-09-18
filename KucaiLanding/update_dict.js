const fs = require('fs');
const file = 'src/lib/i18n/dictionaries.ts';
let content = fs.readFileSync(file, 'utf8');
const newTrans = `
  // Accounts
  "acc.available": { id: "Tersedia", en: "Available", cn: "可用" },
  "acc.title": { id: "Akun Growtopia", en: "Growtopia Accounts", cn: "Growtopia 账号" },
  "acc.ready": { id: "Ready", en: "Ready", cn: "有货" },
  "acc.buy": { id: "Beli", en: "Buy", cn: "购买" },

  // WhatsApp Order
  "wa.easy": { id: "Pemesanan Mudah", en: "Easy Ordering", cn: "轻松订购" },
  "wa.manual": { id: "MANUAL CHECKOUT", en: "MANUAL CHECKOUT", cn: "手动结账" },
  "wa.desc": { id: "Isi detail pesanan di bawah untuk dihubungkan langsung ke admin WhatsApp resmi kami.", en: "Fill in the order details below to be connected directly to our official WhatsApp admin.", cn: "请在下方填写订单详细信息，以便直接连接到我们的官方WhatsApp客服。" },
  "wa.store": { id: "KucaiDL Official Store", en: "KucaiDL Official Store", cn: "KucaiDL 官方商店" },
  "wa.online": { id: "ONLINE & SIAP MELAYANI", en: "ONLINE & READY TO SERVE", cn: "在线且随时准备服务" },
  "wa.buy": { id: "Beli Produk", en: "Buy Product", cn: "购买产品" },
  "wa.sell": { id: "Jual Produk", en: "Sell Product", cn: "出售产品" },
  "wa.shipping": { id: "Detail Pengiriman", en: "Shipping Details", cn: "配送详情" },
  "wa.destination": { id: "Tujuan Pengiriman", en: "Shipping Destination", cn: "配送目的地" },
  "wa.world": { id: "Nama World", en: "World Name", cn: "World 名称" },
  "wa.owner": { id: "Owner World / GrowID", en: "World Owner / GrowID", cn: "World 拥有者 / GrowID" },
  "wa.method": { id: "Metode Pengiriman", en: "Shipping Method", cn: "配送方式" },
  "wa.donation": { id: "Donation Box (Max 3 BGL)", en: "Donation Box (Max 3 BGL)", cn: "Donation Box (最多 3 BGL)" },
  "wa.display": { id: "Display Box", en: "Display Box", cn: "Display Box" },
  "wa.drop": { id: "Drop Langsung (Trade)", en: "Direct Drop (Trade)", cn: "直接掉落 (交易)" },
  "wa.location": { id: "Lokasi Kotak", en: "Box Location", cn: "箱子位置" },
  "wa.locationPh": { id: "Contoh: Kanan pintu masuk", en: "Example: Right of entrance", cn: "例如：入口右侧" },
  "wa.whatsapp": { id: "Nomor WhatsApp", en: "WhatsApp Number", cn: "WhatsApp 号码" },
  "wa.whatsappPh": { id: "Mulai dari 08... atau 628...", en: "Starts with 08... or 628...", cn: "以 08... 或 628... 开头" },
  "wa.amount": { id: "Pilih Jumlah Produk", en: "Select Product Amount", cn: "选择产品数量" },
  "wa.notes": { id: "Catatan Tambahan", en: "Additional Notes", cn: "附加备注" },
  "wa.optional": { id: "(Opsional)", en: "(Optional)", cn: "(选填)" },
  "wa.notesPh": { id: "Pesan khusus untuk admin...", en: "Special message for admin...", cn: "给客服的特别留言..." },
  "wa.subtotal": { id: "Subtotal", en: "Subtotal", cn: "小计" },
  "wa.order": { id: "Pesanan", en: "Order", cn: "订单" },
  "wa.income": { id: "Pendapatan", en: "Income", cn: "收入" },
  "wa.btnBuy": { id: "Lanjut ke Pembayaran", en: "Proceed to Payment", cn: "继续付款" },
  "wa.btnSell": { id: "Jual & Hubungi Admin", en: "Sell & Contact Admin", cn: "出售并联系客服" },

  // Navbar Ticker
  "tick.1": { id: "Jual Beli DL & BGL Amanah & Terpercaya", en: "Trusted & Reliable DL & BGL Trading", cn: "值得信赖的 DL & BGL 交易" },
  "tick.2": { id: "Proses Super Kilat Hitungan Menit", en: "Super Fast Process in Minutes", cn: "几分钟内完成的超快流程" },
  "tick.3": { id: "Stok BGL Selalu Ready", en: "BGL Stock Always Ready", cn: "BGL 库存随时充足" },
  "tick.4": { id: "Jual Akun Growtopia Sultan (Full Akses)", en: "Sell Premium Growtopia Accounts (Full Access)", cn: "出售高级 Growtopia 账号 (完整权限)" },
  "tick.5": { id: "Rate Selalu Update Tiap Hari", en: "Rates Updated Everyday", cn: "汇率每天更新" },
  "tick.6": { id: "Pelayanan Ramah & Fast Respon", en: "Friendly Service & Fast Response", cn: "友好的服务与快速响应" }
`;
content = content.replace('};', newTrans + '\n};');
fs.writeFileSync(file, content);
console.log('Dictionaries updated!');
