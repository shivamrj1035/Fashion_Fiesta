"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Helper to calculate badge or other props - ignoring static properties like oldPrice/badge for dynamic items
    // Dynamic items structure might differ, ensure we handle it gracefully.
    // Assuming backend returns image_urls array, and we use the first one.

    return (
        <main className="min-h-screen bg-slate-50 pt-32">
            <Navbar />

            <div className="container pb-20">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900">My Wishlist</h1>
                    <span className="text-sm font-bold text-slate-400">{items.length} Items</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 relative"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                {product.image_urls && product.image_urls[0] && (
                                    <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                )}

                                {product.old_price && (
                                    <span className="absolute top-5 left-5 bg-first-color text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10">
                                        Sale
                                    </span>
                                )}

                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-5 right-5 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm z-20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-white text-slate-900 font-bold px-6 py-3 rounded-full flex items-center hover:bg-first-color hover:text-white transition-all transform hover:scale-105 shadow-xl"
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold text-slate-400">({product.rating})</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-1 truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                                    {product.old_price && (
                                        <span className="text-xs text-slate-400 line-through">₹{product.old_price}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add More Placeholder */}
                    <Link href="/shop" className="group rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 hover:border-first-color hover:bg-emerald-50/50 transition-all min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-first-color group-hover:text-white transition-colors">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 text-lg">Browse More</h3>
                        <p className="text-sm text-slate-400 font-bold mt-2">Discover New Trends</p>
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
