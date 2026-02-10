"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "./ProductCard";

import { useFeaturedProducts, usePopularProducts, useNewArrivals } from "@/hooks/useProducts";

const TABS = ["Featured", "Popular", "New Added"];

export default function FeaturedProducts() {
    const [activeTab, setActiveTab] = useState("Featured");

    const { data: featured = [], isLoading: featuredLoading } = useFeaturedProducts(8);
    const { data: popular = [], isLoading: popularLoading } = usePopularProducts(8);
    const { data: newArrivals = [], isLoading: newLoading } = useNewArrivals(8);

    const products = activeTab === "Featured" ? featured :
        activeTab === "Popular" ? popular :
            newArrivals;

    const isLoading = featuredLoading || popularLoading || newLoading;

    return (
        <section className="py-24 bg-slate-900 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-first-color font-black tracking-[0.2em] uppercase text-[10px]"
                    >
                        Handpicked Items
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black tracking-tighter mt-4 text-center text-white"
                    >
                        Trending Gear
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex space-x-1 mt-8 p-1 bg-slate-950 rounded-xl shadow-2xl border border-white/5"
                    >
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer",
                                    activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-first-color rounded-lg z-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                >
                    {isLoading ? (
                        <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="space-y-4 animate-pulse">
                                    <div className="aspect-[4/5] bg-slate-800 rounded-2xl" />
                                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    oldPrice={product.old_price}
                                    rating={product.rating}
                                    image={product.image_urls?.[0]}
                                    badge={product.is_featured ? "Hot" : product.is_popular ? "Pop" : undefined}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
