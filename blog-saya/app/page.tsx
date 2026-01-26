import Headline from "@/components/Headline";
import LatestNews from "@/components/LatestNews";
import NewsSidebar from "@/components/NewsSidebar";

export default function Home() {
  return (
    <div className="bg-white pt-24 min-h-screen">
      {/* Top Banner Ad Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-4 hidden sm:block">
        <div className="w-full h-24 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em]">ADVERTISEMENT BANNER</span>
        </div>
      </div>

      <Headline />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <LatestNews />

            {/* Another Section: Tekno */}
            <div className="mt-16">
              <div className="flex items-center justify-between border-b-2 border-orange-500 pb-1 mb-6">
                <h2 className="text-xl font-black uppercase italic">Tekno</h2>
                <button className="text-[10px] font-bold text-zinc-500 hover:text-orange-500 uppercase">Lihat Semua →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden bg-zinc-100">
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-200">
                        <span className="text-xs italic">Image {i}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold leading-tight group-hover:text-blue-600 transition-colors">
                        Inovasi Terbaru di Dunia Teknologi yang Wajib Anda Ketahui di 2026
                      </h3>
                      <p className="text-[10px] text-zinc-400 mt-2 font-medium">TEKNO • 12 Jam Lalu</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
