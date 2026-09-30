import { useState, useMemo } from 'react'
import { PRODUCTS_DATA, type Product } from '../data/productsData'
import { BRANDS_DATA } from '../data/brandsData'
import {
  Search,
  Plus,
  Eye,
  Package,
  Sparkles,
  Boxes,
  RotateCcw
} from 'lucide-react'

interface ProductsViewProps {
  initialBrandFilter?: string
  onOpenProductModal: (product: Product) => void
  onAddToEnquiry: (product: Product, cartons?: number) => void
  onOpenEnquiryDrawer: () => void
}

export function ProductsView({
  initialBrandFilter,
  onOpenProductModal,
  onAddToEnquiry,
  onOpenEnquiryDrawer
}: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrandFilter || 'All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedGender, setSelectedGender] = useState<string>('All')

  const categories = ['All', 'Sneakers', 'Formal Shoes', 'Boots', 'Casual', 'Sports', 'Comfort']
  const genders = ['All', 'Men', 'Women', 'Unisex', 'Kids']

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand =
        selectedBrand === 'All' || p.brandId === selectedBrand

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory

      const matchesGender =
        selectedGender === 'All' || p.gender === selectedGender

      return matchesSearch && matchesBrand && matchesCategory && matchesGender
    })
  }, [searchQuery, selectedBrand, selectedCategory, selectedGender])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedBrand('All')
    setSelectedCategory('All')
    setSelectedGender('All')
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>B2B Wholesale Footwear Catalog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Explore Footwear Models
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          All models are packed in factory-sealed standard cartons with scientific size curves. Add models to your enquiry list to generate an instant wholesale quotation.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-6 rounded-3xl bg-[#121826] border border-slate-800 shadow-xl space-y-5">
        {/* Top search & reset */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by shoe model, SKU, leather, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> models
            </span>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/30 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          {/* Brand Filter Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Partner Brands ({BRANDS_DATA.length})</option>
              {BRANDS_DATA.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Footwear Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Gender / Target Audience
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#121826] rounded-3xl border border-slate-800 space-y-3">
          <Boxes className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-sm font-semibold">No footwear lines match the active filters.</p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-[#121826] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Image Preview */}
              <div
                onClick={() => onOpenProductModal(product)}
                className="relative aspect-square bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-400 border border-amber-400/20">
                  {product.brandName}
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300">
                  SKU: {product.sku}
                </div>

                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300">
                  {product.gender}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3
                    onClick={() => onOpenProductModal(product)}
                    className="text-sm font-bold text-white font-heading hover:text-amber-400 transition cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                    <span>{product.cartonSize}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    Sizes: {product.sizeRun}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Est. Wholesale
                      </span>
                      <span className="text-sm font-bold text-amber-300 font-mono">
                        ₹{(product.wholesaleEstimatePerPair * 83).toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 font-normal"> /pr</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                        MOQ
                      </span>
                      <span className="text-xs font-bold text-white">
                        {product.minimumOrderCartons} Cartons
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenProductModal(product)}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onAddToEnquiry(product, product.minimumOrderCartons)}
                      className="py-2 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Sticky Enquiry Callout */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h4 className="text-base font-bold text-white font-heading">
            Need Custom Assorted Cartons or Regional Master Carton Packs?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Our distribution warehouse supports specialized sizing breakups for high-volume retail chains and departmental stores.
          </p>
        </div>

        <button
          onClick={onOpenEnquiryDrawer}
          className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-amber-300 transition cursor-pointer"
        >
          Review Selected Quotation List
        </button>
      </div>
    </div>
  )
}
