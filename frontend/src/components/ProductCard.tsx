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

    const isInCart = (id: number) => items.some(item => item.id === id);

    const productForContext = {
        id,
        name,
        price,
        old_price: oldPrice,
        rating,
        image_urls: [image],
        description
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 relative",
                viewMode === "list" && "flex flex-col md:flex-row"
            )}
        >
            <div className={cn(
                "relative overflow-hidden block bg-slate-100 group",
                viewMode === "list" ? "md:w-64 aspect-square shrink-0" : "w-full aspect-[4/5]"
            )}>
                <Link href={`/details/${id}`} className="block w-full h-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                </Link>

                {/* Badge */}
                {badge && (
                    <span className={cn(
                        "absolute top-3 left-3 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10",
                        badgeColor === "first-color" && "bg-first-color",
                        badgeColor === "amber-400" && "bg-amber-400",
                        badgeColor === "rose-500" && "bg-rose-500",
                        badgeColor === "emerald-500" && "bg-emerald-500"
                    )}>
                        {badge}
                    </span>
                )}

                {/* Toolbox Overlay - Over Image */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20 pointer-events-none">
                    {/* View Button */}
                    <div className="relative group/btn pointer-events-auto">
                        <Link
                            href={`/details/${id}`}
                            className="bg-white p-3 rounded-full shadow-lg text-slate-700 hover:bg-first-color hover:text-white transition-all transform hover:scale-110 flex items-center justify-center"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            View
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
                        </span>
                    </div>

                    {/* Wishlist Button */}
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
                                "bg-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center hover:bg-first-color hover:text-white",
                                isInWishlist(id) ? "text-first-color" : "text-slate-700"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", isInWishlist(id) && "fill-current")} />
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="relative group/btn pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(productForContext as any);
                            }}
                            className={cn(
                                "bg-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center hover:bg-first-color hover:text-white",
                                isInCart(id) ? "text-first-color" : "text-slate-700"
                            )}
                        >
                            <ShoppingBag className={cn("w-5 h-5", isInCart(id) && "fill-current")} />
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            Add to Cart
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
                        </span>
                    </div>
                </div>
            </div>

            <div className={cn("p-5", viewMode === "list" ? "flex-1 flex flex-col justify-center p-6" : "")}>
                <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1">({rating})</span>
                </div>

                <Link href={`/details/${id}`}>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-first-color transition-colors mb-1 line-clamp-1">
                        {name}
                    </h3>
                </Link>

                {viewMode === "list" && description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-slate-900">₹{price}</span>
                        {oldPrice && <span className="text-xs text-slate-400 line-through">₹{oldPrice}</span>}
                    </div>
                    {/* Small action button for mobile or redundant quick action */}
                    <button
                        onClick={() => addToCart(productForContext as any)}
                        className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-first-color hover:text-white transition-all shadow-sm"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div >
    );
}
