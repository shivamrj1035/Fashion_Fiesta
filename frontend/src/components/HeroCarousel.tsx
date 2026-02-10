"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useFeaturedProducts } from "@/hooks/useProducts";

export default function HeroCarousel() {
    const { data: products = [], isLoading } = useFeaturedProducts(10);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter products that actually have images
    const slides = products.filter(p => p.image_urls && p.image_urls.length > 0);

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, [slides.length]);

    const getImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        return `${baseUrl}${url}`;
    };

    if (isLoading || slides.length === 0) {
        return <div className="absolute inset-0 bg-slate-900 animate-pulse" />;
    }

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={getImageUrl(slides[currentIndex].image_urls[0])}
                        alt="Hero Background"
                        fill
                        className="object-cover mix-blend-overlay"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="absolute bottom-10 right-10 z-30 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-8 h-1 rounded-full transition-all duration-500 ${index === currentIndex ? "bg-first-color w-12" : "bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
        </div>
    );
}
