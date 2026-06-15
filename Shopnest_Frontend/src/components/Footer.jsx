import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Mail, 
  Phone, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Sparkles, 
  Send, 
  Globe, 
  ChevronRight,
  Code
} from 'lucide-react';

const Github = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'contact' | null

  return (
    <footer className="w-full bg-[#090d16] border-t-[0.3vw] md:border-t-[0.1vw] border-slate-900/80 text-slate-400 mt-[8vh]">
      {/* Main Footer Content */}
      <div className="max-w-[90vw] md:max-w-[85vw] mx-auto py-[5vh] md:py-[6vh] px-[4vw] md:px-[2vw]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[6vw] md:gap-[4vw]">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-[2vh]">
            <h3 className="text-[5.5vw] md:text-[1.8vw] font-black tracking-tight text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
              <Sparkles className="h-[4vh] w-[7vw] md:h-[3vh] md:w-[3vw] text-indigo-400 fill-current animate-pulse" />
              <span>ShopNest</span>
            </h3>
            <p className="text-[3.5vw] md:text-[0.9vw] leading-relaxed text-slate-400">
              Your premium destination for curated, high-end products. Experience seamless shopping, secure checkouts, and ultra-fast deliveries tailored for your premium lifestyle.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="flex flex-col gap-[2.5vh]">
            <h4 className="text-[4.5vw] md:text-[1.1vw] font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="flex flex-col gap-[1.5vh] text-[3.8vw] md:text-[0.9vw]">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group">
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group">
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Shopping Cart</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group">
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Your Orders</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group">
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>User Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Information */}
          <div className="flex flex-col gap-[2.5vh]">
            <h4 className="text-[4.5vw] md:text-[1.1vw] font-bold text-white uppercase tracking-wider">
              Information
            </h4>
            <ul className="flex flex-col gap-[1.5vh] text-[3.8vw] md:text-[0.9vw]">
              <li>
                <button 
                  onClick={() => setActiveModal('about')}
                  className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group cursor-pointer text-left w-full"
                >
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>About the Developer</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-white transition-colors flex items-center gap-[1.5vw] md:gap-[0.4vw] group cursor-pointer text-left w-full"
                >
                  <ChevronRight className="h-[2vh] w-[3vw] md:h-[1.5vh] md:w-[1vw] text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Promo */}
          <div className="flex flex-col gap-[2.5vh]">
            <h4 className="text-[4.5vw] md:text-[1.1vw] font-bold text-white uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-[3.5vw] md:text-[0.9vw] text-slate-400">
              Subscribe to unlock premium rewards and stay ahead of trending arrivals.
            </p>
            <div className="flex items-center w-full p-[1.5vw] md:p-[0.3vw] bg-slate-900/60 border border-slate-800 rounded-[2vw] md:rounded-[1vw]">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="w-full bg-transparent text-[3.5vw] md:text-[0.85vw] text-white px-[3vw] md:px-[0.8vw] focus:outline-hidden"
              />
              <a 
                href="mailto:anash.js.dev@gmail.com" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-[2.5vw] md:p-[0.6vw] rounded-[2vw] md:rounded-[0.8vw] transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send className="h-[2.5vh] w-[4vw] md:h-[1.8vh] md:w-[1.2vw]" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-slate-900/80 my-[4vh]" />

        {/* Bottom copyright block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-[2vh] text-[3.5vw] md:text-[0.85vw] text-slate-500">
          <p>© 2026 ShopNest Inc. All rights reserved.</p>
          <p className="flex items-center gap-[1.5vw] md:gap-[0.3vw]">
            Crafted with <Heart className="h-[2.2vh] w-[3vw] md:h-[1.6vh] md:w-[1.1vw] text-rose-500 fill-current animate-pulse" /> by <span className="font-semibold text-slate-350">Anash (Maviz)</span>
          </p>
        </div>
      </div>

      {/* --- Dynamic Modals (In-page full overlays) --- */}
      
      {/* 1. About Us Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[4vw] bg-black/80 backdrop-blur-[0.5vw]">
          <div className="relative w-[90vw] md:w-[60vw] max-h-[85vh] bg-[#0b0f19] border-[0.3vw] md:border-[0.1vw] border-slate-800/80 rounded-[4vw] md:rounded-[2vw] p-[5vw] md:p-[3vw] overflow-y-auto shadow-2xl flex flex-col gap-[3vh] scrollbar-thin scrollbar-thumb-slate-800">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-[1.5vh] right-[3vw] md:top-[2vh] md:right-[2vw] p-[2vw] md:p-[0.6vw] rounded-[2.5vw] md:rounded-[0.8vw] bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <X className="h-[2.5vh] w-[4vw] md:h-[2vh] md:w-[1.5vw]" />
            </button>

            {/* Header / Intro */}
            <div className="flex items-center gap-[4vw] md:gap-[2vw] pb-[2.5vh] border-b border-slate-900">
              <div className="w-[14vw] h-[14vw] md:w-[7vw] md:h-[7vw] rounded-[3vw] md:rounded-[1.5vw] bg-linear-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Code className="h-[4.5vh] w-[8vw] md:h-[4.5vh] md:w-[3.5vw] text-white" />
              </div>
              <div>
                <span className="px-[2.5vw] py-[0.6vh] rounded-[1.5vw] md:px-[0.8vw] md:py-[0.4vh] md:rounded-[0.6vw] text-[2.8vw] md:text-[0.75vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold tracking-wider uppercase">
                  Lead Developer Profile
                </span>
                <h3 className="text-[6vw] md:text-[2.2vw] font-black text-white leading-tight mt-[0.5vh]">
                  Maviz Ahmad
                </h3>
                <p className="text-[3.5vw] md:text-[1.1vw] text-indigo-400 font-medium flex items-center gap-[1vw] md:gap-[0.4vw]">
                  <Sparkles className="h-[2.2vh] w-[3.5vw] md:h-[2vh] md:w-[1.2vw] fill-current" />
                  MERN Stack Developer (Monster Developer)
                </p>
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vh] md:gap-[3vw]">
              {/* Left Column: About & Qualification */}
              <div className="flex flex-col gap-[2.5vh]">
                <div className="flex flex-col gap-[1vh]">
                  <h4 className="text-[4.2vw] md:text-[1.2vw] font-bold text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                    <Briefcase className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw] text-indigo-400" />
                    About Me
                  </h4>
                  <p className="text-[3.5vw] md:text-[0.9vw] text-slate-400 leading-relaxed">
                    I am an ambitious, creative, and highly motivated web developer. Known in the project environment as a "Monster Developer," I excel at taking logic-driven structures and breathing premium, high-fidelity styles into them. My passion lies in constructing end-to-end full stack web platforms that are both secure and stunning.
                  </p>
                </div>

                <div className="flex flex-col gap-[1.5vh]">
                  <h4 className="text-[4.2vw] md:text-[1.2vw] font-bold text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                    <GraduationCap className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw] text-indigo-400" />
                    Highest Qualification
                  </h4>
                  <div className="p-[4vw] md:p-[1.2vw] rounded-[3vw] md:rounded-[1.2vw] bg-slate-900/40 border border-slate-800/60 flex flex-col gap-[0.5vh]">
                    <span className="text-[3.8vw] md:text-[1vw] font-bold text-slate-200">
                      Bachelor of Technology (B.Tech)
                    </span>
                    <span className="text-[3.2vw] md:text-[0.85vw] text-indigo-400 font-medium">
                      Computer Science & Engineering
                    </span>
                    <span className="text-[2.8vw] md:text-[0.8vw] text-slate-500">
                      Focus: Full Stack Engineering, Database Systems, Web Architectures
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tech Stack & Competence */}
              <div className="flex flex-col gap-[2.5vh]">
                <h4 className="text-[4.2vw] md:text-[1.2vw] font-bold text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                  <Award className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw] text-indigo-400" />
                  Tech Stack & Technologies
                </h4>
                <div className="flex flex-col gap-[2vh]">
                  {/* Category: Frontend */}
                  <div>
                    <span className="text-[3vw] md:text-[0.85vw] font-bold text-slate-400 block mb-[0.8vh] uppercase tracking-wider">
                      Frontend Ecosystem
                    </span>
                    <div className="flex flex-wrap gap-[1.5vw] md:gap-[0.5vw]">
                      {['React 19', 'Tailwind CSS v4', 'Redux Toolkit', 'JavaScript ES6+', 'HTML5 / CSS3', 'Vite'].map((skill, i) => (
                        <span key={i} className="px-[2.5vw] py-[0.6vh] rounded-[1.5vw] md:px-[0.8vw] md:py-[0.4vh] md:rounded-[0.6vw] text-[2.8vw] md:text-[0.75vw] bg-indigo-500/5 border border-indigo-500/10 text-slate-355">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category: Backend */}
                  <div>
                    <span className="text-[3vw] md:text-[0.85vw] font-bold text-slate-400 block mb-[0.8vh] uppercase tracking-wider">
                      Backend & Database
                    </span>
                    <div className="flex flex-wrap gap-[1.5vw] md:gap-[0.5vw]">
                      {['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'JWT Auth'].map((skill, i) => (
                        <span key={i} className="px-[2.5vw] py-[0.6vh] rounded-[1.5vw] md:px-[0.8vw] md:py-[0.4vh] md:rounded-[0.6vw] text-[2.8vw] md:text-[0.75vw] bg-cyan-500/5 border border-cyan-500/10 text-slate-355">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category: Tools */}
                  <div>
                    <span className="text-[3vw] md:text-[0.85vw] font-bold text-slate-400 block mb-[0.8vh] uppercase tracking-wider">
                      Development Tools
                    </span>
                    <div className="flex flex-wrap gap-[1.5vw] md:gap-[0.5vw]">
                      {['Git & GitHub', 'Postman', 'NPM / Yarn', 'MVC Pattern'].map((skill, i) => (
                        <span key={i} className="px-[2.5vw] py-[0.6vh] rounded-[1.5vw] md:px-[0.8vw] md:py-[0.4vh] md:rounded-[0.6vw] text-[2.8vw] md:text-[0.75vw] bg-slate-800 border border-slate-700/50 text-slate-355">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Contact Us Modal */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[4vw] bg-black/80 backdrop-blur-[0.5vw]">
          <div className="relative w-[90vw] md:w-[40vw] max-h-[85vh] md:max-h-[75vh] bg-[#0b0f19] border-[0.3vw] md:border-[0.1vw] border-slate-800/80 rounded-[4vw] md:rounded-[2vw] p-[5vw] md:p-[3vw] overflow-y-auto shadow-2xl flex flex-col gap-[3vh]">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-[1.5vh] right-[3vw] md:top-[2vh] md:right-[2vw] p-[2vw] md:p-[0.6vw] rounded-[2.5vw] md:rounded-[0.8vw] bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <X className="h-[2.5vh] w-[4vw] md:h-[2vh] md:w-[1.5vw]" />
            </button>

            {/* Header */}
            <div className="pb-[2.5vh] border-b border-slate-900">
              <span className="px-[2.5vw] py-[0.6vh] rounded-[1.5vw] md:px-[0.8vw] md:py-[0.4vh] md:rounded-[0.6vw] text-[2.8vw] md:text-[0.75vw] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold tracking-wider uppercase">
                Let's Connect
              </span>
              <h3 className="text-[5.5vw] md:text-[2vw] font-black text-white mt-[0.5vh]">
                Contact Information
              </h3>
              <p className="text-[3.5vw] md:text-[0.9vw] text-slate-450 mt-[0.3vh]">
                Have a query, collaboration idea, or need developer support? Reach out now!
              </p>
            </div>

            {/* Contact Details List */}
            <div className="flex flex-col gap-[2vh]">
              {/* Phone */}
              <div className="flex items-center gap-[4vw] md:gap-[1.2vw] p-[3.5vw] md:p-[1vw] rounded-[3vw] md:rounded-[1.2vw] bg-slate-900/40 border border-slate-800/60">
                <div className="p-[2vw] md:p-[0.6vw] rounded-[2vw] md:rounded-[0.8vw] bg-indigo-500/10 text-indigo-400">
                  <Phone className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[2.8vw] md:text-[0.75vw] text-slate-500 font-semibold uppercase">Call directly</span>
                  <a href="tel:+9196852244563" className="text-[3.8vw] md:text-[1vw] text-slate-200 font-bold tracking-wide hover:text-indigo-400 transition-colors">+91 96852 244563</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-[4vw] md:gap-[1.2vw] p-[3.5vw] md:p-[1vw] rounded-[3vw] md:rounded-[1.2vw] bg-slate-900/40 border border-slate-800/60">
                <div className="p-[2vw] md:p-[0.6vw] rounded-[2vw] md:rounded-[0.8vw] bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[2.8vw] md:text-[0.75vw] text-slate-500 font-semibold uppercase">Email developer</span>
                  <a href="mailto:anash.js.dev@gmail.com" className="text-[3.8vw] md:text-[1vw] text-slate-200 font-bold hover:text-cyan-455 transition-colors">anash.js.dev@gmail.com</a>
                </div>
              </div>

              {/* GitHub Repo */}
              <div className="flex items-center gap-[4vw] md:gap-[1.2vw] p-[3.5vw] md:p-[1vw] rounded-[3vw] md:rounded-[1.2vw] bg-slate-900/40 border border-slate-800/60">
                <div className="p-[2vw] md:p-[0.6vw] rounded-[2vw] md:rounded-[0.8vw] bg-slate-800 text-slate-350">
                  <Github className="h-[2.5vh] w-[4.5vw] md:h-[2.2vh] md:w-[1.5vw]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[2.8vw] md:text-[0.75vw] text-slate-500 font-semibold uppercase">GitHub Repository</span>
                  <a 
                    href="https://github.com/Anash1413/Shopnest" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[3.8vw] md:text-[1vw] text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors"
                  >
                    github.com/Anash1413/Shopnest
                  </a>
                </div>
              </div>

              {/* Social Links Badge Row */}
              <div className="flex items-center justify-center gap-[3vw] md:gap-[1vw] pt-[1vh]">
                <a 
                  href="https://github.com/Anash1413" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-[1.5vw] md:gap-[0.4vw] px-[3.5vw] py-[1vh] rounded-[2vw] md:px-[1vw] md:py-[0.6vh] md:rounded-[0.8vw] bg-slate-900 hover:bg-slate-850 text-slate-355 text-[3.2vw] md:text-[0.8vw] border border-slate-800 transition-colors"
                >
                  <Github className="h-[2.2vh] w-[4vw] md:h-[1.8vh] md:w-[1.2vw]" />
                  <span>GitHub Profile</span>
                </a>
                <a 
                  href="https://maviz-portfolio.netlify.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[1.5vw] md:gap-[0.4vw] px-[3.5vw] py-[1vh] rounded-[2vw] md:px-[1vw] md:py-[0.6vh] md:rounded-[0.8vw] bg-slate-900 hover:bg-slate-850 text-slate-355 text-[3.2vw] md:text-[0.8vw] border border-slate-800 transition-colors"
                >
                  <Globe className="h-[2.2vh] w-[4vw] md:h-[1.8vh] md:w-[1.2vw]" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;