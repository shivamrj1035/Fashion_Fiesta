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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
                "group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-first-color/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-500 relative",
                viewMode === "list" && "flex flex-col md:flex-row"
            )}
        >
            <div className={cn(
                "relative overflow-hidden block bg-slate-50 group",
                viewMode === "list" ? "md:w-64 aspect-square shrink-0" : "w-full aspect-[4/5]"
            )}>
                <Link href={`/details/${id}`} className="block w-full h-full">
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                {/* Badge - More Compact */}
                {badge && (
                    <span className={cn(
                        "absolute top-2.5 left-2.5 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-sm z-10",
                        badgeColor === "first-color" && "bg-first-color",
                        badgeColor === "amber-400" && "bg-amber-400",
                        badgeColor === "rose-500" && "bg-rose-500",
                        badgeColor === "emerald-500" && "bg-emerald-500"
                    )}>
                        {badge}
                    </span>
                )}

                {/* Toolbox Overlay - Refined Icons */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-20 pointer-events-none">
                    <div className="relative group/btn pointer-events-auto">
                        <Link
                            href={`/details/${id}`}
                            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg text-slate-700 hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110 flex items-center justify-center"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="relative group/btn pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isInWishlist(id)) {
                                    removeFromWishlist(id);
                                } else {
                                    addToWishlist(productForContext as any);
                                }
                            }}
                            className={cn(
                                "bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg transition-all transform hover:scale-110 flex items-center justify-center hover:bg-slate-900 hover:text-white",
                                isInWishlist(id) ? "text-first-color" : "text-slate-700"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isInWishlist(id) && "fill-current")} />
                        </button>
                    </div>

                    <div className="relative group/btn pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(productForContext as any);
                            }}
                            className={cn(
                                "bg-slate-900/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg transition-all transform hover:scale-110 flex items-center justify-center hover:bg-first-color hover:text-white border border-white/5",
                                isInCart(id) ? "text-first-color" : "text-white"
                            )}
                        >
                            <ShoppingBag className={cn("w-4 h-4", isInCart(id) && "fill-current")} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={cn("p-4", viewMode === "list" ? "flex-1 flex flex-col justify-center p-6" : "")}>
                <div className="flex items-center space-x-0.5 mb-1.5 opacity-80">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-2.5 h-2.5", i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-700")} />
                    ))}
                    <span className="text-[9px] font-bold text-slate-500 ml-1">({rating})</span>
                </div>

                <Link href={`/details/${id}`}>
                    <h3 className="text-xs font-bold text-white group-hover:text-first-color transition-colors mb-0.5 line-clamp-1 leading-snug">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-white">₹{price}</span>
                        {oldPrice && <span className="text-[10px] text-slate-500 line-through font-medium">₹{oldPrice}</span>}
                    </div>
                    <button
                        onClick={() => addToCart(productForContext as any)}
                        className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:bg-first-color hover:text-white transition-all shadow-sm border border-white/5"
                    >
                        <ShoppingBag className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div >
    );
}
