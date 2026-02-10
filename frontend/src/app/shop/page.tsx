"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, SlidersHorizontal, LayoutGrid, LayoutList, ShoppingBag, Star, ChevronRight, Loader2, ChevronDown, X, Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteProducts, useCategories } from "@/hooks/useProducts";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

const SORT_OPTIONS = [
    { label: "Newest", value: "created_at", order: "desc" as const },
    { label: "Price: Low to High", value: "price", order: "asc" as const },
    { label: "Price: High to Low", value: "price", order: "desc" as const },
    { label: "Rating", value: "rating", order: "desc" as const },
];

function ShopContent() {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [subCategory, setSubCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortConfig, setSortConfig] = useState(SORT_OPTIONS[0]);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [showOffer, setShowOffer] = useState(true);
    const { ref: loadMoreRef, inView } = useInView();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Data Fetching
    const { data: categories = [], isLoading: catsLoading } = useCategories();

    // Sync URL Params
    useEffect(() => {
        const catParam = searchParams.get("category");
        const genderParam = searchParams.get("gender");
        const subParam = searchParams.get("sub");

        if (catParam && categories.length > 0) {
            const foundCat = categories.find(c => c.name.toLowerCase() === catParam.toLowerCase());
            setActiveCategoryId(foundCat ? foundCat.id : null);
        } else {
            setActiveCategoryId(null);
        }

        setGender(genderParam);
        setSubCategory(subParam);
    }, [searchParams, categories]);

    // Handle Filter Changes
    const updateFilters = (updates: { category?: number | null, gender?: string | null, sub?: string | null }) => {
        const params = new URLSearchParams(searchParams.toString());

        if ('category' in updates) {
            if (updates.category === null) params.delete("category");
            else {
                const cat = categories.find(c => c.id === updates.category);
                if (cat) params.set("category", cat.name.toLowerCase());
            }
        }

        if ('gender' in updates) {
            const g = updates.gender;
            if (g === null || g === undefined) params.delete("gender");
            else params.set("gender", g.toLowerCase());
        }

        if ('sub' in updates) {
            const s = updates.sub;
            if (s === null || s === undefined) params.delete("sub");
            else params.set("sub", s.toLowerCase());
        }

        router.push(`/shop?${params.toString()}`);
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Data Fetching
    const {
        data,
        isLoading: prodsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useInfiniteProducts({
        category_id: activeCategoryId || undefined,
        gender: gender || undefined,
        sub_category: subCategory || undefined,
        search: debouncedSearch || undefined,
        sort_by: sortConfig.value,
        order: sortConfig.order
    });

    // Infinite Scroll trigger
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const products = data?.pages.flatMap(page => page) || [];

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-first-color/30">
            <Navbar />

            {/* Premium Header / Hero Section */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-first-color/10 via-transparent to-transparent opacity-50" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-first-color animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-first-color">Live Procurement Matrix</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
                        >
                            THE <span className="text-first-color glass-text">FASHION</span><br />
                            COLLECTIVE
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs & View Controls */}
            <div className="container mx-auto px-4 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-white/5">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">Shop Archive</span>
                        {gender && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-first-color">{gender}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-2.5 rounded-xl transition-all",
                                viewMode === "grid" ? "bg-first-color text-white shadow-lg shadow-first-color/20" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-2.5 rounded-xl transition-all",
                                viewMode === "list" ? "bg-first-color text-white shadow-lg shadow-first-color/20" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-32">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 shrink-0 space-y-8">
                        {/* Search Block */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-first-color transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-1 focus:ring-first-color/50 focus:border-first-color/50 outline-none transition-all"
                            />
                        </div>

                        {/* Gender Matrix */}
                        <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center justify-between">
                                Gender Matrix
                                <span className="w-1.5 h-1.5 rounded-full bg-first-color/50" />
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {["Men", "Women", "Boys", "Girls"].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => updateFilters({ gender: gender === g ? null : g })}
                                        className={cn(
                                            "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                            gender === g
                                                ? "bg-first-color text-white border-first-color shadow-lg shadow-first-color/20"
                                                : "bg-slate-950 text-slate-400 border-white/5 hover:border-white/10 hover:text-white"
                                        )}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Spectrum */}
                        <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center justify-between">
                                Category Spectrum
                                <span className="w-1.5 h-1.5 rounded-full bg-first-color/50" />
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => updateFilters({ category: null })}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeCategoryId === null ? "bg-first-color text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    All Protocols
                                    {activeCategoryId === null && <div className="w-1 h-1 rounded-full bg-white" />}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateFilters({ category: cat.id })}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeCategoryId === cat.id ? "bg-first-color text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {cat.name}
                                        {activeCategoryId === cat.id && <div className="w-1 h-1 rounded-full bg-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Pulse */}
                        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-first-color/20 to-transparent rounded-[2rem] border border-first-color/10 group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                <ShoppingBag className="w-12 h-12" />
                            </div>
                            <h4 className="text-lg font-black tracking-tight mb-2">PRO-MEMBER SCAN</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider mb-4">
                                Members get 20% extra extraction bandwidth on all orders.
                            </p>
                            <Link href="/register" className="inline-flex items-center text-[10px] font-black text-first-color uppercase tracking-widest hover:gap-3 transition-all">
                                Initialize Link <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        {/* Dynamic Toolbar */}
                        <div className={cn("flex flex-wrap items-center justify-between p-4 bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/5 gap-4 relative z-[60]")}>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 border-r border-white/10">
                                    Displaying <span className="text-white font-black">{products.length}</span> Units
                                </span>
                                {debouncedSearch && (
                                    <div className="flex items-center gap-2 bg-first-color/10 px-4 py-2 rounded-full border border-first-color/20">
                                        <span className="text-[10px] font-black text-first-color uppercase">Query: "{debouncedSearch}"</span>
                                        <button onClick={() => setSearchQuery("")}><X className="w-3 h-3 text-first-color" /></button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-3 px-6 py-3 bg-slate-950 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-first-color/30 transition-all"
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5 text-first-color" />
                                    Sort: {sortConfig.label}
                                    <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", isSortOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-56 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[70] backdrop-blur-xl"
                                        >
                                            <div className="p-2 space-y-1">
                                                {SORT_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.label}
                                                        onClick={() => {
                                                            setSortConfig(opt);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                            sortConfig.label === opt.label ? "bg-first-color text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Product Grid Area */}
                        {prodsLoading && products.length === 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-slate-900/60 rounded-[2rem] border border-white/5 animate-pulse overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-t from-slate-950 to-transparent" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 border border-white/5">
                                    <Search className="w-10 h-10 text-slate-700" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Protocol Empty</h3>
                                <p className="text-slate-500 max-w-sm text-sm font-bold uppercase tracking-widest leading-loose">
                                    No units found matching your current matrix configuration.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        updateFilters({ category: null, gender: null, sub: null });
                                    }}
                                    className="mt-8 text-xs font-black text-first-color uppercase tracking-[0.2em] border border-first-color/20 px-8 py-4 rounded-2xl hover:bg-first-color hover:text-white transition-all shadow-xl shadow-first-color/10"
                                >
                                    Reset Selection
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className={cn(
                                    "grid gap-4 md:gap-6",
                                    viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                )}
                            >
                                <AnimatePresence mode="popLayout">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            oldPrice={product.old_price}
                                            rating={product.rating}
                                            image={product.image_urls?.[0]}
                                            description={product.description}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Infinite Load Indicator */}
                        <div ref={loadMoreRef} className="py-20 flex flex-col items-center justify-center gap-6">
                            {(isFetchingNextPage || hasNextPage) ? (
                                <>
                                    <div className="relative w-12 h-12">
                                        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-t-first-color rounded-full animate-spin" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Next Chunk...</p>
                                </>
                            ) : products.length > 0 && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-px w-24 bg-white/5" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 italic">Terminus Reached - End of Procurement Stream</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                @keyframes stretch {
                    0% { transform: scaleX(1); opacity: 1; }
                    50% { transform: scaleX(1.5); opacity: 0.5; }
                    100% { transform: scaleX(1); opacity: 1; }
                }
            `}</style>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-first-color" />
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
