import Link from "next/link";

interface TrendingItem {
    id: string;
    title: string;
    count: number;
    newsId: string;
}

const TRENDING: TrendingItem[] = [
    { id: "1", title: "Investasi Hijau", count: 1, newsId: "h1" },
    { id: "2", title: "Prediksi Cuaca AI", count: 2, newsId: "h2" },
    { id: "3", title: "Misi Mars", count: 3, newsId: "h3" },
    { id: "4", title: "Review Land Cruiser", count: 4, newsId: "l3" },
    { id: "5", title: "Green Hydrogen", count: 5, newsId: "l1" },
];

export default function NewsSidebar() {
    return (
        <aside className="space-y-8">
            {/* Popular Ranking */}
            <div className="bg-white border border-zinc-200 p-4">
                <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-2 mb-4">
                    <h2 className="text-lg font-bold uppercase">Popular</h2>
                </div>
                <div className="space-y-4">
                    {TRENDING.map((item) => (
                        <Link key={item.id} href={`/news/${item.newsId}`} className="flex gap-4 group cursor-pointer text-left italic">
                            <span className="text-3xl font-black text-zinc-200 group-hover:text-orange-500 transition-colors">
                                {item.count}
                            </span>
                            <p className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Ad Placeholder */}
            <div className="w-full h-[250px] bg-zinc-100 flex items-center justify-center border border-zinc-200">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">ADVERTISEMENT</span>
            </div>

            {/* Newsletter */}
            <div className="bg-blue-900 p-6 text-white text-center">
                <h3 className="text-lg font-black italic mb-2 tracking-tight uppercase">PannessTV Newsletter</h3>
                <p className="text-[10px] text-blue-200 mb-4 uppercase font-bold tracking-widest">Update berita terkini setiap pagi</p>
                <form className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email Anda"
                        className="w-full px-3 py-2 text-zinc-900 text-sm focus:outline-none"
                    />
                    <button className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-2 text-sm transition-colors">
                        SUBSCRIBE
                    </button>
                </form>
            </div>
        </aside>
    );
}
