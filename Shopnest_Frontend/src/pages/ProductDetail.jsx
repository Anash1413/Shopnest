import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Package,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Tag,
  Check,
  Sparkles,
  SlidersHorizontal,
  Loader2,
  Trash2
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import ProductCard from '../components/ProductCard'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAdmin } = useAuth()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavourite, setIsFavourite] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
    document.title = 'Product-Details'

        const res = await fetch(`/api/product/detail/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        if (data && data.product) {
          setProduct(data.product)
          
          // Sync with backend favourites
          const token = localStorage.getItem("token")
          if (token) {
            const favRes = await fetch("/api/favourites", {
              headers: { "Authorization": `Bearer ${token}` }
            })
            if (favRes.ok) {
              const favData = await favRes.json()
              const isFav = favData.favourites?.some(item => item._id === data.product._id)
              setIsFavourite(!!isFav)
            }
          }
        } else {
          throw new Error('Product not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await dispatch(addToCart(product._id)).unwrap()
      toast.success('Item added to cart')
      if (cartItems.includes(product._id)) {
        setCartItems(cartItems.filter(item => item !== product._id))
      } else {
        setCartItems([...cartItems, product._id])
      }
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  const handleToggleFavourite = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to save favourites")
      return
    }
    try {
      const method = isFavourite ? "DELETE" : "POST"
      const res = await fetch("/api/favourites", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      })
      if (!res.ok) throw new Error("Failed to update wishlist")
      setIsFavourite(!isFavourite)
      toast.success(isFavourite ? 'Removed from saved items' : 'Saved to favourites', {
        icon: isFavourite ? '🗑️' : '❤️',
        style: {
          borderRadius: '12px',
          background: '#0f172a',
          color: '#fff',
          border: '1px border border-slate-800'
        }
      })
    } catch (err) {
      toast.error(err.message || "Could not update saved items")
    }
  }

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Product Profile?",
      text: "This operation will permanently erase this product record from the ShopNest catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      background: "#0c0f1e",
      color: "#e2e8f0",
      customClass: {
        popup: "border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl bg-slate-900/90 p-6 font-sans text-center",
        title: "text-lg font-extrabold text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-slate-400 text-xs font-semibold leading-relaxed mb-6",
        confirmButton: "px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-600/20 transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: product._id })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (err) {
      toast.error("Error deleting product: " + err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Star rendering helper
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-[2vh] w-[1.2vw] ${
            i <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : i - 0.5 <= rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-slate-600'
          }`}
        />
      )
    }
    return stars
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4 mx-auto" />
          <p className="text-slate-400 font-medium tracking-wide">Syncing product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white px-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-2">Product Mismatch</h2>
          <p className="text-slate-400 mb-6">{error || 'Product records could not be found.'}</p>
          <Link to="/" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl font-semibold transition-colors block">
            Return to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-hidden">

      {/* --- Ambient Background Nebulas --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20vh] right-[5vw] w-[50vw] h-[50vw] rounded-full bg-violet-600/8 blur-[12vw]"></div>
        <div className="absolute bottom-[-15vh] left-[0vw] w-[45vw] h-[45vw] rounded-full bg-indigo-600/6 blur-[10vw]"></div>
        <div className="absolute top-[40vh] left-[50vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[8vw]"></div>
      </div>

      <div className="relative z-10">

        {/* --- Breadcrumb / Back Nav --- */}
        <nav className="w-full px-[6vw] pt-[4vh] pb-[2vh]">
          <div className="max-w-[85vw] mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-[0.5vw] text-[3.2vw] md:text-[0.85vw] text-slate-505 hover:text-indigo-400 transition-colors font-semibold group cursor-pointer"
            >
              <ArrowLeft className="h-[1.8vh] w-[3.5vw] md:w-[1vw] group-hover:-translate-x-[0.3vw] transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
        </nav>

        {/* --- Main Product Section --- */}
        <section className="w-full px-[6vw] py-[4vh]">
          <div className="max-w-[85vw] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[6vh] lg:gap-[4vw]">

            {/* ======= LEFT: Product Image ======= */}
            <div className="lg:col-span-7 flex flex-col gap-[2vh]">
              <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-[2vw] overflow-hidden bg-slate-950/60 border border-slate-800/50 group">

                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>

                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Floating Rating Pill */}
                <div className="absolute top-[2vh] left-[1.5vw] px-[2.5vw] py-[0.8vh] md:px-[1vw] md:py-[0.6vh] rounded-[50vw] bg-black/70 backdrop-blur-xl border border-white/10 flex items-center gap-[1vw] md:gap-[0.4vw]">
                  <Star className="h-[1.6vh] w-[3vw] md:w-[1vw] text-amber-400 fill-amber-400" />
                  <span className="text-[3vw] md:text-[0.8vw] font-bold text-white">
                    {product.rating || "4.5"}
                  </span>
                  <span className="text-[2.5vw] md:text-[0.7vw] text-slate-400">
                    ({product.numReviews || "0"})
                  </span>
                </div>

                {/* Favourite Heart Button */}
                <button
                  onClick={handleToggleFavourite}
                  className={`absolute top-[2vh] right-[1.5vw] w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 cursor-pointer active:scale-90 ${
                    isFavourite
                      ? 'bg-rose-500/20 border-rose-500/40 shadow-lg shadow-rose-500/20'
                      : 'bg-black/50 border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30'
                  }`}
                  title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart
                    className={`h-[2.2vh] w-[4vw] md:w-[1.4vw] transition-all duration-300 ${
                      isFavourite
                        ? 'text-rose-500 fill-rose-500 scale-110'
                        : 'text-white/70 hover:text-rose-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* ======= RIGHT: Product Info ======= */}
            <div className="lg:col-span-5 flex flex-col gap-[3vh] text-left">

              {/* Brand & Category Badges */}
              <div className="flex items-center gap-[2vw] md:gap-[0.8vw] flex-wrap">
                <span className="px-[3vw] py-[0.6vh] md:px-[1vw] md:py-[0.5vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] md:text-[0.75vw] font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="flex items-center gap-[1vw] md:gap-[0.3vw] px-[3vw] py-[0.6vh] md:px-[1vw] md:py-[0.5vh] rounded-[50vw] bg-slate-800/50 border border-slate-700/30 text-slate-400 text-[2.8vw] md:text-[0.75vw] font-semibold">
                  <Tag className="h-[1.4vh] w-[2.5vw] md:w-[0.8vw]" />
                  {product.category}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-[7vw] md:text-[2.4vw] font-extrabold text-white leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Star Rating Row */}
              <div className="flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                <div className="flex items-center gap-[0.5vw] md:gap-[0.2vw]">
                  {renderStars(product.rating || 4.5)}
                </div>
                <span className="text-[3vw] md:text-[0.85vw] font-semibold text-slate-400">
                  {product.rating || "4.5"}
                </span>
                <span className="text-[2.8vw] md:text-[0.8vw] text-slate-600">
                  · {product.numReviews || "0"} reviews
                </span>
              </div>

              {/* Price Block */}
              <div className="flex items-end gap-[2vw] md:gap-[1vw]">
                <span className="text-[9vw] md:text-[3vw] font-black text-white tracking-tight">
                  ${product.price}
                </span>
                <span className="text-[3.5vw] md:text-[1vw] text-emerald-400 font-semibold mb-[0.8vh] md:mb-[0.5vh] flex items-center gap-[0.3vw]">
                  <Check className="h-[1.6vh] w-[3vw] md:w-[1vw]" />
                  Free shipping
                </span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

              {/* Description */}
              <div>
                <h3 className="text-[3.5vw] md:text-[0.9vw] font-bold text-slate-300 uppercase tracking-wider mb-[1.5vh]">
                  Description
                </h3>
                <p className="text-[3.2vw] md:text-[0.9vw] text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-[1.5vw] md:gap-[0.5vw]">
                <div
                  className={`w-[2.5vw] h-[2.5vw] md:w-[0.6vw] md:h-[0.6vw] rounded-full ${
                    product.stock > 0
                      ? 'bg-emerald-500 shadow-[0_0_0.8vw_rgba(16,185,129,0.4)]'
                      : 'bg-red-500 shadow-[0_0_0.8vw_rgba(239,68,68,0.4)]'
                  }`}
                ></div>
                <span
                  className={`text-[3vw] md:text-[0.85vw] font-semibold ${
                    product.stock > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-[3vw] md:gap-[1vw]">
                <span className="text-[3.2vw] md:text-[0.85vw] font-semibold text-slate-400">
                  Quantity
                </span>
                <div className="flex items-center bg-slate-900/60 border border-slate-700/50 rounded-[50vw] overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="px-[3vw] py-[1.2vh] md:px-[1vw] md:py-[0.8vh] text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Minus className="h-[1.8vh] w-[3vw] md:w-[1vw]" />
                  </button>
                  <span className="px-[4vw] md:px-[1.5vw] text-[3.5vw] md:text-[0.95vw] font-bold text-white select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-[3vw] py-[1.2vh] md:px-[1vw] md:py-[0.8vh] text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Plus className="h-[1.8vh] w-[3vw] md:w-[1vw]" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-[2vh] sm:gap-[1vw] pt-[1vh]">

                {/* Conditionally Render Edit Product or Add to Cart based on user role */}
                {isAdmin ? (
                  <div className="flex-1 flex gap-3">
                    <Link
                      to={`/admin/add-product?editing=true&id=${product._id}`}
                      className="flex-1 flex items-center justify-center gap-[2vw] md:gap-[0.6vw] px-[4vw] py-[2vh] md:px-[2vw] md:py-[1.6vh] rounded-[50vw] bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-[3.5vw] md:text-[0.95vw] shadow-lg shadow-indigo-600/25 hover:shadow-indigo-550/40 transition-all duration-300 transform active:scale-[0.97] cursor-pointer"
                    >
                      <SlidersHorizontal className="h-[2.2vh] w-[4vw] md:w-[1.2vw]" />
                      <span>Edit Settings</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-[2vw] md:gap-[0.6vw] px-[4vw] py-[2vh] md:px-[2vw] md:py-[1.6vh] rounded-[50vw] bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/20 hover:border-rose-500/30 text-rose-450 font-bold text-[3.5vw] md:text-[0.95vw] transition-all duration-300 transform active:scale-[0.97] disabled:opacity-40 cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-[2.2vh] w-[4vw] md:w-[1.2vw] animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-[2.2vh] w-[4vw] md:w-[1.2vw]" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 flex items-center justify-center gap-[2vw] md:gap-[0.6vw] px-[6vw] py-[2vh] md:px-[2.5vw] md:py-[1.6vh] rounded-[50vw] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-[3.5vw] md:text-[0.95vw] shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all duration-300 transform active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-indigo-600/25 cursor-pointer"
                  >
                    <ShoppingCart className="h-[2.2vh] w-[4vw] md:w-[1.2vw]" />
                    <span>Add to Cart</span>
                  </button>
                )}

                {/* Favourite Button (Mobile-friendly alternate) */}
                <button
                  onClick={handleToggleFavourite}
                  className={`flex items-center justify-center gap-[2vw] md:gap-[0.5vw] px-[6vw] py-[2vh] md:px-[2vw] md:py-[1.6vh] rounded-[50vw] border font-bold text-[3.5vw] md:text-[0.95vw] transition-all duration-300 transform active:scale-[0.97] cursor-pointer ${
                    isFavourite
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-450 hover:bg-rose-500/25'
                      : 'bg-white/[0.03] border-white/10 text-slate-350 hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <Heart
                    className={`h-[2.2vh] w-[4vw] md:w-[1.2vw] ${
                      isFavourite ? 'fill-rose-450 text-rose-400' : ''
                    }`}
                  />
                  <span className="sm:hidden md:inline">
                    {isFavourite ? 'Saved' : 'Save'}
                  </span>
                </button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-[2vh] md:gap-[1vw] mt-[1vh]">
                <div className="flex items-center gap-[2vw] md:gap-[0.5vw] p-[2.5vw] md:p-[0.8vw] rounded-[1.2vw] bg-slate-900/30 border border-slate-800/30">
                  <Truck className="h-[2vh] w-[4vw] md:w-[1.2vw] text-indigo-400 shrink-0" />
                  <span className="text-[2.6vw] md:text-[0.75vw] text-slate-400 font-semibold">
                    Free Delivery
                  </span>
                </div>
                <div className="flex items-center gap-[2vw] md:gap-[0.5vw] p-[2.5vw] md:p-[0.8vw] rounded-[1.2vw] bg-slate-900/30 border border-slate-800/30">
                  <Shield className="h-[2vh] w-[4vw] md:w-[1.2vw] text-emerald-400 shrink-0" />
                  <span className="text-[2.6vw] md:text-[0.75vw] text-[#e2e8f0] font-semibold">
                    Secure Payment
                  </span>
                </div>
                <div className="flex items-center gap-[2vw] md:gap-[0.5vw] p-[2.5vw] md:p-[0.8vw] rounded-[1.2vw] bg-slate-900/30 border border-slate-800/30">
                  <RotateCcw className="h-[2vh] w-[4vw] md:w-[1.2vw] text-cyan-400 shrink-0" />
                  <span className="text-[2.6vw] md:text-[0.75vw] text-slate-400 font-semibold">
                    Easy Returns
                  </span>
                </div>
                <div className="flex items-center gap-[2vw] md:gap-[0.5vw] p-[2.5vw] md:p-[0.8vw] rounded-[1.2vw] bg-slate-900/30 border border-slate-800/30">
                  <Package className="h-[2vh] w-[4vw] md:w-[1.2vw] text-violet-400 shrink-0" />
                  <span className="text-[2.6vw] md:text-[0.75vw] text-slate-400 font-semibold">
                    Premium Quality
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 px-24 gap-7 lg:grid-cols-3">
        <ProductCard limit={3} />
      </div>
    </div>
  )
}

export default ProductDetail;