import React, { useState } from 'react';
import { Eye, Star, Truck, Zap, ShoppingBag, ShieldCheck, ChevronRight, Edit3, Trash2, ShoppingCart, Check, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminEdit } from '../contexts/AdminEditContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductMrp } from '../utils/pricing';

export default function ProductCard({ product, onQuickView, onEnquire }) {
  const { currentUser, isAdmin, isMasterAdmin, hasPermission } = useAuth();
  const { isEditModeActive, openEditProduct, confirmDeleteProduct } = useAdminEdit();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const isLiked = isInWishlist(product.id);

  const canEdit = isAdmin && isEditModeActive && hasPermission('manage_products');
  const canDelete = isAdmin && isEditModeActive && (isMasterAdmin || hasPermission('delete_products'));

  // Generate consistent pseudo ratings for realistic wholesale store look
  const rating = 4.4 + ((product.id?.charCodeAt(0) || 5) % 5) * 0.1;
  const reviewsCount = 120 + ((product.id?.charCodeAt(1) || 7) * 9);
  
  // Rule: Only MRP displayed, no discount, calculated strictly from MRP
  const mrpPrice = getProductMrp(product);

  return (
    <div className="ecom-card shimmer-effect group flex flex-col h-full bg-[#131b2e] border border-blue-900/30 rounded-2xl overflow-hidden hover:border-blue-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 relative">
      
      {/* Admin Live Quick Edit & Delete Controls Header Strip */}
      {(canEdit || canDelete) && (
        <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-b border-amber-400/40 px-3 py-1.5 flex items-center justify-between z-30">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Control</span>
          </span>
          <div className="flex items-center gap-1.5">
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditProduct(product);
                }}
                className="px-2 py-0.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Edit this footwear SKU"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeleteProduct(product);
                }}
                className="px-2 py-0.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Delete this footwear SKU"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upper Badges — JMR Assured & Special Deals */}
      <div className={`absolute left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none ${(canEdit || canDelete) ? 'top-10' : 'top-2.5'}`}>
        <span className="badge-jmr-assured flex items-center gap-1 shadow-md">
          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>JMR Assured</span>
        </span>

        {product.tag ? (
          <span className="badge-jmr-deal animate-pulse">
            {product.tag}
          </span>
        ) : (
          <span className="badge-bestseller flex items-center gap-0.5">
            <span>★ Best Seller</span>
          </span>
        )}
      </div>

      {/* Image Container with Hover Zoom */}
      <div 
        className="relative aspect-[4/3] w-full bg-[#0a0f1d] overflow-hidden cursor-pointer flex items-center justify-center p-2" 
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
        
        {/* Wishlist / Like Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-75 cursor-pointer ${
            isLiked 
              ? 'bg-red-500/25 text-red-400 border border-red-500/50 hover:bg-red-500/35 scale-105' 
              : 'bg-black/60 text-slate-300 border border-white/15 hover:text-red-400 hover:bg-black/80 hover:scale-110'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
          aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-[2]'}`} />
        </button>
        
        {/* Quick View Floating Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg scale-95 hover:scale-105 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Brand & Category Header */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {product.brandName}
            </span>
            <span className="text-slate-400 font-medium text-[10px]">{product.category}</span>
          </div>

          {/* Product Title */}
          <h4 
            onClick={() => onQuickView(product)}
            className="font-sans text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h4>

          {/* Wholesale Rating Stars */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="inline-flex items-center gap-1 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-current text-white" />
            </div>
            <span className="text-[11px] text-slate-400">({reviewsCount.toLocaleString()} ratings)</span>
          </div>

          {/* Price & Wholesale Set Block (Protected for logged-in retailers only) */}
          {currentUser ? (
            (() => {
              const pairsPerSet = parseInt(product.pairsPerSet, 10) || 12;
              const setRate = pairsPerSet * mrpPrice;
              return (
                <>
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MRP:</span>
                        <span className="text-lg font-black text-white font-mono">
                          ₹{mrpPrice.toLocaleString('en-IN')}
                          <span className="text-[10px] font-normal text-slate-400 ml-0.5">/pair</span>
                        </span>
                      </div>
                    </div>

                    {/* Wholesale Set Packing Pill */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px] bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-lg">
                      <span className="font-bold text-amber-300">
                        1 Set = {pairsPerSet} Pairs
                      </span>
                      <span className="font-mono font-bold text-white">
                        ₹{setRate.toLocaleString('en-IN')}<span className="text-[9px] text-slate-400">/set</span>
                      </span>
                    </div>
                  </div>

                  {/* Dispatch & Size Curve Specs */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-1 text-slate-300 truncate max-w-[150px]">
                      <Truck className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">{product.sizeCurve || product.sizeRange || 'Full Curve'}</span>
                    </span>
                    <span className="text-amber-300 font-semibold shrink-0">
                      MOQ: 1 Set
                    </span>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
                <span className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>🔒 Retailer Login for Prices</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Wholesale rates & carton pricing protected</span>
              </div>
            </div>
          )}
        </div>

        {/* Wholesale Cart & Action Buttons */}
        <div className="space-y-1.5 pt-1">
          {currentUser ? (
            <>
              {(() => {
                const pairsPerSet = parseInt(product.pairsPerSet, 10) || 12;
                return (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                      setJustAdded(true);
                      setTimeout(() => setJustAdded(false), 1500);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                    }`}
                    title={`Add 1 Wholesale Set (${pairsPerSet} Pairs) to Cart`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added 1 Set ({pairsPerSet} Pairs)!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add 1 Set ({pairsPerSet} Pairs)</span>
                      </>
                    )}
                  </button>
                );
              })()}
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="py-1.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold tracking-wider transition-colors text-center cursor-pointer"
                >
                  Specs
                </button>
                
                <button
                  type="button"
                  onClick={() => onEnquire(product)}
                  className="py-1.5 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-white text-xs font-bold tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Enquire</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* For Guests: Cannot Add to Cart, only Raise Query and View Specs */}
              <button
                type="button"
                onClick={() => onEnquire(product)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 hover:from-amber-400 hover:to-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Raise Wholesale Query for this article"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Raise Wholesale Inquiry</span>
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="w-full py-1.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold tracking-wider transition-colors text-center cursor-pointer"
                >
                  View Details & Specs
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 pt-0.5">
                <span>🔒 Login to access Add to Cart</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
