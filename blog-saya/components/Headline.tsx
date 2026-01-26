import Link from "next/link";
import Image from "next/image";
import { ALL_NEWS } from "@/data/news";

export default function Headline() {
    const headlines = ALL_NEWS.slice(0, 3);

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Headline */}
                <div className="lg:col-span-2 relative h-[300px] sm:h-[450px] group overflow-hidden bg-zinc-100 italic">
                    <Link href={`/news/${headlines[0].id}`}>
                        <Image
                            src={headlines[0].image}
                            alt={headlines[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 text-white text-left">
                            <span className="bg-orange-600 text-[10px] font-bold px-2 py-1 mb-2 inline-block italic">
                                {headlines[0].category}
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-black leading-tight group-hover:underline">
                                {headlines[0].title}
                            </h2>
                            <p className="text-sm text-zinc-300 mt-2">{headlines[0].date}</p>
                        </div>
                    </Link>
                </div>

                {/* Sub Headlines */}
                <div className="flex flex-col gap-4">
                    {headlines.slice(1).map((sub) => (
                        <div key={sub.id} className="relative h-[142px] sm:h-[217px] group overflow-hidden bg-zinc-100 italic">
                            <Link href={`/news/${sub.id}`}>
                                <Image
                                    src={sub.image}
                                    alt={sub.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4 text-white text-left">
                                    <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 mb-1 inline-block italic">
                                        {sub.category}
                                    </span>
                                    <h3 className="text-sm sm:text-lg font-bold leading-tight group-hover:underline line-clamp-2">
                                        {sub.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
