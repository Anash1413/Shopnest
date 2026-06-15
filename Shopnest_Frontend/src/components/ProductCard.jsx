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

const ProductCard = () => {
  const { data, isLoading, error } = useFetch('api/product/', {
    method: 'GET',
    // headers:{'Authorization':`Bearer ${token}`}
  });

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
        data?.products?.map((product, index) => (
          <div key={index}>
            <div
              key={product._id}
              className="group relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 rounded-[1.5vw] p-[1vw] transition-all duration-[300ms] hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              {/* Heart Button */}

              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block relative aspect-square w-full bg-slate-950 rounded-[1vw] overflow-hidden mb-[1.5vh] border border-slate-800/30">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-[500ms] ease-out"
                />
              </Link>

              {/* Brand & Category */}
              <div className="flex items-center justify-between text-[0.8vw] font-bold text-slate-500 uppercase tracking-widest mb-[0.7vh]">
                <span>{product.brand}</span>
                <span className="flex items-center gap-[0.3vw] text-indigo-400">
                  <Tag className="h-[1.5vh] w-[1vw]" />
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <Link to={`/product/${product._id}`} className="block">
                <h3 className="text-[1vw] font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1 mb-[0.8vh]">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-[0.4vw] mb-[2vh]">
                <div className="flex items-center text-amber-500">
                  <Star className="h-[1.6vh] w-[1.1vw] fill-current" />
                </div>
                <span className="text-[0.8vw] font-semibold text-slate-400">
                  {product.rating} <span className="text-slate-600">({product.numReviews})</span>
                </span>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-[1.2vh] border-t border-slate-800/50">
                <div>
                  <span className="text-[0.7vw] font-semibold text-slate-500 block">Price</span>
                  <span className="text-[1.3vw] font-extrabold text-white">${product.price}</span>
                </div>
                <button
                  className="flex items-center justify-center p-[0.7vw] rounded-[1vw] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-[300ms] transform active:scale-95"
                  title="Add to Cart"
                >
                  <Plus className="h-[2vh] w-[1.2vw]" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default ProductCard;