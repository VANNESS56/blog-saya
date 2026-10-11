"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Auto-reload on chunk load failures (stale deployment cache)
  if (
    typeof window !== "undefined" &&
    (error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("Unexpected token") ||
      error.name === "ChunkLoadError")
  ) {
    window.location.reload();
    return null;
  }

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4">
        <div className="bg-[#1f2c34] p-8 rounded-2xl border border-white/10 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Terjadi Kesalahan</h2>
          <p className="text-gray-400 text-sm">
            Halaman gagal dimuat. Silakan coba lagi.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-bold text-sm"
            >
              Muat Ulang
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium text-sm"
            >
              Ke Beranda
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
