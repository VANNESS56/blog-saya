"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Post {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
}

export default function BlogCard({ post, index }: { post: Post; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/blog/${post.id}`} className="block">
                <article className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-blue-500">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-zinc-500">{post.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors duration-300">
                        {post.title}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {post.excerpt}
                    </p>

                    <div className="pt-2 flex items-center text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                        Read Story
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                    </div>
                </article>
            </Link>
            <div className="mt-8 h-[1px] w-full bg-zinc-100 dark:bg-zinc-900 group-last:hidden" />
        </motion.div>
    );
}
