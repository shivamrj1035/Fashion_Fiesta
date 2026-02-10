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

    const products = data?.pages.flatMap(page => page) || [];
    const isLoading = catsLoading || prodsLoading;

    return (
        <main className="min-h-screen bg-slate-900 pt-32">
            <Navbar />

            {/* Breadcrumbs - Adjusted Sticky Top */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 py-3 mb-6 sticky top-[81px] z-40">
                <div className="container mx-auto px-4 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <Link href="/shop" className={cn("transition-colors", !gender && !activeCategoryId ? "text-first-color" : "text-slate-400 hover:text-white")}>Shop</Link>
                    {gender && (
                        <>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                            <span className="text-first-color">{gender}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="container pb-16">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters - Updated Sticky Top */}
                    <aside className="lg:w-1/4 space-y-8 sticky top-[130px] h-[calc(100vh-130px)] overflow-y-auto pr-2">
                        <div>
                            <h4 className="text-xs font-black tracking-[0.2em] mb-4 uppercase text-slate-500">Neural Search</h4>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Scan database..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-first-color/50 outline-none transition-all placeholder:text-slate-600"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-first-color transition-colors" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black tracking-[0.2em] mb-4 uppercase text-slate-500">Categories</h4>
                            {catsLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-800/50 rounded-xl animate-pulse" />)}
                                </div>
                            ) : (
                                <ul className="space-y-2 border-l border-white/5 ml-1">
                                    <li>
                                        <button
                                            onClick={() => updateFilters({ category: null })}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-r-xl text-xs font-bold transition-all border-l-2",
                                                activeCategoryId === null
                                                    ? "border-first-color bg-first-color/5 text-first-color"
                                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                            )}
                                        >
                                            All Collections
                                        </button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => updateFilters({ category: cat.id })}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 rounded-r-xl text-xs font-bold transition-all border-l-2",
                                                    activeCategoryId === cat.id
                                                        ? "border-first-color bg-first-color/5 text-first-color"
                                                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                                )}
                                            >
                                                {cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Top Bar - Z-INDEX FIX */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-5 bg-slate-800/40 backdrop-blur-md rounded-[1.5rem] border border-white/5 gap-4 relative z-30">
                            <div className="text-xs font-bold text-slate-500">
                                Results: <span className="text-white">{products.length}</span> Objects Detected
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 border-r border-white/10 pr-4 mr-4 hidden md:flex">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn("p-2 rounded-xl transition-all", viewMode === "grid" ? "bg-first-color/10 text-first-color" : "text-slate-500 hover:text-slate-300")}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-first-color/10 text-first-color" : "text-slate-500 hover:text-slate-300")}
                                    >
                                        <LayoutList className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="relative z-20">
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className={cn(
                                                "flex items-center space-x-3 px-5 py-2.5 rounded-full border transition-all duration-300 text-[11px] font-black uppercase tracking-widest",
                                                isSortOpen ? "bg-slate-800 border-first-color text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-slate-700"
                                            )}
                                        >
                                            <SlidersHorizontal className={cn("w-3.5 h-3.5 transition-colors", isSortOpen ? "text-first-color" : "text-slate-500")} />
                                            <span>
                                                {sortConfig.label}
                                            </span>
                                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform duration-300", isSortOpen && "rotate-180 text-first-color")} />
                                        </button>

                                        <AnimatePresence>
                                            {isSortOpen && (
                                                <motion.ul
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 p-2 overflow-hidden z-50"
                                                >
                                                    {SORT_OPTIONS.map((option) => (
                                                        <li key={option.label}>
                                                            <button
                                                                onClick={() => {
                                                                    setSortConfig(option);
                                                                    setIsSortOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                                                    sortConfig.value === option.value && sortConfig.order === option.order
                                                                        ? "bg-first-color/10 text-first-color"
                                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                                )}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <motion.div
                            layout
                            className={cn(
                                "grid gap-6 min-h-[400px]",
                                viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                            )}
                        >
                            {isLoading ? (
                                // Compact Skeletons
                                [...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-slate-800/40 rounded-2xl p-4 space-y-4 animate-pulse border border-white/5">
                                        <div className="aspect-[4/5] bg-slate-800 rounded-xl" />
                                        <div className="h-3 bg-slate-800 rounded w-3/4" />
                                        <div className="h-3 bg-slate-800 rounded w-1/2" />
                                    </div>
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center text-center p-20">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                        <Search className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-white">Negative Match Found</h3>
                                    <p className="text-slate-500 text-sm font-bold mt-2">The specified parameters returned no results in the neural database.</p>
                                    <button
                                        onClick={() => { setActiveCategoryId(null); setSearchQuery(""); }}
                                        className="mt-6 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                                    >
                                        Reset Neural Filters
                                    </button>
                                </div>
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
                                            badge={product.is_featured ? "Hot" : product.is_popular ? "Pop" : undefined}
                                            badgeColor={product.is_featured ? "first-color" : "amber-400"}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.div>

                        {/* Loading Indicator for Infinite Scroll */}
                        <div ref={loadMoreRef} className="mt-16 flex justify-center py-12 border-t border-white/5">
                            {hasNextPage ? (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="px-10 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20 active:scale-95 group shadow-2xl"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-first-color" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Expand Results</span>
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            ) : products.length > 0 ? (
                                <p className="text-sm font-bold text-slate-400">You've reached the end!</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
