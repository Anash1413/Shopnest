import React from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden py-[8vh] md:py-[12vh] px-[5vw] md:px-[6vw] flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-[-10vh] left-[-10vw] w-[80vw] md:w-[35vw] h-[35vw] rounded-[40vw] md:rounded-[17.5vw] bg-indigo-600/10 blur-[8vw] md:blur-[6vw] pointer-events-none"></div>
        <div className="absolute bottom-[-10vh] right-[-10vw] w-[80vw] md:w-[35vw] h-[35vw] rounded-[40vw] md:rounded-[17.5vw] bg-cyan-600/10 blur-[8vw] md:blur-[6vw] pointer-events-none"></div>
        
        {/* Animated Badge */}
        <div className="px-[3vw] py-[0.8vh] md:px-[1.2vw] md:py-[0.6vh] rounded-[2vw] md:rounded-[1vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[3vw] md:text-[0.8vw] font-bold tracking-widest uppercase mb-[3vh] md:mb-[3.5vh] inline-flex items-center gap-[1.5vw] md:gap-[0.4vw]">
          <Sparkles className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw] text-indigo-450 animate-spin" />
          <span>New Experience Awaits</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-[7.5vw] md:text-[4vw] font-black tracking-tight text-white leading-tight max-w-[90vw] md:max-w-[55vw] mb-[2.5vh]">
          Elevate Your Style With{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-indigo-200 to-cyan-300">
            ShopNest Premium
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-[3.8vw] md:text-[1.15vw] text-slate-400 leading-relaxed max-w-[85vw] md:max-w-[45vw] mb-[4vh] md:mb-[5vh]">
          Discover a carefully curated universe of trending, top-tier goods. Experience secure checkouts, ultra-fast delivery, and premium care at every step.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[3vw] md:gap-[1.2vw] w-full sm:w-auto">
          <a 
            href="#products-section"
            className="w-full sm:w-auto px-[5vw] py-[1.8vh] md:px-[2vw] md:py-[1.4vh] rounded-[2vw] md:rounded-[1vw] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[3.5vw] md:text-[0.9vw] shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] hover:translate-y-[-0.2vh] cursor-pointer"
          >
            <span>Shop Now</span>
            <ArrowRight className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw]" />
          </a>
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-[5vw] py-[1.8vh] md:px-[2vw] md:py-[1.4vh] rounded-[2vw] md:rounded-[1vw] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 font-semibold text-[3.5vw] md:text-[0.9vw] transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] hover:translate-y-[-0.2vh] cursor-pointer"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </section>

      {/* --- CREATIVE VALUE HIGHLIGHTS --- */}
      <section className="relative max-w-[85vw] md:max-w-[80vw] mx-auto mb-[8vh] mt-[-2vh] w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3.5vh] md:gap-[2.5vw]">
          
          {/* Card 1: Express Delivery */}
          <div className="p-[6vw] md:p-[2vw] rounded-[4vw] md:rounded-[1.5vw] bg-[#0b0f19]/60 border border-slate-900/80 backdrop-blur-md flex flex-col gap-[1.5vh] hover:border-slate-800/80 hover:bg-[#0b0f19] transition-all duration-300">
            <div className="w-[12vw] h-[12vw] md:w-[3vw] md:h-[3vw] rounded-[2.5vw] md:rounded-[0.8vw] bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-[1vh] md:mb-[0.5vh]">
              <Truck className="h-[3.5vh] w-[6vw] md:h-[2.5vh] md:w-[1.8vw]" />
            </div>
            <h3 className="text-[4.5vw] md:text-[1.2vw] font-bold text-white">Express Delivery</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-400 leading-relaxed">
              We ship packages globally using advanced priority services, ensuring they arrive securely in record time.
            </p>
          </div>

          {/* Card 2: Secure Payment */}
          <div className="p-[6vw] md:p-[2vw] rounded-[4vw] md:rounded-[1.5vw] bg-[#0b0f19]/60 border border-slate-900/80 backdrop-blur-md flex flex-col gap-[1.5vh] hover:border-slate-800/80 hover:bg-[#0b0f19] transition-all duration-300">
            <div className="w-[12vw] h-[12vw] md:w-[3vw] md:h-[3vw] rounded-[2.5vw] md:rounded-[0.8vw] bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-[1vh] md:mb-[0.5vh]">
              <ShieldCheck className="h-[3.5vh] w-[6vw] md:h-[2.5vh] md:w-[1.8vw]" />
            </div>
            <h3 className="text-[4.5vw] md:text-[1.2vw] font-bold text-white">Protected Checkout</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-400 leading-relaxed">
              Every checkout transaction is locked behind strict industry-standard SSL encryption protocols.
            </p>
          </div>

          {/* Card 3: Support */}
          <div className="p-[6vw] md:p-[2vw] rounded-[4vw] md:rounded-[1.5vw] bg-[#0b0f19]/60 border border-slate-900/80 backdrop-blur-md flex flex-col gap-[1.5vh] hover:border-slate-800/80 hover:bg-[#0b0f19] transition-all duration-300">
            <div className="w-[12vw] h-[12vw] md:w-[3vw] md:h-[3vw] rounded-[2.5vw] md:rounded-[0.8vw] bg-violet-500/10 flex items-center justify-center text-violet-400 mb-[1vh] md:mb-[0.5vh]">
              <Headphones className="h-[3.5vh] w-[6vw] md:h-[2.5vh] md:w-[1.8vw]" />
            </div>
            <h3 className="text-[4.5vw] md:text-[1.2vw] font-bold text-white">Elite Helpdesk</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-400 leading-relaxed">
              Our professional support desk works 24/7/365 to resolve your shipment queries and returns.
            </p>
          </div>

        </div>
      </section>

      {/* --- PRODUCTS SECTION --- */}
      <section id="products-section" className="max-w-[85vw] md:max-w-[80vw] mx-auto mb-[10vh] w-full scroll-mt-[5vh]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[4vh] gap-[2vh]">
          <div>
            <span className="text-[3vw] md:text-[0.8vw] font-bold uppercase tracking-wider text-indigo-400">
              Curated Selection
            </span>
            <h2 className="text-[5.5vw] md:text-[2.2vw] font-black text-white mt-[0.5vh] flex items-center gap-[1.5vw] md:gap-[0.5vw]">
              <ShoppingBag className="h-[4.5vh] w-[6.5vw] md:h-[3.5vh] md:w-[2.2vw] text-indigo-400 fill-current" />
              <span>Trending Arrivals</span>
            </h2>
          </div>
          <p className="text-[3.5vw] md:text-[0.9vw] text-slate-550 max-w-[85vw] md:max-w-[30vw]">
            Browse all our high-quality inventory, now open for guest viewing and registered users.
          </p>
        </div>

        {/* Product Cards Container Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4vw] md:gap-[2vw]">
          <ProductCard />
        </div>
      </section>

      {/* --- CALL TO ACTION (CTA) --- */}
      <section className="max-w-[85vw] md:max-w-[80vw] mx-auto mb-[8vh] w-full">
        <div className="relative overflow-hidden rounded-[4vw] md:rounded-[2vw] bg-[#0b0f19] border border-slate-900 py-[6vh] md:py-[8vh] px-[6vw] md:px-[4vw] flex flex-col items-center text-center shadow-xl">
          {/* Ambient Glowing Background Layer */}
          <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[80vw] md:w-[40vw] h-[30vh] md:h-[40vh] rounded-[40vw] md:rounded-[20vw] bg-indigo-500/5 blur-[10vw] md:blur-[5vw] pointer-events-none"></div>

          <h2 className="text-[5.5vw] md:text-[2.5vw] font-black text-white mb-[2vh] md:mb-[1.5vh] tracking-tight">
            Ready to Upgrade Your Lifestyle?
          </h2>
          <p className="text-[3.5vw] md:text-[1.05vw] text-slate-450 max-w-[80vw] md:max-w-[40vw] mb-[4vh] leading-relaxed">
            Join our community today! Registered members receive exclusive discount vouchers, access to custom tracking, and direct access to order history.
          </p>

          <Link 
            to="/register" 
            className="w-full sm:w-auto px-[5vw] py-[1.8vh] md:px-[2.5vw] md:py-[1.6vh] rounded-[2vw] md:rounded-[1vw] bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[3.5vw] md:text-[0.9vw] shadow-lg shadow-indigo-650/20 transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] cursor-pointer"
          >
            <span>Unlock Premium Benefits</span>
            <ArrowRight className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw]" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;