import { useState, useMemo } from 'react'
import { BRANDS_DATA, type Brand } from '../data/brandsData'
import {
  Search,
  Filter,
  Eye,
  FileCheck2,
  MapPin,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react'
import type { NavTab } from '../components/Navbar'

interface BrandsViewProps {
  onSelectTab: (tab: NavTab) => void
  onOpenBrandModal: (brand: Brand) => void
  onSelectBrandForProducts: (brandId: string) => void
  onApplyForBrandDealership: (brand: Brand) => void
}

export function BrandsView({
  onSelectTab,
  onOpenBrandModal,
  onSelectBrandForProducts,
  onApplyForBrandDealership
}: BrandsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = [
    'All',
    'Luxury & Formal',
    'Athletic & Sport',
    'Urban & Casual',
    'Outdoor & Rugged',
    'Comfort & Orthopedic',
    'Youth & Kids'
  ]

  const filteredBrands = useMemo(() => {
    return BRANDS_DATA.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.origin.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || brand.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Regional Distribution Portfolio</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Authorized Footwear Brands
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Every brand represented by JMR Shooz undergoes stringent vetting for factory build quality, material durability, consumer demand velocity, and fair retailer gross margins.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121826] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by brand name, origin, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredBrands.length}</span> of {BRANDS_DATA.length} Brands
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length === 0 ? (
        <div className="text-center py-20 bg-[#121826] rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-base font-medium">No brands match your search query.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
            className="mt-3 text-xs font-bold text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="rounded-3xl bg-[#121826] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-xl"
            >
              {/* Brand Banner */}
              <div className="relative h-52 bg-slate-950 overflow-hidden">
                <img
                  src={brand.heroImage}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-[#121826]/30 to-black/30" />

                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-amber-300 border border-amber-400/30">
                  {brand.category}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{brand.origin} • Est. {brand.establishedYear}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-xs font-semibold text-amber-300/90 italic">
                    "{brand.tagline}"
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    {brand.description}
                  </p>
                </div>

                {/* Distributor Commercial Indicators */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Dealer Gross Margin
                    </span>
                    <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {brand.marginRange}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Min. Carton Order
                    </span>
                    <span className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                      <Layers className="w-3.5 h-3.5" />
                      {brand.minimumOrderCartons} Cartons
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenBrandModal(brand)}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Brand Dossier</span>
                    </button>

                    <button
                      onClick={() => onSelectBrandForProducts(brand.id)}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Shoes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onApplyForBrandDealership(brand)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Apply for Territory Dealership</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brand Manufacturer Representation Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#151D2F] to-slate-900 border border-amber-400/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Footwear Brands & Manufacturers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Looking for Regional Footwear Distribution?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            JMR Shooz represents ambitious footwear brands looking to scale their distribution across 450+ authorized retail storefronts with guaranteed shelf placement.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('contact')}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-amber-500/20 hover:scale-105 transition cursor-pointer flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Brand Representation Deck</span>
        </button>
      </div>
    </div>
  )
}
