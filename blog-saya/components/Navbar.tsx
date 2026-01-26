"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Menu, User } from "lucide-react";

const mainCategories = [
    { name: "News", href: "/news" },
    { name: "Ekonomi", href: "/ekonomi" },
    { name: "Tekno", href: "/tekno" },
    { name: "Sains", href: "/sains" },
    { name: "Lifestyle", href: "/lifestyle" },
    { name: "Hiburan", href: "/hiburan" },
    { name: "Otomotif", href: "/otomotif" },
    { name: "Bola", href: "/bola" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-zinc-200">
            {/* Top Header */}
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Menu className="w-6 h-6 cursor-pointer" />
                    <div className="hidden sm:flex items-center text-xs font-medium text-zinc-500 gap-4">
                        <span>Senin, 26 Januari 2026</span>
                    </div>
                </div>

                <Link href="/" className="flex items-center gap-1 group">
                    <span className="text-3xl font-black tracking-tighter text-blue-800 italic uppercase">
                        Panness<span className="text-orange-500">TV</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/search">
                        <Search className="w-5 h-5 cursor-pointer text-zinc-600 hover:text-blue-600 transition-colors" />
                    </Link>
                    <User className="w-5 h-5 cursor-pointer text-zinc-600" />
                </div>
            </div>

            {/* Category Bar */}
            <div className="bg-zinc-50 border-b border-zinc-200 overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-start sm:justify-center gap-6 whitespace-nowrap">
                    {mainCategories.map((cat) => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            className={cn(
                                "text-xs font-bold uppercase tracking-wide hover:text-blue-600 transition-colors",
                                pathname === cat.href ? "text-blue-600" : "text-zinc-600"
                            )}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
