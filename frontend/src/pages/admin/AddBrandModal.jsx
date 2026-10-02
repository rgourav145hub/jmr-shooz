import React from 'react';
import ImageUploader from '../../components/ImageUploader';
import { X, Building2, Tag, Percent, Check } from 'lucide-react';

export default function AddBrandModal({
  showAddBrandModal,
  onClose,
  onSubmit,
  brandData,
  setBrandData,
  isEditing = false
}) {
  if (!showAddBrandModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-brand-card hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Footwear Brand' : 'Upload New Footwear Brand'}
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              {isEditing ? 'Update brand details, commercial retailer margins, and banner visuals.' : 'Add a new footwear brand to the JMR Shooz distribution roster.'}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: Brand Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={brandData.name || ''}
                onChange={handleChange}
                placeholder="e.g. Liberty, Columbus, Aerowalk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                name="tagline"
                value={brandData.tagline || ''}
                onChange={handleChange}
                placeholder="e.g. India's Most Trusted Formal Footwear"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 2: Category & Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Footwear Category
              </label>
              <input
                type="text"
                name="category"
                value={brandData.category || ''}
                onChange={handleChange}
                placeholder="e.g. Formal, Casual & Sports"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Manufacturing Origin / Hub
              </label>
              <input
                type="text"
                name="origin"
                value={brandData.origin || ''}
                onChange={handleChange}
                placeholder="e.g. Karnal, Haryana, India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 3: Retailer Margin & Partnership Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Retailer Profit Margin *
              </label>
              <input
                type="text"
                name="retailMargin"
                required
                value={brandData.retailMargin || ''}
                onChange={handleChange}
                placeholder="e.g. 42% - 48%"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-amber-500/40 text-amber-300 font-bold text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Partnership Type
              </label>
              <input
                type="text"
                name="partnershipType"
                value={brandData.partnershipType || ''}
                onChange={handleChange}
                placeholder="e.g. Authorized Distribution Partner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 4: Carton MOQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Carton MOQ (Minimum Order Quantity)
              </label>
              <input
                type="text"
                name="moq"
                value={brandData.moq || ''}
                onChange={handleChange}
                placeholder="e.g. 36 pairs / carton"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Logo Subtext
              </label>
              <input
                type="text"
                name="logoSubtext"
                value={brandData.logoSubtext || ''}
                onChange={handleChange}
                placeholder="OFFICIAL DISTRIBUTOR"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 5: Banner Image URL & Upload */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Brand Banner Image URL
            </label>
            <input
              type="url"
              name="bannerImage"
              value={brandData.bannerImage || ''}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono mb-2"
            />

            <div className="bg-brand-card/50 p-3 rounded-xl border border-brand-border/60">
              <span className="text-[11px] text-slate-400 block mb-1.5">Or upload banner image directly:</span>
              <ImageUploader 
                folder="brands"
                onUploadSuccess={(url) => setBrandData(prev => ({ ...prev, bannerImage: url }))}
                onUploadError={(err) => console.error(err)}
              />
            </div>

            {brandData.bannerImage && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-brand-card rounded-xl border border-brand-border">
                <img src={brandData.bannerImage} alt="Banner Preview" className="w-16 h-10 object-cover rounded-lg bg-black/40" />
                <span className="text-[11px] text-brand-gold truncate flex-1">{brandData.bannerImage}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Brand Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={brandData.description || ''}
              onChange={handleChange}
              placeholder="Short brand provenance and distribution summary..."
              className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-brand-border/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-brand-card hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold uppercase tracking-wider shadow-gold-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Brand Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
