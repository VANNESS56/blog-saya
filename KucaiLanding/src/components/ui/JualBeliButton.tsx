"use client";

import { usePathname, useRouter } from "next/navigation";

export function JualBeliButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <JualBeliInner />;
}

function JualBeliInner() {
  const router = useRouter();

  return (
    <div className="fixed bottom-[160px] right-4 md:bottom-[155px] md:right-8 z-[51] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto relative">
        <button
          onClick={() => router.push("/jual-beli")}
          className="h-[52px] md:h-14 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-[20px] flex items-center gap-3 shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:scale-105 transition-all duration-300 relative group overflow-hidden"
        >
          <div className="absolute inset-0 rounded-[20px] border-2 border-sky-400/40 scale-100 group-hover:scale-105 transition-transform duration-500" />
          <span className="relative z-10 text-xl">??</span>
          <div className="relative z-10 flex flex-col items-start text-left leading-none">
            <span className="font-black text-[13px] tracking-wide">Jual Beli</span>
            <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-wider">DL &amp; BGL</span>
          </div>
        </button>
      </div>
    </div>
  );
}
