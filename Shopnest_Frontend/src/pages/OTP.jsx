import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Sparkles, Send, ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react'

const OTP = () => {
  useEffect(() => {
        document.title = 'Verify-OTP' 
  }, [])
  const { user, login ,token} = useAuth()
  const [confirm, setconfirm] = useState(false)
  const [loading, setloading] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const sendOtp = async () => {
    setloading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        
      })
      
      const data = await res.json()
      if (res.ok) {
        setconfirm(true)
        setSuccess('Verification code sent to your email.')
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.')
      }
    } catch  {
      setError('Connection error. Please check your network.')
    } finally {
      setloading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.')
      return
    }

    setloading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`


        },
        body: JSON.stringify({
          email: user?.email,
          otp: otp
        })
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess('Account verified successfully!')
        // Update user auth context
        if (login && data.user && data.token) {
          login(data.user, data.token)
        }
      } else {
        setError(data.message || 'Invalid or expired OTP.')
      }
    } catch  {
      setError('Verification failed. Please check your connection.')
    } finally {
      setloading(false)
    }
  }

  // Early return for loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center py-[10vh] px-[5vw]">
        <div className="flex flex-col items-center gap-[2.5vh]">
          <div className="animate-spin rounded-full h-[6vh] w-[6vh] border-t-[0.3vw] border-b-[0.3vw] border-indigo-500"></div>
          <span className="text-[3.2vw] sm:text-[0.85vw] font-mono text-slate-500 tracking-wider">
            [ CONTACTING WORKSPACE... ]
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col items-center justify-center py-[8vh] px-[4vw] relative overflow-hidden font-sans">
      
      {/* Background Graphic Cosmic Glows */}
      <div className="absolute top-[-15vh] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/10 blur-[9vw] pointer-events-none"></div>
      <div className="absolute bottom-[-10vh] right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-indigo-650/10 blur-[9vw] pointer-events-none"></div>

      {/* Frosted Glass Container */}
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

        {/* View 1: Send OTP request */}
        {!confirm ? (
          <div className="flex flex-col gap-[4vh]">
            <div className="flex flex-col items-center gap-[1vh] text-center">
              <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] sm:text-[0.75vw] font-bold tracking-widest uppercase mb-[0.5vh] inline-flex items-center gap-[0.4vw]">
                <Sparkles className="h-[2vh] w-[3vw] sm:w-[1vw] text-indigo-400 fill-indigo-400/20" />
                <span>Verification Portal</span>
              </div>
              <h3 className="text-[6vw] sm:text-[2vw] font-extrabold text-white leading-tight uppercase tracking-tight">
                Send OTP
              </h3>
              <p className="text-[3.2vw] sm:text-[0.85vw] text-slate-400 max-w-[80vw] sm:max-w-none">
                Verify your identity by sending a code to: <span className="font-semibold text-white">{user?.email}</span>
              </p>
            </div>

            <button 
              onClick={sendOtp}
              className="w-full py-[1.8vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] transform active:scale-95 cursor-pointer"
            >
              <span>Send Verification Code</span>
              <Send className="h-[2vh] w-[3.5vw] sm:w-[1.2vw]" />
            </button>
          </div>
        ) : (
          /* View 2: Verify OTP input */
          <div className="flex flex-col gap-[4vh]">
            <div className="flex flex-col items-center gap-[1vh] text-center">
              <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] sm:text-[0.75vw] font-bold tracking-widest uppercase mb-[0.5vh] inline-flex items-center gap-[0.4vw]">
                <ShieldCheck className="h-[2vh] w-[3vw] sm:w-[1vw] text-indigo-400" />
                <span>Security Check</span>
              </div>
              <h3 className="text-[6vw] sm:text-[2vw] font-extrabold text-white leading-tight uppercase tracking-tight">
                Enter Code
              </h3>
              <p className="text-[3.2vw] sm:text-[0.85vw] text-slate-400 max-w-[80vw] sm:max-w-none">
                Please input the 6-digit secure code sent to your mail inbox.
              </p>
            </div>

            <div className="flex flex-col gap-[0.8vh]">
              <label className="text-[2.8vw] sm:text-[0.75vw] font-bold text-slate-400 uppercase tracking-widest ml-[0.5vw]">
                6-Digit OTP Code
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
                onClick={verifyOtp}
                className="w-full py-[1.8vh] rounded-[50vw] bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.8vw] sm:text-[0.95vw] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-[2vw] sm:gap-[0.5vw] transform active:scale-95 cursor-pointer"
              >
                <span>Verify & Activate</span>
              </button>
              
              <button 
                onClick={() => setconfirm(false)}
                className="w-full py-[1.5vh] rounded-[50vw] bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-[3.2vw] sm:text-[0.85vw] font-bold text-slate-350 transition-all flex items-center justify-center gap-[1.5vw] sm:gap-[0.4vw] cursor-pointer"
              >
                <ArrowLeft className="h-[2vh] w-[3.5vw] sm:w-[1.1vw]" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default OTP
