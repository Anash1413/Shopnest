import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight 
} from 'lucide-react';

function Register() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    mode: 'onTouched' // Triggers validation on blur/touch
  });

  const password = watch("password");

  const onSubmit = (data) => {
    // Logic will be written by user
    console.log("Registration Form Data:", data);
  };

  return (
    <div className="min-h-screen bg-[#06080f] flex items-center justify-center py-[10vh] px-[5vw] relative overflow-hidden font-sans">
      
      {/* Ambient Glowing Background Layers */}
      <div className="absolute top-[-20vh] left-[-20vw] w-[50vw] h-[50vw] rounded-[25vw] bg-indigo-500/10 blur-[8vw] pointer-events-none"></div>
      <div className="absolute bottom-[-20vh] right-[-20vw] w-[50vw] h-[50vw] rounded-[25vw] bg-violet-500/10 blur-[8vw] pointer-events-none"></div>

      {/* Registration Card */}
      <div className="relative w-[90vw] sm:w-[50vw] lg:w-[32vw] bg-[#0b0f19]/80 border-[0.3vw] sm:border-[0.1vw] border-slate-800/80 rounded-[4vw] sm:rounded-[2vw] p-[6vw] sm:p-[2.5vw] backdrop-blur-md shadow-2xl flex flex-col gap-[3.5vh]">
        
        {/* Title Block */}
        <div className="flex flex-col items-center gap-[1vh] text-center">
          <h3 className="text-[6vw] sm:text-[2vw] font-black text-white leading-tight flex items-center justify-center gap-[1.5vw] sm:gap-[0.5vw]">
            <Sparkles className="h-[3.5vh] w-[6vw] sm:h-[3vh] sm:w-[2.5vw] text-indigo-400 fill-current animate-pulse" />
            <span>Create Account</span>
          </h3>
          <p className="text-[3.5vw] sm:text-[0.9vw] text-slate-400 max-w-[80vw] sm:max-w-none">
            Sign up to unlock premium shopping privileges at ShopNest.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[2.5vh]">
          
          {/* Full Name Input Group */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[3.2vw] sm:text-[0.8vw] font-bold text-slate-500 uppercase tracking-wider">
              Full Name
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[3vw] sm:rounded-[1vw] bg-slate-900/40 border ${errors.name ? 'border-rose-500/50 focus-within:border-rose-500' : 'border-slate-800/80 focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/40 transition-all`}>
              <User className={`h-[2.5vh] w-[4vw] sm:h-[2vh] sm:w-[1.2vw] ${errors.name ? 'text-rose-455' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-650"
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
              <span className="text-rose-500 text-[3vw] sm:text-[0.75vw] mt-[0.5vh] ml-[0.5vw] font-medium leading-none">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Input Group */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[3.2vw] sm:text-[0.8vw] font-bold text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[3vw] sm:rounded-[1vw] bg-slate-900/40 border ${errors.email ? 'border-rose-500/50 focus-within:border-rose-500' : 'border-slate-800/80 focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/40 transition-all`}>
              <Mail className={`h-[2.5vh] w-[4vw] sm:h-[2vh] sm:w-[1.2vw] ${errors.email ? 'text-rose-455' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Enter your email" 
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-650"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format"
                  }
                })}
              />
            </div>
            {errors.email && (
              <span className="text-rose-500 text-[3vw] sm:text-[0.75vw] mt-[0.5vh] ml-[0.5vw] font-medium leading-none">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[3.2vw] sm:text-[0.8vw] font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[3vw] sm:rounded-[1vw] bg-slate-900/40 border ${errors.password ? 'border-rose-500/50 focus-within:border-rose-500' : 'border-slate-800/80 focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/40 transition-all`}>
              <Lock className={`h-[2.5vh] w-[4vw] sm:h-[2vh] sm:w-[1.2vw] ${errors.password ? 'text-rose-455' : 'text-slate-500'}`} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-650"
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
              <span className="text-rose-500 text-[3vw] sm:text-[0.75vw] mt-[0.5vh] ml-[0.5vw] font-medium leading-none">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password Input Group */}
          <div className="flex flex-col gap-[0.8vh]">
            <label className="text-[3.2vw] sm:text-[0.8vw] font-bold text-slate-500 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className={`flex items-center gap-[3vw] sm:gap-[1vw] p-[3.5vw] sm:p-[1vw] rounded-[3vw] sm:rounded-[1vw] bg-slate-900/40 border ${errors.confirmPassword ? 'border-rose-500/50 focus-within:border-rose-500' : 'border-slate-800/80 focus-within:border-indigo-500/50'} focus-within:bg-[#0f172a]/40 transition-all`}>
              <KeyRound className={`h-[2.5vh] w-[4vw] sm:h-[2vh] sm:w-[1.2vw] ${errors.confirmPassword ? 'text-rose-455' : 'text-slate-500'}`} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-transparent text-[3.8vw] sm:text-[0.95vw] text-white focus:outline-hidden placeholder-slate-650"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match"
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-500 text-[3vw] sm:text-[0.75vw] mt-[0.5vh] ml-[0.5vw] font-medium leading-none">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-[1.8vh] rounded-[2vw] sm:rounded-[1vw] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-650/20 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] mt-[1.5vh] cursor-pointer"
          >
            <span>Register Now</span>
            <ArrowRight className="h-[2.2vh] w-[3.5vw] sm:h-[2vh] sm:w-[1.2vw]" />
          </button>
        </form>

        {/* Sign In Navigation Link */}
        <p className="text-[3.5vw] sm:text-[0.85vw] text-slate-500 text-center mt-[1vh]">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;