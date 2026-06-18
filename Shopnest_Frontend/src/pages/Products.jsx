import React, { useState } from 'react'
import ProductCard from '../components/ProductCard'
import useFetch from '../hooks/useFetch'
import {
  Search,
  Check,
  Sparkles,
  ChevronDown,
  X,
  ArrowUpDown,
  Sliders
} from 'lucide-react'

function Products() {
  // --- FILTERS & STATE (For styling/demo interaction) ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState(250)
  const [sortBy, setSortBy] = useState('Featured')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isBrandCollapsed, setIsBrandCollapsed] = useState(true)

  const sortOptions = [
    { value: 'Featured', label: 'Featured' },
    { value: 'PriceLowToHigh', label: 'Price: Low to High' },
    { value: 'PriceHighToLow', label: 'Price: High to Low' },
    { value: 'TopRated', label: 'Top Rated' }
  ]
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Featured'

  const categories = ['All', 'Electronics', 'Home & Living', 'Accessories', 'Fitness']
  const brands = ['All', 'SoundWave', 'AuraStyle', 'ApexGear', 'Lumina', 'FitTrack']

  const { data, isLoading, error } = useFetch('/api/product/')

  // Apply filtering and sorting dynamically
  const getFilteredProducts = () => {
    if (!data || !data.products) return []

    let filtered = [...data.products]

    // 1. Search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
      )
    }

    // 2. Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // 3. Brand filter
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase())
    }

    // 4. Price range filter
    filtered = filtered.filter(p => p.price <= priceRange)

    // 5. Sorting
    if (sortBy === 'PriceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'PriceHighToLow') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'TopRated') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200 font-sans overflow-x-clip relative">
      
      {/* Ambient background glow meshes (Cosmic Theme) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10vh] left-[5vw] w-[45vw] h-[45vw] rounded-full bg-violet-600/5 blur-[10vw]"></div>
        <div className="absolute bottom-[-10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/5 blur-[10vw]"></div>
        <div className="absolute top-[40vh] left-[35vw] w-[30vw] h-[30vw] rounded-full bg-indigo-600/4 blur-[8vw]"></div>
      </div>

      <div className="relative z-10 max-w-[85vw] mx-auto py-[6vh]">
        
        {/* --- PAGE HEADER --- */}
        <header className="mb-[6vh] flex flex-col md:flex-row md:items-end justify-between border-b border-white/4 pb-[4vh] gap-[2vh]">
          <div className="flex flex-col items-start gap-[1vh]">
            <div className="px-[1.5vw] py-[0.6vh] rounded-[50vw] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[2.8vw] md:text-[0.75vw] font-bold tracking-widest uppercase inline-flex items-center gap-[0.4vw]">
              <Sparkles className="h-[1.5vh] w-[1.2vw] text-indigo-400 fill-indigo-400/20" />
              <span>ShopNest Catalog</span>
            </div>
            <h1 className="text-[8vw] md:text-[3.2vw] font-extrabold text-white tracking-tight uppercase leading-none">
              Premium <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-indigo-200 to-cyan-400">Releases</span>
            </h1>
          </div>
          <p className="text-[3.5vw] md:text-[1vw] text-slate-500 max-w-[85vw] md:max-w-[30vw] leading-relaxed">
            Browse our curated high-fidelity items. Designed for aesthetic precision, tactile satisfaction, and effortless performance.
          </p>
        </header>

        <div className="relative flex flex-col gap-[4vh] lg:flex-row lg:items-start lg:gap-[3vw]">
          
          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block scrollbar-none lg:w-[22vw] lg:shrink-0 bg-slate-900/20 border border-white/4 rounded-[2vw] p-[2vw] backdrop-blur-md sticky top-30 h-fit max-h-[calc(100vh-160px)] overflow-y-auto z-10">
            <div className="flex items-center justify-between mb-[3.5vh] pb-[1.5vh] border-b border-white/4">
              <h2 className="text-[1.1vw] font-bold text-white tracking-wide uppercase flex items-center gap-[0.5vw]">
                <Sliders className="h-[2vh] w-[1.2vw] text-indigo-400" />
                <span>Filters</span>
              </h2>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedBrand('All')
                  setPriceRange(250)
                }}
                className="text-[0.85vw] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Search Input Widget */}
            <div className="mb-[4vh]">
              <label className="block text-[0.85vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh]">
                Search Product
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-[1.2vw] py-[1.2vh] pl-[3vw] pr-[1vw] text-[0.9vw] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <Search className="absolute left-[1vw] top-1/2 -translate-y-1/2 h-[1.8vh] w-[1.1vw] text-slate-500" />
              </div>
            </div>

            {/* Categories Widget */}
            <div className="mb-[4vh]">
              <label className="block text-[0.85vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh]">
                Category
              </label>
              <div className="flex flex-col gap-[1vh]">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left px-[1.2vw] py-[1vh] rounded-[1vw] text-[0.85vw] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-300'
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/2'
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <Check className="h-[1.5vh] w-[1vw] text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Widget */}
            <div className="mb-[4vh] border-b border-white/3 pb-[2.5vh]">
              <button
                onClick={() => setIsBrandCollapsed(!isBrandCollapsed)}
                className="w-full flex items-center justify-between text-[0.85vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh] cursor-pointer focus:outline-none select-none hover:text-slate-350 transition-colors"
              >
                <span>Brand</span>
                <ChevronDown className={`h-[1.5vh] w-[1vw] text-slate-500 transition-transform duration-300 ${isBrandCollapsed ? '-rotate-90' : ''}`} />
              </button>
              
              <div 
                className={`flex flex-col gap-[1vh] overflow-hidden transition-all duration-300 ${
                  isBrandCollapsed 
                    ? 'max-h-0 opacity-0 pointer-events-none' 
                    : 'max-h-[30vh] opacity-100'
                }`}
              >
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-left px-[1.2vw] py-[1vh] rounded-[1vw] text-[0.85vw] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedBrand === brand
                        ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-300'
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/2'
                    }`}
                  >
                    <span>{brand}</span>
                    {selectedBrand === brand && <Check className="h-[1.5vh] w-[1vw] text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-[1.5vh]">
                <label className="text-[0.85vw] font-bold text-slate-400 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-[1vw] font-extrabold text-white">${priceRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-indigo-500 h-[0.6vh] bg-slate-900 rounded-[50vw] cursor-pointer"
              />
              <div className="flex justify-between text-[0.75vw] text-slate-650 mt-[1vh] font-semibold">
                <span>$10</span>
                <span>$300</span>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CATALOG CONTENT ================= */}
          <main className="w-full min-w-0 flex-1 flex flex-col gap-[4vh]">
            
            {/* --- CONTROLS / SORTING BAR --- */}
            <div className="bg-slate-900/10 border border-white/3 rounded-[1.5vw] p-[1.5vw] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-[2vh]">
              
              {/* Product Counter / Filter pill overview */}
              <div className="text-[3.5vw] sm:text-[0.9vw] text-slate-450 font-semibold">
                Showing <span className="text-white font-extrabold">{filteredProducts.length}</span> Products
              </div>

              {/* Sort selector & Mobile filter trigger */}
              <div className="flex items-center justify-end w-full sm:w-auto gap-[2.5vw] sm:gap-[1vw]">
                
                {/* Mobile Filter Button (only visible below lg breakpoint) */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden px-[4vw] py-[1.2vh] rounded-[50vw] bg-white/3 border border-white/10 text-slate-350 hover:bg-white/8 transition-colors flex items-center gap-[1.5vw] text-[3.2vw] font-bold cursor-pointer"
                >
                  <Sliders className="h-[1.8vh] w-[3.5vw]" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-[1.5vw] sm:gap-[0.5vw] relative z-20">
                  <ArrowUpDown className="h-[2vh] w-[3.5vw] sm:w-[1vw] text-slate-500" />
                  <div className="relative">
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="bg-black/50 border border-white/10 rounded-[50vw] px-[4vw] py-[1vh] sm:px-[1.2vw] sm:py-[0.8vh] text-[3.2vw] sm:text-[0.85vw] text-slate-300 font-bold focus:outline-none hover:border-indigo-500/50 flex items-center justify-between gap-[2vw] sm:gap-[0.8vw] cursor-pointer min-w-[32vw] sm:min-w-[13vw] select-none"
                    >
                      <span>{currentSortLabel}</span>
                      <ChevronDown className={`h-[1.5vh] w-[3vw] sm:w-[1vw] text-slate-400 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                    </button>

                    {isSortDropdownOpen && (
                      <>
                        {/* Overlay to close the dropdown when clicking outside */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsSortDropdownOpen(false)}
                        ></div>
                        
                        {/* Dropdown Options List */}
                        <div className="absolute right-0 mt-[1vh] w-[45vw] sm:w-[15vw] rounded-[1.2vw] bg-[#0c0f1e]/95 border border-white/8 backdrop-blur-xl shadow-2xl p-[1.5vw] sm:p-[0.6vw] z-20 flex flex-col gap-[0.5vh] overflow-hidden select-none">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value)
                                setIsSortDropdownOpen(false)
                              }}
                              className={`w-full text-left px-[3vw] py-[1.2vh] sm:px-[1.2vw] sm:py-[1vh] rounded-[0.8vw] text-[3.2vw] sm:text-[0.85vw] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                sortBy === option.value
                                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/10'
                                  : 'bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-white/3'
                              }`}
                            >
                              <span>{option.label}</span>
                              {sortBy === option.value && <Check className="h-[1.5vh] w-[1vw] text-indigo-400" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* --- PRODUCTS CARD GRID --- */}
            <div className="w-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-[10vh] gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading items...</span>
                </div>
              ) : error ? (
                <div className="text-center py-[10vh] border border-rose-500/10 rounded-[2vw] bg-rose-500/5 p-[2vw]">
                  <h3 className="text-rose-450 font-extrabold text-lg mb-1">Error fetching catalog</h3>
                  <p className="text-rose-400/80 text-sm font-semibold">{error.message || error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-[12vh] border border-white/[0.03] rounded-[2vw] bg-slate-900/10 backdrop-blur-md p-[4vw]">
                  <h3 className="text-slate-300 font-extrabold text-lg mb-2">No items found</h3>
                  <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">We couldn't find any products matching your selected search term or active filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[4vw] md:gap-[2vw]">
                  <ProductCard products={filteredProducts} />
                </div>
              )}
            </div>

          </main>
        </div>

      </div>

      {/* ================= MOBILE FILTERS DRAWER (Overlay Modal) ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative w-[80vw] max-w-95 h-full bg-[#0b0e1a] border-l border-white/8 p-[6vw] flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            
            <div>
              <div className="flex items-center justify-between pb-[2.5vh] border-b border-white/6 mb-[3vh]">
                <h3 className="text-[4.5vw] font-bold text-white uppercase tracking-wide flex items-center gap-[2vw]">
                  <Sliders className="h-[2.2vh] w-[4.5vw] text-indigo-400" />
                  <span>Filters</span>
                </h3>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-[1.5vw] rounded-full bg-white/3 text-slate-400 hover:text-white"
                >
                  <X className="h-[2.2vh] w-[4.5vw]" />
                </button>
              </div>

              {/* Mobile Search Widget */}
              <div className="mb-[4vh]">
                <label className="block text-[3.2vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh]">
                  Search Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[3vw] py-[1.2vh] pl-[10vw] pr-[3vw] text-[3.8vw] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                  />
                  <Search className="absolute left-[3vw] top-1/2 -translate-y-1/2 h-[2vh] w-[4vw] text-slate-500" />
                </div>
              </div>

              {/* Mobile Categories Widget */}
              <div className="mb-[4vh]">
                <label className="block text-[3.2vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh]">
                  Category
                </label>
                <div className="flex flex-wrap gap-[1.5vh]">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-[4vw] py-[0.8vh] rounded-[50vw] text-[3.2vw] font-semibold transition-all border ${
                        selectedCategory === category
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300'
                          : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands Widget */}
              <div className="mb-[4vh] border-b border-white/4 pb-[2.5vh]">
                <button
                  onClick={() => setIsBrandCollapsed(!isBrandCollapsed)}
                  className="w-full flex items-center justify-between text-[3.2vw] font-bold text-slate-400 uppercase tracking-wider mb-[1.5vh] cursor-pointer focus:outline-none select-none hover:text-slate-350 transition-colors"
                >
                  <span>Brand</span>
                  <ChevronDown className={`h-[2vh] w-[4vw] text-slate-500 transition-transform duration-300 ${isBrandCollapsed ? '-rotate-90' : ''}`} />
                </button>
                
                <div 
                  className={`flex flex-wrap gap-[1.5vh] overflow-hidden transition-all duration-300 ${
                    isBrandCollapsed 
                      ? 'max-h-0 opacity-0 pointer-events-none' 
                      : 'max-h-[30vh] opacity-100'
                  }`}
                >
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-[4vw] py-[0.8vh] rounded-[50vw] text-[3.2vw] font-semibold transition-all border ${
                        selectedBrand === brand
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300'
                          : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="mb-[4vh]">
                <div className="flex justify-between items-center mb-[1.5vh]">
                  <label className="text-[3.2vw] font-bold text-slate-400 uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-[3.8vw] font-extrabold text-white">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-[0.6vh] bg-slate-900 rounded-[50vw]"
                />
              </div>
            </div>

            {/* Mobile Actions bottom bar */}
            <div className="flex gap-[3vw] pt-[2vh] border-t border-white/6">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedBrand('All')
                  setPriceRange(250)
                }}
                className="flex-1 py-[1.5vh] rounded-[50vw] border border-white/10 text-slate-300 font-bold text-[3.5vw]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-[1.5vh] rounded-[50vw] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[3.5vw]"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Products
