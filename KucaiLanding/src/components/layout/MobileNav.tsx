"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingBag, FileText } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  // Update hash on scroll or navigation
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    
    // Listen to hash changes
    window.addEventListener("hashchange", handleHashChange);
    
    // Initial check
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  // Determine active state based on pathname and hash
  const isActive = (path: string, hash: string) => {
    if (pathname === path) {
      if (hash && activeHash !== hash) return false;
      if (!hash && activeHash && activeHash !== "#home") return false;
      return true;
    }
    return false;
  };

  const navItems = [
    { name: "Home", href: "/#home", path: "/", hash: "#home", icon: Home },
    { name: "Produk", href: "/#products", path: "/", hash: "#products", icon: ShoppingBag },
    { name: "Lacak Pesanan", href: "/order", path: "/order", hash: "", icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[#111]/90 backdrop-blur-xl border border-white/5 rounded-full px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const active = isActive(item.path, item.hash);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1.5 px-2 rounded-full transition-all duration-300 ${
                active 
                  ? "bg-amber-500/10 text-amber-500" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? "text-amber-500" : ""}`} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-medium tracking-wide ${active ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
