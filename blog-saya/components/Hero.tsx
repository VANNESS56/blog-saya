"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                        Tulisan tentang <br />
                        <span className="text-zinc-400 dark:text-zinc-600">ide, desain & teknologi.</span>
                    </h1>
                    <p className="mt-8 text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        Selamat datang di Journal. Dokumentasi perjalanan kreatif dan teknis dalam bentuk yang paling murni dan minimalis.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
