
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

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


function Home() {
 

  return(
    <>
     <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-auto ">

    <ProductCard />
    </div>
    </>
  )
  
}

export default Home;