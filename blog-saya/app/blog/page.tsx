import { ALL_NEWS } from "@/data/news";
import Image from "next/image";
import Link from "next/link";
import NewsSidebar from "@/components/NewsSidebar";

export default function BlogPage() {
    return (
        <div className="bg-white pt-28 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-12 border-b-4 border-zinc-900 pb-2">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        Indeks Berita
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {ALL_NEWS.map((news) => (
                            <Link key={news.id} href={`/news/${news.id}`} className="group flex flex-col sm:flex-row gap-6 italic border-b border-zinc-100 pb-8">
                                <div className="relative w-full sm:w-48 aspect-video sm:h-32 shrink-0 overflow-hidden bg-zinc-100 italic">
                                    <Image
                                        src={news.image}
                                        alt={news.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">
                                        {news.category} • {news.date}
                                    </span>
                                    <h2 className="text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors mb-2">
                                        {news.title}
                                    </h2>
                                    <p className="text-sm text-zinc-500 line-clamp-2">
                                        {news.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Sidebar Column */}
                    <div className="hidden lg:block">
                        <NewsSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}
