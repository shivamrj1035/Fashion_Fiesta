"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowRight, RotateCcw, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";

export default function ProductDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const { data: product, isLoading } = useProduct(id);

    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("Teal");

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-first-color border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">Loading product details...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
                    <p className="text-slate-500 mb-6">The product you are looking for does not exist.</p>
                    <a href="/shop" className="btn-primary">Back to Shop</a>
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
        <main className="min-h-screen bg-slate-50 pt-24">
            <Navbar />

            <div className="container pb-16">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Image Gallery */}
                        <div className="lg:w-2/5 space-y-4">
                            <motion.div
                                layoutId="mainImg"
                                className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg border border-white bg-slate-100"
                            >
                                <Image src={images[activeImg]} alt={product.name} fill className="object-cover" />
                                {product.is_featured && (
                                    <span className="absolute top-4 left-4 bg-first-color text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                                        Best Seller
                                    </span>
                                )}
                            </motion.div>

                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={cn(
                                            "relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                                            activeImg === idx ? "border-first-color scale-105" : "border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200"
                                        )}
                                    >
                                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="lg:w-3/5 py-2">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="font-bold text-slate-900 text-sm">{product.rating}</span>
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Rating</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-end space-x-3 mb-6">
                                <span className="text-3xl font-black text-first-color">₹{product.price}</span>
                                {product.old_price && (
                                    <span className="text-lg text-slate-400 line-through font-bold mb-1">₹{product.old_price}</span>
                                )}
                                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full mb-2">
                                    SAVE {Math.round(((product.old_price || product.price) - product.price) / (product.old_price || product.price) * 100)}%
                                </span>
                            </div>

                            <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm md:text-base">
                                {product.description}
                            </p>

                            <div className="space-y-6 mb-8">
                                {/* Sizes */}
                                <div>
                                    <div className="flex justify-between mb-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-900">Select Size</span>
                                        <button className="text-[10px] font-bold text-first-color underline">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center",
                                                    selectedSize === size
                                                        ? "border-first-color bg-first-color text-white shadow-lg scale-105"
                                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
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

                            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-slate-50 rounded-xl p-1.5 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-lg transition-colors shadow-sm font-bold"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-lg transition-colors shadow-sm font-bold"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button className="flex-1 btn-primary flex items-center justify-center text-base gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 py-3">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-3 mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex flex-col items-center text-center">
                                    <Truck className="w-5 h-5 text-first-color mb-1.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Free Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-l border-slate-200">
                                    <ShieldCheck className="w-5 h-5 text-first-color mb-1.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Secure Pay</span>
                                </div>
                                <div className="flex flex-col items-center text-center border-l border-slate-200">
                                    <RotateCcw className="w-5 h-5 text-first-color mb-1.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Free Returns</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Features Tabs Placeholder */}
                <div className="mt-12 text-center">
                    <h3 className="text-xl font-black text-slate-900 mb-5">Product Features</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            "Premium Cotton Blend",
                            "Breathable Fabric",
                            "Pre-shrunk & Color Fast"
                        ].map((feat, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 justify-center">
                                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-700 text-sm">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
