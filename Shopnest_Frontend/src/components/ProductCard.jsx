import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  User, 
  LogOut, 
  SlidersHorizontal, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Heart, 
  Loader2,
  ShoppingBag,
  Check,
  Tag
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ProductCard =  ({limit, products}) => {
  const { isAdmin } = useAuth();
  const [favourites, setFavourites] = useState([])
  const [cartItems, setCartItems] = useState([])
  const dispatch = useDispatch()
  const handleaddtocart = async (id)=>{
         try {
           await dispatch(addToCart(id))
          toast.success('item added to cart')
        
         } catch (error) {
          toast.error('Error',error)
         }

  }

  const { data: fetchedData, isLoading: fetchLoading, error: fetchError } =  useFetch('/api/product/', {
    method: 'GET',
    // headers:{'Authorization':`Bearer ${token}`}
  })

  // Use products prop directly if provided, otherwise fallback to API fetch
  const data = products ? { products } : fetchedData;
  const isLoading = products ? false : fetchLoading;
  const error = products ? null : fetchError;
  let displaylist = null

  return (
    <>
      {error && (
        <div>
          <h1>error occurred : "{error.message || error}"</h1>
        </div>
      )}
      {isLoading ? (
        <div>
          data is fetching .....
        </div>
      ) : (
        data && (displaylist = limit ? data.products.slice(0,limit) : data.products,
        displaylist.map((product, index) => (
          <div key={index}>
            <div
              key={product._id}
              className="group relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-5 transition-all duration-[300ms] hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between h-full"
            >
              <div>
                {/* Favourite Heart Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (favourites.includes(product._id)) {
                      setFavourites(favourites.filter(id => id !== product._id))
                    } else {
                      setFavourites([...favourites, product._id])
                    }
                  }}
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xl border z-10 transition-all duration-300 cursor-pointer active:scale-90 ${
                    favourites.includes(product._id)
                      ? 'bg-rose-500/25 border-rose-500/40 shadow-lg shadow-rose-500/15'
                      : 'bg-black/50 border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30'
                  }`}
                  title={favourites.includes(product._id) ? 'Remove from Favourites' : 'Add to Favourites'}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-300 ${
                      favourites.includes(product._id)
                        ? 'text-rose-500 fill-rose-500 scale-110'
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="block relative aspect-square w-full bg-slate-950 rounded-xl overflow-hidden mb-4 border border-slate-800/30">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-[500ms] ease-out"
                  />
                </Link>

                {/* Brand & Category */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span>{product.brand}</span>
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <Link to={`/product/${product._id}`} className="block">
                  <h3 className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-400">
                    {product.rating} <span className="text-slate-600">({product.numReviews})</span>
                  </span>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block uppercase tracking-wider">Price</span>
                  <span className="text-base sm:text-lg font-extrabold text-white">${product.price}</span>
                </div>
                {isAdmin ? (
                  <Link
                    to={`/admin/add-product?editing=true&id=${product._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-650/10 hover:bg-indigo-650 text-indigo-400 hover:text-white transition-all duration-300 cursor-pointer shadow-md"
                    title="Edit Product"
                  >
                    <SlidersHorizontal className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </Link>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleaddtocart(product._id)
                      if (cartItems.includes(product._id)) {
                        setCartItems(cartItems.filter(id => id !== product._id))
                      } else {
                        setCartItems([...cartItems, product._id])
                      }
                    }}
                    className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer border ${
                      cartItems.includes(product._id)
                        ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-450 hover:bg-emerald-600/30 shadow-emerald-600/5'
                        : 'bg-indigo-600 border border-indigo-500/20 hover:bg-indigo-500 text-white shadow-indigo-600/10 hover:shadow-indigo-600/20'
                    }`}
                    title={cartItems.includes(product._id) ? 'Remove from Cart' : 'Add to Cart'}
                  >
                    {cartItems.includes(product._id) ? (
                      <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    ) : (
                      <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )))
      )}
    </>
  );
};

export default ProductCard;