import BlogCard from "./BlogCard";

const DUMMY_POSTS = [
    {
        id: "1",
        title: "Masa Depan Desain Minimalis di Era AI",
        excerpt: "Bagaimana kecerdasan buatan mengubah cara kita memandang kesederhanaan dalam antarmuka digital dan pengalaman pengguna.",
        date: "24 Jan 2026",
        category: "Design",
    },
    {
        id: "2",
        title: "Membangun Performa Web yang Maksimal",
        excerpt: "Panduan mendalam tentang optimasi Core Web Vitals dan mengapa kecepatan adalah kunci dari pengalaman pengguna yang modern.",
        date: "20 Jan 2026",
        category: "Tech",
    },
    {
        id: "3",
        title: "Seni Menulis Kode yang Bersih",
        excerpt: "Menulis kode bukan hanya tentang fungsionalitas, tapi tentang komunikasi dengan manusia di masa depan.",
        date: "15 Jan 2026",
        category: "Development",
    },
    {
        id: "4",
        title: "Filosofi 'Less is More' dalam Keseharian",
        excerpt: "Menerapkan prinsip minimalis tidak hanya terbatas pada desain, tapi juga bagaimana kita mengelola waktu dan prioritas.",
        date: "10 Jan 2026",
        category: "Life",
    },
];

export default function BlogList() {
    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Tulisan Terbaru</h2>
                    <button className="text-sm font-medium text-zinc-500 hover:text-blue-500 transition-colors">
                        Lihat Semua Post →
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {DUMMY_POSTS.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
