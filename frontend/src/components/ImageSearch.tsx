
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Product {
    id: number;
    name: string;
    price: number;
    old_price?: number;
    rating: number;
    image_urls: string[];
    category_id: number;
    match_score?: number;
}

interface ImageSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageSearch({ isOpen, onClose }: ImageSearchProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setSelectedImage(URL.createObjectURL(file));
            // Auto search on select or wait for user? Let's wait for user to click search or auto?
            // Let's do auto for smoother UX
            handleSearch(file);
        }
    };

    const handleSearch = async (file: File) => {
        setLoading(true);
        setResults([]);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Use the centralized API client which handles baseURL
            // Endpoint is /search/image as defined in backend/api/search.py
            const { data } = await import("@/lib/api").then(m => m.default.post<Product[]>("/search/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }));

            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Camera className="w-6 h-6 text-first-color" />
                                Visual Search
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Upload Section */}
                                <div className="md:col-span-1 space-y-6">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "relative aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-first-color hover:bg-first-color/5 transition-all group overflow-hidden bg-white",
                                            selectedImage ? "border-solid border-first-color" : ""
                                        )}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />

                                        {selectedImage ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={selectedImage}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-first-color" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-600 text-center">
                                                    Click to upload an image
                                                </p>
                                                <p className="text-xs text-slate-400 text-center mt-2">
                                                    JPG, PNG supported
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {loading && (
                                        <div className="flex items-center justify-center gap-2 text-first-color font-bold animate-pulse">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Searching similar styles...
                                        </div>
                                    )}
                                </div>

                                {/* Results Section */}
                                <div className="md:col-span-2">
                                    {!selectedImage ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                                            <Search className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="font-medium">Upload an image to find similar products</p>
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Similar Products</h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                {results.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/details/${product.id}`}
                                                        onClick={onClose}
                                                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100"
                                                    >
                                                        <div className="aspect-[4/5] relative overflow-hidden bg-slate-200">
                                                            {product.image_urls && product.image_urls[0] && (
                                                                <Image
                                                                    src={product.image_urls[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            )}
                                                            {product.match_score && (
                                                                <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
                                                                    {product.match_score}% Match
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <h4 className="font-bold text-slate-800 text-sm truncate">{product.name}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm font-black text-first-color">₹{product.price}</span>
                                                                {product.old_price && (
                                                                    <span className="text-[10px] text-slate-400 line-through">₹{product.old_price}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : !loading && (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                            <p>No similar products found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
