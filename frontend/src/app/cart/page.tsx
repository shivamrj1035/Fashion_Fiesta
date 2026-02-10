"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, addToCart, removeFromCart, decrementItem } = useCart();

    const updateQuantity = (id: number, delta: number) => {
        // Find item to update
        const item = items.find(i => i.id === id);
        if (!item) return;

        if (delta > 0) {
            addToCart(item); // Context logic adds +1
        } else {
            // Logic to remove 1 is not in context explicitly exposed as decrement, 
            // but usually cart implementation handles it or we could add a `updateQuantity` method.
            // Given addToCart implementation: "return [...prev, { ...product, quantity: 1 }];" and "quantity: item.quantity + 1"
            // It seems current implementation only increments.
            // To support decrement properly, I should check CartContext. 
            // The context file I wrote earlier only has `addToCart` (which increments) and `removeFromCart`.
            // It missed `decrementItem`.
            // For now, I will assume the user adds more. To fix decrement, I might need to edit Context.
            // Let's stick to what is available or try to re-use addToCart. 
            // Actually, I should update Context to support setting quantity or decrementing.
            // But to keep it simple and fulfill request "make it working", I will rely on context.
            // Wait, if I cannot decrement, the minus button is broken.
            // I will update CartContext in next step if needed. 
            // For now, I will use `addToCart` for +1. For -1, I will leave it empty or remove if qty 1?
            // No, I need to fix it.
            // Let's implement the layout first using what we have.

            // The prompt is "is not added to the wishlist page and add to cart page".
            // display is key.
        }
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-slate-900 pt-32 pb-20 text-white">
                <Navbar />
                <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-28 h-28 bg-slate-800/50 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <ShoppingBag className="w-12 h-12 text-slate-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter">Cart is Offline</h2>
                        <p className="text-slate-500 max-w-sm font-medium">Your current session has no active objects in the procurement queue.</p>
                    </div>
                    <Link href="/shop" className="bg-first-color text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-first-color/20">
                        Synchronize Now
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 pt-32 text-white">
            <Navbar />

            <div className="container mx-auto px-4 pb-20">
                <h1 className="text-5xl font-black tracking-tighter mb-12 text-center md:text-left">Procurement / Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-6">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/5 flex flex-col sm:flex-row items-center gap-8 group hover:border-white/10 transition-all shadow-2xl"
                            >
                                <div className="relative w-full sm:w-32 aspect-square rounded-[1.5rem] overflow-hidden bg-slate-900 border border-white/5">
                                    {item.image_urls && item.image_urls[0] && (
                                        <Image src={item.image_urls[0]} alt={item.name} fill className="object-cover" />
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-1">
                                    <h3 className="text-xl font-black text-white tracking-tight">{item.name}</h3>
                                    <p className="text-2xl font-black text-first-color tracking-tighter">₹{item.price}</p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center bg-slate-900/50 rounded-2xl p-1.5 border border-white/5">
                                        <button
                                            onClick={() => decrementItem(item.id)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all disabled:opacity-20"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-black text-lg text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-slate-950/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 sticky top-32 shadow-2xl">
                            <h3 className="text-2xl font-black tracking-tight mb-8">Summary / Cluster</h3>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                    <span>Procurement Subtotal</span>
                                    <span className="text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                    <span>Logistics Estimate</span>
                                    <span className="text-white">₹{shipping}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                    <span>Tax Allocation</span>
                                    <span className="text-white">₹0</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Final Delta</span>
                                    <span className="text-4xl font-black text-first-color tracking-tighter">₹{total}</span>
                                </div>
                            </div>

                            <button className="w-full bg-first-color text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center group text-sm active:scale-95">
                                Initialize Checkout
                                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
                            </button>

                            <div className="mt-10 flex items-center justify-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                <ShieldCheck className="w-4 h-4 text-first-color" />
                                <span>Neural Encryption Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

