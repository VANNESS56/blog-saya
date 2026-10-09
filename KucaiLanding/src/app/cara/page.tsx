"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Download, MapPin, DollarSign } from "lucide-react";

export default function CaraPage() {
  const [activeTab, setActiveTab] = useState<"beli" | "jual">("beli");

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <Navbar />

      <div className="flex-1 max-w-[1000px] mx-auto w-full px-4 md:px-6 pt-[140px] pb-24 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Cara Transaksi
          </h1>
          <p className="text-gray-400 text-[15px] md:text-lg max-w-2xl mx-auto">
            Panduan lengkap langkah demi langkah cara membeli dan menjual Diamond Lock & Blue Gem Lock di KUCAIDL.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-[#101010] p-1.5 rounded-2xl max-w-md mx-auto mb-10 border border-white/5 relative">
          <button
            onClick={() => setActiveTab("beli")}
            className={`flex-1 py-3 text-[15px] font-bold rounded-xl transition-all relative z-10 ${
              activeTab === "beli" ? "text-amber-500" : "text-gray-400 hover:text-white"
            }`}
          >
            Cara Beli
          </button>
          <button
            onClick={() => setActiveTab("jual")}
            className={`flex-1 py-3 text-[15px] font-bold rounded-xl transition-all relative z-10 ${
              activeTab === "jual" ? "text-amber-500" : "text-gray-400 hover:text-white"
            }`}
          >
            Cara Jual
          </button>

          {/* Tab Indicator */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#1a1a1a] border border-amber-500/30 rounded-xl transition-transform duration-300 ease-out shadow-[0_0_15px_rgba(245,158,11,0.1)]`}
            style={{
              transform: activeTab === "beli" ? "translateX(0)" : "translateX(100%)",
            }}
          />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "beli" && (
            <motion.div
              key="beli"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-[#101010] border border-white/5 rounded-[24px] p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <MessageSquare size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    Langkah Pembelian
                  </h2>
                </div>
                
                <ol className="space-y-4 text-gray-300">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">1</span>
                    <p className="pt-1">Tekan <strong>Order Now</strong> di navbar, lalu pilih Beli DL/BGL.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">2</span>
                    <p className="pt-1">Pilih metode pembayaran — nomor rekening langsung muncul di chat dan transfer.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">3</span>
                    <p className="pt-1">Kirim foto bukti transfernya & nama world, dan admin akan mengecek.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">4</span>
                    <p className="pt-1">Setelah cek admin akan nge drop dl / bgl nya ke world kamu.</p>
                  </li>
                </ol>

                <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-500/90 text-sm font-medium">
                    <strong className="text-amber-500">Penting:</strong> Jangan tinggalkan lock di lantai world! World bisa sewaktu-waktu ter-nuke atau dibersihkan moderator, dan lock yang hilang akibat kelalaian pembeli tidak bisa diganti.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "jual" && (
            <motion.div
              key="jual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-[#101010] border border-white/5 rounded-[24px] p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    Cara drop lock di world
                  </h2>
                </div>
                
                <ol className="space-y-4 text-gray-300">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">1</span>
                    <p className="pt-1">Tekan <strong>Order Now</strong> di navbar, lalu pilih Jual DL/BGL — nama world drop akan diberikan oleh admin.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">2</span>
                    <p className="pt-1">Masuk ke Growtopia, tempel nama World Name tersebut.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">3</span>
                    <p className="pt-1">Jatuhkan (drop) lock yang mau kamu jual di world itu.</p>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    <strong>Catatan:</strong> Yang kami terima hanya Diamond Lock (DL) dan Blue Gem Lock (BGL).
                  </p>
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 rounded-[24px] p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <DollarSign size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    Setelah drop sampai uang ditransfer
                  </h2>
                </div>
                
                <ol className="space-y-4 text-gray-300">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">1</span>
                    <p className="pt-1">Kembali ke WhatsApp, berikan nomor rekening atau e-wallet (DANA, OVO, dll) ke admin.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">2</span>
                    <p className="pt-1">Konfirmasikan bahwa kamu <strong>Sudah drop</strong> lock-nya.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">3</span>
                    <p className="pt-1">Tunggu admin/bot kami masuk untuk mengambil dan menghitung lock kamu.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] text-amber-500 font-bold flex items-center justify-center border border-white/10">4</span>
                    <p className="pt-1">Dana cair! Uang kamu akan langsung ditransfer ke rekening tujuan.</p>
                  </li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <Footer />
    </main>
  );
}
