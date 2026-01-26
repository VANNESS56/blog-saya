import Link from "next/link";
import Image from "next/image";
import { ALL_NEWS } from "@/data/news";

export default function LatestNews() {
    const latestNews = ALL_NEWS.slice(3, 7);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1 mb-6">
                <h2 className="text-xl font-black uppercase italic">Berita Terbaru</h2>
            </div>

            <div className="space-y-6">
                {latestNews.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}`} className="flex gap-4 group italic">
                        <div className="relative w-32 h-20 sm:w-48 sm:h-28 shrink-0 overflow-hidden bg-zinc-100 italic">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col justify-between py-1 text-left">
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">
                                    {news.category}
                                </span>
                                <h3 className="text-sm sm:text-base font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {news.title}
                                </h3>
                            </div>
                            <p className="text-[10px] text-zinc-500">{news.date}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <Link
                href="/news"
                className="block w-full py-2 bg-zinc-100 border border-zinc-200 text-center text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors uppercase"
            >
                Indeks Berita
            </Link>
        </div>
    );
}
