import React, { useEffect, useState } from 'react';
import { X, Check, ShieldCheck, Truck, Package, ArrowRight, Building2, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductMrp } from '../utils/pricing';

export default function ProductQuickViewModal({ product, onClose, onEnquire, openAuthModal }) {
  const { currentUser } = useAuth();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [specification, setSpecification] = useState('');
  const defaultColor = (Array.isArray(product?.colors) && product.colors.length > 0) 
    ? product.colors[0] 
    : (product?.color || 'Classic Black');
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const isLiked = isInWishlist(product?.id);

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setAddedSuccess(false);
    setSelectedColor((Array.isArray(product.colors) && product.colors.length > 0) ? product.colors[0] : (product.color || 'Classic Black'));

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative w-full max-w-4xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-dark/80 text-slate-300 hover:text-white hover:bg-brand-card transition-colors border border-brand-border cursor-pointer shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wishlist / Like Toggle Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-4 left-4 z-20 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-75 cursor-pointer ${
            isLiked 
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 scale-105' 
              : 'bg-brand-dark/80 text-slate-300 hover:text-red-400 hover:bg-brand-card transition-colors border border-brand-border'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
          aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-[2]'}`} />
        </button>

        {/* Product Image Panel */}
        <div className="md:w-1/2 bg-brand-card relative flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[280px] md:min-h-[350px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface/90 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-gold text-brand-darker shadow-gold-sm">
              {product.brandName}
            </span>
            <p className="text-xs text-slate-300 font-mono mt-1">Official Distributed SKU: {product.sku}</p>
          </div>
        </div>

        {/* Product Specifications Panel */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-[90vh]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
              <span>{product.category} Footwear</span>
              <span>•</span>
              <span>{product.priceCategory}</span>
            </div>

            <h3 id="product-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Color Variant Selector */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Article Color (रंग चुनें):</span>
                <span className="text-amber-400 font-bold font-mono">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {((Array.isArray(product.colors) && product.colors.length > 0) ? product.colors : [product.color || 'Classic Black', 'Rich Tan']).map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedColor === col
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-gold-sm scale-105'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Wholesale Trade Specs */}
            {(() => {
              const pairsPerSet = parseInt(product.pairsPerSet, 10) || 12;
              const ratePerPair = getProductMrp(product);
              const ratePerSet = pairsPerSet * ratePerPair;
              const totalPairs = quantity * pairsPerSet;
              const totalCost = quantity * ratePerSet;

              return (
                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    B2B Wholesale Set Specifications (MRP Basis)
                  </h4>

                  {currentUser ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-brand-card p-3 rounded-xl border border-brand-border/60">
                          <span className="text-brand-muted block text-[10px] uppercase tracking-wider">MRP Rate</span>
                          <span className="font-semibold text-white text-sm font-mono">₹{ratePerPair.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-400">/ pair</span></span>
                        </div>
                        <div className="bg-amber-400/10 p-3 rounded-xl border border-amber-400/30">
                          <span className="text-amber-400 block text-[10px] uppercase tracking-wider font-bold">1 Set Pack Size</span>
                          <span className="font-bold text-amber-300 text-sm font-mono">{pairsPerSet} Pairs / Set</span>
                        </div>
                      </div>

                      {/* Set Pricing Card */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block font-medium">1 Set Total (by MRP)</span>
                          <span className="text-white font-mono font-bold text-sm">₹{ratePerSet.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-400">/ Set</span></span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] uppercase block font-medium">Assorted Size Curve</span>
                          <span className="text-amber-300 font-mono text-[11px] font-semibold">{product.sizeCurve || product.sizeRange || 'Full Size Curve'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-amber-400/10 p-3 rounded-xl border border-amber-400/30">
                          <span className="text-amber-400 block text-[10px] uppercase tracking-wider font-bold">1 Set Pack Size</span>
                          <span className="font-bold text-amber-300 text-sm font-mono">{pairsPerSet} Pairs / Set</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 p-3">
                          <span className="text-slate-400 text-[10px] uppercase block font-medium">Assorted Size Curve</span>
                          <span className="text-amber-300 font-mono text-[11px] font-semibold">{product.sizeCurve || product.sizeRange || 'Full Size Curve'}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-amber-400/10 border border-amber-400/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Wholesale MRP Protected</span>
                          <span className="text-slate-300 text-[11px]">🔒 Login as retailer to view wholesale MRP & set totals</span>
                        </div>
                        {openAuthModal && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              openAuthModal('login', 'retailer');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow cursor-pointer shrink-0"
                          >
                            Retailer Login
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Order Specification Input */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                        Order Specification / विशेष निर्देश (Optional):
                      </label>
                      <span className="text-[9px] text-slate-400">Custom note for godown packing</span>
                    </div>
                    <input
                      type="text"
                      value={specification}
                      onChange={(e) => setSpecification(e.target.value)}
                      placeholder="e.g. Size curve custom ratio (6x3, 7x4), special carton mark, etc."
                      className="w-full px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  {/* Material Breakdown */}
                  <div className="bg-brand-card/50 p-3.5 rounded-lg border border-brand-border/50 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Upper:</span>
                      <span className="text-slate-200 font-medium text-right">{product.materials?.upper || product.upper || 'Synthetic PU Leather'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Lining:</span>
                      <span className="text-slate-200 font-medium text-right">{product.materials?.lining || 'Breathable Textile'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Outsole:</span>
                      <span className="text-slate-200 font-medium text-right">{product.materials?.outsole || product.outsole || 'Direct Injected PU'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-brand-muted pt-1">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                      <span>100% Genuine</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-brand-gold" />
                      <span>24-48h Hub Dispatch</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Standard Master Carton</span>
                    </div>
                  </div>

                  {/* Action Buttons: Add to Cart (Only Logged-in) or Wholesale Inquiry (Guests) */}
                  {currentUser ? (
                    <div className="mt-5 pt-4 border-t border-brand-border space-y-3">
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-300 font-semibold">Select Number of Sets:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {quantity} {quantity === 1 ? 'Set' : 'Sets'} = {totalPairs} Pairs ({selectedColor})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Sets Picker */}
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold transition-colors"
                            title="Decrease sets"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-12 text-center font-mono font-bold text-amber-300 text-sm">
                            {quantity} <span className="text-[10px] text-slate-400">Sets</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold transition-colors"
                            title="Increase sets"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add to Wholesale Cart Button */}
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product, quantity, { color: selectedColor, specification: specification.trim() });
                            setAddedSuccess(true);
                            setTimeout(() => setAddedSuccess(false), 2000);
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                            addedSuccess
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-emerald-500/30'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 active:scale-95'
                          }`}
                        >
                          {addedSuccess ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Added {quantity} Set ({selectedColor})!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add {quantity} Set ({selectedColor}) · ₹{totalCost.toLocaleString('en-IN')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 pt-4 border-t border-brand-border space-y-3">
                      <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-center space-y-1">
                        <div className="text-xs font-bold text-amber-300">
                          🔒 Retailer Login Required to Add to Cart
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Guests can raise a direct inquiry below. Login to unlock wholesale cart booking.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Second row: Wishlist, Cart (if logged in), and Enquire */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`py-2.5 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shrink-0 ${
                  isLiked 
                    ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-sm' 
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-red-400'
                }`}
                title={isLiked ? 'Article Saved to Wishlist' : 'Save to Wishlist / Shortlist'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400 stroke-red-400' : ''}`} />
                <span className="hidden sm:inline">{isLiked ? 'Saved' : 'Wishlist'}</span>
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openCart();
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Cart</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnquire(product);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Raise Wholesale Inquiry</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
