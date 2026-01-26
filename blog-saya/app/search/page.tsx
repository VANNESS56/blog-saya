"use client";

import { useState } from "react";
import { ALL_NEWS } from "@/data/news";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const results = query
        ? ALL_NEWS.filter(n =>
            n.title.toLowerCase().includes(query.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="bg-white pt-28 min-h-screen">
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-black italic uppercase mb-8">Cari Berita</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Masukkan kata kunci..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-6 py-4 bg-zinc-100 border-none text-xl focus:ring-2 focus:ring-blue-600 outline-none"
                            autoFocus
                        />
                        <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-8">
                    {query && (
                        <p className="text-sm font-bold text-zinc-500 uppercase">
                            Menampilkan {results.length} hasil untuk "{query}"
                        </p>
                    )}

                    {results.map((news) => (
                        <Link key={news.id} href={`/news/${news.id}`} className="group flex gap-6 items-center italic">
                            <div className="relative w-32 h-20 shrink-0 bg-zinc-100 overflow-hidden italic">
                                <Image src={news.image} alt={news.title} fill className="object-cover" />
                            </div>
                            <div className="text-left">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">
                                    {news.category} • {news.date}
                                </span>
                                <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                                    {news.title}
                                </h3>
                            </div>
                        </Link>
                    ))}

                    {query && results.length === 0 && (
                        <div className="py-20 text-center text-zinc-400">
                            <p>Tidak ditemukan berita dengan kata kunci tersebut.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
