import Navbar from "@/components/Navbar";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[450px] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-[center_top_0px]" />
        </div>

        <div className="container relative z-20">
          <div className="max-w-xl space-y-4">
            <span className="inline-block text-first-color font-bold tracking-widest uppercase text-[10px]">
              Hot Promotions
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter text-slate-900">
              Fashion <span className="text-transparent bg-clip-text bg-gradient-to-r from-first-color to-emerald-500">Trending</span> <br />
              Collection
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-md font-medium leading-relaxed">
              Save more with coupons and get up to 20% off on our latest summer collection.
            </p>
            <div className="pt-4 flex space-x-3">
              <Link href="/shop" className="btn-primary py-2.5 px-6 text-xs">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      <CategorySlider />
      <FeaturedProducts />
      <Footer />
    </main>
  );
}
