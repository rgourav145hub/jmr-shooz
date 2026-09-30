import { useState, useEffect } from 'react'
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileText,
  ShieldCheck,
  Building2,
  LogOut
} from 'lucide-react'
import type { RetailerProfile, DeliveryAddress } from '../types/retailer'

interface RetailerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  currentRetailer: RetailerProfile | null
  onSaveRetailer: (retailer: RetailerProfile) => void
  onLogoutRetailer: () => void
}

export function RetailerAuthModal({
  isOpen,
  onClose,
  currentRetailer,
  onSaveRetailer,
  onLogoutRetailer
}: RetailerAuthModalProps) {
  const [ownerName, setOwnerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  
  // Default delivery address fields
  const [street, setStreet] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  // Populate form when modal opens or retailer changes
  useEffect(() => {
    if (currentRetailer) {
      setOwnerName(currentRetailer.ownerName)
      setBusinessName(currentRetailer.businessName)
      setPhone(currentRetailer.phone)
      setEmail(currentRetailer.email)
      setGstNumber(currentRetailer.gstNumber || '')
      setStreet(currentRetailer.defaultAddress.street)
      setLandmark(currentRetailer.defaultAddress.landmark || '')
      setCity(currentRetailer.defaultAddress.city)
      setState(currentRetailer.defaultAddress.state)
      setPincode(currentRetailer.defaultAddress.pincode)
      setIsEditing(false)
    } else {
      setOwnerName('')
      setBusinessName('')
      setPhone('')
      setEmail('')
      setGstNumber('')
      setStreet('')
      setLandmark('')
      setCity('')
      setState('')
      setPincode('')
      setIsEditing(true)
    }
  }, [currentRetailer, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const defaultAddress: DeliveryAddress = {
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim()
    }

    const updatedProfile: RetailerProfile = {
      id: currentRetailer?.id || `ret_${Date.now()}`,
      ownerName: ownerName.trim(),
      businessName: businessName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gstNumber: gstNumber.trim() || undefined,
      defaultAddress,
      registeredAt: currentRetailer?.registeredAt || new Date().toISOString()
    }

    onSaveRetailer(updatedProfile)
    setIsEditing(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#0F1522] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {currentRetailer && !isEditing
                  ? 'Retailer Account Profile'
                  : currentRetailer && isEditing
                  ? 'Edit Retailer & Address Details'
                  : 'Retailer Registration'}
              </h2>
              <p className="text-xs text-slate-400">
                {currentRetailer && !isEditing
                  ? 'Manage your registered business and default delivery location'
                  : 'Register your dealership to auto-fill default delivery address on all orders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Profile View */}
        {currentRetailer && !isEditing ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    {currentRetailer.businessName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Proprietor: {currentRetailer.ownerName}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Retailer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentRetailer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{currentRetailer.email}</span>
                </div>
                {currentRetailer.gstNumber && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>GSTIN: {currentRetailer.gstNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Default Delivery Address Card */}
            <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Default Delivery Address
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  Used at Order Checkout
                </span>
              </div>
              <p className="text-sm font-medium text-white">
                {currentRetailer.defaultAddress.street}
              </p>
              {currentRetailer.defaultAddress.landmark && (
                <p className="text-xs text-slate-400">
                  Landmark: {currentRetailer.defaultAddress.landmark}
                </p>
              )}
              <p className="text-xs text-slate-300">
                {currentRetailer.defaultAddress.city}, {currentRetailer.defaultAddress.state} -{' '}
                <span className="font-mono text-amber-300 font-bold">
                  {currentRetailer.defaultAddress.pincode}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Edit Profile & Delivery Address
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogoutRetailer()
                  onClose()
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                title="Log out from retailer profile"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Registration / Edit Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Business Details */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Business Details
              </label>
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Retail Store / Firm Name *"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Owner / Contact Person *"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="Business Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="GSTIN (Optional)"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Mandatory Delivery Address (As Requested by User) */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Primary Delivery Address (Default)
                </label>
                <span className="text-[10px] text-slate-400">
                  Auto-populated on order placement
                </span>
              </div>

              <div className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Shop / Godown No., Street, Market Area *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                <input
                  type="text"
                  placeholder="Landmark / Nearby transporter or junction (optional)"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              {currentRetailer && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {currentRetailer
                    ? 'Save Updated Profile & Address'
                    : 'Complete Registration & Save Default Address'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
