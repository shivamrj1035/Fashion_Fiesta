"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CART_ITEMS = [
    { id: 1, name: "Floral Print Shirt", price: 450, color: "Teal", size: "M", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964" },
    { id: 2, name: "Casual Sneakers", price: 850, color: "White", size: "9", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070" },
    { id: 3, name: "Leather Watch", price: 2100, color: "Brown", size: "One Size", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999" },
];

export default function CartPage() {
    const [items, setItems] = useState(CART_ITEMS);
    const [quantities, setQuantities] = useState<Record<number, number>>({ 1: 1, 2: 1, 3: 1 });

    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * (quantities[item.id] || 1)), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 pb-20">
                <Navbar />
                <div className="container flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Your cart is empty</h2>
                    <p className="text-slate-500 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.</p>
                    <Link href="/shop" className="btn-primary mt-4">
                        Start Shopping
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32">
            <Navbar />

            <div className="container pb-20">
                <h1 className="text-4xl font-black tracking-tighter mb-10 text-center md:text-left">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-6">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all"
                            >
                                <div className="relative w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-slate-50">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-black text-slate-900 mb-1">{item.name}</h3>
                                    <p className="text-sm font-bold text-slate-400 mb-4">{item.color} • {item.size}</p>
                                    <p className="text-xl font-black text-first-color">₹{item.price}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-slate-50 rounded-xl p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-colors shadow-sm"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold text-slate-900">{quantities[item.id]}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-colors shadow-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 sticky top-32">
                            <h3 className="text-xl font-black tracking-tight mb-8">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Shipping Estimate</span>
                                    <span className="text-slate-900">₹{shipping}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Tax Estimate</span>
                                    <span className="text-slate-900">₹0</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-black text-slate-900">
                                    <span>Order Total</span>
                                    <span className="text-first-color">₹{total}</span>
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-first-color transition-all shadow-xl hover:shadow-2xl flex items-center justify-center group">
                                Checkout
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

