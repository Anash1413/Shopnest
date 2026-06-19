import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Search,
  ArrowRight
} from "lucide-react";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search terms
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const token = localStorage.getItem("token");

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Analytics
      const analyticsRes = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const analyticsData = await analyticsRes.json();

      // 2. Fetch Products
      const productsRes = await fetch('/api/product');
      const productsData = await productsRes.json();

      // 3. Fetch Orders
      const ordersRes = await fetch('/api/order', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ordersData = await ordersRes.json();

      // 4. Fetch Users
      const usersRes = await fetch('/api/admin/alluser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersRes.json();

      if (analyticsRes.ok) setAnalytics(analyticsData);
      if (productsRes.ok) setProducts(productsData.products || []);
      if (ordersRes.ok) setOrders(ordersData.orders || []);
      if (usersRes.ok) setUsers(usersData.User || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Dashboard | ShopNest';
    if (token) {
      loadData();
    } else {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  // Actions
  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "Are you sure you want to permanently delete this product from the catalog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0c0f1e",
      color: "#e2e8f0",
      customClass: {
        popup: "border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl bg-slate-900/90 p-6 font-sans text-center",
        title: "text-lg font-extrabold text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-slate-400 text-xs font-semibold leading-relaxed mb-6",
        confirmButton: "px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-600/25 transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: productId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p._id !== productId));
      setAnalytics(prev => prev ? { ...prev, totalproducts: Math.max(0, prev.totalproducts - 1) } : null);
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  // Filters
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o._id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.status?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-450 font-semibold uppercase tracking-wider text-sm">Syncing admin dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center px-4 pt-20">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Access Denied / Error</h2>
          <p className="text-slate-450 mb-6 text-sm leading-relaxed">{error}</p>
          <button onClick={loadData} className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors block w-full">
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

      <div className="relative z-10 max-w-[85vw] mx-auto">
        
        {/* Header Block */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
          <div className="flex flex-col items-start gap-1">
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/20" />
              <span>Control Operations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none mt-2">
              Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">Dashboard</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Monitor real-time sales revenue, manage users profiles, edit inventory listings, and update checkout orders.
          </p>
        </header>

        {/* Tab Controls */}
        <nav className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-900 pb-5">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "products", label: "Products", icon: ShoppingBag },
            { id: "orders", label: "Orders", icon: ClipboardList },
            { id: "users", label: "Users", icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600/10 text-white border-indigo-500/35 shadow-md shadow-indigo-600/5"
                    : "bg-transparent border-transparent text-slate-450 hover:text-slate-250 hover:bg-slate-900/30"
                }`}
              >
                <Icon className="h-4 w-4 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <section className="min-h-[50vh]">
          
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: `$${analytics?.totalRevenue?.toLocaleString() || "0"}`,
                    icon: DollarSign,
                    color: "text-emerald-400",
                    glow: "bg-emerald-500/5"
                  },
                  {
                    title: "Total Orders",
                    value: analytics?.totalorders || "0",
                    icon: ClipboardList,
                    color: "text-indigo-400",
                    glow: "bg-indigo-500/5"
                  },
                  {
                    title: "Total Products",
                    value: analytics?.totalproducts || "0",
                    icon: ShoppingBag,
                    color: "text-cyan-400",
                    glow: "bg-cyan-500/5"
                  },
                  {
                    title: "Registered Users",
                    value: analytics?.totalUsers || "0",
                    icon: Users,
                    color: "text-violet-400",
                    glow: "bg-violet-500/5"
                  }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md hover:border-slate-700/50 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
                        <div className="text-2xl md:text-3xl font-black text-white">{card.value}</div>
                      </div>
                      <div className={`p-3 rounded-xl ${card.color} ${card.glow} border border-white/5 group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphic Chart + Activity row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Sales Chart */}
                <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-base font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                        <span>Sales Revenue Trends</span>
                      </h3>
                      <p className="text-xs text-slate-500">Analytics overview of weekly transactions</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">+18.5% this week</span>
                  </div>

                  {/* SVG Chart Wave */}
                  <div className="relative">
                    <svg className="w-full h-48 md:h-64 mt-4 overflow-visible" viewBox="0 0 700 250">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                        </linearGradient>
                        <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818cf8"/>
                          <stop offset="50%" stopColor="#c084fc"/>
                          <stop offset="100%" stopColor="#22d3ee"/>
                        </linearGradient>
                      </defs>
                      <line x1="50" y1="50" x2="650" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
                      <line x1="50" y1="100" x2="650" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
                      <line x1="50" y1="150" x2="650" y2="150" stroke="#1e293b" strokeDasharray="4 4" />
                      <line x1="50" y1="200" x2="650" y2="200" stroke="#1e293b" strokeDasharray="4 4" />
                      <path
                        d="M 50 180 C 100 160, 100 140, 150 140 C 200 140, 200 160, 250 160 C 300 160, 300 100, 350 100 C 400 100, 400 110, 450 110 C 500 110, 500 60, 550 60 C 600 60, 600 40, 650 40"
                        fill="none"
                        stroke="url(#strokeGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 180 C 100 160, 100 140, 150 140 C 200 140, 200 160, 250 160 C 300 160, 300 100, 350 100 C 400 100, 400 110, 450 110 C 500 110, 500 60, 550 60 C 600 60, 600 40, 650 40 L 650 200 L 50 200 Z"
                        fill="url(#chartGlow)"
                      />
                      <circle cx="50" cy="180" r="5.5" fill="#818cf8" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="150" cy="140" r="5.5" fill="#818cf8" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="250" cy="160" r="5.5" fill="#c084fc" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="350" cy="100" r="5.5" fill="#c084fc" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="450" cy="110" r="5.5" fill="#22d3ee" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="550" cy="60" r="5.5" fill="#22d3ee" stroke="#070913" strokeWidth="2.5" />
                      <circle cx="650" cy="40" r="5.5" fill="#22d3ee" stroke="#070913" strokeWidth="2.5" />
                      <text x="50" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Mon</text>
                      <text x="150" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Tue</text>
                      <text x="250" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Wed</text>
                      <text x="350" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Thu</text>
                      <text x="450" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Fri</text>
                      <text x="550" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Sat</text>
                      <text x="650" y="230" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">Sun</text>
                    </svg>
                  </div>
                </div>

                {/* Quick actions & stats */}
                <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-wide uppercase mb-1">Shortcut Panel</h3>
                    <p className="text-xs text-slate-500 mb-4">Quick access to admin modules</p>
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/admin/add-product"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-600/15 text-indigo-300 transition-all font-semibold text-sm group"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="h-4.5 w-4.5" /> Create Product Record
                        </span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button
                        onClick={() => setActiveTab("products")}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/20 hover:bg-slate-900/40 text-slate-350 transition-all font-semibold text-sm group cursor-pointer text-left"
                      >
                        <span>Manage Inventory ({products.length})</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/20 hover:bg-slate-900/40 text-slate-350 transition-all font-semibold text-sm group cursor-pointer text-left"
                      >
                        <span>Inspect Orders Log ({orders.length})</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Recent Order Status</span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-center p-3 border border-white/5 rounded-xl bg-slate-950/40">
                        <div className="text-lg font-black text-amber-500">{orders.filter(o => o.status?.toLowerCase() === 'pending').length}</div>
                        <div className="text-[10px] font-bold text-slate-550 uppercase">Pending</div>
                      </div>
                      <div className="flex-1 text-center p-3 border border-white/5 rounded-xl bg-slate-950/40">
                        <div className="text-lg font-black text-indigo-400">{orders.filter(o => o.status?.toLowerCase() === 'shipped').length}</div>
                        <div className="text-[10px] font-bold text-slate-550 uppercase">Shipped</div>
                      </div>
                      <div className="flex-1 text-center p-3 border border-white/5 rounded-xl bg-slate-950/40">
                        <div className="text-lg font-black text-emerald-400">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</div>
                        <div className="text-[10px] font-bold text-slate-550 uppercase">Delivered</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === "products" && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search product name, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
                <Link
                  to="/admin/add-product"
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white text-sm font-bold shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-slate-300 font-extrabold">No Products Found</h3>
                  <p className="text-slate-500 text-xs mt-1">Try refining your active search string.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">Product Info</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-950/20 transition-colors group">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url} alt={p.name} className="h-10 w-10 object-cover rounded-lg border border-slate-800" />
                              <div>
                                <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{p.name}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{p.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-400">{p.category}</td>
                          <td className="py-4 px-4 font-extrabold text-white">${p.price}</td>
                          <td className="py-4 px-4 font-semibold">
                            {p.stock === 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase">Out of Stock</span>
                            ) : p.stock <= 5 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/20 bg-amber-500/10 text-amber-400 uppercase">{p.stock} Left</span>
                            ) : (
                              <span className="text-slate-350">{p.stock} Units</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-450 font-bold">{p.rating} ★</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/add-product?editing=true&id=${p._id}`}
                                className="p-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-650 text-indigo-400 hover:text-white transition-all duration-200"
                                title="Edit Product"
                              >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-600 text-rose-450 hover:text-white transition-all duration-200 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5 animate-fade-in">
              <div className="flex items-center pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by ID, customer name..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-slate-300 font-extrabold">No Orders Logged</h3>
                  <p className="text-slate-500 text-xs mt-1">Try adjusting your active search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Details</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Order Date</th>
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
                          <td className="py-4 px-4 text-slate-500 font-semibold">
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
                              className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-none border cursor-pointer ${
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
          )}

          {/* ================= USERS TAB ================= */}
          {activeTab === "users" && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5 animate-fade-in">
              <div className="flex items-center pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-slate-300 font-extrabold">No Users Registered</h3>
                  <p className="text-slate-500 text-xs mt-1">Try search queries matching existing profiles.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">User Name</th>
                        <th className="py-3.5 px-4">Email Address</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-950/20 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-200">{u.name}</td>
                          <td className="py-4 px-4 text-slate-400 font-semibold">{u.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              u.role?.toLowerCase() === 'admin'
                                ? 'border-violet-500/20 bg-violet-500/10 text-violet-400'
                                : 'border-slate-800 bg-slate-950 text-slate-400'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {u.isVerified ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase inline-flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Yes
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/20 bg-rose-500/10 text-rose-450 uppercase inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;