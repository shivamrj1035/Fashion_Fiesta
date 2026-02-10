"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, ShoppingBag, Star, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <main className="min-h-screen bg-slate-900 pt-32 text-white">
            <Navbar />

            <div className="container mx-auto px-4 pb-20">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Neural Vault</h1>
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5 uppercase">
                        {items.length} Tracked Objects
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-first-color/50 transition-all duration-700 relative shadow-2xl"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                {product.image_urls && product.image_urls[0] && (
                                    <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                )}

                                {product.is_featured && (
                                    <span className="absolute top-6 left-6 bg-first-color text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10 border border-white/10">
                                        Core Asset
                                    </span>
                                )}

                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-6 right-6 w-12 h-12 bg-slate-900/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-slate-950 transition-all border border-white/5 z-20 group/trash"
                                >
                                    <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                                </button>

                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-first-color text-white font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl flex items-center hover:bg-emerald-600 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 text-xs"
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-3" />
                                        Initialize
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">{product.rating}</span>
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl font-black text-first-color tracking-tighter">₹{product.price}</span>
                                    {product.old_price && (
                                        <span className="text-sm text-slate-600 line-through font-bold">₹{product.old_price}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <Link href="/shop" className="group rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 hover:border-first-color/50 hover:bg-white/5 transition-all min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-first-color group-hover:text-white transition-all shadow-xl">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="font-black text-white text-2xl tracking-tighter">Expand Vault</h3>
                        <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-[0.2em]">Acquire New Assets</p>
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
