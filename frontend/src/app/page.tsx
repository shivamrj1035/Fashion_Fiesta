import Navbar from "@/components/Navbar";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center overflow-hidden bg-slate-50 mt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-[center_top_-100px]" />
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
              <button className="btn-primary py-2.5 px-6 text-xs">Shop Now</button>
              <button className="px-6 py-2.5 rounded-lg font-bold text-xs text-slate-700 bg-white shadow-sm hover:shadow-lg transition-all border border-slate-100">
                View Gallery
              </button>
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
