import { useState } from 'react'
import type { Product } from '../data/productsData'
import {
  X,
  Package,
  Layers,
  Sparkles,
  Check,
  Send,
  Boxes,
  Plus
} from 'lucide-react'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onAddToEnquiry: (product: Product, cartons: number) => void
  onDirectEnquire: (product: Product) => void
}

export function ProductModal({
  product,
  onClose,
  onAddToEnquiry,
  onDirectEnquire
}: ProductModalProps) {
  const [selectedCartons, setSelectedCartons] = useState<number>(3)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false)

  if (!product) return null

  const handleAdd = () => {
    onAddToEnquiry(product, selectedCartons)
    setAddedSuccess(true)
    setTimeout(() => setAddedSuccess(false), 2000)
  }

  const activeColor = selectedColor || product.colorways[0]
  const totalPairs = selectedCartons * product.cartonPairs
  const estWholesaleTotal = totalPairs * product.wholesaleEstimatePerPair

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121826] border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Imagery */}
          <div className="relative bg-slate-900 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30">
                {product.brandName}
              </span>
              <span className="text-xs font-mono text-slate-400">
                SKU: {product.sku}
              </span>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/80 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-slate-300">
                Category: {product.category}
              </div>
            </div>

            {/* Colorways */}
            <div className="mt-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Available Wholesale Colorways
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colorways.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeColor === c
                        ? 'bg-amber-400 text-slate-950 font-bold shadow'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Wholesale Specifications */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400/90 uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Distributed By JMR Shooz</span>
              </div>

              <h2 className="text-2xl font-bold text-white font-heading leading-tight">
                {product.name}
              </h2>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Wholesale Pricing Tier (B2B Indication) */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Est. Wholesale Tier
                  </span>
                  <div className="text-xl font-bold text-amber-300 mt-0.5 font-mono">
                    ₹{(product.wholesaleEstimatePerPair * 83).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ pair</span>
                  </div>
                  <span className="text-[10px] text-slate-400">(Approx. ${product.wholesaleEstimatePerPair}/pair FOB)</span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Recommended Retail MSRP
                  </span>
                  <div className="text-xl font-bold text-white mt-0.5 font-mono">
                    ₹{(product.msrpPerPair * 83).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ pair</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Dealer Gross Margin: ~55%</span>
                </div>
              </div>

              {/* Carton Packaging Breakdown */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>Carton Assortment Pack</span>
                  </span>
                  <span className="font-semibold text-white">{product.cartonSize}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Boxes className="w-4 h-4 text-amber-400" />
                    <span>Size Curve Breakdown</span>
                  </span>
                  <span className="font-semibold text-white">{product.sizeRun}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Upper Construction</span>
                  </span>
                  <span className="font-semibold text-white text-right max-w-[200px] truncate">
                    {product.material}
                  </span>
                </div>
              </div>

              {/* Order Cartons Quantity Selector */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Carton Quantity for Enquiry
                  </span>
                  <span className="text-xs text-amber-400 font-medium">
                    MOQ: {product.minimumOrderCartons} Cartons
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setSelectedCartons(Math.max(product.minimumOrderCartons, selectedCartons - 1))}
                      className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 text-sm font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono text-sm font-bold text-white min-w-[45px] text-center">
                      {selectedCartons}
                    </span>
                    <button
                      onClick={() => setSelectedCartons(selectedCartons + 1)}
                      className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 text-sm font-bold transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-xs text-slate-400">
                    = <span className="font-bold text-white">{totalPairs} Pairs</span> (~₹{(estWholesaleTotal * 83).toLocaleString('en-IN')})
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-900 border border-amber-400/50 text-amber-300 hover:bg-amber-400 hover:text-black'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Enquiry List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Enquiry List</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onDirectEnquire(product)
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Direct Dealer Quote</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
