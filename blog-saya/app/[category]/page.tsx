import { ALL_NEWS } from "@/data/news";
import Image from "next/image";
import Link from "next/link";
import NewsSidebar from "@/components/NewsSidebar";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categoryName = category.toUpperCase();
    const categoryNews = ALL_NEWS.filter(
        (n) => n.category === categoryName || category === "news"
    );

    return (
        <div className="bg-white pt-28 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-12 border-b-4 border-zinc-900 pb-2">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        {categoryName}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {categoryNews.length > 0 ? (
                            categoryNews.map((news) => (
                                <Link key={news.id} href={`/news/${news.id}`} className="group grid grid-cols-1 md:grid-cols-3 gap-6 italic">
                                    <div className="relative aspect-video md:aspect-auto md:h-48 overflow-hidden bg-zinc-100 italic">
                                        <Image
                                            src={news.image}
                                            alt={news.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col justify-center text-left">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">
                                            {news.category} • {news.date}
                                        </span>
                                        <h2 className="text-2xl font-bold leading-tight group-hover:text-blue-600 transition-colors mb-4">
                                            {news.title}
                                        </h2>
                                        <p className="text-sm text-zinc-500 line-clamp-2">
                                            {news.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-20 text-center text-zinc-400">
                                <p>Belum ada berita untuk kategori ini.</p>
                            </div>
                        )}
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
