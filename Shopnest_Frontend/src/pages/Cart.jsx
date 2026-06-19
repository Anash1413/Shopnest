
import { useSelector, useDispatch } from "react-redux";
import { deleteToCart, fetchCart } from "../redux/cartSlice";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  MapPin, 
  User, 
  Mail, 
  Lock, 
  ChevronLeft,
  RotateCcw
} from "lucide-react";




function Cart() {
  useEffect(() => {
        document.title = 'Cart' 
  }, [])
  // Alias isloading (all lowercase from cartSlice) to isLoading (camelCase)
  const { cartItems, isloading: isLoading, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  
  // Local state for interactive features
  const [deletingId, setDeletingId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = shipping details, 2 = payment, 3 = order completed
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [paymentMethodSelection, setPaymentMethodSelection] = useState("razorpay");
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: ""
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Handle removing an item with individual loading states
  const handleRemove = async (productId) => {
    setDeletingId(productId);
    try {
      await dispatch(deleteToCart(productId)).unwrap();
      toast.success("Item removed from cart", {
        icon: '🗑️',
        style: {
          borderRadius: '12px',
          background: '#0f172a',
          color: '#fff',
          border: '1px border border-slate-800'
        }
      });
    } catch (err) {
      toast.error(err || "Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  // Calculations
  const subtotal = cartItems?.reduce((total, item) => total + (item.price || 0), 0) || 0;
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08; // 8% tax rate
  const grandTotal = subtotal + shippingCost + estimatedTax;

  // Handle Checkout actions
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.phoneNumber) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (paymentMethodSelection === "razorpay") {
      setIsProcessingOrder(true);
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load Razorpay SDK. Check your connection.");
          setIsProcessingOrder(false);
          return;
        }

        // 1. Fetch Razorpay key from backend
        const keyRes = await fetch("/api/payment/key", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!keyRes.ok) throw new Error("Failed to load payment credentials");
        const { key } = await keyRes.json();

        // 2. Create Razorpay order in backend
        const orderRes = await fetch("/api/payment/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ amount: grandTotal })
        });
        if (!orderRes.ok) throw new Error("Failed to initialize payment gateway");
        const rzpOrder = await orderRes.json();

        // 3. Open Razorpay Checkout overlay
        const options = {
          key: key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "ShopNest",
          description: "Secure Checkout Payment",
          order_id: rzpOrder.id,
          prefill: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            contact: shippingInfo.phoneNumber
          },
          theme: {
            color: "#6366f1"
          },
          handler: async (response) => {
            try {
              setIsProcessingOrder(true);
              // 4. Verify payment signature on backend
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");

              // 5. Create final order in MongoDB database
              const itemsMapped = cartItems.map(item => ({
                product: item._id,
                quantity: 1
              }));

              const dbOrderRes = await fetch("/api/order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  items: itemsMapped,
                  address: {
                    fullName: shippingInfo.fullName,
                    addressLine1: shippingInfo.address,
                    addressLine2: "",
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zipCode: shippingInfo.zipCode,
                    phoneNumber: shippingInfo.phoneNumber
                  },
                  totalAmount: grandTotal,
                  paymentMethod: "online",
                  status: "completed"
                })
              });

              const dbOrderData = await dbOrderRes.json();
              if (!dbOrderRes.ok) throw new Error(dbOrderData.message || "Failed to create order record");

              setGeneratedOrderId(dbOrderData.order?._id || dbOrderData.order?.id || "SN-SUCCESS");
              setCheckoutStep(3);
              toast.success("Payment successful! Order placed.");

              // Clear local and backend cart items
              for (const item of cartItems) {
                await dispatch(deleteToCart(item._id)).unwrap();
              }
            } catch (err) {
              toast.error(err.message || "Order placement failed");
              console.error(err);
            } finally {
              setIsProcessingOrder(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessingOrder(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (err) {
        toast.error(err.message || "Payment initiation failed");
        console.error(err);
        setIsProcessingOrder(false);
      }
    } else {
      // Cash on Delivery checkout
      setIsProcessingOrder(true);
      try {
        const itemsMapped = cartItems.map(item => ({
          product: item._id,
          quantity: 1
        }));

        const dbOrderRes = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items: itemsMapped,
            address: {
              fullName: shippingInfo.fullName,
              addressLine1: shippingInfo.address,
              addressLine2: "",
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              phoneNumber: shippingInfo.phoneNumber
            },
            totalAmount: grandTotal,
            paymentMethod: "cashOnDelivery",
            status: "pending"
          })
        });

        const dbOrderData = await dbOrderRes.json();
        if (!dbOrderRes.ok) throw new Error(dbOrderData.message || "Failed to create order record");

        setGeneratedOrderId(dbOrderData.order?._id || dbOrderData.order?.id || "SN-SUCCESS");
        setCheckoutStep(3);
        toast.success("Order placed successfully! Cash on Delivery.");

        // Clear local and backend cart items
        for (const item of cartItems) {
          await dispatch(deleteToCart(item._id)).unwrap();
        }
      } catch (err) {
        toast.error(err.message || "Order placement failed");
        console.error(err);
      } finally {
        setIsProcessingOrder(false);
      }
    }
  };

  const resetCheckoutState = () => {
    setShowCheckout(false);
    setCheckoutStep(1);
    setShippingInfo({ fullName: "", email: "", address: "", city: "", state: "", zipCode: "", phoneNumber: "" });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white px-4">
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-8 max-w-md text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/25 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Cart Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchCart())}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold border border-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if cart is fully loading initially
  const isInitialLoading = isLoading && (!cartItems || cartItems.length === 0);

  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-10vh] left-[5vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/5 blur-[12vw] pointer-events-none"></div>
      <div className="absolute bottom-[10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/4 blur-[12vw] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full z-10 relative flex-1 flex flex-col justify-center">
        
        {isInitialLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium tracking-wide">Syncing with secure vault...</p>
          </div>
        ) : cartItems && cartItems.length === 0 && checkoutStep !== 3 ? (
          /* --- EMPTY CART STATE --- */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 max-w-lg mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-120 animate-pulse"></div>
              <div className="w-24 h-24 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center text-indigo-400 backdrop-blur-md relative">
                <ShoppingCart className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Your Cargo Bay is Empty
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
              Your cosmic shopping cart is currently empty. Explore our catalog of designed essentials to fill it up.
            </p>
            <Link 
              to="/products"
              className="px-8 py-3.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : checkoutStep === 3 ? (
          /* --- MOCK ORDER SUCCESS SCREEN --- */
          <div className="max-w-2xl mx-auto w-full py-6">
            <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-3xl text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[30vw] h-[30vh] rounded-full bg-emerald-500/5 blur-[5vw] pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-emerald-550/10 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-450">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 uppercase">
                Order Confirmed
              </h1>
              <p className="text-slate-450 text-sm mb-6">Thank you for your purchase. Your invoice details are generated below.</p>
              
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 mb-8 text-left space-y-4 font-mono text-xs text-slate-400">
                <div className="flex justify-between border-b border-slate-900 pb-3">
                  <span>ORDER ID:</span>
                  <span className="text-white font-bold">{generatedOrderId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-3">
                  <span>EST. DELIVERY:</span>
                  <span className="text-indigo-300 font-semibold">3-5 Business Days</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-3">
                  <span>SHIPPING TO:</span>
                  <span className="text-white text-right max-w-[200px] truncate">{shippingInfo.fullName}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>TOTAL PAID:</span>
                  <span className="text-emerald-400 font-bold text-sm">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link 
                  to="/products"
                  onClick={resetCheckoutState}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>
                <Link 
                  to="/orders"
                  onClick={resetCheckoutState}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-white font-bold text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  View Order Logs
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : showCheckout ? (
          /* --- CHECKOUT DRAWER / FORM PROCESS --- */
          <div className="max-w-3xl mx-auto w-full py-4">
            <button 
              onClick={() => {
                if (checkoutStep === 2) setCheckoutStep(1);
                else setShowCheckout(false);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-450 hover:text-slate-200 mb-6 transition-colors font-semibold uppercase tracking-wider bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-800/40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back {checkoutStep === 2 ? 'to Shipping' : 'to Cart'}</span>
            </button>

            {/* Stepper progress indicator */}
            <div className="flex items-center justify-center gap-3 mb-8 max-w-md mx-auto px-4">
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${checkoutStep >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px]">1</span>
                <span>Shipping</span>
              </div>
              <div className="h-px bg-slate-850 flex-1"></div>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${checkoutStep >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 2 ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-slate-950 border border-slate-900 text-slate-650'}`}>2</span>
                <span>Payment</span>
              </div>
            </div>

            <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-3xl">
              {checkoutStep === 1 ? (
                /* STEP 1: SHIPPING DETAILS */
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-slate-850 pb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span>Shipping Address</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Full Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 h-4 w-4 text-slate-550" />
                        <input 
                          type="text" 
                          placeholder="Anash Khan"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 pl-11 text-sm placeholder-slate-600"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Email Address</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 h-4 w-4 text-slate-550" />
                        <input 
                          type="email" 
                          placeholder="anash@shopnest.com"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 pl-11 text-sm placeholder-slate-600"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="123 Cosmic Way, Sector 5"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">City</label>
                      <input 
                        type="text" 
                        placeholder="Mumbai"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">State</label>
                      <input 
                        type="text" 
                        placeholder="Maharashtra"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Postal / ZIP Code</label>
                      <input 
                        type="text" 
                        placeholder="400001"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 9876543210"
                      value={shippingInfo.phoneNumber}
                      onChange={(e) => setShippingInfo({...shippingInfo, phoneNumber: e.target.value})}
                      className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-600"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 mt-4 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                /* STEP 2: PAYMENT METHOD */
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-slate-850 pb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-400" />
                    <span>Select Payment Method</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentMethodSelection("razorpay")}
                      className={`p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                        paymentMethodSelection === "razorpay" 
                          ? "bg-indigo-600/10 border-indigo-500/60 text-white shadow-lg shadow-indigo-600/5" 
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold tracking-wide uppercase text-sm">Razorpay Online</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethodSelection === "razorpay" ? "border-indigo-400" : "border-slate-600"
                        }`}>
                          {paymentMethodSelection === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pay securely using Credit/Debit Cards, UPI, Net Banking, or popular Mobile Wallets.
                      </p>
                    </div>

                    <div 
                      onClick={() => setPaymentMethodSelection("cashOnDelivery")}
                      className={`p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                        paymentMethodSelection === "cashOnDelivery" 
                          ? "bg-indigo-600/10 border-indigo-500/60 text-white shadow-lg shadow-indigo-600/5" 
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold tracking-wide uppercase text-sm">Cash on Delivery</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethodSelection === "cashOnDelivery" ? "border-indigo-400" : "border-slate-600"
                        }`}>
                          {paymentMethodSelection === "cashOnDelivery" && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pay with cash upon delivery of your cosmic essentials. Estimated delivery 3-5 days.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessingOrder}
                    className="w-full py-4 mt-6 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-650/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
                  >
                    {isProcessingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Processing Order...</span>
                      </>
                    ) : paymentMethodSelection === "razorpay" ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Pay via Razorpay (${grandTotal.toFixed(2)})</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Place Cash on Delivery Order (${grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* --- REGULAR SHOPPING CART ROW --- */
          <div className="w-full">
            {/* Breadcrumb section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-5 border-b border-slate-900/60 gap-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Cargo Inventory
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2.5">
                  <ShoppingCart className="h-7 w-7 text-indigo-400" />
                  <span>Shopping Cart</span>
                </h1>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/40 text-xs font-bold text-slate-400">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Ready
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Product Rows Column */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((cart) => (
                  <div 
                    key={cart._id}
                    className="group bg-slate-900/20 hover:bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-300 shadow-md"
                  >
                    {/* Item details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <Link 
                        to={`/product/${cart._id}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 border border-slate-900 overflow-hidden shrink-0 block relative"
                      >
                        <img 
                          src={cart.image_url} 
                          alt={cart.name} 
                          className="object-cover w-full h-full transform group-hover:scale-103 transition-transform duration-500"
                        />
                      </Link>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                          <span>{cart.brand}</span>
                          <span className="text-slate-750">•</span>
                          <span className="text-indigo-400/80">{cart.category}</span>
                        </div>
                        <Link to={`/product/${cart._id}`} className="block">
                          <h3 className="text-sm sm:text-base font-bold text-slate-200 hover:text-white transition-colors line-clamp-1 mb-1">
                            {cart.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block max-w-sm">
                          {cart.description}
                        </p>
                      </div>
                    </div>

                    {/* Price, Action controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-850/60">
                      <div className="flex items-center gap-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 text-[10px] font-bold text-slate-500 border border-slate-900 uppercase">
                          Qty: 1
                        </span>
                        <div className="text-right sm:min-w-[80px]">
                          <span className="text-xs font-semibold text-slate-550 block sm:hidden">Price</span>
                          <span className="text-base sm:text-lg font-black text-white">${cart.price}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRemove(cart._id)}
                        disabled={deletingId !== null}
                        className="p-2.5 rounded-xl border border-transparent bg-slate-950/40 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50"
                        title="Remove item"
                      >
                        {deletingId === cart._id ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-slate-900/35 border border-slate-850/60 hover:border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-3xl transition-colors duration-300">
                  <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-850/60 pb-4 mb-5">
                    Order Summary
                  </h2>

                  {/* Free shipping progress alert */}
                  {shippingCost > 0 && (
                    <div className="mb-6 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-left">
                      <div className="flex justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wide mb-1">
                        <span>Free Shipping Goal</span>
                        <span>{((subtotal / shippingThreshold) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                        <div 
                          className="bg-linear-to-r from-violet-500 to-indigo-550 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">
                        Add <span className="text-indigo-400 font-semibold">${(shippingThreshold - subtotal).toFixed(2)}</span> more for FREE shipping!
                      </p>
                    </div>
                  )}

                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="mb-6 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-left flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Free delivery applied!
                      </span>
                    </div>
                  )}

                  <div className="space-y-3.5 text-slate-400 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping Fee</span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-md">Free</span>
                      ) : (
                        <span className="text-white font-semibold">${shippingCost.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="text-white font-semibold">${estimatedTax.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-slate-850/60 pt-4 mt-4 flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-300">Total Amount</span>
                      <span className="text-xl font-extrabold text-white leading-none">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-4 mt-6 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
                  >
                    <span>Place Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Secure checkout assurances */}
                  <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-850/60">
                    <div className="flex flex-col items-center text-center text-[9px] font-medium text-slate-550 gap-1">
                      <ShieldCheck className="h-5.5 w-5.5 text-indigo-400/80" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex flex-col items-center text-center text-[9px] font-medium text-slate-550 gap-1">
                      <Truck className="h-5.5 w-5.5 text-indigo-400/80" />
                      <span>Reliable Delivery</span>
                    </div>
                    <div className="flex flex-col items-center text-center text-[9px] font-medium text-slate-550 gap-1">
                      <RotateCcw className="h-5.5 w-5.5 text-indigo-400/80" />
                      <span>Easy Returns</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;
