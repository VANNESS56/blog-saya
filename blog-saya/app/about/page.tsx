export default function AboutPage() {
    return (
        <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black italic tracking-tighter mb-8 border-b-4 border-zinc-900 pb-2 uppercase">
                    Tentang PannessTV
                </h1>

                <div className="prose prose-zinc max-w-none space-y-6 text-zinc-700 leading-relaxed italic">
                    <p className="text-xl text-zinc-900 font-bold">
                        PannessTV adalah portal berita modern yang berkomitmen menyajikan informasi tercepat dan terpercaya untuk masyarakat Indonesia.
                    </p>

                    <p>
                        Di tengah arus informasi yang begitu cepat, kami hadir untuk memilah mana berita yang benar-benar penting untuk Anda ketahui. Fokus kami meliputi berbagai sektor mulai dari ekonomi, teknologi, hingga gaya hidup.
                    </p>

                    <h2 className="text-2xl font-black uppercase text-zinc-900 mt-12 mb-4 italic">Visi & Misi</h2>
                    <p>
                        Visi kami adalah menjadi rujukan utama informasi digital di Indonesia dengan menjunjung tinggi kode etik jurnalistik dan integritas data.
                    </p>

                    <div className="bg-zinc-50 p-8 rounded-none border-l-4 border-orange-500 my-12">
                        <h3 className="text-lg font-black uppercase text-zinc-900 mb-2 italic">Redaksi & Iklan</h3>
                        <p className="mb-4 text-sm">
                            Untuk kerja sama pemberitaan atau pemasangan iklan, silakan hubungi tim kami.
                        </p>
                        <a
                            href="mailto:redaksi@pannesstv.com"
                            className="inline-block px-6 py-2 bg-blue-800 text-white font-bold uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
