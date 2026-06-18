import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { 
  Package, 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Layers, 
  Tag, 
  Database,
  Trash2,
  AlertTriangle
} from "lucide-react";

function AddProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isEditing = searchParams.get("editing") === "true";
  const productId = searchParams.get("id");

  // React Hook Form initialization
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      rating: "4.5",
      numReviews: "0"
    }
  });

  // Image states (kept separate as they deal with File uploads & previews)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Loading states
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditing && productId) {
      const fetchProductDetails = async () => {
        setIsFetchingData(true);
        try {
          const res = await fetch(`/api/product/detail/${productId}`);
          if (!res.ok) throw new Error("Failed to fetch product details");
          const data = await res.json();
          
          if (data && data.product) {
            const prod = data.product;
            reset({
              name: prod.name || "",
              price: prod.price || "",
              description: prod.description || "",
              category: prod.category || "",
              brand: prod.brand || "",
              stock: prod.stock || "",
              rating: prod.rating || "4.5",
              numReviews: prod.numReviews || "0"
            });
            setCurrentImageUrl(prod.image_url || "");
            setImagePreview(prod.image_url || "");
          }
        } catch (err) {
          toast.error("Error loading product: " + err.message);
          console.error(err);
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchProductDetails();
    }
  }, [isEditing, productId, reset]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    if (!isEditing && !imageFile) {
      toast.error("Please upload a product image");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    // Append product fields from react-hook-form data
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock);
    formData.append("rating", data.rating);
    formData.append("numReviews", data.numReviews);

    if (imageFile) {
      formData.append("image_url", imageFile); // Multipart upload name expected by backend multer
    }

    if (isEditing) {
      formData.append("id", productId); // Backend expects req.body.id in updateProductById
    }

    try {
      const url = "/api/product/";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Server responded with status ${res.status}`);
      }

      toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => {
        navigate("/products");
      }, 1000);

    } catch (err) {
      toast.error(err.message || "Failed to process product command");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        body: JSON.stringify({ id: productId })
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
  };

  return (
    <div className="min-h-screen bg-[#070913] text-[#e2e8f0] flex flex-col font-sans overflow-x-hidden relative">
      {/* Background glowing effects */}
      <div className="absolute top-[-10vh] left-[5vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/5 blur-[12vw] pointer-events-none"></div>
      <div className="absolute bottom-[10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/4 blur-[12vw] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full z-10 relative flex-1 flex flex-col justify-center">
        
        {/* Back navigation button */}
        <button 
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-1.5 text-xs text-slate-450 hover:text-slate-200 mb-6 transition-colors font-semibold uppercase tracking-wider bg-slate-900/30 px-3.5 py-2 rounded-xl border border-slate-800/40 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>

        {isFetchingData ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium tracking-wide">Retrieving product record from databank...</p>
          </div>
        ) : (
          <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-3xl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850/60 pb-5 mb-8 gap-4">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Admin Terminal</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2.5">
                  <Package className="h-7 w-7 text-indigo-400" />
                  <span>{isEditing ? "Modify Product Profile" : "Register Product"}</span>
                </h1>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {isEditing ? `ID: ${productId}` : "STATUS: NEW RECORD"}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Upload area & Preview image */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase text-slate-450 tracking-wider">Product Visual</span>
                  
                  <div className="relative group aspect-square w-full rounded-2xl bg-slate-950/60 border-2 border-dashed border-slate-850 hover:border-indigo-500/40 overflow-hidden flex flex-col items-center justify-center transition-all">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                          <Upload className="h-8 w-8 text-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Change Artwork</span>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center flex flex-col items-center gap-2 text-slate-500">
                        <ImageIcon className="h-12 w-12 text-slate-700 animate-pulse" />
                        <span className="text-sm font-semibold">Select digital asset</span>
                        <span className="text-[10px] text-slate-600">Supports PNG, JPG, WEBP</span>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  
                  {isEditing && currentImageUrl && !imageFile && (
                    <p className="text-[10px] text-slate-555 text-center font-mono">
                      Rendering live copy from Cloudinary database.
                    </p>
                  )}
                </div>

                {/* Right side: Input text details */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Space Capsule Speaker v2"
                      className={`w-full bg-slate-950/60 border ${errors.name ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-650`}
                      {...register("name", { required: "Product Name is required" })}
                    />
                    {errors.name && (
                      <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>{errors.name.message}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-slate-500" />
                        <span>Price ($) *</span>
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="149.00"
                        className={`w-full bg-slate-950/60 border ${errors.price ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-650`}
                        {...register("price", { 
                          required: "Price is required",
                          min: { value: 0.01, message: "Price must be greater than 0" }
                        })}
                      />
                      {errors.price && (
                        <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{errors.price.message}</span>
                        </span>
                      )}
                    </div>

                    {/* Stock field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider flex items-center gap-1">
                        <Database className="h-3 w-3 text-slate-500" />
                        <span>Stock Unit *</span>
                      </label>
                      <input 
                        type="number" 
                        placeholder="25"
                        className={`w-full bg-slate-950/60 border ${errors.stock ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-650`}
                        {...register("stock", { 
                          required: "Stock is required",
                          min: { value: 0, message: "Stock cannot be negative" }
                        })}
                      />
                      {errors.stock && (
                        <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{errors.stock.message}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Brand field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider flex items-center gap-1">
                        <Tag className="h-3 w-3 text-slate-500" />
                        <span>Brand Name *</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. ShopNest Tech"
                        className={`w-full bg-slate-950/60 border ${errors.brand ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-650`}
                        {...register("brand", { required: "Brand name is required" })}
                      />
                      {errors.brand && (
                        <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{errors.brand.message}</span>
                        </span>
                      )}
                    </div>

                    {/* Category field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase text-slate-450 tracking-wider flex items-center gap-1">
                        <Layers className="h-3 w-3 text-slate-500" />
                        <span>Category *</span>
                      </label>
                      <select 
                        className={`w-full bg-slate-950/60 border ${errors.category ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm cursor-pointer`}
                        {...register("category", { required: "Category is required" })}
                      >
                        <option value="" disabled className="bg-slate-950 text-slate-500">Select Category</option>
                        <option value="Audio" className="bg-slate-950 text-white">Audio</option>
                        <option value="Electronics" className="bg-slate-950 text-white">Electronics</option>
                        <option value="Wearables" className="bg-slate-950 text-white">Wearables</option>
                        <option value="Accessories" className="bg-slate-950 text-white">Accessories</option>
                        <option value="Home" className="bg-slate-950 text-white">Home</option>
                      </select>
                      {errors.category && (
                        <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{errors.category.message}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-slate-450 tracking-wider">Product Description *</label>
                    <textarea 
                      placeholder="Explain features, specs, design values, materials..."
                      rows="4"
                      className={`w-full bg-slate-950/60 border ${errors.description ? "border-rose-500/70 focus:border-rose-500" : "border-slate-850 hover:border-slate-800 focus:border-indigo-500"} text-white rounded-xl focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none p-3.5 text-sm placeholder-slate-650 resize-none`}
                      {...register("description", { 
                        required: "Description is required",
                        minLength: { value: 10, message: "Description must be at least 10 characters long" }
                      })}
                    ></textarea>
                    {errors.description && (
                      <span className="text-rose-400 text-[10px] font-bold tracking-wide flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>{errors.description.message}</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit and Delete buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isDeleting}
                  className="flex-1 py-4 rounded-xl bg-linear-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 disabled:from-slate-855 disabled:to-slate-900 disabled:text-slate-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/25 hover:shadow-indigo-650/40 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Saving Product Log...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>{isEditing ? "Update Product Log" : "Confirm Product Log"}</span>
                    </>
                  )}
                </button>

                {isEditing && (
                  <button 
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting || isDeleting}
                    className="py-4 px-6 rounded-xl bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/20 hover:border-rose-500/30 disabled:border-slate-855 disabled:bg-slate-950 disabled:text-slate-550 text-rose-400 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4.5 w-4.5" />
                        <span>Delete Product</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddProduct;
