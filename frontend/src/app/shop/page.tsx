"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, SlidersHorizontal, LayoutGrid, LayoutList, ShoppingBag, Star, ChevronRight, Loader2, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useInfiniteProducts, useCategories } from "@/hooks/useProducts";
import { useInView } from "react-intersection-observer";

const SORT_OPTIONS = [
    { label: "Newest", value: "created_at", order: "desc" as const },
    { label: "Price: Low to High", value: "price", order: "asc" as const },
    { label: "Price: High to Low", value: "price", order: "desc" as const },
    { label: "Rating", value: "rating", order: "desc" as const },
];

export default function ShopPage() {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortConfig, setSortConfig] = useState(SORT_OPTIONS[0]);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [showOffer, setShowOffer] = useState(true);
    const { ref: loadMoreRef, inView } = useInView();

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Data Fetching
    const { data: categories = [], isLoading: catsLoading } = useCategories();
    const {
        data,
        isLoading: prodsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useInfiniteProducts({
        category_id: activeCategoryId,
        search: debouncedSearch,
        sort_by: sortConfig.value,
        order: sortConfig.order,
    });

    // Load more when scrolling to bottom (Disabled for manual load)
    // useEffect(() => {
    //     if (inView && hasNextPage) {
    //         fetchNextPage();
    //     }
    // }, [inView, hasNextPage, fetchNextPage]);

    const products = data?.pages.flatMap(page => page) || [];
    const isLoading = catsLoading || prodsLoading;

    return (
        <main className="min-h-screen bg-slate-50 pt-24">
            <Navbar />

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-slate-100 py-3 mb-6 sticky top-[73px] z-40 shadow-sm">
                <div className="container flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest">
                    <Link href="/" className="text-slate-900 hover:text-first-color transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-first-color">Shop</span>
                </div>
            </div>

            <div className="container pb-16">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-1/4 space-y-8 sticky top-[130px] h-[calc(100vh-130px)] overflow-y-auto pr-2">
                        <div>
                            <h4 className="text-sm font-black tracking-tighter mb-4 uppercase text-slate-900">Search</h4>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-first-color outline-none transition-all shadow-sm"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-black tracking-tighter mb-4 uppercase text-slate-900">Categories</h4>
                            {catsLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-9 bg-slate-200 rounded-lg animate-pulse" />)}
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setActiveCategoryId(null)}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all",
                                                activeCategoryId === null ? "bg-first-color text-white shadow-md" : "text-slate-600 hover:bg-white hover:shadow-sm"
                                            )}
                                        >
                                            All Categories
                                        </button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setActiveCategoryId(cat.id)}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all",
                                                    activeCategoryId === cat.id ? "bg-first-color text-white shadow-md" : "text-slate-600 hover:bg-white hover:shadow-sm"
                                                )}
                                            >
                                                {cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {showOffer && (
                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group cursor-pointer">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOffer(false);
                                    }}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors z-20"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 relative z-10">Offer</span>
                                <h3 className="text-xl font-black mt-2 leading-tight relative z-10">Summer Sale <br /> <span className="text-slate-400">Up to 70% off</span></h3>
                                <button className="mt-6 w-full bg-white text-slate-900 font-bold py-2.5 text-xs rounded-lg hover:bg-emerald-400 hover:text-white transition-all relative z-10">
                                    Shop Now
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
                            <div className="text-xs font-bold text-slate-500">
                                Showing <span className="text-slate-900">{products.length}</span> products
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 border-r border-slate-200 pr-4 mr-4 hidden md:flex">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-slate-100 text-first-color" : "text-slate-400")}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-slate-100 text-first-color" : "text-slate-400")}
                                    >
                                        <LayoutList className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="relative z-20">
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className={cn(
                                                "flex items-center space-x-2 px-4 py-2 rounded-full border bg-white transition-all duration-300",
                                                isSortOpen ? "border-first-color shadow-sm" : "border-slate-200 hover:border-first-color"
                                            )}
                                        >
                                            <SlidersHorizontal className={cn("w-3.5 h-3.5 transition-colors", isSortOpen ? "text-first-color" : "text-slate-400")} />
                                            <span className={cn("text-xs font-bold transition-colors", isSortOpen ? "text-slate-900" : "text-slate-700")}>
                                                {sortConfig.label}
                                            </span>
                                            <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-300", isSortOpen && "rotate-180 text-first-color")} />
                                        </button>

                                        <AnimatePresence>
                                            {isSortOpen && (
                                                <motion.ul
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 top-full mt-2 w-56 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100 p-2 overflow-hidden"
                                                >
                                                    {SORT_OPTIONS.map((option) => (
                                                        <li key={option.label}>
                                                            <button
                                                                onClick={() => {
                                                                    setSortConfig(option);
                                                                    setIsSortOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                                                                    sortConfig.value === option.value && sortConfig.order === option.order
                                                                        ? "bg-slate-50 text-first-color"
                                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                                    <div key={i} className="bg-white rounded-2xl p-3 space-y-3 animate-pulse border border-slate-100">
                                        <div className="aspect-[4/5] bg-slate-200 rounded-xl" />
                                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                                    </div>
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center text-center p-20">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">No products found</h3>
                                    <p className="text-slate-500 text-xs font-bold mt-1">Try adjusting your filters.</p>
                                    <button
                                        onClick={() => { setActiveCategoryId(null); setSearchQuery(""); }}
                                        className="mt-4 text-first-color text-xs font-bold hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={`${product.id}-${index}`}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                "group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300",
                                                viewMode === "list" && "flex flex-col md:flex-row"
                                            )}
                                        >
                                            <Link href={`/details/${product.id}`} className={cn(
                                                "relative overflow-hidden aspect-[4/5] block bg-slate-100",
                                                viewMode === "list" ? "md:w-48 aspect-square" : "w-full"
                                            )}>
                                                {product.image_urls?.[0] && (
                                                    <Image
                                                        src={product.image_urls[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                )}

                                                {product.is_featured && (
                                                    <span className="absolute top-3 left-3 bg-first-color text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10">
                                                        Hot
                                                    </span>
                                                )}
                                                {product.is_popular && !product.is_featured && (
                                                    <span className="absolute top-3 left-3 bg-amber-400 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10">
                                                        Pop
                                                    </span>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </Link>

                                            <div className={cn("p-4", viewMode === "list" ? "flex-1 flex flex-col justify-center p-6" : "")}>
                                                <div className="flex items-center space-x-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                                    ))}
                                                    <span className="text-[10px] font-bold text-slate-400 ml-1">({product.rating})</span>
                                                </div>
                                                <Link href={`/details/${product.id}`}>
                                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-first-color transition-colors mb-1 line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                {viewMode === "list" && (
                                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                                                        {product.old_price && <span className="text-xs text-slate-400 line-through">₹{product.old_price}</span>}
                                                    </div>
                                                    <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-first-color hover:text-white transition-all shadow-sm">
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.div>

                        {/* Loading Indicator for Infinite Scroll */}
                        <div ref={loadMoreRef} className="mt-12 flex justify-center py-8 border-t border-slate-100">
                            {hasNextPage ? (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="text-xs font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-first-color hover:border-first-color transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Load More Products</span>
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
