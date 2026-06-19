import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Compass, HelpCircle, Sparkles } from 'lucide-react'

function NotFound() {
  useEffect(() => {
        document.title = '404' 
  }, [])
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-hidden relative flex flex-col items-center justify-center py-[10vh] px-[6vw]">
      
      {/* Cosmic background nebulae */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20vh] left-[20vw] w-[40vw] h-[40vw] rounded-full bg-violet-600/10 blur-[10vw]"></div>
        <div className="absolute bottom-[20vh] right-[20vw] w-[40vw] h-[40vw] rounded-full bg-cyan-600/8 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center max-w-[500px] gap-[4vh]">
        
        {/* Floating Sparkles Badge */}
        <div className="px-[2.5vw] py-[0.8vh] md:px-[1.2vw] md:py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[3.2vw] md:text-[0.8vw] font-bold tracking-widest uppercase inline-flex items-center gap-[1.5vw] md:gap-[0.4vw] shadow-[0_0_2vw_rgba(99,102,241,0.05)]">
          <Compass className="h-[2vh] w-[3.5vw] md:h-[1.8vh] md:w-[1.1vw] text-indigo-400 animate-spin-slow" />
          <span>Navigation Alert</span>
        </div>

        {/* 404 Glowing Number block */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[3vw] bg-gradient-to-r from-violet-600 to-indigo-650 opacity-40 blur-2xl group-hover:opacity-60 transition duration-500"></div>
          <div className="relative px-[8vw] py-[3vh] md:px-[4vw] md:py-[2.5vh] rounded-[2.5vw] bg-slate-950/80 border border-white/10 backdrop-blur-xl flex flex-col items-center">
            <h1 className="text-[18vw] md:text-[7vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 tracking-tighter leading-none select-none">
              404
            </h1>
            <span className="text-[3.2vw] md:text-[0.8vw] text-slate-500 uppercase tracking-widest font-black mt-[1vh]">
              Orbit Mismatch
            </span>
          </div>
        </div>

        {/* Messaging block */}
        <div className="flex flex-col gap-[1.5vh]">
          <h2 className="text-[6.5vw] md:text-[2vw] font-extrabold text-white tracking-tight leading-tight uppercase">
            Lost In Space
          </h2>
          <p className="text-[3.8vw] md:text-[0.95vw] text-slate-450 leading-relaxed font-medium">
            The coordinates you requested are out of reach. Either the route was never registered, or it has drifted permanently out of orbit.
          </p>
        </div>

        {/* Action Button Set */}
        <div className="flex flex-col sm:flex-row items-center gap-[3vw] md:gap-[1vw] w-full mt-[1.5vh]">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex-1 px-[6vw] py-[1.8vh] md:px-[1.8vw] md:py-[1.4vh] rounded-[50vw] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-200 font-bold text-[3.5vw] md:text-[0.9vw] transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-[2.2vh] w-[3.5vw] md:h-[1.8vh] md:w-[1vw]" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto flex-1 px-[6vw] py-[1.8vh] md:px-[1.8vw] md:py-[1.4vh] rounded-[50vw] bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.5vw] md:text-[0.9vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-[1.5vw] md:gap-[0.5vw] transform active:scale-95"
          >
            <Home className="h-[2.2vh] w-[3.5vw] md:h-[1.8vh] md:w-[1vw]" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Help Signal */}
        <div className="flex items-center gap-[1.5vw] md:gap-[0.4vw] text-[3vw] md:text-[0.75vw] text-slate-600 font-semibold mt-[2vh]">
          <HelpCircle className="h-[1.8vh] w-[3vw] md:h-[1.5vh] md:w-[0.9vw]" />
          <span>Need help? Contact support or check order logs.</span>
        </div>

      </div>

    </div>
  )
}

export default NotFound
