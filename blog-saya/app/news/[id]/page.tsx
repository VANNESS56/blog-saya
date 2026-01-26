import { ALL_NEWS } from "@/data/news";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsSidebar from "@/components/NewsSidebar";

export default async function SingleNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const news = ALL_NEWS.find((n) => n.id === id);

    if (!news) {
        notFound();
    }

    return (
        <div className="bg-white pt-28 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Article */}
                    <article className="lg:col-span-2">
                        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">
                            <Link href="/" className="hover:text-blue-600">Home</Link>
                            <span>/</span>
                            <Link href={`/${news.category.toLowerCase()}`} className="hover:text-blue-600">{news.category}</Link>
                            <span>/</span>
                            <span className="text-zinc-600">Detail</span>
                        </nav>

                        <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-6 italic">
                            {news.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8 border-y border-zinc-100 py-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold">
                                {news.author.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">{news.author}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-medium">{news.date} | PannessTV</p>
                            </div>
                        </div>

                        <div className="relative aspect-video mb-8 overflow-hidden bg-zinc-100">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div
                            className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        <div className="mt-12 pt-8 border-t border-zinc-100">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                                {news.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-zinc-50 text-zinc-600 text-[10px] font-bold uppercase border border-zinc-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <NewsSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}
