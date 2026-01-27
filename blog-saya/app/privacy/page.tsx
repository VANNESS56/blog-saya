export default function PrivacyPage() {
    return (
        <div className="bg-white pt-32 pb-20 min-h-screen">
            <main className="max-w-4xl mx-auto px-6">
                <header className="mb-12 border-b-4 border-zinc-900 pb-4">
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                        Kebijakan Privasi
                    </h1>
                    <p className="mt-4 text-zinc-500 text-sm font-bold uppercase tracking-widest">
                        Terakhir Diperbarui: 27 Januari 2026
                    </p>
                </header>

                <div className="prose prose-zinc max-w-none space-y-8 text-zinc-700 leading-relaxed italic">
                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">1. Pendahuluan</h2>
                        <p>
                            Selamat datang di PannessTV. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda saat Anda mengunjungi situs kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">2. Informasi yang Kami Kumpulkan</h2>
                        <p>
                            Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara sukarela, seperti nama dan alamat email ketika Anda berlangganan newsletter kami atau menghubungi kami melalui formulir kontak. Selain itu, kami juga mengumpulkan data non-personal secara otomatis seperti alamat IP, jenis browser, dan halaman yang dikunjungi untuk tujuan analisis statistik.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">3. Penggunaan Informasi</h2>
                        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Menyediakan informasi dan berita terbaru kepada Anda.</li>
                            <li>Meningkatkan pengalaman pengguna dan kualitas konten kami.</li>
                            <li>Menanggapi pertanyaan atau permintaan layanan pelanggan.</li>
                            <li>Mengirimkan update berkala melalui newsletter (jika Anda berlangganan).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">4. Keamanan Data</h2>
                        <p>
                            Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda. Namun, perlu diingat bahwa tidak ada metode transmisi melalui internet yang 100% aman. Kami berusaha sebaik mungkin untuk melindungi data Anda, namun kami tidak dapat menjamin keamanan mutlak.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">5. Cookie</h2>
                        <p>
                            Situs ini menggunakan cookie untuk meningkatkan navigasi dan menganalisis trafik situs. Anda dapat memilih untuk menonaktifkan cookie melalui pengaturan browser Anda, namun hal ini mungkin memengaruhi fungsi tertentu dari situs kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4 italic">6. Hubungi Kami</h2>
                        <p>
                            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, Anda dapat menghubungi kami melalui:
                        </p>
                        <div className="bg-zinc-50 p-6 border-l-4 border-orange-500 mt-4 not-italic">
                            <p className="font-bold text-zinc-900">PannessTV Redaksi</p>
                            <p className="text-sm text-zinc-600">Email: vannessvanness56@gmail.com</p>
                            <p className="text-sm text-zinc-600">Alamat: Jl. Siaran Kecamatan Sako, Sumatera Selatan</p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
