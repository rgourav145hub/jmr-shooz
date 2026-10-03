import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingCart, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Sparkles 
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getProductMrp } from '../utils/pricing';

export default function WishlistDrawer({ openAuthModal, openEnquiryModal, onQuickView }) {
  const navigate = useNavigate();
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlistItems, 
    removeFromWishlist, 
    clearWishlist, 
    totalWishlist 
  } = useWishlist();

  const { addToCart, openCart } = useCart();
  const { currentUser } = useAuth();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWishlistOpen, closeWishlist]);

  if (!isWishlistOpen) return null;

  const handleMoveAllToCart = () => {
    if (!currentUser) {
      closeWishlist();
      if (openAuthModal) openAuthModal('login', 'retailer');
      return;
    }
    wishlistItems.forEach(item => {
      addToCart(item, 1);
    });
    closeWishlist();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-brand-surface border-l border-brand-border/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border/60 bg-brand-dark/95 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                    Saved Articles & Wishlist
                  </h3>
                  {totalWishlist > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold border border-red-500/30">
                      {totalWishlist}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentUser ? 'Your shortlisted wholesale articles for store allocation' : 'Save articles to inquire with factory distributors'}
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              className="p-2 rounded-xl bg-brand-card hover:bg-slate-800 text-slate-400 hover:text-white border border-brand-border transition-colors cursor-pointer"
              title="Close Wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {wishlistItems.length === 0 ? (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center text-slate-500 shadow-inner">
                  <Heart className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Your Wishlist is Empty</h4>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                    Click the heart icon on any footwear article to shortlist models for wholesale cartons, set allocations, or inquiries.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeWishlist();
                    navigate(currentUser ? '/products' : '/brands');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-black text-xs uppercase tracking-wider shadow-gold-sm hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{currentUser ? 'Explore Footwear Catalog' : 'Browse Authorized Brands'}</span>
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => {
                const pairsPerSet = parseInt(item.pairsPerSet, 10) || 12;
                const ratePerPair = getProductMrp(item);
                const setTotal = pairsPerSet * ratePerPair;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-brand-card/70 border border-brand-border/80 hover:border-brand-gold/40 transition-all group flex gap-3.5 relative overflow-hidden"
                  >
                    {/* Item Thumbnail */}
                    <div 
                      onClick={() => {
                        if (onQuickView) {
                          closeWishlist();
                          onQuickView(item);
                        }
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-900 border border-brand-border/60 overflow-hidden shrink-0 flex items-center justify-center p-1 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 truncate">
                            {item.brandName}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 
                          onClick={() => {
                            if (onQuickView) {
                              closeWishlist();
                              onQuickView(item);
                            }
                          }}
                          className="font-bold text-white text-xs sm:text-sm mt-1 line-clamp-1 hover:text-brand-gold cursor-pointer"
                        >
                          {item.name}
                        </h4>

                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="font-mono">SKU: {item.sku}</span>
                          <span>•</span>
                          <span>1 Set = {pairsPerSet} Pairs</span>
                        </div>
                      </div>

                      {/* Pricing or Guest Protected Badge */}
                      <div className="mt-2 pt-2 border-t border-brand-border/50 flex items-center justify-between gap-2">
                        {currentUser ? (
                          <div className="text-xs">
                            <span className="font-mono font-bold text-white">
                              ₹{ratePerPair.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/pr</span>
                            </span>
                            <span className="text-[10px] text-amber-300 font-mono ml-2">
                              (Set: ₹{setTotal.toLocaleString('en-IN')})
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Wholesale B2B Rate</span>
                          </span>
                        )}

                        {/* Action: Add to Cart (Retailer) or Enquire (Guest) */}
                        {currentUser ? (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(item, 1);
                              closeWishlist();
                              openCart();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add Set</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              closeWishlist();
                              if (openAuthModal) openAuthModal('login', 'retailer');
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[10px] transition-colors cursor-pointer border border-amber-400/30"
                          >
                            Retailer Login
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {wishlistItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-border/60 bg-brand-dark/95 space-y-2.5">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Move All {totalWishlist} Items to Wholesale Cart</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeWishlist();
                      if (openAuthModal) openAuthModal('login', 'retailer');
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Retailer Login to Book</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeWishlist();
                      if (openEnquiryModal) openEnquiryModal();
                    }}
                    className="py-3 px-3 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Inquire All</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-slate-400 hover:text-red-400 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Wishlist</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate('/products');
                  }}
                  className="text-brand-gold hover:text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Continue Browsing</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
