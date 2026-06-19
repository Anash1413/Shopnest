import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Calendar,
  User,
  Mail,
  SlidersHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

function AdminOrderDetails() {
  const { id } = useParams()
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
      if (!res.ok) throw new Error('Order details could not be found')
      const data = await res.json()
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Admin Order Details | ShopNest'
    if (token) {
      fetchOrderDetails()
    } else {
      setError('Please log in as admin.')
      setLoading(false)
    }
  }, [id, token])

  const handleUpdateOrderStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/order/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ _id: order._id, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      toast.success("Order status updated successfully");
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-455 font-semibold uppercase tracking-wider text-sm">Loading admin invoice view...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center px-4 pt-20">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Error Loading Order</h2>
          <p className="text-slate-455 mb-6 text-sm leading-relaxed">{error || "Order data missing"}</p>
          <Link to="/admin/orders" className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors block w-full">
            Back to Orders Log
          </Link>
        </div>
      </div>
    )
  }

  // Calculate items subtotal
  const itemsSubtotal = order.items?.reduce((total, item) => total + ((item.product?.price || 0) * (item.quantity || 1)), 0) || 0;
  const shippingThreshold = 100;
  const shippingCost = itemsSubtotal >= shippingThreshold || itemsSubtotal === 0 ? 0 : 15;
  const estimatedTax = itemsSubtotal * 0.08;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-205 font-sans pb-16 pt-28 overflow-x-hidden relative">
      
      {/* Background glowing nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10vh] right-[10vw] w-[40vw] h-[40vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[10vh] left-[5vw] w-[40vw] h-[40vw] rounded-full bg-cyan-600/4 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 max-w-[80vw] mx-auto space-y-8">
        
        {/* Navigation */}
        <Link
          to="/admin/orders"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-bold uppercase text-slate-400 tracking-wider transition hover:border-slate-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders Log
        </Link>

        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
          <div className="flex flex-col items-start gap-1">
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Operations Inspector</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none mt-2">
              Inspect <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Order Invoice</span>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-1 md:items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Set Shipment Status</span>
            <select
              value={order.status || "Pending"}
              onChange={(e) => handleUpdateOrderStatus(e.target.value)}
              className={`text-xs font-bold rounded-lg px-3 py-2 focus:outline-none border cursor-pointer bg-slate-950/80 ${
                order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed'
                  ? 'border-emerald-500/35 text-emerald-450'
                  : order.status?.toLowerCase() === 'shipped'
                  ? 'border-indigo-500/35 text-indigo-400'
                  : 'border-amber-500/35 text-amber-400'
              }`}
            >
              <option value="pending" className="bg-[#0b0e1a] text-amber-400">Pending</option>
              <option value="shipped" className="bg-[#0b0e1a] text-indigo-400">Shipped</option>
              <option value="completed" className="bg-[#0b0e1a] text-emerald-400">Delivered/Completed</option>
            </select>
          </div>
        </header>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Items Table & Tracking */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status bar */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Customer Details</span>
                <div className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-400" />
                  <span>{order.user?.name || "Deleted User"}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-400/50" />
                  <span>{order.user?.email || "No email info"}</span>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1">Receipt Date</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                    <Calendar className="h-4 w-4 text-slate-550" />
                    <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1">Payment Method</span>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                    <span className="capitalize">{order.paymentMethod === 'online' ? 'Online Gateway' : 'Cash on Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Card List */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-400" />
                <span>Purchased Items</span>
              </h2>

              <div className="divide-y divide-white/[0.04] space-y-4">
                {order.items?.map((item) => (
                  <div key={item.product?._id} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 first:pt-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img 
                        src={item.product?.image_url} 
                        alt={item.product?.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-slate-850 shrink-0" 
                      />
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block mb-1">
                          {item.product?.brand} · {item.product?.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-205 line-clamp-1">{item.product?.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block max-w-sm mt-0.5">{item.product?.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-white/[0.03]">
                      <div className="text-right sm:min-w-[80px]">
                        <span className="text-[9px] font-bold text-slate-505 block uppercase">Price</span>
                        <span className="font-semibold text-slate-300 text-sm">${item.product?.price}</span>
                      </div>
                      <div className="text-right sm:min-w-[50px]">
                        <span className="text-[9px] font-bold text-slate-505 block uppercase">Qty</span>
                        <span className="font-extrabold text-white text-sm">x{item.quantity}</span>
                      </div>
                      <div className="text-right sm:min-w-[85px]">
                        <span className="text-[9px] font-bold text-slate-505 block uppercase">Subtotal</span>
                        <span className="font-black text-white text-sm">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Address & Financial Summaries */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Delivery Details Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Shipping Address</span>
              </h2>
              <div className="space-y-3 text-sm text-slate-350 text-left">
                <div>
                  <span className="text-[9px] font-bold text-slate-550 block uppercase">Recipient Name</span>
                  <span className="text-white font-semibold">{order.address?.fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-550 block uppercase">Street Location</span>
                  <span className="text-white font-semibold">{order.address?.addressLine1} {order.address?.addressLine2}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-550 block uppercase">City & State</span>
                  <span className="text-white font-semibold">{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-550 block uppercase">Contact Phone</span>
                  <span className="text-indigo-400 font-semibold">{order.address?.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Financial Invoice Details */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-400" />
                <span>Financial Summary</span>
              </h2>
              <div className="space-y-3.5 text-slate-400 text-sm">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-white font-semibold">${itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-2 rounded-md">Free</span>
                  ) : (
                    <span className="text-white font-semibold">${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800/60 pt-4 mt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-300">Grand Total</span>
                  <span className="text-xl font-extrabold text-white leading-none">${order.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminOrderDetails
