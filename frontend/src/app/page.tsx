"use client";

import Navbar from "@/components/Navbar";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import CVTeaser from "@/components/CVTeaser";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - High Fidelity Dark Mode */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center overflow-hidden bg-slate-950">
        <HeroCarousel />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-first-color animate-pulse" />
              <span className="text-first-color font-black tracking-[0.2em] uppercase text-[9px]">
                New Era of Style
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-first-color to-emerald-400">Identity.</span>
            </h1>

            <p className="text-sm md:text-base text-slate-400 max-w-sm font-medium leading-relaxed">
              Experience the fusion of high-end fashion and Neural Computer Vision. Find your style with 44k+ curated items.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <Link href="/shop" className="bg-first-color text-white py-3.5 px-10 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] active:scale-95">
                Explore Collection
              </Link>
              <Link href="/visual-search" className="text-white py-3.5 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
                Try Visual Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CategorySlider />
      <CVTeaser />
      <FeaturedProducts />
      <Footer />
    </main>
  );
}
