"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "./ProductCard";

const PRODUCTS = [
    { id: 1, name: "Floral Print Shirt", price: 450, oldPrice: 599, rating: 4.5, category: "Featured", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964", badge: "Hot" },
    { id: 2, name: "Denim Jacket", price: 1200, oldPrice: 1599, rating: 4.8, category: "Featured", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936", badge: "Trending" },
    { id: 3, name: "Casual Sneakers", price: 850, oldPrice: 999, rating: 4.2, category: "Popular", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070", badge: "New" },
    { id: 4, name: "Leather Watch", price: 2100, oldPrice: 2500, rating: 4.9, category: "Featured", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999", badge: "-20%" },
    { id: 5, name: "Summer Dress", price: 750, oldPrice: 899, rating: 4.4, category: "Popular", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070", badge: "Best Seller" },
    { id: 6, name: "Slim Fit Jeans", price: 950, oldPrice: 1200, rating: 4.6, category: "New Added", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2052" },
];

const TABS = ["Featured", "Popular", "New Added"];

export default function FeaturedProducts() {
    const [activeTab, setActiveTab] = useState("Featured");

    const filteredProducts = PRODUCTS.filter(p =>
        activeTab === "Featured" ? p.category === "Featured" :
            activeTab === "Popular" ? p.category === "Popular" : true
    );

    return (
        <section className="py-24 bg-slate-50">
            <div className="container">
                <div className="flex flex-col items-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-first-color font-bold tracking-widest uppercase text-xs"
                    >
                        Our Collection
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black tracking-tighter mt-4 text-center"
                    >
                        Featured Products
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex space-x-2 mt-10 p-1.5 bg-white rounded-full shadow-lg border border-slate-100"
                    >
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden focus:outline-none cursor-pointer",
                                    activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-first-color z-0"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                oldPrice={product.oldPrice}
                                rating={product.rating}
                                image={product.image}
                                badge={product.badge}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
