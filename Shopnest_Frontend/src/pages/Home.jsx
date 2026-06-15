import React from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag,
  Heart,
  Star
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col font-sans overflow-x-hidden">
      
      {/* --- COSMIC HERO SECTION --- */}
      <section className="relative w-full py-[10vh] md:py-[15vh] px-[6vw] flex flex-col items-center justify-center text-center">
        
        {/* Soft Organic Fluid Nebulas */}
        <div className="absolute top-[-15vh] left-[10vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/10 blur-[10vw] pointer-events-none"></div>
        <div className="absolute bottom-[-10vh] right-[10vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/8 blur-[10vw] pointer-events-none"></div>

        {/* Outer Circular Rings for Premium Space Feel */}
        <div className="absolute w-[80vw] h-[80vw] border border-white/[0.02] rounded-full pointer-events-none"></div>
        <div className="absolute w-[60vw] h-[60vw] border border-white/[0.01] rounded-full pointer-events-none"></div>

        <div className="max-w-[85vw] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[8vh] lg:gap-[4vw] items-center z-10 relative">
          
          {/* Left Side: Soft Text & Floating Accents */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Soft Rounded Pill Badge */}
            <div className="px-[1.5vw] py-[0.8vh] md:px-[1.2vw] md:py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[3vw] md:text-[0.8vw] font-bold tracking-widest uppercase mb-[3.5vh] inline-flex items-center gap-[1.5vw] md:gap-[0.4vw] shadow-[0_0_2vw_rgba(99,102,241,0.05)]">
              <Sparkles className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw] text-indigo-400 fill-indigo-400/20 animate-pulse" />
              <span>Aesthetic Commerce Concept</span>
            </div>

            {/* Organic Soft Header */}
            <h1 className="text-[9vw] md:text-[4.5vw] font-extrabold text-white leading-tight mb-[3vh] tracking-tight">
              Curating beautiful <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-violet-200 to-cyan-300">
                everyday essentials.
              </span>
            </h1>

            <p className="text-[3.8vw] md:text-[1.1vw] text-slate-400 leading-relaxed max-w-[85vw] md:max-w-[34vw] mb-[5vh]">
              Discover an immersive digital catalog crafted for design purists. Enjoy fluid micro-interactions, responsive scaling, and a soft cosmic atmosphere.
            </p>

            {/* Rounded Tactile Button Set */}
            <div className="flex flex-col sm:flex-row items-center gap-[3vw] md:gap-[1.2vw] w-full sm:w-auto">
              <a 
                href="#releases"
                className="w-full sm:w-auto px-[6vw] py-[1.8vh] md:px-[2.5vw] md:py-[1.4vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.5vw] md:text-[0.9vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] transform active:scale-95 cursor-pointer"
              >
                <span>Explore releases</span>
                <ArrowRight className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw]" />
              </a>
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-[6vw] py-[1.8vh] md:px-[2.5vw] md:py-[1.4vh] rounded-[50vw] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-200 font-semibold text-[3.5vw] md:text-[0.9vw] transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] transform active:scale-95"
              >
                <span>Create account</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Frosted Floating Preview Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Ambient Back Glow */}
            <div className="absolute w-[20vw] h-[20vw] rounded-full bg-indigo-500/20 blur-[5vw] pointer-events-none"></div>

            {/* Glowing Frosted Glass Card */}
            <div className="relative w-[80vw] sm:w-[45vw] lg:w-[25vw] bg-white/[0.02] border border-white/[0.08] rounded-[2.5vw] p-[2vw] backdrop-blur-xl shadow-3xl flex flex-col gap-[2.5vh] hover:translate-y-[-0.5vh] transition-transform duration-500">
              
              {/* Product Visual Mock */}
              <div className="relative w-full aspect-square rounded-[1.8vw] bg-linear-to-tr from-slate-950 via-slate-900 to-indigo-950/40 overflow-hidden border border-white/[0.04]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="h-[8vh] w-[12vw] text-indigo-400/30 fill-indigo-400/5 animate-pulse" />
                </div>
                {/* Floating Rating Pill */}
                <div className="absolute top-[1.2vh] left-[1vw] px-[1.2vw] py-[0.6vh] rounded-[50vw] bg-black/60 backdrop-blur-md border border-white/[0.08] flex items-center gap-[0.4vw] text-[2.8vw] sm:text-[0.75vw] text-amber-400 font-bold">
                  <Star className="h-[1.5vh] w-[3vw] sm:w-[1vw] fill-current" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Product Info details */}
              <div className="flex flex-col gap-[1vh] text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[2.8vw] sm:text-[0.75vw] uppercase tracking-wider text-indigo-400 font-bold">Concept Edition</span>
                  <span className="text-[3.5vw] sm:text-[1.1vw] font-black text-white">$149.00</span>
                </div>
                <h3 className="text-[4.5vw] sm:text-[1.2vw] font-bold text-white tracking-tight leading-snug">ShopNest Space Capsule</h3>
                <p className="text-[3vw] sm:text-[0.8vw] text-slate-500">A limited high-fidelity aesthetic physical capsule.</p>
              </div>

              {/* Card CTA Row */}
              <div className="flex items-center justify-between pt-[1.5vh] border-t border-white/[0.04]">
                <div className="flex items-center gap-[0.5vw]">
                  <div className="w-[6vw] h-[6vw] sm:w-[2.2vw] sm:h-[2.2vw] rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
                    <Heart className="h-[1.8vh] w-[3vw] sm:w-[1.1vw] text-rose-500 fill-current" />
                  </div>
                  <span className="text-[2.8vw] sm:text-[0.75vw] text-slate-500 font-semibold">1.2k saves</span>
                </div>
                <button className="px-[3.5vw] py-[1vh] sm:px-[1.2vw] sm:py-[0.8vh] rounded-[50vw] bg-white text-black text-[2.8vw] sm:text-[0.75vw] font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                  Quick View
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- VALUE STATEMENT (Frosted Cards) --- */}
      <section className="w-full py-[8vh] px-[6vw]">
        <div className="max-w-[85vw] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[3vh] md:gap-[2.5vw]">
          
          {/* Box 1 */}
          <div className="p-[2.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.04] backdrop-blur-md flex flex-col gap-[2vh] text-left hover:bg-[#0c0f1e]/60 transition-colors">
            <span className="w-[10vw] h-[10vw] sm:w-[3.2vw] sm:h-[3.2vw] rounded-[1vw] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-[2.5vh] w-[4vw] sm:w-[1.6vw] fill-current" />
            </span>
            <h3 className="text-[4.2vw] md:text-[1.25vw] font-bold text-white tracking-tight">Vibrant Aesthetics</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-450 leading-relaxed">
              We focus heavily on rich design, utilizing soft glassmorphic panels, glowing neon hues, and responsive web curves.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-[2.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.04] backdrop-blur-md flex flex-col gap-[2vh] text-left hover:bg-[#0c0f1e]/60 transition-colors">
            <span className="w-[10vw] h-[10vw] sm:w-[3.2vw] sm:h-[3.2vw] rounded-[1vw] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="h-[2.5vh] w-[4vw] sm:w-[1.6vw]" />
            </span>
            <h3 className="text-[4.2vw] md:text-[1.25vw] font-bold text-white tracking-tight">Curated Inventory</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-450 leading-relaxed">
              Every single listing is handpicked by our product curators, ensuring a premium selection of high-fidelity essentials.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-[2.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.04] backdrop-blur-md flex flex-col gap-[2vh] text-left hover:bg-[#0c0f1e]/60 transition-colors">
            <span className="w-[10vw] h-[10vw] sm:w-[3.2vw] sm:h-[3.2vw] rounded-[1vw] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Heart className="h-[2.5vh] w-[4vw] sm:w-[1.6vw]" />
            </span>
            <h3 className="text-[4.2vw] md:text-[1.25vw] font-bold text-white tracking-tight">Global Support</h3>
            <p className="text-[3.5vw] md:text-[0.85vw] text-slate-450 leading-relaxed">
              Serving customers with secure, lightning-fast database routes, priority email channels, and 24/7 client care.
            </p>
          </div>

        </div>
      </section>

      {/* --- DYNAMIC PRODUCTS SHOWCASE --- */}
      <section id="releases" className="w-full py-[8vh] md:py-[12vh] px-[6vw] scroll-mt-[5vh]">
        <div className="max-w-[85vw] mx-auto flex flex-col gap-[6vh]">
          
          {/* Header Block */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-[3vh] gap-[2.5vh]">
            <div className="flex flex-col items-start gap-[0.5vh]">
              <span className="text-[3vw] sm:text-[0.85vw] font-bold uppercase tracking-wider text-indigo-400">
                Premium Releases
              </span>
              <h2 className="text-[6.5vw] md:text-[2.2vw] font-extrabold text-white flex items-center gap-[1.5vw] tracking-tight uppercase">
                <ShoppingBag className="h-[3.5vh] w-[6vw] md:w-[2.2vw] text-indigo-400" />
                <span>Trending Collections</span>
              </h2>
            </div>
            <p className="text-[3.5vw] md:text-[0.9vw] text-slate-500 max-w-[85vw] md:max-w-[28vw] leading-relaxed">
              Explore our physical inventory catalog, designed to fit seamlessly into modern daily life.
            </p>
          </div>

          {/* Grid Layout containing Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4vw] md:gap-[2.5vw]">
            <ProductCard />
          </div>

        </div>
      </section>

      {/* --- TACTILE MINIMALIST CTA BANNER --- */}
      <section className="w-full py-[8vh] px-[6vw]">
        <div className="max-w-[85vw] mx-auto">
          {/* Deep blur curved poster card */}
          <div className="relative overflow-hidden rounded-[3vw] bg-[#0c0f20]/50 border border-white/[0.05] py-[8vh] px-[6vw] flex flex-col md:flex-row items-center justify-between gap-[4vh] md:gap-[2vw] shadow-2xl">
            {/* Glowing Nebular Background mesh inside card */}
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[50vw] h-[40vh] rounded-full bg-indigo-500/10 blur-[6vw] pointer-events-none"></div>

            <div className="flex flex-col gap-[1.5vh] text-left z-10">
              <span className="text-[3vw] sm:text-[0.85vw] font-bold text-cyan-400 uppercase tracking-widest">[ Register Access ]</span>
              <h2 className="text-[6.5vw] md:text-[2.5vw] font-extrabold text-white leading-tight tracking-tight">
                Upgrade Your Shopping
              </h2>
              <p className="text-[3.5vw] md:text-[1vw] text-slate-400 max-w-[85vw] md:max-w-[38vw] leading-relaxed">
                Join our premium customer list to unlock custom order logs, responsive carts, and direct access to releases.
              </p>
            </div>

            <div className="z-10 w-full md:w-auto">
              <Link 
                to="/register" 
                className="w-full md:w-auto px-[6vw] py-[2vh] md:px-[2.5vw] md:py-[1.6vh] rounded-[50vw] text-[3.8vw] md:text-[0.95vw] font-bold tracking-wider uppercase bg-white text-black hover:bg-slate-200 transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw]"
              >
                <span>Create Account</span>
                <ArrowRight className="h-[2.2vh] w-[4vw] md:w-[1.2vw]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;