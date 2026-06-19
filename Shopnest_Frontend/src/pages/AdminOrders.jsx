import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders");
      }
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Orders | ShopNest';
    if (token) {
     fetchOrders();
    } else {
      setError("Authorization token missing. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ _id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      toast.success("Order status updated");
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-450 font-semibold uppercase tracking-wider text-sm">Syncing orders log...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center px-4 pt-20">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Error Loading Orders</h2>
          <p className="text-slate-450 mb-6 text-sm leading-relaxed">{error}</p>
          <button onClick={fetchOrders} className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors block w-full">
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070913] text-slate-200 font-sans pb-16 pt-28 overflow-x-hidden relative">
      {/* Background glowing nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10vh] right-[10vw] w-[40vw] h-[40vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[10vh] left-[5vw] w-[40vw] h-[40vw] rounded-full bg-cyan-600/4 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 max-w-[85vw] mx-auto space-y-6">
        
        {/* Navigation / Header Row */}
        <div className="flex flex-col gap-4">
          <Link
            to="/admin"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-bold uppercase text-slate-400 tracking-wider transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          
          <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
            <div className="flex flex-col items-start gap-1">
              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/20" />
                <span>Orders Manager</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none mt-2">
                Checkout <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Orders Log</span>
              </h1>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </header>
        </div>

        {/* Standalone Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Pending Orders</span>
            <div className="text-2xl font-black text-amber-500">{orders.filter(o => o.status?.toLowerCase() === 'pending').length}</div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Shipped Orders</span>
            <div className="text-2xl font-black text-indigo-450">{orders.filter(o => o.status?.toLowerCase() === 'shipped').length}</div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Delivered Orders</span>
            <div className="text-2xl font-black text-emerald-400">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</div>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-slate-300 font-extrabold">No Orders Found</h3>
              <p className="text-slate-500 text-xs mt-1 font-semibold">We couldn't find any checkout records matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Purchased Items</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Purchase Date</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-950/20 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-indigo-400 font-semibold">{o._id}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">{o.user?.name || "Deleted User"}</div>
                        <div className="text-[10px] text-slate-500">{o.shippingAddress?.email}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        <ul className="text-xs list-disc pl-4 space-y-0.5">
                          {o.items?.map((item, idx) => (
                            <li key={idx}>
                              {item.product?.name || "Product"} <span className="font-bold text-slate-300">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-white">${o.totalAmount}</td>
                      <td className="py-4 px-4 text-slate-500 font-semibold font-sans">
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none border cursor-pointer ${
                            o.status?.toLowerCase() === 'delivered'
                              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                              : o.status?.toLowerCase() === 'shipped'
                              ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400'
                              : 'bg-amber-500/10 border-amber-500/35 text-amber-400'
                          }`}
                        >
                          <option value="Pending" className="bg-[#0b0e1a] text-amber-400">Pending</option>
                          <option value="Shipped" className="bg-[#0b0e1a] text-indigo-400">Shipped</option>
                          <option value="Delivered" className="bg-[#0b0e1a] text-emerald-400">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default AdminOrders;
