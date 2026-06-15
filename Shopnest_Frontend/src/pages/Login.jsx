import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    mode: 'onTouched'
  });

  // Handle standard credentials login submit
  const onSubmitLogin = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data) {
        if (data.twoFA) {
          // 2FA OTP sent to mail
          setRegEmail(formData.email);
          setShowOtp(true);
          setSuccess(data.message || 'Please enter the 2FA code sent to your email.');
        } else if (data.User) {
          // Success direct login
          setSuccess('Login successful!');
          login(data.User, data.User.token);
          navigate('/');
        } else {
          setError('Failed to login. Invalid user response structure.');
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA OTP verification submit
  const onSubmitOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: regEmail,
          otp: otp
        })
      });

      const data = await res.json();

      if (res.ok && data) {
        // Backend returns verified user data
        const verifiedUser = data.user || data.User;
        if (verifiedUser) {
          setSuccess('2FA Verification successful!');
          login(verifiedUser, verifiedUser.token);
          navigate('/');
        } else {
          setError(data.message || 'Invalid response structure from verification.');
        }
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError('Verification failed. Please check your connection.');
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
            [ SECURING SESSION... ]
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col items-center justify-center py-[8vh] px-[4vw] relative overflow-hidden font-sans">
      
      {/* Background Cosmic Glows */}
      <div className="absolute top-[-15vh] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/10 blur-[9vw] pointer-events-none"></div>
      <div className="absolute bottom-[-10vh] right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-indigo-655/10 blur-[9vw] pointer-events-none"></div>

      {/* Main Structural Container - Soft Frosted Glass Card */}
      <div className="relative w-[90vw] sm:w-[55vw] lg:w-[32vw] bg-[#0c0f20]/50 border border-white/[0.06] rounded-[3vw] p-[6vw] sm:p-[3vw] backdrop-blur-xl shadow-[0_0_8vw_rgba(99,102,241,0.05)] flex flex-col gap-[4vh]">
        
        {/* Error / Success Notifications */}
        {error && (
          <div className="px-[4vw] py-[1.5vh] sm:px-[1vw] sm:py-[1.2vh] rounded-[1.2vw] bg-rose-500/10 border border-rose-500/20 text-rose-450 text-[3.2vw] sm:text-[0.8vw] font-semibold flex items-center gap-[1.5vw] sm:gap-[0.5vw]">
            <ShieldAlert className="h-[2.2vh] w-[4vw] sm:w-[1.2vw] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="px-[4vw] py-[1.5vh] sm:px-[1vw] sm:py-[1.2vh] rounded-[1.2vw] bg-emerald-500/10 border border-emerald-500/20 text-emerald-405 text-[3.2vw] sm:text-[0.8vw] font-semibold flex items-center gap-[1.5vw] sm:gap-[0.5vw]">
            <ShieldCheck className="h-[2.2vh] w-[4vw] sm:w-[1.2vw] shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* View 1: Standard Credentials Login */}
        {!showOtp ? (
          <div className="flex flex-col gap-[4vh]">
            <div className="flex flex-col items-center gap-[1vh] text-center">
              {/* Glowing Badge */}
              <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] sm:text-[0.75vw] font-bold tracking-widest uppercase mb-[0.5vh] inline-flex items-center gap-[0.4vw]">
                <Sparkles className="h-[2vh] w-[3vw] sm:w-[1vw] text-indigo-400 fill-indigo-400/20" />
                <span>Security Gateway</span>
              </div>
              <h3 className="text-[6vw] sm:text-[2vw] font-extrabold text-white leading-tight uppercase tracking-tight">
                Sign In
              </h3>
              <p className="text-[3.2vw] sm:text-[0.85vw] text-slate-400 max-w-[80vw] sm:max-w-none">
                Input your credentials to access your ShopNest profile
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-col gap-[2.8vh]">
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
                  <span className="text-rose-455 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
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
                      required: "Password is required"
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="text-rose-455 text-[2.8vw] sm:text-[0.75vw] mt-[0.3vh] ml-[0.5vw] flex items-center gap-[1vw] sm:gap-[0.3vw] font-semibold">
                    <ShieldAlert className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
                    <span>{errors.password.message}</span>
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full py-[1.8vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-555 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] mt-[2vh] transform active:scale-95 cursor-pointer"
              >
                <span>Authorize Login</span>
                <ArrowRight className="h-[2.2vh] w-[3.5vw] sm:w-[1.2vw]" />
              </button>
            </form>

            {/* Bottom Register Redirect Link */}
            <p className="text-[3.2vw] sm:text-[0.8vw] text-slate-500 text-center">
              New to ShopNest?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors inline-flex items-center gap-[0.2vw]">
                <span>Register Account</span>
                <ArrowUpRight className="h-[1.5vh] w-[3vw] sm:w-[1vw]" />
              </Link>
            </p>
          </div>
        ) : (
          /* View 2: 2FA Verification Form */
          <div className="flex flex-col gap-[4vh]">
            <div className="flex flex-col items-center gap-[1vh] text-center">
              <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] sm:text-[0.75vw] font-bold tracking-widest uppercase mb-[0.5vh] inline-flex items-center gap-[0.4vw]">
                <KeyRound className="h-[2vh] w-[3vw] sm:w-[1vw] text-indigo-400" />
                <span>2FA Verification</span>
              </div>
              <h3 className="text-[6vw] sm:text-[2vw] font-extrabold text-white leading-tight uppercase tracking-tight">
                Enter Code
              </h3>
              <p className="text-[3.2vw] sm:text-[0.85vw] text-slate-400 max-w-[80vw] sm:max-w-none">
                Please enter the 6-digit code sent to your email to verify this session.
              </p>
            </div>

            <div className="flex flex-col gap-[0.8vh]">
              <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
                6-Digit OTP
              </label>
              <input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full text-center p-[3.5vw] sm:p-[1vw] rounded-[1.5vw] bg-slate-950/40 border border-white/[0.06] focus:border-indigo-500/50 focus:bg-[#0f172a]/25 text-[5vw] sm:text-[1.3vw] font-bold text-white tracking-widest focus:outline-hidden transition-all placeholder-slate-800"
              />
            </div>

            <div className="flex flex-col gap-[2vh]">
              <button 
                onClick={onSubmitOtp}
                className="w-full py-[1.8vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] transform active:scale-95 cursor-pointer"
              >
                <span>Verify & Login</span>
              </button>
              
              <button 
                onClick={() => setShowOtp(false)}
                className="w-full py-[1.5vh] rounded-[50vw] bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-[3.2vw] sm:text-[0.85vw] font-bold text-slate-350 transition-all flex items-center justify-center gap-[1.5vw] sm:gap-[0.4vw] cursor-pointer"
              >
                <ArrowLeft className="h-[2vh] w-[3.5vw] sm:w-[1.1vw]" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;