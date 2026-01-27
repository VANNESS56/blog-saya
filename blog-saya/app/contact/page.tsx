import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white pt-32 pb-20 min-h-screen">
            <main className="max-w-7xl mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                        Hubungi Kami
                    </h1>
                    <p className="text-zinc-500 text-lg uppercase font-bold tracking-widest text-sm">
                        Sampaikan saran, kritik, atau penawaran kerja sama Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-zinc-50 p-8 border-l-4 border-orange-500">
                            <h3 className="text-xl font-black italic uppercase mb-6">Informasi Kontak</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-800 p-2 text-white">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Redaksi</p>
                                        <p className="font-bold text-zinc-900 italic">vannessvanness56@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-800 p-2 text-white">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">WhatsApp Business</p>
                                        <p className="font-bold text-zinc-900 italic">+62 899-999-1950</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-800 p-2 text-white">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Kantor Pusat</p>
                                        <p className="font-bold text-zinc-900 italic">Jl. Siaran Kecamatan Sako, Sumatera Selatan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 p-8 text-white">
                            <h3 className="text-lg font-black italic uppercase mb-4 text-orange-500">Iklan & Kerja Sama</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic">
                                PannessTV membuka peluang kerja sama konten, pemasangan iklan, dan liputan khusus untuk brand Anda.
                            </p>
                            <button
                                suppressHydrationWarning
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-6 uppercase tracking-widest text-xs transition-colors"
                            >
                                MEDIA KIT 2026
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-zinc-100 p-8 shadow-sm">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nama Lengkap</label>
                                <input
                                    suppressHydrationWarning
                                    type="text"
                                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-800 italic"
                                    placeholder="Masukkan nama Anda"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Alamat Email</label>
                                <input
                                    suppressHydrationWarning
                                    type="email"
                                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-800 italic"
                                    placeholder="nama@email.com"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subjek Pesan</label>
                                <select
                                    suppressHydrationWarning
                                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-800 italic text-zinc-900"
                                >
                                    <option>Informasi Umum</option>
                                    <option>Kritik & Saran</option>
                                    <option>Penawaran Iklan</option>
                                    <option>Kirim Berita / Tip</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pesan Anda</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-800 italic resize-none"
                                    placeholder="Tuliskan pesan Anda di sini..."
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    suppressHydrationWarning
                                    type="submit"
                                    className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs transition-all italic"
                                >
                                    <Send size={14} />
                                    Kirim Pesan Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
