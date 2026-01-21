"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
    { name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936", items: "120 Items" },
    { name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2052", items: "85 Items" },
    { name: "Shirts", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974", items: "210 Items" },
    { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070", items: "150 Items" },
    { name: "Kurtis", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964", items: "95 Items" },
    { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999", items: "45 Items" },
];

export default function CategorySlider() {
    return (
        <section className="py-24 bg-white">
            <div className="container">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-first-color font-bold tracking-widest uppercase text-xs"
                        >
                            Explore
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl font-black tracking-tighter mt-4"
                        >
                            Popular Categories
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/shop" className="text-sm font-bold text-slate-500 hover:text-first-color transition-colors group">
                            View All Categories <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {CATEGORIES.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 shadow-sm border border-slate-100 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <h3 className="font-bold text-center text-slate-800 text-lg transition-colors group-hover:text-first-color">
                                {cat.name}
                            </h3>
                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-2">
                                {cat.items}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
