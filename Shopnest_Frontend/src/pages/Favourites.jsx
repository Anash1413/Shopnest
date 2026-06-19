import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Tag,
  Trash2,
  Sparkles,
  Loader2,
  ShoppingBag,
  Check,
  Plus,
  Star
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import toast from 'react-hot-toast'

function Favourites() {
  const dispatch = useDispatch()
  const [favourites, setFavourites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const token = localStorage.getItem('token')

  const fetchFavourites = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/favourites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to load favourites')
      const data = await res.json()
      setFavourites(data.favourites || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Saved Items | ShopNest'
    if (token) {
      fetchFavourites()
    } else {
      setError('Please log in to view favourites.')
      setIsLoading(false)
    }
  }, [token])

  const handleRemoveFavourite = async (productId) => {
    try {
      const res = await fetch('/api/favourites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })
      if (!res.ok) throw new Error('Failed to remove from wishlist')
      setFavourites(prev => prev.filter(item => item._id !== productId))
      toast.success('Removed from saved items', {
        icon: '🗑️',
        style: {
          borderRadius: '12px',
          background: '#0f172a',
          color: '#fff',
          border: '1px border border-slate-800'
        }
      })
    } catch (err) {
      toast.error(err.message || 'Could not update saved items')
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart(productId)).unwrap()
      toast.success('Item added to cart')
      setCartItems([...cartItems, productId])
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-clip relative">
      
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10vh] left-[5vw] w-[45vw] h-[45vw] rounded-full bg-rose-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[-10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
      </div>

      <div className="relative z-10 max-w-[85vw] mx-auto py-[6vh] pt-[15vh]">
        
        {/* Navigation Back */}
        <Link
          to="/profile"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-bold uppercase text-slate-400 tracking-wider transition hover:border-slate-700 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>

        {/* Page Header */}
        <header className="mb-[6vh] flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-[4vh] gap-[2vh]">
          <div className="flex flex-col items-start gap-[1vh]">
            <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[2.8vw] md:text-[0.75vw] font-bold tracking-widest uppercase inline-flex items-center gap-[0.4vw]">
              <Sparkles className="h-[1.5vh] w-[1.2vw] text-rose-450 fill-rose-450/20" />
              <span>Wishlist Vault</span>
            </div>
            <h1 className="text-[8vw] md:text-[3.2vw] font-extrabold text-white tracking-tight uppercase leading-none mt-2">
              Your Saved <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-300 to-violet-400">Favourites</span>
            </h1>
          </div>
          <p className="text-[3.5vw] md:text-[1vw] text-slate-505 max-w-[85vw] md:max-w-[30vw] leading-relaxed">
            Keep track of items you love. Add them to your cart directly, or remove them when you change your mind.
          </p>
        </header>

        {/* Content Section */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-[15vh] gap-3">
              <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Syncing favorites...</span>
            </div>
          ) : error ? (
            <div className="text-center py-[10vh] border border-rose-500/15 rounded-[2.5vw] bg-rose-950/10 p-8 max-w-lg mx-auto">
              <h3 className="text-rose-450 font-extrabold text-lg mb-2">Failed to load Favourites</h3>
              <p className="text-rose-400/85 text-sm mb-6 font-semibold">{error}</p>
              <button 
                onClick={fetchFavourites}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs uppercase tracking-wider"
              >
                Retry Fetch
              </button>
            </div>
          ) : favourites.length === 0 ? (
            <div className="text-center py-[12vh] border border-white/[0.03] rounded-[2vw] bg-slate-900/10 backdrop-blur-md p-8 max-w-lg mx-auto flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-rose-500/10 blur-xl rounded-full scale-120 animate-pulse"></div>
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-rose-400 backdrop-blur-md relative">
                  <Heart className="h-7 w-7 text-rose-400" />
                </div>
              </div>
              <h3 className="text-white font-extrabold text-xl mb-2">No saved items yet</h3>
              <p className="text-slate-455 text-sm leading-relaxed mb-8">
                Your wishlist is empty. Explore our catalog of designed essentials to add products to your favorites.
              </p>
              <Link 
                to="/products"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-rose-600 to-violet-650 hover:from-rose-500 hover:to-violet-550 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-rose-650/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favourites.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-[#0c0f1e]/40 hover:bg-[#0c0f1e]/80 border border-white/[0.05] hover:border-rose-500/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/5 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Delete Heart Button */}
                    <button
                      onClick={() => handleRemoveFavourite(product._id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-white/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer active:scale-90 z-10"
                      title="Remove from Saved Items"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} className="block relative aspect-square w-full bg-slate-950 rounded-xl overflow-hidden mb-4 border border-white/[0.03]">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full transform group-hover:scale-103 transition-transform duration-500"
                      />
                    </Link>

                    {/* Brand & Category */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      <span>{product.brand}</span>
                      <span className="flex items-center gap-1 text-rose-455">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-450" />
                      <span className="text-xs font-semibold text-slate-400">
                        {product.rating} <span className="text-slate-600">({product.numReviews})</span>
                      </span>
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-505 block uppercase tracking-wider">Price</span>
                      <span className="text-base font-extrabold text-white">${product.price}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className={`flex items-center justify-center p-2 rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer border ${
                        cartItems.includes(product._id)
                          ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-450'
                          : 'bg-rose-600/10 border border-rose-500/20 hover:bg-rose-500 text-white'
                      }`}
                      title={cartItems.includes(product._id) ? 'Added to Cart' : 'Add to Cart'}
                    >
                      {cartItems.includes(product._id) ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
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

export default Favourites
