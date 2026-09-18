"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Intro() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fading out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Completely remove from DOM after 2.5 seconds
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-[100px] h-[100px] rounded-2xl overflow-hidden mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse-glow">
        <Image src="/logo.png" alt="KUCAIDL" fill className="object-contain" priority />
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tighter shimmer-text drop-shadow-sm mb-1">
          KUCAIDL
        </h1>
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-amber-500/80">
          Growtopia Marketplace
        </p>
      </div>

      <div className="absolute bottom-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150 mx-2"></div>
        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
