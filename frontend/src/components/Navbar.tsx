"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Search, User, Menu, X, ChevronDown, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import ImageSearch from "./ImageSearch";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Men", href: "/shop?category=men", items: ["Topwear", "Bottomwear", "Footwear", "Watches"] },
    { name: "Women", href: "/shop?category=women", items: ["Topwear", "Dresses", "Footwear", "Jewellery"] },
    { name: "New Arrivals", href: "/shop?sort=new" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [imageSearchOpen, setImageSearchOpen] = useState(false);
    const { user: currentUser, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-3"
            )}
        >
            {/* Top Bar (Optional, can be used for alerts) */}
            <div className="bg-first-color text-white py-1 px-4 text-center text-[10px] font-bold uppercase tracking-widest">
                Super value Deals - Save more with coupons and up to 20% off!
            </div>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mt-2">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group">
                        FASHION<span className="text-first-color">FIESTA</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center space-x-8">
                    {NAV_LINKS.map((link, index) => (
                        <motion.li
                            key={link.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            <Link
                                href={link.href}
                                className="text-sm font-bold text-slate-700 hover:text-first-color transition-colors flex items-center group-hover:scale-105 transform duration-300"
                            >
                                {link.name}
                                {link.items && <ChevronDown className="ml-1 w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                            </Link>

                            {link.items && (
                                <div className="absolute top-full left-0 mt-3 w-48 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 border border-slate-50">
                                    {link.items.map((item) => (
                                        <Link
                                            key={item}
                                            href={`${link.href}&sub=${item.toLowerCase()}`}
                                            className="block px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-first-color transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="p-2 text-slate-700 hover:text-first-color transition-all transform hover:scale-110"
                    >
                        <Search className="w-4.5 h-4.5" />
                    </button>

                    <button
                        onClick={() => setImageSearchOpen(true)}
                        className="p-2 text-slate-700 hover:text-first-color transition-all transform hover:scale-110"
                        title="Search by Image"
                    >
                        <Camera className="w-4.5 h-4.5" />
                    </button>

                    <Link href="/wishlist" className="relative p-2 text-slate-700 hover:text-first-color transition-all transform hover:scale-110">
                        <Heart className="w-4.5 h-4.5" />
                        <span className="absolute top-1 right-1 bg-first-color text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">3</span>
                    </Link>

                    <Link href="/cart" className="relative p-2 text-slate-700 hover:text-first-color transition-all transform hover:scale-110">
                        <ShoppingCart className="w-4.5 h-4.5" />
                        <span className="absolute top-1 right-1 bg-first-color text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">5</span>
                    </Link>

                    {currentUser ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-2">
                            <div className="flex flex-col items-end hidden lg:flex leading-tight">
                                <span className="text-xs font-bold text-slate-900">{currentUser.full_name.split(' ')[0]}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Member</span>
                            </div>
                            <div className="group relative">
                                <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 hover:bg-first-color hover:text-white transition-colors border border-slate-200">
                                    <User className="w-4 h-4" />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                                    <div className="px-4 py-2 border-b border-slate-50 mb-1 lg:hidden">
                                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.full_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                                    </div>
                                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors uppercase tracking-wider">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 text-slate-700 hover:text-first-color transition-all transform hover:scale-110">
                            <User className="w-4.5 h-4.5" />
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <span className="text-xl font-bold">MENU</span>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <ul className="flex-1 overflow-y-auto p-6 space-y-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-2xl font-bold text-slate-800"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

            </AnimatePresence>

            <ImageSearch isOpen={imageSearchOpen} onClose={() => setImageSearchOpen(false)} />
        </header>
    );
}
