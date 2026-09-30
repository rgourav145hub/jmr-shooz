import type { Brand } from '../data/brandsData'
import {
  X,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  FileCheck2
} from 'lucide-react'

interface BrandModalProps {
  brand: Brand | null
  onClose: () => void
  onApplyDealership: (brand: Brand) => void
  onViewBrandCatalog: (brand: Brand) => void
}

export function BrandModal({
  brand,
  onClose,
  onApplyDealership,
  onViewBrandCatalog
}: BrandModalProps) {
  if (!brand) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#121826] border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-950">
          <img
            src={brand.heroImage}
            alt={brand.name}
            className="w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-[#121826]/40 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Distributed By JMR Shooz</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white font-heading">
                {brand.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{brand.tagline}</p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/40 text-amber-300 text-xs font-bold">
              {brand.category}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Origin
              </span>
              <p className="text-sm font-bold text-white mt-1">{brand.origin}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Established
              </span>
              <p className="text-sm font-bold text-white mt-1">{brand.establishedYear}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Retailer Margin
              </span>
              <p className="text-sm font-bold text-emerald-400 mt-1">{brand.marginRange}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Min. Carton MOQ
              </span>
              <p className="text-sm font-bold text-amber-300 mt-1">{brand.minimumOrderCartons} Cartons</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Brand Dossier & Distribution Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {brand.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
              Retail Commercial USPs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {brand.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-200"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onViewBrandCatalog(brand)
                onClose()
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Filter Shoes by {brand.name}
            </button>

            <button
              onClick={() => {
                onApplyDealership(brand)
                onClose()
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Apply for Territory Dealership</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
