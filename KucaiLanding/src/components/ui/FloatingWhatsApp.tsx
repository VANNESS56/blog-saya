"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSettings } from "@/lib/settings/SettingsContext";

export function FloatingWhatsApp() {
  const { waKucaidl, waCta } = useSettings();
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
      setTimeout(() => setIsVisible(true), 50); // for transition
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const activeWa = waCta || waKucaidl;
  if (!activeWa) return null;

  const waUrl = `https://wa.me/${activeWa}?text=Halo%20KUCAIDL,%20ada%20yang%20ingin%20saya%20tanyakan...`;

  return (
    <div className="fixed bottom-[85px] right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      {/* Popup Message */}
      <div 
        className={`mb-4 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 shadow-2xl relative w-[250px] transition-all duration-500 origin-bottom-right ${
          showPopup && isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(false);
            setTimeout(() => setShowPopup(false), 500);
          }}
          className="absolute top-2.5 right-2.5 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500 text-[10px] font-bold tracking-wider uppercase">
            Customer Support
          </span>
        </div>
        <p className="text-white text-sm font-medium leading-snug">
          Hai Kak ada yg bisa saya bantu
        </p>
      </div>

      {/* WhatsApp Button */}
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[52px] h-[52px] md:w-14 md:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 relative group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366]/40 scale-100 group-hover:scale-125 transition-transform duration-500" />
        
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 md:w-7 md:h-7 fill-current relative z-10"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
