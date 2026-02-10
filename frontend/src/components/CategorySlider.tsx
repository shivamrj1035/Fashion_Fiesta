"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useCategories } from "@/hooks/useProducts";

// No more hardcoded CATEGORIES

export default function CategorySlider() {
    const { data: categories = [], isLoading } = useCategories();

    // Helper to format image URL
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    return (
        <section className="py-24 bg-slate-900 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 space-y-4 md:space-y-0">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-first-color font-black tracking-[0.2em] uppercase text-[10px]"
                        >
                            Explore
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-3xl font-black tracking-tighter mt-4 text-white"
                        >
                            Neural Taxonomy
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/shop" className="text-[11px] font-black text-slate-400 hover:text-first-color transition-colors group uppercase tracking-widest">
                            All Categories <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-[4/5] bg-slate-800 rounded-2xl" />
                                <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto" />
                            </div>
                        ))
                    ) : (
                        categories.slice(0, 6).map((cat, index) => (
                            <Link
                                key={cat.id}
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="group cursor-pointer block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 shadow-2xl border border-white/5 transition-all duration-700 group-hover:border-first-color/50 group-hover:-translate-y-2">
                                        <Image
                                            src={getImageUrl(cat.image_url)}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-center text-white text-sm transition-colors group-hover:text-first-color leading-tight">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[8px] text-center text-slate-500 font-black uppercase tracking-widest mt-1.5">
                                        Exploration Ready
                                    </p>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
