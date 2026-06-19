import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ClipboardList, 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  Package
} from 'lucide-react'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/order/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'My Orders | ShopNest'
    if (token) {
      fetchOrders()
    } else {
      setError('Please log in to view your orders.')
      setLoading(false)
    }
  }, [token])

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-clip relative">
      
      {/* Background ambient glowing */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10vh] left-[5vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[-10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/5 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 max-w-[85vw] mx-auto py-[6vh] pt-[15vh]">
        
        {/* Back navigation */}
        <Link
          to="/profile"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-bold uppercase text-slate-400 tracking-wider transition hover:border-slate-700 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>

        {/* Page Header */}
        <header className="mb-[6vh] flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-[4vh] gap-[2vh]">
          <div className="flex flex-col items-start gap-[1vh]">
            <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] md:text-[0.75vw] font-bold tracking-widest uppercase inline-flex items-center gap-[0.4vw]">
              <Sparkles className="h-[1.5vh] w-[1.2vw] text-indigo-400 fill-indigo-400/20" />
              <span>Purchase History</span>
            </div>
            <h1 className="text-[8vw] md:text-[3.2vw] font-extrabold text-white tracking-tight uppercase leading-none mt-2">
              Checkout <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Order Logs</span>
            </h1>
          </div>
          <p className="text-[3.5vw] md:text-[1vw] text-slate-505 max-w-[85vw] md:max-w-[30vw] leading-relaxed">
            Verify shipment updates, view invoices, and browse details of your previous orders.
          </p>
        </header>

        {/* Main Content */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-[15vh] gap-3">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Syncing orders log...</span>
            </div>
          ) : error ? (
            <div className="text-center py-[10vh] border border-rose-500/15 rounded-[2.5vw] bg-rose-950/10 p-8 max-w-lg mx-auto">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
              <h3 className="text-rose-455 font-extrabold text-lg mb-2">Error Loading Orders</h3>
              <p className="text-rose-400/85 text-sm mb-6 font-semibold">{error}</p>
              <button 
                onClick={fetchOrders}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs uppercase tracking-wider"
              >
                Retry Fetch
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-[12vh] border border-white/[0.03] rounded-[2vw] bg-slate-900/10 backdrop-blur-md p-8 max-w-lg mx-auto flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-120 animate-pulse"></div>
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-indigo-400 backdrop-blur-md relative">
                  <ClipboardList className="h-7 w-7 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-white font-extrabold text-xl mb-2">No orders placed yet</h3>
              <p className="text-slate-455 text-sm leading-relaxed mb-8">
                Your order logs are empty. Visit the store, add items to your cart, and complete checkouts.
              </p>
              <Link 
                to="/products"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-indigo-650/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  className="bg-[#0c0f1e]/40 border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/20 transition-all duration-300 group"
                >
                  <div className="flex-1 space-y-4 w-full">
                    {/* Top Row: Order metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Order Identifier</span>
                        <span className="font-mono text-xs text-indigo-400 font-semibold">{order._id}</span>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-550" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CreditCard className="h-3.5 w-3.5 text-slate-555" />
                          <span className="capitalize">{order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Shipment status</span>
                        <span className={`text-[10px] font-bold rounded-lg px-2.5 py-1 border uppercase tracking-wider ${
                          order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-450'
                            : order.status?.toLowerCase() === 'shipped'
                            ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400'
                            : 'bg-amber-500/10 border-amber-500/35 text-amber-400'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Items preview */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-black/30 border border-white/[0.03] p-2.5 rounded-2xl">
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-900 shrink-0" 
                          />
                          <div className="text-left">
                            <span className="font-semibold text-slate-300 text-xs block max-w-[120px] truncate">{item.product?.name}</span>
                            <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">{item.product?.brand} x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Total Paid + Detail Link */}
                  <div className="flex flex-col items-end justify-between md:border-l border-white/[0.04] md:pl-6 md:min-w-[150px] w-full md:w-auto self-stretch gap-4 md:gap-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                    <div className="text-left md:text-right w-full">
                      <span className="text-[10px] font-bold text-slate-505 block uppercase tracking-wider mb-1">Grand Total</span>
                      <span className="text-xl font-extrabold text-white">${order.totalAmount}</span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex w-full md:w-fit items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 px-4 py-2.5 text-xs font-bold text-slate-300 tracking-wider transition-all"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders