"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    image: string;
    description?: string;
    badge?: string; // "Hot", "Sale", etc.
    badgeColor?: "first-color" | "amber-400" | "rose-500" | "emerald-500";
    viewMode?: "grid" | "list";
}

export default function ProductCard({
    id,
    name,
    price,
    oldPrice,
    rating,
    image,
    description,
    badge,
    badgeColor = "first-color",
    viewMode = "grid"
}: ProductCardProps) {
    const { addToCart, items } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // Helper to format image URL
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    const displayImage = getImageUrl(image);

    const isInCart = (id: number) => items.some(item => item.id === id);

    const productForContext = {
        id,
        name,
        price,
        old_price: oldPrice,
        rating,
        image_urls: [displayImage],
        description
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "group relative bg-slate-900/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/5 hover:border-first-color/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.1)] transition-all duration-700",
                viewMode === "list" && "flex flex-col md:flex-row p-3 gap-6"
            )}
        >
            {/* Image Area */}
            <div className={cn(
                "relative overflow-hidden bg-slate-950 group-hover:bg-slate-900 transition-colors duration-500",
                viewMode === "list" ? "md:w-64 aspect-square rounded-[1.5rem] shrink-0" : "w-full aspect-[3/4] rounded-[1.5rem] m-1.5"
            )}>
                <Link href={`/details/${id}`} className="block w-full h-full">
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>

                {/* Intelligent Badge */}
                {badge && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/10 text-white",
                            badgeColor === "first-color" ? "bg-first-color/80" :
                                badgeColor === "amber-400" ? "bg-amber-400/80" :
                                    badgeColor === "rose-500" ? "bg-rose-500/80" : "bg-emerald-500/80"
                        )}>
                            {badge}
                        </div>
                    </div>
                )}

                {/* Floating Action Menu */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (isInWishlist(id)) removeFromWishlist(id);
                            else addToWishlist(productForContext as any);
                        }}
                        className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all hover:scale-110 shadow-lg",
                            isInWishlist(id) ? "bg-first-color text-slate-900 border-first-color" : "bg-slate-950/40 text-white hover:bg-white hover:text-slate-900"
                        )}
                    >
                        <Heart className={cn("w-3.5 h-3.5", isInWishlist(id) && "fill-current")} />
                    </button>
                    <button
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-950/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all hover:scale-110 shadow-lg"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Bottom Quick Action */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150 w-[85%] z-20">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(productForContext as any);
                        }}
                        className="w-full bg-white text-slate-900 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-first-color hover:text-white transition-all active:scale-95"
                    >
                        {isInCart(id) ? "In Basket" : "Quick Add"}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={cn(
                "px-5 pb-6 pt-2.5",
                viewMode === "list" ? "flex-1 flex flex-col justify-center py-0" : ""
            )}>
                <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-y-1">
                        <div className="flex items-center space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("w-2 h-2", i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-700")} />
                            ))}
                            <span className="text-[9px] font-bold text-slate-500 ml-1">{rating}</span>
                        </div>
                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest hidden xl:block">Stock: High</span>
                    </div>

                    <div className="space-y-0.5">
                        <Link href={`/details/${id}`}>
                            <h3 className="text-xs md:text-sm font-black text-white group-hover:text-first-color transition-colors line-clamp-1">
                                {name}
                            </h3>
                        </Link>
                        {viewMode === "list" && description && (
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-3 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1 pt-1">
                        <div className="flex flex-col">
                            {oldPrice && <span className="text-[8px] text-slate-500 line-through font-bold">₹{oldPrice}</span>}
                            <span className="text-base md:text-lg font-black text-white tracking-tighter leading-none">
                                ₹{price}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.1em] leading-none">Tax Incl.</span>
                            <div className="w-1 h-1 rounded-full bg-first-color/40" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
