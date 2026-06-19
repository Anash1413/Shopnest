import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  BadgeDollarSign,
  Boxes,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  PackagePlus,
  PencilLine,
  Save,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

const initialProduct = {
  name: "",
  price: "",
  description: "",
  category: "",
  brand: "",
  stock: "",
  rating: "4.5",
  numReviews: "0",
};

const categories = ["Audio", "Electronics", "Wearables", "Accessories", "Home"];

const fieldShell =
  "w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15";

const labelShell = "text-xs font-bold uppercase tracking-wide text-slate-400";

function AddProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef("");

  const isEditing = searchParams.get("editing") === "true";
  const productId = searchParams.get("id");

  const [form, setForm] = useState(initialProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const title = isEditing ? "Edit Product" : "Add Product";
  const submitLabel = isEditing ? "Save Changes" : "Create Product";

  const completion = useMemo(() => {
    const requiredFields = ["name", "price", "description", "category", "brand", "stock"];
    const completedFields = requiredFields.filter((field) => String(form[field]).trim()).length;
    const imageReady = isEditing ? Boolean(existingImageUrl || imageFile) : Boolean(imageFile);
    return Math.round(((completedFields + (imageReady ? 1 : 0)) / (requiredFields.length + 1)) * 100);
  }, [existingImageUrl, form, imageFile, isEditing]);

  useEffect(() => {
    if (!isEditing || !productId) {
      return;
    }

    const loadProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await fetch(`/api/product/detail/${productId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        const product = data.product;
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = "";
        }
        setForm({
          name: product.name || "",
          price: product.price ?? "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock ?? "",
          rating: product.rating ?? "4.5",
          numReviews: product.numReviews ?? "0",
        });
        setExistingImageUrl(product.image_url || "");
        setImagePreview(product.image_url || "");
        setImageFile(null);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [isEditing, productId]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(objectUrlRef.current);
  };

  const clearSelectedImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
    setImageFile(null);
    setImagePreview(existingImageUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.brand.trim()) return "Brand name is required";
    if (!form.category) return "Category is required";
    if (!form.description.trim() || form.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0";
    if (form.stock === "" || Number(form.stock) < 0) return "Stock cannot be negative";
    if (!isEditing && !imageFile) return "Please choose a product image";
    return "";
  };

  const buildProductFormData = () => {
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("price", String(Number(form.price)));
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("brand", form.brand.trim());
    payload.append("stock", String(Number(form.stock)));
    payload.append("rating", String(Number(form.rating || 0)));
    payload.append("numReviews", String(Number(form.numReviews || 0)));

    if (imageFile) {
      payload.append("image_url", imageFile);
    }

    if (isEditing) {
      payload.append("id", productId);
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again before saving");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/product/", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: buildProductFormData(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to save product");
      }

      toast.success(isEditing ? "Product updated" : "Product created");
      navigate("/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  
  const handleDelete = async () => {
    if (!isEditing || !productId) return;

    const result = await Swal.fire({
      title: "Delete this product?",
      text: "This product will be permanently removed from the catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Product",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0f172a",
      color: "#e2e8f0",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-lg border border-slate-800 p-6",
        confirmButton:
          "ml-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500",
        cancelButton:
          "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800",
      },
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again before deleting");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/product/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success("Product deleted");
      navigate("/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-sm font-semibold text-slate-400">Loading product details</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-900 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Catalog
              </div>
              <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Build a complete catalog record with clean product data, image upload, and inventory details.
              </p>
            </div>

            <div className="w-full max-w-xs">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
                <span>Ready</span>
                <span>{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-900">
                <div
                  className="h-2 rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} enctype="multipart/form-data" className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <section className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className={labelShell}>Product Image</span>
              {imageFile && (
                <button
                  type="button"
                  onClick={clearSelectedImage}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:border-slate-700 hover:text-white"
                  aria-label="Clear selected image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-700 bg-slate-950 text-left transition hover:border-cyan-400"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/70 opacity-0 transition group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-950">
                      <Camera className="h-4 w-4" />
                      Change Image
                    </span>
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-cyan-300">
                    <ImagePlus className="h-7 w-7" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">Upload product image</span>
                    <span className="mt-1 block text-xs text-slate-500">JPG, PNG, or WEBP</span>
                  </span>
                </span>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <UploadCloud className="h-4 w-4 text-cyan-300" />
              <span>{imageFile ? imageFile.name : isEditing ? "Current image will stay unless replaced" : "Required for new products"}</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <span className={labelShell}>Checklist</span>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              {[
                ["Name", form.name],
                ["Pricing", form.price],
                ["Category", form.category],
                ["Inventory", form.stock !== ""],
                ["Image", isEditing ? existingImageUrl || imageFile : imageFile],
              ].map(([label, done]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}`}>
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900/40 p-5 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className={labelShell}>Product Name</span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Wireless studio headphones"
                className={fieldShell}
              />
            </label>

            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <BadgeDollarSign className="h-4 w-4 text-cyan-300" />
                Price
              </span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
                placeholder="149.00"
                className={fieldShell}
              />
            </label>

            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Boxes className="h-4 w-4 text-cyan-300" />
                Stock
              </span>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={updateField}
                placeholder="25"
                className={fieldShell}
              />
            </label>

            <label className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Tag className="h-4 w-4 text-cyan-300" />
                Brand
              </span>
              <input
                name="brand"
                value={form.brand}
                onChange={updateField}
                placeholder="ShopNest"
                className={fieldShell}
              />
            </label>

            <label className="space-y-2">
              <span className={labelShell}>Category</span>
              <select name="category" value={form.category} onChange={updateField} className={fieldShell}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className={labelShell}>Rating</span>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={updateField}
                className={fieldShell}
              />
            </label>

            <label className="space-y-2">
              <span className={labelShell}>Reviews</span>
              <input
                name="numReviews"
                type="number"
                min="0"
                value={form.numReviews}
                onChange={updateField}
                className={fieldShell}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className={labelShell}>Description</span>
              <textarea
                name="description"
                rows="6"
                value={form.description}
                onChange={updateField}
                placeholder="Add materials, specs, fit, care notes, and anything shoppers should know."
                className={`${fieldShell} resize-none leading-6`}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-900 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-900/70 px-4 py-3 text-sm font-bold text-rose-300 transition hover:border-rose-500 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete Product
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <PackagePlus className="h-4 w-4" />
                )}
                {saving ? "Saving" : submitLabel}
              </button>
            </div>
          </div>
        </section>
      </form>

      {isEditing && (
        <div className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-600 sm:px-6 lg:px-8">
          <PencilLine className="mr-1 inline h-3.5 w-3.5" />
          Editing product ID: {productId}
        </div>
      )}
    </main>
  );
}

export default AddProduct;
