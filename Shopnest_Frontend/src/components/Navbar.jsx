import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/Logo.png';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  ClipboardList, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Layers
} from 'lucide-react';

const Navbar = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  // Styling helpers for active/inactive links
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
      isActive 
        ? 'bg-indigo-600/10 text-white border-indigo-500/20 shadow-sm shadow-indigo-500/5' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent hover:border-slate-800/40'
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 border ${
      isActive 
        ? 'bg-indigo-600/10 text-white border-indigo-500/20' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2.5 group">
             <img src={logoImg} alt="ShopNest Logo" className="h-10 w-10 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300" />
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400 group-hover:opacity-90 transition-opacity">
                ShopNest
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              <Layers className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              <ClipboardList className="h-4 w-4" />
              Orders
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <ShoppingCart className="h-4 w-4" />
              Cart
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User className="h-4 w-4" />
              Profile
            </NavLink>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-800 text-white border-slate-700 shadow-lg shadow-black/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`
              }
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </NavLink>

            <NavLink 
              to="/logout" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isActive 
                    ? 'bg-rose-950/20 text-rose-450 border-rose-900/50'
                    : 'bg-slate-900/40 border-transparent text-slate-200 hover:text-rose-400 hover:bg-rose-500/5 hover:border-rose-500/10'
                }`
              }
            >
              <LogOut className="h-4 w-4" />
              Logout
            </NavLink>
          </div>

          {/* Mobile Menu Burger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] border-t border-slate-900/80 bg-[#0f172a]/95 backdrop-blur-xl' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-5 space-y-2">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            <Layers className="h-5 w-5" />
            Home
          </NavLink>
          <NavLink to="/orders" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            <ClipboardList className="h-5 w-5" />
            Orders
          </NavLink>
          <NavLink to="/cart" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            <ShoppingCart className="h-5 w-5" />
            Cart
          </NavLink>
          <NavLink to="/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            <User className="h-5 w-5" />
            Profile
          </NavLink>

          <hr className="border-slate-900 my-4" />

          {/* Mobile Auth Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm hover:text-white transition-all duration-300"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </NavLink>
            <NavLink
              to="/logout"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-450 font-semibold text-sm hover:bg-rose-500/15 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;