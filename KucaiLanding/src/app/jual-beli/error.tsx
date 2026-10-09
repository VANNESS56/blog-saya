"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Jual Beli Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/50 max-w-lg w-full text-center space-y-4">
        <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
        <p className="text-red-300 text-sm font-mono break-all">{error.message || "Unknown error"}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
