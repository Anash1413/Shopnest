import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Printer,
  Calendar,
  Lock
} from 'lucide-react'

function PaymentDetails() {
  const { id } = useParams() // order ID
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/order/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Payment ledger details could not be found')
      const data = await res.json()
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Payment Details | ShopNest'
    if (token) {
      fetchOrderDetails()
    } else {
      setError('Please log in to view payment logs.')
      setLoading(false)
    }
  }, [id, token])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-455 font-semibold uppercase tracking-wider text-sm">Syncing payment records...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center px-4 pt-20">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Receipt Missing</h2>
          <p className="text-slate-455 mb-6 text-sm leading-relaxed">{error || "Payment data is missing"}</p>
          <Link to="/orders" className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors block w-full">
            Back to Orders Log
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-205 font-sans pb-16 pt-28 overflow-x-hidden relative print:bg-white print:text-black">
      
      {/* Background glowing nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div className="absolute top-[10vh] right-[10vw] w-[40vw] h-[40vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[10vh] left-[5vw] w-[40vw] h-[40vw] rounded-full bg-cyan-600/4 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8 print:my-0">
        
        {/* Navigation */}
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-bold uppercase text-slate-400 tracking-wider transition hover:border-slate-700 hover:text-white print:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Order Details
        </Link>

        {/* Invoice Container */}
        <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-3xl print:bg-transparent print:border-none print:shadow-none">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4 border-b border-white/5 pb-8">
            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase print:text-black">Payment Receipt</h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wider font-mono">ORDER ID: {order._id}</p>
            </div>

            <div className="px-3 py-1.5 bg-slate-950/80 border border-slate-900 rounded-xl inline-flex items-center gap-2 text-xs font-mono text-slate-400 print:bg-slate-100 print:text-black print:border-slate-200">
              <Calendar className="h-4 w-4 text-indigo-400 print:text-indigo-600" />
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-8 space-y-6 text-sm text-slate-350">
            <h2 className="text-xs font-bold text-white uppercase tracking-widest text-left print:text-black">Transaction Allocations</h2>
            
            <div className="space-y-3.5 border-b border-white/5 pb-6">
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="text-white font-semibold print:text-black">{order.address?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone</span>
                <span className="text-white font-semibold print:text-black">{order.address?.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="text-indigo-400 font-semibold uppercase tracking-wider">{order.paymentMethod === 'online' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">SUCCESS / VERIFIED</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 font-mono text-xs">
              {order.items?.map((item) => (
                <div key={item.product?._id} className="flex justify-between text-slate-400 print:text-black">
                  <span className="max-w-[300px] truncate">{item.product?.name} x{item.quantity}</span>
                  <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3.5 text-slate-450 print:text-black">
              <div className="flex justify-between font-bold text-white text-base print:text-black">
                <span>Amount Paid</span>
                <span>${order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5 print:hidden">
            <button 
              onClick={handlePrint}
              className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-white font-bold text-xs border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
          </div>

          {/* Secure indicator */}
          <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-605 uppercase tracking-widest print:hidden">
            <Lock className="h-3 w-3 text-indigo-500" />
            <span>Secure SSL Encryption Gateway</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default PaymentDetails