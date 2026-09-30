import { useState, useEffect } from 'react'
import { BRANDS_DATA } from '../data/brandsData'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  HelpCircle
} from 'lucide-react'

interface ContactViewProps {
  initialSubject?: string
  initialBrand?: string
  onSubmissionSuccess: (refId: string) => void
}

export function ContactView({
  initialSubject,
  initialBrand,
  onSubmissionSuccess
}: ContactViewProps) {
  const [enquiryType, setEnquiryType] = useState<'retailer' | 'brand' | 'general'>('retailer')
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cityState, setCityState] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [selectedBrand, setSelectedBrand] = useState(initialBrand || '')
  const [volumeEstimate, setVolumeEstimate] = useState('10 - 25 Cartons / Month')
  const [message, setMessage] = useState(initialSubject ? `Inquiring regarding: ${initialSubject}` : '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand)
    }
    if (initialSubject) {
      setMessage(`Inquiring regarding: ${initialSubject}`)
    }
  }, [initialBrand, initialSubject])

  const faqs = [
    {
      q: 'What is the minimum order quantity (MOQ) for new footwear retailers?',
      a: 'For new authorized stockists, our introductory trial order is as low as 3 to 5 assorted cartons per brand. Each standard carton contains 12 pairs in a balanced size curve (e.g., UK 6-11), allowing you to test customer demand with minimal capital lock-in.'
    },
    {
      q: 'How does JMR Shooz protect retail margins against online predatory discounting?',
      a: 'We enforce contractual Minimum Advertised Price (MAP) policies across all partner brands. Any retailer or online platform violating MAP agreements faces immediate suspension of distributor supply. We ensure your retail counter maintains 40% - 55% healthy gross margins.'
    },
    {
      q: 'What are the dispatch and delivery timelines for restocking?',
      a: 'All standard orders are dispatched from our nearest regional warehouse within 24 to 48 hours. Depending on your city, express freight transit typically takes 2 to 4 business days with full GPS consignment tracking.'
    },
    {
      q: 'How do you handle defective footwear or carton mispicks?',
      a: 'Every carton undergoes 3-point barcode verification before dispatch. In the rare event of a manufacturing defect, you can upload photos via our Dealer WhatsApp Desk for an immediate credit note or carton replacement on your next delivery.'
    },
    {
      q: 'Can a retailer request physical shoe samples before ordering wholesale cartons?',
      a: 'Yes. Authorized footwear stores can request our curated "Retailer Sample Trunk" featuring one shoe per top-velocity model. The sample deposit is fully credited against your first commercial carton order.'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const refNumber = `JMR-${enquiryType.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`
      setSubmittedRef(refNumber)
      setIsSubmitting(false)
      onSubmissionSuccess(refNumber)
    }, 1200)
  }

  const resetForm = () => {
    setSubmittedRef(null)
    setFullName('')
    setBusinessName('')
    setPhone('')
    setEmail('')
    setCityState('')
    setGstNumber('')
    setMessage('')
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Distribution Channels</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Contact & Business Enquiry
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Whether you are a footwear retailer seeking dealership rights or a footwear brand manufacturer seeking pan-regional distribution, our commercial desk is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Hotline Details */}
        <div className="lg:col-span-5 space-y-8">
          {/* Quick Direct Desk Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-amber-400/30 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Direct Distribution Hotline
              </span>
              <h3 className="text-xl font-bold text-white font-heading mt-1">
                Commercial Wholesale Desk
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Connect directly with our regional distribution managers for instant stock availability and quotation sheets.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Wholesale Phone / WhatsApp</div>
                  <div className="text-slate-300 font-mono mt-0.5">+91 98000 12345 / +91 98000 67890</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">WhatsApp Catalog Desk Active (09:00 AM – 08:00 PM)</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Distribution Correspondence</div>
                  <div className="text-slate-300 mt-0.5">distribution@jmrshooz.com</div>
                  <div className="text-slate-400 text-[11px]">dealers@jmrshooz.com (Dealer Onboarding)</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Central Operations & Logistics HQ</div>
                  <div className="text-slate-300 mt-0.5">
                    JMR House, Logistics Hub Corridor, Sector 18, Industrial Area, Hub 400072
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Operating Hours</div>
                  <div className="text-slate-300 mt-0.5">Monday to Saturday: 09:30 AM – 07:00 PM</div>
                  <div className="text-slate-400 text-[11px]">Warehouse Dispatch: 24/7 Operations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Authentic Distributor Badge */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed B2B Invoicing</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                All dispatches are accompanied by 100% compliant GST tax invoices, E-way transport bills, and manufacturer warranty certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Comprehensive Business Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#121826] border border-amber-400/30 shadow-2xl relative">
            {submittedRef ? (
              /* Success Confirmation */
              <div className="py-12 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce-in">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-heading">
                    Business Enquiry Submitted Successfully
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting JMR Shooz Distribution. Your commercial application has been queued with our regional business team.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 max-w-md mx-auto space-y-1">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Application Reference Number
                  </div>
                  <div className="text-lg font-mono font-bold text-amber-300">
                    {submittedRef}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium pt-1">
                    Expected Response: Within 2 Hours via WhatsApp / Phone Call
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Direct Commercial Application
                  </div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Submit Business Enquiry
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Please provide your business credentials so we can assign your inquiry to the correct regional distributor desk.
                  </p>
                </div>

                {/* Form Mode Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEnquiryType('retailer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      enquiryType === 'retailer'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Retail Dealership
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnquiryType('brand')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      enquiryType === 'brand'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Brand Distribution
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnquiryType('general')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      enquiryType === 'general'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    General Wholesale
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {enquiryType === 'brand' ? 'Footwear Brand Name *' : 'Retail Store / Enterprise Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={enquiryType === 'brand' ? 'e.g. Veloce Footwear' : 'e.g. Metro Shoe Emporium'}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="procurement@store.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Store City & State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune, Maharashtra"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        GSTIN / Business Registration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 27AAAAA0000A1Z5 (Optional)"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {enquiryType === 'retailer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Brand of Primary Interest
                        </label>
                        <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="">All Brands / Entire Portfolio</option>
                          {BRANDS_DATA.map((b) => (
                            <option key={b.id} value={b.name}>
                              {b.name} ({b.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Estimated Monthly Order Volume
                        </label>
                        <select
                          value={volumeEstimate}
                          onChange={(e) => setVolumeEstimate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="5 - 10 Cartons / Month (Introductory)">5 - 10 Cartons / Month (Introductory)</option>
                          <option value="10 - 25 Cartons / Month">10 - 25 Cartons / Month (Standard Outlet)</option>
                          <option value="25 - 60 Cartons / Month">25 - 60 Cartons / Month (Large Multi-brand)</option>
                          <option value="60+ Cartons / Month">60+ Cartons / Month (Regional Chain)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Specific Requirements / Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any specific models, territory exclusivity questions, or carton assortments you are looking for..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing Dealership Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Dealership Enquiry & Request Wholesale Catalog</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            <span>Retailer Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Frequently Asked Dealership Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#121826] border border-slate-800 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition"
                >
                  <span className="text-sm font-bold text-white font-heading">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
