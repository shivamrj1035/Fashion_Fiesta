"use client";

import { motion } from "framer-motion";
import { Camera, Zap, Search, Maximize2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";

const CORE_CV_FEATURES = [
    {
        title: "Visual Search",
        desc: "Find matches using ResNet50. Discover styles instantly.",
        icon: Search,
        link: "/visual-search",
        color: "bg-blue-500",
        delay: 0.1
    },
    {
        title: "AR Try-On",
        desc: "Real-time pose estimation for clothing projection.",
        icon: Maximize2,
        link: "/virtual-try-on",
        color: "bg-purple-500",
        delay: 0.2
    },
    {
        title: "Auto-Tagging",
        desc: "Neural identification of category and fabric.",
        icon: Zap,
        link: "/visual-search",
        color: "bg-amber-500",
        delay: 0.3
    }
];

export default function CVTeaser() {
    const { data: featured = [] } = useFeaturedProducts(1);
    const teaserProduct = featured[0];
    const [confidence, setConfidence] = useState(98.4);

    useEffect(() => {
        const interval = setInterval(() => {
            setConfidence(97.8 + Math.random() * 1.5);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Helper to format image URL
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    const teaserImage = teaserProduct?.image_urls?.[0] ? getImageUrl(teaserProduct.image_urls[0]) : "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012";

    return (
        <section className="py-24 bg-slate-950 overflow-hidden border-y border-white/5">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Info */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-first-color/10 px-3 py-1.5 rounded-full border border-first-color/20"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-first-color" />
                            <span className="text-[9px] font-black text-first-color uppercase tracking-[0.2em]">Neural Fashion</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[0.95]"
                        >
                            Neural <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-first-color to-emerald-400">Intelligence</span> Lab
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 font-medium leading-relaxed max-w-sm text-[13px]"
                        >
                            Our proprietary Computer Vision engine is integrated into every layer of the experience. The future of fashion is algorithmic.
                        </motion.p>

                        <div className="grid grid-cols-1 gap-4 pt-2">
                            {CORE_CV_FEATURES.map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: feature.delay }}
                                    className="group flex items-start gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                >
                                    <div className={`${feature.color} text-white p-2.5 rounded-2xl shadow-xl`}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-white text-base flex items-center gap-2 group-hover:text-first-color transition-colors">
                                            {feature.title}
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </h4>
                                        <p className="text-[11px] text-slate-500 font-medium leading-tight">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual Mockup - More Compact */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square max-w-[400px] mx-auto"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-first-color blur-[80px] opacity-10 animate-pulse" />

                            {/* Main Display */}
                            <div className="relative w-full h-full rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl border-4 border-slate-800/50">
                                <Image
                                    src={teaserImage}
                                    alt="CV Analysis"
                                    fill
                                    className="object-cover opacity-60 brightness-90 transition-all duration-1000 group-hover:scale-105"
                                />

                                {/* HUD Overlays */}
                                <div className="absolute inset-x-6 top-8 flex justify-between">
                                    <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 min-w-[60px] text-center">
                                        <div className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none">Confidence</div>
                                        <div className="text-[10px] font-black text-emerald-400 mt-0.5">{confidence.toFixed(1)}%</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-first-color flex items-center justify-center text-white">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="absolute inset-x-6 bottom-8">
                                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                <Zap className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Neural Hub</p>
                                                <p className="text-[10px] font-bold text-white mt-0.5 whitespace-nowrap">
                                                    {teaserProduct ? `${teaserProduct.attributes?.articleType || 'Item'}: ${teaserProduct.name}` : "Scanning for patterns..."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Scanner */}
                                <motion.div
                                    animate={{ y: [0, 320, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-px bg-first-color/40 shadow-[0_0_15px_#first-color]"
                                />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
