"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, SlidersHorizontal, LayoutGrid, LayoutList, ShoppingBag, Star, ChevronRight, Loader2, ChevronDown, X, Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteProducts, useCategories } from "@/hooks/useProducts";
import { useInView } from "react-intersection-observer"; // Keeping this import if needed later
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

const SORT_OPTIONS = [
    { label: "Newest", value: "created_at", order: "desc" as const },
    { label: "Price: Low to High", value: "price", order: "asc" as const },
    { label: "Price: High to Low", value: "price", order: "desc" as const },
    { label: "Rating", value: "rating", order: "desc" as const },
];

export default function ShopPage() {
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
        category_id: activeCategoryId,
        gender: gender,
        sub_category: subCategory,
        search: debouncedSearch,
        sort_by: sortConfig.value,
        order: sortConfig.order,
    });

    // Automatic Infinite Scroll
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const products = data?.pages.flatMap(page => page) || [];
    const isLoading = catsLoading || prodsLoading;

    return (
        <main className="min-h-screen bg-[#020617] pt-28">
            <Navbar />

            {/* Premium Header Section */}
            <div className="relative border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl py-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-first-color/5 via-transparent to-purple-500/5 opacity-50" />
                <div className="container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-first-color/80">
                                <span>Neural Database</span>
                                <div className="w-1 h-1 rounded-full bg-first-color animate-pulse" />
                                <span className="text-slate-500">Global Sync</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                Infinite <span className="text-transparent bg-clip-text bg-gradient-to-r from-first-color to-emerald-400">Collections</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed">
                                Experience 5,000+ curated objects powered by computer vision and real-time neural indexing.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-white">Shop</span>
                            {gender && (
                                <>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-first-color">{gender}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sidebar Filters - Premium Glassmorphism */}
                    <aside className="lg:w-[280px] shrink-0 space-y-8">
                        <div className="sticky top-28 space-y-8">
                            {/* Neural Search Input */}
                            <div className="p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem]">
                                <div className="bg-slate-900/90 backdrop-blur-xl rounded-[1.9rem] p-5 border border-white/5 space-y-4">
                                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 flex items-center justify-between">
                                        Search Query
                                        <Search className="w-3 h-3 text-first-color" />
                                    </h4>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Keywords..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-first-color/50 outline-none transition-all placeholder:text-slate-600 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="p-1 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem]">
                                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[1.9rem] p-5 border border-white/5">
                                    <h4 className="text-[10px] font-black tracking-[0.2em] mb-6 uppercase text-slate-500">Classifications</h4>
                                    <div className="space-y-1.5">
                                        <button
                                            onClick={() => updateFilters({ category: null })}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group",
                                                activeCategoryId === null
                                                    ? "bg-first-color text-slate-900 shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span>Full Index</span>
                                            {activeCategoryId === null && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                                        </button>

                                        {catsLoading ? (
                                            [...Array(6)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
                                        ) : (
                                            categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => updateFilters({ category: cat.id })}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group",
                                                        activeCategoryId === cat.id
                                                            ? "bg-first-color text-slate-900 shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                                    )}
                                                >
                                                    <span className="truncate">{cat.name}</span>
                                                    {activeCategoryId === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Visual Stats */}
                            <div className="bg-first-color/5 border border-first-color/10 rounded-[2rem] p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-first-color">Live Telemetry</span>
                                    <div className="w-2 h-2 rounded-full bg-first-color animate-ping" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Inference</p>
                                        <p className="text-sm font-black text-white">12.4ms</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Load Bal</p>
                                        <p className="text-sm font-black text-white">Optimum</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        {/* Dynamic Toolbar */}
                        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/5 gap-4 relative z-[60]">
                            <div className="flex items-center space-x-4 pl-2">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Index Results</span>
                                    <span className="text-sm font-black text-white">{products.length} <span className="text-[10px] text-slate-500 font-bold ml-1">Objects</span></span>
                                </div>
                                <div className="h-8 w-px bg-white/10 hidden md:block" />
                                <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950/50 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn("px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2", viewMode === "grid" ? "bg-first-color text-slate-900" : "text-slate-500 hover:text-slate-300")}
                                    >
                                        <LayoutGrid className="w-3 h-3" />
                                        <span>Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn("px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2", viewMode === "list" ? "bg-first-color text-slate-900" : "text-slate-500 hover:text-slate-300")}
                                    >
                                        <LayoutList className="w-3 h-3" />
                                        <span>List</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className={cn(
                                            "flex items-center space-x-4 px-6 py-2.5 rounded-full border transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em]",
                                            isSortOpen ? "bg-white text-slate-900 border-white" : "bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/20"
                                        )}
                                    >
                                        <span>Sort: {sortConfig.label}</span>
                                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-500", isSortOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {isSortOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-3 w-64 bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl border border-white/10 p-2 overflow-hidden z-50"
                                            >
                                                {SORT_OPTIONS.map((option) => (
                                                    <button
                                                        key={`${option.label}-${option.order}`}
                                                        onClick={() => {
                                                            setSortConfig(option);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group",
                                                            sortConfig.value === option.value && sortConfig.order === option.order
                                                                ? "bg-first-color/10 text-first-color"
                                                                : "text-slate-500 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {option.label}
                                                        {(sortConfig.value === option.value && sortConfig.order === option.order) && (
                                                            <div className="w-1 h-1 rounded-full bg-first-color" />
                                                        )}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid Area */}
                        <div className="relative">
                            <motion.div
                                layout
                                className={cn(
                                    "grid gap-4 md:gap-6",
                                    viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                )}
                            >
                                {isLoading && products.length === 0 ? (
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-slate-900/40 rounded-3xl p-5 space-y-5 animate-pulse border border-white/5 aspect-[4/5]">
                                            <div className="aspect-square bg-slate-800 rounded-2xl" />
                                            <div className="space-y-3">
                                                <div className="h-3 bg-slate-800 rounded-full w-3/4" />
                                                <div className="h-3 bg-slate-800 rounded-full w-1/2" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {products.map((product, index) => (
                                            <ProductCard
                                                key={`${product.id}-${index}`}
                                                id={product.id}
                                                name={product.name}
                                                price={product.price}
                                                oldPrice={product.old_price}
                                                rating={product.rating}
                                                image={product.image_urls?.[0] || ""}
                                                description={product.description}
                                                badge={product.is_featured ? "Featured" : product.is_popular ? "Top Rate" : undefined}
                                                badgeColor={product.is_featured ? "first-color" : "amber-400"}
                                                viewMode={viewMode}
                                            />
                                        ))}
                                    </AnimatePresence>
                                )}
                            </motion.div>

                            {/* No Results Fallback */}
                            {!isLoading && products.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-32 space-y-6"
                                >
                                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 relative">
                                        <Search className="w-10 h-10 text-slate-700" />
                                        <div className="absolute inset-0 border-2 border-first-color/20 rounded-full animate-ping" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">Zero Matches Detected</h3>
                                        <p className="text-slate-500 text-sm font-bold mt-2 max-w-sm mx-auto">Our neural engine couldn't find any objects matching your current parameters.</p>
                                    </div>
                                    <button
                                        onClick={() => { setActiveCategoryId(null); setSearchQuery(""); setGender(null); }}
                                        className="bg-first-color text-slate-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-first-color/20 transition-all hover:scale-105"
                                    >
                                        Reset Search Engine
                                    </button>
                                </motion.div>
                            )}

                            {/* Infinite Load Indicator */}
                            <div ref={loadMoreRef} className="py-20 flex flex-col items-center justify-center space-y-4">
                                {isFetchingNextPage ? (
                                    <>
                                        <div className="flex items-center space-x-1.5 h-6">
                                            {[0, 0.1, 0.2].map((delay) => (
                                                <motion.div
                                                    key={delay}
                                                    animate={{ scaleY: [0.4, 1.2, 0.4] }}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: delay
                                                    }}
                                                    className="w-1.5 h-full bg-first-color rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Synchronizing Neural Data...</span>
                                    </>
                                ) : !hasNextPage && products.length > 0 ? (
                                    <div className="flex flex-col items-center space-y-2 opacity-50">
                                        <div className="w-12 h-px bg-white/10" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End of Catalog</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
