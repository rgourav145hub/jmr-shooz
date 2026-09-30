import { useState } from 'react'
import type { Product } from '../data/productsData'
import {
  X,
  Trash2,
  Send,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  Boxes
} from 'lucide-react'

export interface EnquiryItem {
  product: Product
  cartons: number
}

interface EnquiryDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: EnquiryItem[]
  onUpdateCartons: (productId: string, cartons: number) => void
  onRemoveItem: (productId: string) => void
  onClearAll: () => void
  onSubmitSuccess: (referenceId: string) => void
}

export function EnquiryDrawer({
  isOpen,
  onClose,
  items,
  onUpdateCartons,
  onRemoveItem,
  onClearAll,
  onSubmitSuccess
}: EnquiryDrawerProps) {
  const [dealerName, setDealerName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  if (!isOpen) return null

  const totalCartons = items.reduce((acc, item) => acc + item.cartons, 0)
  const totalPairs = items.reduce(
    (acc, item) => acc + item.cartons * item.product.cartonPairs,
    0
  )
  const estimatedWholesale = items.reduce(
    (acc, item) =>
      acc + item.cartons * item.product.cartonPairs * item.product.wholesaleEstimatePerPair,
    0
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      const generatedRef = `JMR-ENQ-${Math.floor(100000 + Math.random() * 900000)}`
      setSubmittedRef(generatedRef)
      setIsSubmitting(false)
      onClearAll()
      onSubmitSuccess(generatedRef)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0F1522] border-l border-amber-400/30 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0F1522]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                B2B Wholesale Enquiry List
              </h2>
              <p className="text-xs text-slate-400">
                {items.length} footwear line{items.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedRef(null)
              onClose()
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-5 space-y-6">
          {submittedRef ? (
            /* Success confirmation */
            <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-amber-400/30 space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                Enquiry Dispatched to JMR Sales Desk
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your wholesale footwear quote request has been logged. Our regional distributor manager will connect via WhatsApp/Call with carton tier rates and dispatch schedules.
              </p>
              <div className="p-3 bg-black/50 rounded-xl border border-slate-700 font-mono text-xs text-amber-300">
                Reference ID: <span className="font-bold text-white">{submittedRef}</span>
              </div>
              <button
                onClick={() => {
                  setSubmittedRef(null)
                  onClose()
                }}
                className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
              >
                Return to Footwear Catalog
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                <Boxes className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No items added to enquiry list</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Browse our distributed footwear brands and click "Add to Enquiry List" to assemble your wholesale quotation.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Selected Footwear Models</span>
                  <button
                    onClick={onClearAll}
                    className="text-red-400 hover:text-red-300 text-[11px] underline"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                        {item.product.brandName}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.product.cartonSize} ({item.product.sizeRun})
                      </div>

                      {/* Carton adjuster */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateCartons(item.product.id, Math.max(1, item.cartons - 1))
                            }
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                            {item.cartons} ctns
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateCartons(item.product.id, item.cartons + 1)
                            }
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-300 font-mono">
                          {item.cartons * item.product.cartonPairs} pairs
                        </span>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wholesale Summary Box */}
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Cartons Selected:</span>
                  <span className="font-bold text-white">{totalCartons} Cartons</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Footwear Pairs:</span>
                  <span className="font-bold text-white">{totalPairs} Pairs</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-amber-400/10">
                  <span className="font-semibold text-amber-300">Est. Wholesale Booking Value:</span>
                  <span className="font-bold text-amber-300 font-mono text-sm">
                    ₹{(estimatedWholesale * 83).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight pt-1">
                  * Final pricing includes volume tiered distributor discount, GST invoice, and freight subsidy.
                </p>
              </div>

              {/* Dealer Quick Info Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Retailer / Dealer Information</span>
                </h3>

                <div>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contact Person Name *"
                      value={dealerName}
                      onChange={(e) => setDealerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Retail Store / Firm *"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="City / State *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Business Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Specific delivery notes or GST number (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Generating B2B Quote...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Wholesale Quote Request</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
