import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    mode: 'onTouched'
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (res.ok) {
        setSuccess(result.message || 'Registration successful! Verification code sent to email.');
        // Optional: redirect to OTP after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };


  // Early return for loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center py-[10vh] px-[5vw]">
        <div className="flex flex-col items-center gap-[2.5vh]">
          <div className="animate-spin rounded-full h-[6vh] w-[6vh] border-t-[0.3vw] border-b-[0.3vw] border-indigo-500"></div>
          <span className="text-[3.2vw] sm:text-[0.85vw] font-mono text-slate-500 tracking-wider">
            [ CREATING PROFILE... ]
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col items-center justify-center py-[8vh] px-[4vw] relative overflow-hidden font-sans">
      
      {/* Background Graphic Cosmic Glows */}
      <div className="absolute top-[-15vh] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/10 blur-[9vw] pointer-events-none"></div>
      <div className="absolute bottom-[-10vh] right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-indigo-650/10 blur-[9vw] pointer-events-none"></div>

      {/* Main Structural Container - Soft Frosted Glass Card */}
      <div className="relative w-[90vw] sm:w-[55vw] lg:w-[32vw] bg-[#0c0f20]/50 border border-white/[0.06] rounded-[3vw] p-[6vw] sm:p-[3vw] backdrop-blur-xl shadow-[0_0_8vw_rgba(99,102,241,0.05)] flex flex-col gap-[4vh]">
        
        {/* Error / Success Notifications */}
        {error && (
          <div className="px-[4vw] py-[1.5vh] sm:px-[1vw] sm:py-[1.2vh] rounded-[1.2vw] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[3.2vw] sm:text-[0.8vw] font-semibold flex items-center gap-[1.5vw] sm:gap-[0.5vw]">
            <ShieldAlert className="h-[2.2vh] w-[4vw] sm:w-[1.2vw] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="px-[4vw] py-[1.5vh] sm:px-[1vw] sm:py-[1.2vh] rounded-[1.2vw] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[3.2vw] sm:text-[0.8vw] font-semibold flex items-center gap-[1.5vw] sm:gap-[0.5vw]">
            <ShieldCheck className="h-[2.2vh] w-[4vw] sm:w-[1.2vw] shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Title Block */}
        <div className="flex flex-col items-center gap-[1vh] text-center">
          {/* Glowing Badge */}
          <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] sm:text-[0.75vw] font-bold tracking-widest uppercase mb-[0.5vh] inline-flex items-center gap-[0.4vw]">
            <Sparkles className="h-[2vh] w-[3vw] sm:w-[1vw] text-indigo-400 fill-indigo-400/20" />
            <span>Secure Registry</span>
          </div>
          <h3 className="text-[6vw] sm:text-[2vw] font-extrabold text-white leading-tight uppercase tracking-tight">
            Create Account
          </h3>
          <p className="text-[3.2vw] sm:text-[0.85vw] text-slate-400 max-w-[80vw] sm:max-w-none">
            Register your credentials to access the ShopNest catalog
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[2.8vh]">
          
          {/* Field: Full Name */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
              Full Name
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[1.5vw] bg-slate-950/40 border ${errors.name ? 'border-rose-500' : 'border-white/[0.06] focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/20 transition-all`}>
              <User className={`h-[2.5vh] w-[4vw] sm:w-[1.2vw] ${errors.name ? 'text-rose-500' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-600"
                {...register("name", {
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters long"
                  }
                })}
              />
            </div>
            {errors.name && (
              <span className="text-rose-400 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
                <ShieldAlert className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
                <span>{errors.name.message}</span>
              </span>
            )}
          </div>

          {/* Field: Email */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
              Email Address
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[1.5vw] bg-slate-950/40 border ${errors.email ? 'border-rose-500' : 'border-white/[0.06] focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/20 transition-all`}>
              <Mail className={`h-[2.5vh] w-[4vw] sm:w-[1.2vw] ${errors.email ? 'text-rose-500' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Enter your email"
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-600"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format"
                  }
                })}
              />
            </div>
            {errors.email && (
              <span className="text-rose-400 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
                <ShieldAlert className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
                <span>{errors.email.message}</span>
              </span>
            )}
          </div>

          {/* Field: Password */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
              Password
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[1.5vw] bg-slate-950/40 border ${errors.password ? 'border-rose-500' : 'border-white/[0.06] focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/20 transition-all`}>
              <Lock className={`h-[2.5vh] w-[4vw] sm:w-[1.2vw] ${errors.password ? 'text-rose-500' : 'text-slate-500'}`} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-600"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long"
                  }
                })}
              />
            </div>
            {errors.password && (
              <span className="text-rose-400 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
                <ShieldAlert className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
                <span>{errors.password.message}</span>
              </span>
            )}
          </div>

          {/* Field: Confirm Password */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
              Confirm Password
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[1.5vw] bg-slate-950/40 border ${errors.confirmPassword ? 'border-rose-500' : 'border-white/[0.06] focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/20 transition-all`}>
              <KeyRound className={`h-[2.5vh] w-[4vw] sm:w-[1.2vw] ${errors.confirmPassword ? 'text-rose-500' : 'text-slate-500'}`} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-600"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match"
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-400 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
                <ShieldAlert className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
                <span>{errors.confirmPassword.message}</span>
              </span>
            )}
          </div>

          {/* Submit Button - Soft Pill Gradient */}
          <button 
            type="submit" 
            className="w-full py-[1.8vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] mt-[2vh] transform active:scale-95 cursor-pointer"
          >
            <span>Register & Validate</span>
            <ArrowRight className="h-[2.2vh] w-[3.5vw] sm:w-[1.2vw]" />
          </button>
        </form>

        {/* Bottom Link */}
        <p className="text-[3.2vw] sm:text-[0.8vw] text-slate-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors inline-flex items-center gap-[0.2vw]">
            <span>Sign In</span>
            <ArrowUpRight className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;