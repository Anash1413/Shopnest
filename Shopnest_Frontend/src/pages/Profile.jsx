import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth'
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  Crown,
  LogOut,
  ShoppingBag,
  ClipboardList,
  Heart,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast';

function Profile() {
  const { user,  token, isAdmin, isVerified } = useAuth()
  const [twoFAEnabled, setTwoFAEnabled] = useState(Boolean(user?.twoFA))

  useEffect(() => {
        document.title = 'Profile' 
  }, [])

  useEffect(() => {
    setTwoFAEnabled(Boolean(user?.twoFA))
  }, [user?.twoFA])
  
  const handle2FA = async (id , flag)=>{
    const res = await fetch('api/auth/toggle-2FA',{
      method :'POST',
      headers:{
        'Authorization' :`Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
              id,flag
      })
    })
    const msg = await res.json()
    if(!res.ok){
        return toast.error(msg.message ||"can't change 2FA !! something went wrong")
         
    }
    toast.success('successfully changed 2FA')
  }

  const handle2FAToggle = () => {
    const nextTwoFAState = !twoFAEnabled
    setTwoFAEnabled(nextTwoFAState)
    handle2FA(user?._id, nextTwoFAState)
  }
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-hidden">

      {/* --- Ambient Background Nebulas --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15vh] left-[15vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/8 blur-[12vw]"></div>
        <div className="absolute bottom-[-10vh] right-[10vw] w-[40vw] h-[40vw] rounded-full bg-indigo-600/6 blur-[10vw]"></div>
        <div className="absolute top-[50vh] right-[30vw] w-[25vw] h-[25vw] rounded-full bg-cyan-600/4 blur-[8vw]"></div>
      </div>

      <div className="relative z-10 w-full px-[6vw] py-[6vh]">
        <div className="max-w-[85vw] mx-auto">

          {/* --- Profile Header Card --- */}
          <div className="relative overflow-hidden rounded-[2.5vw] bg-[#0c0f1e]/50 border border-white/[0.06] p-[4vw] md:p-[3vw] mb-[5vh]">

            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] h-[20vh] rounded-full bg-indigo-500/8 blur-[6vw] pointer-events-none"></div>

            <div className="relative flex flex-col md:flex-row items-center gap-[4vh] md:gap-[3vw]">

              {/* Avatar */}
              <div className="relative">
                <div className="w-[25vw] h-[25vw] md:w-[8vw] md:h-[8vw] rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                  <span className="text-[8vw] md:text-[2.5vw] font-black text-white select-none">
                    {getInitials(user?.name)}
                  </span>
                </div>
                {/* Role badge on avatar */}
                <div className={`absolute -bottom-[0.8vh] right-0 px-[2.5vw] py-[0.4vh] md:px-[0.8vw] md:py-[0.3vh] rounded-[50vw] text-[2.5vw] md:text-[0.65vw] font-bold uppercase tracking-wider border ${
                  isAdmin
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                }`}>
                  {isAdmin ? '★ Admin' : 'User'}
                </div>
              </div>

              {/* Name & Email */}
              <div className="flex flex-col items-center md:items-start gap-[1vh]">
                <h1 className="text-[7vw] md:text-[2.5vw] font-extrabold text-white tracking-tight flex items-center gap-[1.5vw] md:gap-[0.6vw]">
                  {user?.name || 'User'}
                  {isAdmin && (
                    <Crown className="h-[3vh] w-[5vw] md:w-[1.6vw] text-amber-400 fill-amber-400/20" />
                  )}
                </h1>
                <div className="flex items-center gap-[1.5vw] md:gap-[0.5vw] text-[3.5vw] md:text-[0.95vw] text-slate-400">
                  <Mail className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                  <span>{user?.email || 'No email'}</span>
                </div>
                {/* Verification status */}
                <div className={`flex items-center gap-[1.5vw] md:gap-[0.4vw] text-[3vw] md:text-[0.8vw] font-semibold ${
                  isVerified ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {isVerified ? (
                    <>
                      <CheckCircle className="h-[1.8vh] w-[3vw] md:w-[1vw]" />
                      <span>Email Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-[1.8vh] w-[3vw] md:w-[1vw]" />
                      <span>Email Not Verified</span>
                      <NavLink className={"text-rose-700"} to={"/verify"}>Verify Now </NavLink>
                    </>
                  )}
                </div>
              </div>

              {/* Logout button (desktop — top right) */}
              <div className="hidden md:block md:ml-auto">
                <Link
                  to="/logout"
                  className="flex items-center gap-[0.5vw] px-[1.5vw] py-[1vh] rounded-[50vw] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[0.85vw] font-semibold hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-[1.8vh] w-[1vw]" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

          {/* --- Info & Quick Actions Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[4vh] lg:gap-[2.5vw]">

            {/* ===== LEFT: Account Details ===== */}
            <div className="lg:col-span-5 flex flex-col gap-[3vh]">

              <h2 className="text-[4.5vw] md:text-[1.3vw] font-bold text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                <Settings className="h-[2.5vh] w-[4vw] md:w-[1.3vw] text-indigo-400" />
                Account Details
              </h2>

              <div className="rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] overflow-hidden">

                {/* Detail Row: Name */}
                <div className="flex items-center justify-between px-[4vw] py-[2.5vh] md:px-[1.5vw] md:py-[1.8vh] border-b border-white/[0.04]">
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    <User className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    <span className="text-[3vw] md:text-[0.8vw] text-slate-500 font-semibold uppercase tracking-wider">Name</span>
                  </div>
                  <span className="text-[3.2vw] md:text-[0.9vw] text-white font-semibold">{user?.name}</span>
                </div>

                {/* Detail Row: Email */}
                <div className="flex items-center justify-between px-[4vw] py-[2.5vh] md:px-[1.5vw] md:py-[1.8vh] border-b border-white/[0.04]">
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    <Mail className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    <span className="text-[3vw] md:text-[0.8vw] text-slate-500 font-semibold uppercase tracking-wider">Email</span>
                  </div>
                  <span className="text-[3.2vw] md:text-[0.9vw] text-white font-semibold">{user?.email}</span>
                </div>

                {/* Detail Row: Role */}
                <div className="flex items-center justify-between px-[4vw] py-[2.5vh] md:px-[1.5vw] md:py-[1.8vh] border-b border-white/[0.04]">
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    <Shield className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    <span className="text-[3vw] md:text-[0.8vw] text-slate-500 font-semibold uppercase tracking-wider">Role</span>
                  </div>
                  <span className={`px-[2.5vw] py-[0.4vh] md:px-[0.8vw] md:py-[0.3vh] rounded-[50vw] text-[2.8vw] md:text-[0.75vw] font-bold uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                  }`}>
                    {user?.role || 'user'}
                  </span>
                </div>

                {/* Detail Row: Verified */}
                <div className="flex items-center justify-between px-[4vw] py-[2.5vh] md:px-[1.5vw] md:py-[1.8vh] border-b border-white/[0.04]">
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    <ShieldCheck className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    <span className="text-[3vw] md:text-[0.8vw] text-slate-500 font-semibold uppercase tracking-wider">Verified</span>
                  </div>
                  <span className={`flex items-center gap-[1vw] md:gap-[0.3vw] text-[3vw] md:text-[0.8vw] font-semibold ${
                    isVerified ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isVerified ? (
                      <><CheckCircle className="h-[1.6vh] w-[3vw] md:w-[0.9vw]" /> Yes</>
                    ) : (
                      <><XCircle className="h-[1.6vh] w-[3vw] md:w-[0.9vw]" /> No</>
                    )}
                  </span>
                </div>

                {/* Detail Row: 2FA */}
                <div className="flex items-center justify-between px-[4vw] py-[2.5vh] md:px-[1.5vw] md:py-[1.8vh]">
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    {twoFAEnabled ? (
                      <Lock className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    ) : (
                      <Unlock className="h-[2vh] w-[3.5vw] md:w-[1vw] text-slate-500" />
                    )}
                    <span className="text-[3vw] md:text-[0.8vw] text-slate-500 font-semibold uppercase tracking-wider">Two-Factor Auth</span>
                  </div>
                  <div className="flex items-center gap-[2vw] md:gap-[0.6vw]">
                    <span className={`px-[2.5vw] py-[0.4vh] md:px-[0.8vw] md:py-[0.3vh] rounded-[50vw] text-[2.8vw] md:text-[0.75vw] font-bold border ${
                      twoFAEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800/50 border-slate-700/30 text-slate-500'
                    }`}>
                      {twoFAEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      type="button"
                      onClick={handle2FAToggle}
                      aria-label="Toggle two-factor authentication"
                      aria-pressed={twoFAEnabled}
                      className={`relative h-[3vh] w-[12vw] md:h-[2.6vh] md:w-[2.8vw] rounded-[50vw] border transition-all duration-300 cursor-pointer ${
                        twoFAEnabled
                          ? 'bg-emerald-500/20 border-emerald-500/30'
                          : 'bg-slate-800/60 border-slate-700/40'
                      }`}
                    >
                      <span className={`absolute top-1/2 h-[2.1vh] w-[2.1vh] md:h-[1.8vh] md:w-[1.8vh] -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-300 ${
                        twoFAEnabled
                          ? 'left-[calc(100%-2.4vh)] md:left-[calc(100%-2.1vh)]'
                          : 'left-[0.35vh]'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT: Quick Actions ===== */}
            <div className="lg:col-span-7 flex flex-col gap-[3vh]">

              <h2 className="text-[4.5vw] md:text-[1.3vw] font-bold text-white flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                <Sparkles className="h-[2.5vh] w-[4vw] md:w-[1.3vw] text-indigo-400 fill-indigo-400/20" />
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.5vh] md:gap-[1.2vw]">

                {/* Orders Card */}
                <Link
                  to={isAdmin ? '/admin/orders' : '/orders'}
                  className="group p-[4vw] md:p-[1.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] hover:border-indigo-500/20 hover:bg-[#0c0f1e]/60 transition-all duration-300 flex flex-col gap-[2vh]"
                >
                  <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-[1vw] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <ClipboardList className="h-[2.5vh] w-[4.5vw] md:w-[1.5vw]" />
                  </div>
                  <div>
                    <h3 className="text-[3.8vw] md:text-[1.05vw] font-bold text-white mb-[0.5vh]">My Orders</h3>
                    <p className="text-[3vw] md:text-[0.8vw] text-slate-500 leading-relaxed">View your order history, track deliveries, and manage returns.</p>
                  </div>
                  <div className="flex items-center gap-[0.3vw] text-[2.8vw] md:text-[0.75vw] text-indigo-400 font-semibold mt-auto group-hover:gap-[0.6vw] transition-all">
                    <span>View Orders</span>
                    <ArrowRight className="h-[1.5vh] w-[3vw] md:w-[0.9vw]" />
                  </div>
                </Link>

                {/* Cart Card */}
                {!isAdmin && (
                  <Link
                    to="/cart"
                    className="group p-[4vw] md:p-[1.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] hover:border-cyan-500/20 hover:bg-[#0c0f1e]/60 transition-all duration-300 flex flex-col gap-[2vh]"
                  >
                    <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-[1vw] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <ShoppingBag className="h-[2.5vh] w-[4.5vw] md:w-[1.5vw]" />
                    </div>
                    <div>
                      <h3 className="text-[3.8vw] md:text-[1.05vw] font-bold text-white mb-[0.5vh]">Shopping Cart</h3>
                      <p className="text-[3vw] md:text-[0.8vw] text-slate-500 leading-relaxed">Review items in your cart and proceed to checkout.</p>
                    </div>
                    <div className="flex items-center gap-[0.3vw] text-[2.8vw] md:text-[0.75vw] text-cyan-400 font-semibold mt-auto group-hover:gap-[0.6vw] transition-all">
                      <span>Go to Cart</span>
                      <ArrowRight className="h-[1.5vh] w-[3vw] md:w-[0.9vw]" />
                    </div>
                  </Link>
                )}

                {/* Favourites Card */}
                {!isAdmin && (
                  <Link
                    to="/favourites"
                    className="group p-[4vw] md:p-[1.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] hover:border-rose-500/20 hover:bg-[#0c0f1e]/60 transition-all duration-300 flex flex-col gap-[2vh]"
                  >
                    <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-[1vw] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                      <Heart className="h-[2.5vh] w-[4.5vw] md:w-[1.5vw]" />
                    </div>
                    <div>
                      <h3 className="text-[3.8vw] md:text-[1.05vw] font-bold text-white mb-[0.5vh]">Favourites</h3>
                      <p className="text-[3vw] md:text-[0.8vw] text-slate-500 leading-relaxed">Browse your saved products and wishlist items.</p>
                    </div>
                    <div className="flex items-center gap-[0.3vw] text-[2.8vw] md:text-[0.75vw] text-rose-400 font-semibold mt-auto group-hover:gap-[0.6vw] transition-all">
                      <span>View Favourites</span>
                      <ArrowRight className="h-[1.5vh] w-[3vw] md:w-[0.9vw]" />
                    </div>
                  </Link>
                )}

                {/* Admin Dashboard Card */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="group p-[4vw] md:p-[1.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] hover:border-amber-500/20 hover:bg-[#0c0f1e]/60 transition-all duration-300 flex flex-col gap-[2vh]"
                  >
                    <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-[1vw] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Crown className="h-[2.5vh] w-[4.5vw] md:w-[1.5vw]" />
                    </div>
                    <div>
                      <h3 className="text-[3.8vw] md:text-[1.05vw] font-bold text-white mb-[0.5vh]">Admin Dashboard</h3>
                      <p className="text-[3vw] md:text-[0.8vw] text-slate-500 leading-relaxed">Manage products, users, and site settings.</p>
                    </div>
                    <div className="flex items-center gap-[0.3vw] text-[2.8vw] md:text-[0.75vw] text-amber-400 font-semibold mt-auto group-hover:gap-[0.6vw] transition-all">
                      <span>Open Dashboard</span>
                      <ArrowRight className="h-[1.5vh] w-[3vw] md:w-[0.9vw]" />
                    </div>
                  </Link>
                )}

                {/* Browse Store Card */}
                <Link
                  to="/products"
                  className="group p-[4vw] md:p-[1.5vw] rounded-[2vw] bg-[#0c0f1e]/40 border border-white/[0.05] hover:border-violet-500/20 hover:bg-[#0c0f1e]/60 transition-all duration-300 flex flex-col gap-[2vh]"
                >
                  <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-[1vw] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="h-[2.5vh] w-[4.5vw] md:w-[1.5vw]" />
                  </div>
                  <div>
                    <h3 className="text-[3.8vw] md:text-[1.05vw] font-bold text-white mb-[0.5vh]">Browse Store</h3>
                    <p className="text-[3vw] md:text-[0.8vw] text-slate-500 leading-relaxed">Explore our trending collections and premium releases.</p>
                  </div>
                  <div className="flex items-center gap-[0.3vw] text-[2.8vw] md:text-[0.75vw] text-violet-400 font-semibold mt-auto group-hover:gap-[0.6vw] transition-all">
                    <span>Explore Now</span>
                    <ArrowRight className="h-[1.5vh] w-[3vw] md:w-[0.9vw]" />
                  </div>
                </Link>
              </div>

              {/* Mobile Logout Button */}
              <div className="md:hidden">
                <Link
                  to="/logout"
                  className="flex items-center justify-center gap-[2vw] w-full px-[6vw] py-[2vh] rounded-[50vw] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[3.5vw] hover:bg-rose-500/20 transition-all duration-300"
                >
                  <LogOut className="h-[2.2vh] w-[4vw]" />
                  <span>Logout</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
