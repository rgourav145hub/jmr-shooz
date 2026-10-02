import React from 'react';
import ImageUploader from '../../components/ImageUploader';
import { X, Package, DollarSign, Layers, Tag, Image as ImageIcon, Check } from 'lucide-react';

export default function AddProductModal({
  brands = [],
  showAddProductModal,
  onClose,
  onSubmit,
  productData,
  setProductData,
  isEditing = false
}) {
  if (!showAddProductModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'brandId') {
      const selectedBrand = brands.find(b => b.id === value);
      setProductData(prev => ({
        ...prev,
        brandId: value,
        brandName: selectedBrand ? selectedBrand.name : prev.brandName
      }));
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
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
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Footwear SKU Listing' : 'Add Footwear SKU Listing'}
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              {isEditing ? 'Update pricing, images, MOQ, and catalog specifications.' : 'Add a wholesale footwear model under an authorized brand.'}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: Product Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={productData.name || ''}
                onChange={handleChange}
                placeholder="e.g. Fortune Executive Oxford"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Brand Selection *
              </label>
              <select
                name="brandId"
                required
                value={productData.brandId || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              >
                <option value="">Select Brand</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Category & Stock Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Footwear Category
              </label>
              <select
                name="category"
                value={productData.category || 'Formal'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              >
                <option value="Formal">Formal</option>
                <option value="Athletic">Athletic & Sports</option>
                <option value="Casual">Casual & Daily</option>
                <option value="Boots">Boots & Outdoor</option>
                <option value="Daily Comfort">Daily Comfort & Slippers</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Display Badge / Tag
              </label>
              <input
                type="text"
                name="tag"
                value={productData.tag || ''}
                onChange={handleChange}
                placeholder="e.g. ⚡ Hot Deal, Best Seller, Festive Special"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 3: Wholesale Rate & Retail MSRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Wholesale Trade Rate (₹ / Single Pair) *
              </label>
              <input
                type="text"
                name="wholesaleRate"
                required
                value={productData.wholesaleRate || ''}
                onChange={handleChange}
                placeholder="e.g. ₹750 / pair or 750"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-amber-500/40 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Suggested Retail MSRP (₹ / pair)
              </label>
              <input
                type="text"
                name="suggestedRetailPrice"
                value={productData.suggestedRetailPrice || ''}
                onChange={handleChange}
                placeholder="e.g. ₹1,499 / pair"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-slate-200 font-mono text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 4: Wholesale Set Packing & Size Curve (B2B Requirement) */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Wholesale Set Packing & Ratio (Mandatory for B2B)</span>
              </span>
              <span className="text-[10px] text-slate-400">Order will be placed in Sets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-amber-300 text-[11px] mb-1">
                  Pairs Per Set (Set Size) *
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="pairsPerSet"
                    value={productData.pairsPerSet || 12}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 12;
                      setProductData(prev => ({
                        ...prev,
                        pairsPerSet: val,
                        moq: `1 Set (${val} Pairs)`
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-amber-500/40 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-brand-gold"
                  >
                    <option value="6">6 Pairs / Set</option>
                    <option value="8">8 Pairs / Set</option>
                    <option value="12">12 Pairs / Set (Standard)</option>
                    <option value="18">18 Pairs / Set</option>
                    <option value="24">24 Pairs / Set (2 Dozens)</option>
                    <option value="36">36 Pairs / Set (Carton)</option>
                    <option value="48">48 Pairs / Set (Master Carton)</option>
                    <option value="60">60 Pairs / Set</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 text-[11px] mb-1">
                  Size Ratio / Curve
                </label>
                <input
                  type="text"
                  name="sizeCurve"
                  value={productData.sizeCurve || ''}
                  onChange={handleChange}
                  placeholder="e.g. 6-10 (6x1, 7x2, 8x3, 9x3, 10x2, 11x1)"
                  className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Live calculation banner */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                1 Set = <strong className="text-white">{productData.pairsPerSet || 12} Pairs</strong>
              </span>
              <span className="text-amber-400 font-bold">
                Set Price: ₹{(
                  (productData.pairsPerSet || 12) *
                  (parseInt(String(productData.wholesaleRate || '750').replace(/\D/g, ''), 10) || 750)
                ).toLocaleString('en-IN')} / Set
              </span>
            </div>
          </div>

          {/* Row 5: Size Range & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Overall Size Range
              </label>
              <input
                type="text"
                name="sizeRange"
                value={productData.sizeRange || ''}
                onChange={handleChange}
                placeholder="e.g. UK/IND 6 - 10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Colors Available (Comma Separated)
              </label>
              <input
                type="text"
                name="colors"
                value={Array.isArray(productData.colors) ? productData.colors.join(', ') : (productData.colors || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  setProductData(prev => ({ ...prev, colors: val }));
                }}
                placeholder="e.g. Classic Black, Tan Brown, Navy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Row 5: Image Upload / URL */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Product Image URL
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                name="image"
                value={productData.image || ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
              />
            </div>

            <div className="bg-brand-card/50 p-3 rounded-xl border border-brand-border/60">
              <span className="text-[11px] text-slate-400 block mb-1.5">Or upload image directly:</span>
              <ImageUploader 
                folder="products"
                onUploadSuccess={(url) => setProductData(prev => ({ ...prev, image: url }))}
                onUploadError={(err) => console.error(err)}
              />
            </div>

            {productData.image && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-brand-card rounded-xl border border-brand-border">
                <img src={productData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg bg-black/40" />
                <span className="text-[11px] text-brand-gold truncate flex-1">{productData.image}</span>
              </div>
            )}
          </div>

          {/* Row 6: Materials & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Upper Material
              </label>
              <input
                type="text"
                name="upper"
                value={productData.upper || ''}
                onChange={handleChange}
                placeholder="e.g. Synthetic PU Leather"
                className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Outsole Material
              </label>
              <input
                type="text"
                name="outsole"
                value={productData.outsole || ''}
                onChange={handleChange}
                placeholder="e.g. Direct Injected PU Sole"
                className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="2"
              value={productData.description || ''}
              onChange={handleChange}
              placeholder="Wholesale model highlights..."
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
              <span>{isEditing ? 'Save Changes' : 'Publish Shoe Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
