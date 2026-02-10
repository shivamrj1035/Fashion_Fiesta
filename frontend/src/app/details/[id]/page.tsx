"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowRight, RotateCcw, Share2, Heart, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct, useRecommendations } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const { data: product, isLoading } = useProduct(id);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("Teal");

    // Helper to format image URL
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-first-color border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                    <p className="text-slate-400 font-bold animate-pulse">Scanning Neural Database...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-white tracking-tighter">Identity Not Found</h2>
                    <p className="text-slate-500 mb-8 mt-2">The specified object does not exist in the current neural cluster.</p>
                    <Link href="/shop" className="bg-first-color text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all">
                        Return to Hub
                    </Link>
                </div>
            </main>
        );
    }

    // Safely handle images if none exist
    const images = product.image_urls && product.image_urls.length > 0
        ? product.image_urls
        : ["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070"]; // Fallback

    const SIZES = ["S", "M", "L", "XL"];
    const COLORS = [
        { name: "Teal", class: "bg-teal-700" },
        { name: "Blue", class: "bg-blue-600" },
        { name: "Black", class: "bg-slate-900" }
    ];

    return (
        <main className="min-h-screen bg-slate-900 pt-32">
            <Navbar />

            <div className="container mx-auto px-4 pb-16">
                <div className="bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 border border-white/5 shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Image Gallery */}
                        <div className="lg:w-2/5 space-y-4">
                            <motion.div
                                layoutId="mainImg"
                                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl border border-white/5 bg-slate-900"
                            >
                                <Image src={getImageUrl(images[activeImg])} alt={product.name} fill className="object-cover" />
                                {product.is_featured && (
                                    <span className="absolute top-6 left-6 bg-first-color text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl z-10 border border-white/10">
                                        Core Alpha
                                    </span>
                                )}
                            </motion.div>

                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={cn(
                                            "relative w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                                            activeImg === idx ? "border-first-color scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-white/5 opacity-40 hover:opacity-100 hover:border-white/10"
                                        )}
                                    >
                                        <Image src={getImageUrl(img)} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="lg:w-3/5 py-2">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2 bg-first-color/10 px-3 py-1.5 rounded-xl border border-first-color/20">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-black text-white text-sm">{product.rating}</span>
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Score</span>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center transition-all border border-white/5 hover:border-first-color/50 group",
                                            isInWishlist(product.id) ? "text-first-color" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/20">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
                                {product.name}
                            </h1>

                            <div className="flex items-end space-x-4 mb-8">
                                <span className="text-4xl font-black text-first-color tracking-tighter">₹{product.price}</span>
                                {product.old_price && (
                                    <span className="text-xl text-slate-600 line-through font-bold mb-1">₹{product.old_price}</span>
                                )}
                                <div className="bg-first-color/10 text-first-color border border-first-color/20 text-[11px] font-black px-3 py-1.5 rounded-full mb-2 uppercase tracking-widest">
                                    {Math.round(((product.old_price || product.price) - product.price) / (product.old_price || product.price) * 100)}% Delta
                                </div>
                            </div>

                            <p className="text-slate-400 font-medium leading-relaxed mb-10 text-sm md:text-base max-w-xl">
                                {product.description}
                            </p>

                            <div className="space-y-8 mb-10">
                                {/* Sizes */}
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Selection Matrix / Size</span>
                                        <button className="text-[10px] font-black text-first-color uppercase tracking-widest hover:underline">Size Chart</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl text-xs font-black transition-all border flex items-center justify-center overflow-hidden relative group",
                                                    selectedSize === size
                                                        ? "border-first-color bg-first-color text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                        : "border-white/5 bg-slate-900/50 text-slate-500 hover:border-white/20 hover:text-slate-300"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <span className="block text-xs font-black uppercase tracking-widest text-slate-900 mb-3">Select Color</span>
                                    <div className="flex flex-wrap gap-3">
                                        {COLORS.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={cn(
                                                    "w-9 h-9 rounded-full border-2 transition-all relative",
                                                    selectedColor === color.name
                                                        ? "border-first-color ring-2 ring-first-color ring-offset-2"
                                                        : "border-transparent ring-1 ring-slate-200"
                                                )}
                                            >
                                                <span className={cn("absolute inset-0.5 rounded-full", color.class)} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row gap-5">
                                <div className="flex items-center bg-slate-900/50 rounded-2xl p-2 w-fit border border-white/5">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 rounded-xl transition-all font-bold group"
                                    >
                                        <Minus className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                                    </button>
                                    <span className="w-14 text-center font-black text-xl text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 rounded-xl transition-all font-bold group"
                                    >
                                        <Plus className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => addToCart(product, quantity)}
                                    className="flex-[2] bg-first-color hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center text-sm gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all py-4 active:scale-95"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Initialize Order</span>
                                </button>

                                <Link
                                    href={`/virtual-try-on?productId=${product.id}`}
                                    className="flex-1 bg-slate-900/80 hover:bg-slate-950 text-white font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center text-sm gap-3 border border-white/5 hover:border-first-color transition-all py-4 active:scale-95 group"
                                >
                                    <Camera className="w-5 h-5 text-first-color group-hover:scale-110 transition-transform" />
                                    <span>Try ON</span>
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 mt-12 p-6 bg-slate-900/30 rounded-3xl border border-white/5">
                                <div className="flex flex-col items-center text-center">
                                    <Truck className="w-6 h-6 text-first-color mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Expedited Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-l border-white/5">
                                    <ShieldCheck className="w-6 h-6 text-first-color mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Security</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-l border-white/5">
                                    <RotateCcw className="w-6 h-6 text-first-color mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Refact Returns</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Similar Styles - CV Recommendations */}
                <RecommendationsSection productId={id} />
            </div>

            <Footer />
        </main>
    );
}

function RecommendationsSection({ productId }: { productId: number }) {
    const { data: recommendations = [], isLoading } = useRecommendations(productId);

    if (!isLoading && recommendations.length === 0) return null;

    return (
        <div className="mt-28 border-t border-white/5 pt-20">
            <div className="flex flex-col items-center mb-10">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-first-color font-black tracking-[0.2em] uppercase text-[10px]"
                >
                    You Might Also Like
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl font-black tracking-tighter mt-4 text-center text-white"
                >
                    Similar Cluster
                </motion.h2>
                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Powered by Neural Search</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="aspect-[4/5] bg-slate-800 rounded-2xl" />
                            <div className="h-4 bg-slate-800 rounded w-3/4" />
                            <div className="h-4 bg-slate-800 rounded w-1/2" />
                        </div>
                    ))
                ) : (
                    recommendations.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            oldPrice={product.old_price}
                            rating={product.rating}
                            image={product.image_urls?.[0]}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
