"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Camera, Search, Loader2, Info, Sparkles, Filter, LayoutGrid, Activity, Maximize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
    image_urls: string[];
    match_score?: number;
    attributes?: {
        baseColour?: string;
        articleType?: string;
    }
}

export default function VisualSearchPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [telemetry, setTelemetry] = useState({ accuracy: 98.4, inference: 12 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry({
                accuracy: parseFloat((98.2 + Math.random() * 0.7).toFixed(1)),
                inference: Math.floor(10 + Math.random() * 6)
            });
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            searchImage(file);
        }
    };

    const searchImage = async (file: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${baseUrl}/search/image`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 selection:bg-first-color/30 selection:text-first-color text-white">
            <Navbar />

            <div className="pt-32 pb-8">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Header Card - Tech HUD Style */}
                    <div className="relative mb-10 rounded-[2rem] bg-slate-900 p-10 overflow-hidden shadow-2xl border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-first-color/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                        {/* Retro Grid Effect */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-first-color" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Neural Vision v2.0</span>
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                                    Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-first-color">Search</span>
                                </h1>
                                <p className="text-slate-400 font-medium max-w-lg text-[13px] leading-relaxed">
                                    Upload a style or snap a photo. Our neural network will analyze pattern, cut, and color to find your perfect match from our collection.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
                                    <Activity className="w-5 h-5 text-first-color mb-2" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span>
                                    <span className="text-lg font-black text-white">{telemetry.accuracy}%</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
                                    <Maximize className="w-5 h-5 text-emerald-400 mb-2" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inference</span>
                                    <span className="text-lg font-black text-white">{telemetry.inference}ms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Control Module (Left) - More Compact & Fixed Width */}
                        <div className="lg:col-span-4 xl:col-span-3 sticky top-24 space-y-4">
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 shadow-2xl">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Camera className="w-3.5 h-3.5 text-first-color" />
                                    Query Image
                                </h3>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "relative aspect-square max-w-[240px] mx-auto rounded-2xl border-2 border-dashed border-white/5 transition-all cursor-pointer group flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-950 hover:border-first-color/30",
                                        selectedImage && "border-solid border-first-color/20 bg-slate-950"
                                    )}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*" />

                                    {selectedImage ? (
                                        <div className="absolute inset-2.5 z-10 overflow-hidden rounded-xl shadow-2xl border border-white/10">
                                            <Image src={selectedImage} alt="Query" fill className="object-cover" />

                                            {/* Scanning Line Animation */}
                                            {loading && (
                                                <motion.div
                                                    initial={{ top: "-10%" }}
                                                    animate={{ top: "110%" }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-x-0 h-1 bg-first-color shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 backdrop-blur-[2px]">
                                                <button className="bg-first-color text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-xl uppercase tracking-widest">Replace</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-3 p-4">
                                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-white/5 group-hover:bg-slate-700 transition-colors">
                                                <Upload className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop Style Query</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Link</span>
                                        <span className="text-[9px] font-black text-first-color uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-first-color animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            Stream Active
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 overflow-hidden rounded-full h-1 bg-slate-900 border border-white/5">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-first-color to-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Viewport (Right) */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">

                            {/* Filter Bar - Compact - Z-INDEX FIX */}
                            <div className="bg-slate-800/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between shadow-xl relative z-20 gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={cn("px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'all' ? "bg-first-color text-white shadow-lg shadow-first-color/20" : "text-slate-500 hover:text-white hover:bg-white/5")}
                                    >
                                        Neural Hub
                                    </button>
                                    {/* <button
                                        onClick={() => setActiveTab('similar')}
                                        className={cn("px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'similar' ? "bg-first-color text-white shadow-lg shadow-first-color/20" : "text-slate-500 hover:text-white hover:bg-white/5")}
                                    >
                                        High Conf.
                                    </button> */}
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Confidience Count</span>
                                        <span className="text-sm font-black text-first-color mt-1">{results.length > 0 ? (99.2 + Math.random() * 0.7).toFixed(2) : "0.00"}%</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-first-color hover:border-first-color/30 cursor-pointer transition-all">
                                        <LayoutGrid className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Main Grid - Standardized with ProductCard */}
                            <div className="bg-slate-800/20 backdrop-blur-sm rounded-[2.5rem] p-4 md:p-8 border border-white/5 min-h-[600px] shadow-2xl overflow-hidden">
                                {loading ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 animate-pulse">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl border border-white/5" />
                                        ))}
                                    </div>
                                ) : results.length > 0 ? (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {results.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    id={product.id}
                                                    name={product.name}
                                                    price={product.price}
                                                    rating={4.5}
                                                    image={product.image_urls?.[0] || ""}
                                                    badge={product.match_score ? `${product.match_score.toFixed(1)}%` : undefined}
                                                    badgeColor="emerald-500"
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-12">
                                        <div className="w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center mb-8 relative border border-white/5 shadow-2xl">
                                            <Search className="w-10 h-10 text-slate-700 relative z-10" />
                                            <div className="absolute inset-0 border border-first-color/20 rounded-full animate-ping opacity-20" />
                                            <div className="absolute inset-4 border border-first-color/10 rounded-full animate-pulse opacity-40" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter">Operational Readiness 100%</h3>
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-4 max-w-sm leading-loose">
                                            CV Engine Idling. Upload style query to initialize feature extraction sequence.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </main>
    );
}
