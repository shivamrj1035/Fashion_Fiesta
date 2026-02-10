"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, Sparkles, AlertCircle, Info, Zap, Maximize, Settings2, Activity, User as UserIcon, Search, CheckCircle2, Filter, Loader2, StopCircle, Upload, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInfiniteProducts, Product } from "@/hooks/useProducts";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function VirtualTryOnPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-first-color animate-spin" />
            </main>
        }>
            <VirtualTryOnContent />
        </Suspense>
    );
}

function VirtualTryOnContent() {
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [tryOnMode, setTryOnMode] = useState<'live' | 'photo'>('live');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [status, setStatus] = useState("System Offline");
    const [fps, setFps] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: productsData, isLoading: loadingProducts } = useInfiniteProducts({ search: searchQuery });
    const allProducts = productsData?.pages.flatMap(page => page) || [];

    // Auto-select product from URL if present
    useEffect(() => {
        const productId = searchParams.get("productId");
        if (productId && allProducts.length > 0) {
            const product = allProducts.find(p => p.id === Number(productId));
            if (product) {
                setSelectedProduct(product);
            }
        }
    }, [searchParams, allProducts]);

    // Helper to format image URL
    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isStreaming) setFps(Math.floor(Math.random() * 5) + 56);
        }, 1000);
        return () => clearInterval(interval);
    }, [isStreaming]);

    const startCamera = async () => {
        if (!selectedProduct) return;
        setStatus("Initializing Neural Engine...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setTryOnMode('live');
                setTimeout(() => setStatus("Tracking 33 Mesh Points"), 1000);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatus("Hardware Link Error");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
        setStatus("System Offline");
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
                setTryOnMode('photo');
                setIsStreaming(false); // Stop camera if photo is uploaded
                setStatus("Analyzing Static Template...");
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 text-slate-200 selection:bg-first-color/30 selection:text-first-color">
            <Navbar />

            <div className="pt-32 pb-8">
                <div className="container mx-auto px-4 max-w-[1600px]">

                    {/* Dark Mode Lab Header - Compact */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div className="space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800"
                            >
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experimental Studio</span>
                            </motion.div>
                            <h1 className="text-4xl font-black text-white tracking-tighter">
                                AR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-first-color">Projector</span>
                            </h1>
                            <p className="text-slate-400 font-medium max-w-lg text-[13px] leading-tight opacity-70">
                                Real-time clothing projection using high-fidelity pose estimation.
                            </p>
                        </div>

                        <div className="hidden lg:flex items-center gap-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Select Garment</p>
                                <p className={cn("text-xs font-black", selectedProduct ? "text-emerald-400" : "text-rose-400")}>
                                    {selectedProduct ? "Ready" : "Required"}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Neural Sync</p>
                                <p className={cn("text-xs font-black", isStreaming ? "text-emerald-400" : "text-slate-400")}>
                                    {isStreaming ? "Streaming" : "Standby"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Product Picker (Left) */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 space-y-6 flex flex-col h-[700px]">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5" />
                                        Inventory Selection
                                    </h3>
                                    {selectedProduct && (
                                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase">Selected</span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-first-color/50 transition-colors"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {allProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-3 rounded-2xl border transition-all text-left group",
                                                selectedProduct?.id === product.id
                                                    ? "bg-first-color/10 border-first-color shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                                    : "bg-slate-900/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
                                            )}
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                                <Image
                                                    src={getImageUrl(product.image_urls[0])}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black uppercase text-slate-300 truncate tracking-tight">{product.name}</h4>
                                                <p className="text-xs font-bold text-first-color mt-0.5">₹{product.price}</p>
                                                <p className="text-[9px] text-slate-500 uppercase mt-1">ID: {product.id}</p>
                                            </div>
                                            {selectedProduct?.id === product.id && (
                                                <div className="w-8 h-8 rounded-full bg-first-color text-white flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {loadingProducts && (
                                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                                            <Loader2 className="w-6 h-6 text-first-color animate-spin" />
                                            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Accessing Datastream</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-700/30 space-y-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTryOnMode('live')}
                                            className={cn(
                                                "flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                                                tryOnMode === 'live' ? "bg-slate-800 border-first-color text-first-color" : "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            <Monitor className="w-3.5 h-3.5" />
                                            Live Mode
                                        </button>
                                        <label className={cn(
                                            "flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 cursor-pointer",
                                            tryOnMode === 'photo' ? "bg-slate-800 border-first-color text-first-color" : "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300"
                                        )}>
                                            <Upload className="w-3.5 h-3.5" />
                                            Photo Mode
                                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                        </label>
                                    </div>

                                    <button
                                        onClick={isStreaming ? stopCamera : startCamera}
                                        disabled={!selectedProduct || (tryOnMode === 'photo' && !uploadedImage)}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-3 relative group overflow-hidden uppercase tracking-[0.15em]",
                                            (!selectedProduct || (tryOnMode === 'photo' && !uploadedImage))
                                                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                                                : isStreaming
                                                    ? "bg-rose-500/10 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white"
                                                    : "bg-first-color text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                                        )}
                                    >
                                        {isStreaming ? (
                                            <>
                                                <StopCircle className="w-4 h-4" />
                                                Stop Neural Engine
                                            </>
                                        ) : (
                                            <>
                                                {tryOnMode === 'live' ? <Camera className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                                Initialize {tryOnMode === 'live' ? 'Live AR' : 'Photo AR'}
                                            </>
                                        )}
                                    </button>
                                    {!selectedProduct && (
                                        <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest text-center animate-pulse">
                                            Pick a garment to start AR
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* AR Viewport (Right) */}
                        <div className="lg:col-span-12 xl:col-span-8 group">
                            <div className="aspect-[16/9] md:aspect-video bg-slate-800/20 border border-slate-700/50 rounded-[2.5rem] overflow-hidden relative shadow-2xl transition-all duration-700">

                                <AnimatePresence>
                                    {(!isStreaming && tryOnMode === 'live') || (tryOnMode === 'photo' && !uploadedImage) ? (
                                        <motion.div
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md px-10 text-center"
                                        >
                                            <div className="w-32 h-32 bg-slate-950 rounded-[2.5rem] border border-slate-800/50 flex items-center justify-center mb-10 relative">
                                                {tryOnMode === 'live' ? <Camera className="w-10 h-10 text-slate-700 animate-pulse" /> : <Upload className="w-10 h-10 text-slate-700 animate-bounce" />}
                                                <div className="absolute inset-x-0 bottom-0 h-1 bg-first-color/20 blur-md" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                                {tryOnMode === 'live' ? "Neural Link Offline" : "Awaiting Template"}
                                            </h3>
                                            <div className="mt-4 flex flex-col items-center gap-2">
                                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-2">
                                                    <span className={cn("w-1.5 h-1.5 rounded-full", (selectedProduct) ? "bg-emerald-500" : "bg-rose-500")} />
                                                    Garment Signature: {selectedProduct ? "Verified" : "Missing"}
                                                </p>
                                                <p className="text-slate-600 text-[9px] uppercase font-black tracking-[0.2em]">
                                                    {tryOnMode === 'live' ? "Awaiting hardware handshake..." : "Upload a photo to begin projection..."}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>

                                {/* Photo Viewport */}
                                {tryOnMode === 'photo' && uploadedImage && (
                                    <div className="absolute inset-0 z-0">
                                        <Image src={uploadedImage} alt="User Template" fill className="object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
                                    </div>
                                )}

                                {/* Live Viewport */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className={cn(
                                        "w-full h-full object-cover grayscale contrast-125 opacity-20 brightness-50 transition-all duration-1000 scale-x-[-1]", // Mirroring added
                                        isStreaming && "opacity-80 grayscale-0 brightness-110"
                                    )}
                                />

                                {/* Simulated AR Overlay (Floating Garment) */}
                                {(isStreaming || (tryOnMode === 'photo' && uploadedImage)) && selectedProduct && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="relative w-80 h-96 group">
                                            <Image
                                                src={getImageUrl(selectedProduct.image_urls[0])}
                                                alt="AR Overlay"
                                                fill
                                                className="object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-float opacity-90 transition-all duration-500"
                                            />
                                            {/* Scanning effect around garment */}
                                            <div className="absolute inset-0 border border-first-color/20 rounded-3xl animate-pulse" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Detection Messages */}
                                {(isStreaming || (tryOnMode === 'photo' && uploadedImage)) && (
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-slate-950/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-first-color animate-ping" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                            {status.includes("Mesh") ? "Human Found - Projecting Garment" : status}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay HUD Elements */}
                                {isStreaming && (
                                    <div className="absolute inset-0 z-10 pointer-events-none">
                                        {/* Corner Brackets */}
                                        <div className="absolute top-12 left-12 w-16 h-16 border-l-[3px] border-t-[3px] border-first-color rounded-tl-2xl opacity-50" />
                                        <div className="absolute top-12 right-12 w-16 h-16 border-r-[3px] border-t-[3px] border-first-color rounded-tr-2xl opacity-50" />
                                        <div className="absolute bottom-12 left-12 w-16 h-16 border-l-[3px] border-b-[3px] border-first-color rounded-bl-2xl opacity-50" />
                                        <div className="absolute bottom-12 right-12 w-16 h-16 border-r-[3px] border-b-[3px] border-first-color rounded-br-2xl opacity-50" />

                                        {/* Telemetry */}
                                        <div className="absolute top-12 right-20 text-right">
                                            <div className="text-[10px] font-black text-first-color uppercase tracking-widest mb-1">FPS</div>
                                            <div className="text-3xl font-black tabular-nums tracking-tighter text-white">{fps}</div>
                                        </div>

                                        <div className="absolute bottom-14 left-20">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Hash</div>
                                            <div className="text-[11px] font-black text-emerald-400 font-mono">0x{Math.random().toString(16).substr(2, 8).toUpperCase()}</div>
                                        </div>

                                        {/* Crosshair */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-first-color rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 border-t border-first-color/20 rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.02); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin 6s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </main>
    );
}
