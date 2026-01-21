"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                            FASHION<span className="text-[hsl(var(--first-color))]">FIESTA</span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Premium fashion destination for the modern individual. We bring you the latest trends with unmatched quality and style.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[hsl(var(--first-color))] transition-colors">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[hsl(var(--first-color))] transition-colors">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[hsl(var(--first-color))] transition-colors">
                                <Twitter className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/shop" className="hover:text-[hsl(var(--first-color))] transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop" className="hover:text-[hsl(var(--first-color))] transition-colors">Best Sellers</Link></li>
                            <li><Link href="/about" className="hover:text-[hsl(var(--first-color))] transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[hsl(var(--first-color))] transition-colors">Store Locator</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Customer Service</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/account" className="hover:text-[hsl(var(--first-color))] transition-colors">My Account</Link></li>
                            <li><Link href="/cart" className="hover:text-[hsl(var(--first-color))] transition-colors">Shopping Cart</Link></li>
                            <li><Link href="/wishlist" className="hover:text-[hsl(var(--first-color))] transition-colors">Wishlist</Link></li>
                            <li><Link href="/terms" className="hover:text-[hsl(var(--first-color))] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-sm mb-6">Enter your email and receive the latest news about our products.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-800 border-none px-4 py-3 rounded-l-lg text-sm w-full focus:ring-1 focus:ring-[hsl(var(--first-color))] outline-none"
                            />
                            <button className="bg-[hsl(var(--first-color))] text-white px-4 py-3 rounded-r-lg hover:bg-emerald-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium">
                    <p>© 2026 Fashion Fiesta. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="flex items-center"><Phone className="w-3 h-3 mr-2" /> +91-9054401780</span>
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> Ahmedabad, India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
