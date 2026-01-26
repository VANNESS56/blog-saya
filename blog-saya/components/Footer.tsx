import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-20 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-3xl font-black tracking-tighter italic uppercase">
                            Panness<span className="text-orange-500">TV</span>
                        </Link>
                        <p className="mt-4 text-zinc-400 max-w-xs leading-relaxed text-sm">
                            PannessTV adalah portal berita digital terdepan yang menyajikan informasi terkini seputar teknologi, ekonomi, dan gaya hidup secara akurat dan mendalam untuk pembaca Indonesia.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-zinc-500">Kategori</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/news" className="hover:text-orange-500 transition-colors">News</Link></li>
                            <li><Link href="/ekonomi" className="hover:text-orange-500 transition-colors">Ekonomi</Link></li>
                            <li><Link href="/tekno" className="hover:text-orange-500 transition-colors">Tekno</Link></li>
                            <li><Link href="/bola" className="hover:text-orange-500 transition-colors">Bola</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-zinc-500">Bantuan</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Kontak</Link></li>
                            <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Kebijakan Privasi</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Pedoman Media Siber</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <p>© {new Date().getFullYear()} PannessTV. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
