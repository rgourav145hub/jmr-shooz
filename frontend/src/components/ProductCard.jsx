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
    <div className="ecom-card group flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-[#2874f0] transition-all duration-300 shadow-sm hover:shadow-xl relative">
      
      {/* Admin Live Quick Edit & Delete Controls Header Strip */}
      {(canEdit || canDelete) && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between z-30">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
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
                className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
                className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
        <span className="badge-jmr-assured flex items-center gap-1 bg-white shadow-sm border border-blue-400 text-[#2874f0] font-bold text-[10px] px-2 py-0.5 rounded">
          <Zap className="w-3 h-3 text-[#ff9f00] fill-[#ff9f00]" />
          <span>JMR Assured</span>
        </span>

        {product.tag ? (
          <span className="badge-jmr-deal">
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
        className="relative aspect-[4/3] w-full bg-white overflow-hidden cursor-pointer flex items-center justify-center p-3 border-b border-slate-100" 
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        
        {/* Wishlist / Like Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full transition-all shadow-md active:scale-75 cursor-pointer ${
            isLiked 
              ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 scale-105' 
              : 'bg-white/90 text-slate-400 border border-slate-200 hover:text-red-500 hover:bg-white hover:scale-110'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
          aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist / Like'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-[2]'}`} />
        </button>
        
        {/* Quick View Floating Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/20 backdrop-blur-[1px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md scale-95 hover:scale-105 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2.5 bg-white">
        <div>
          {/* Brand & Category Header */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-[#878787] uppercase tracking-wider text-[11px]">
              {product.brandName}
            </span>
            <span className="text-slate-500 font-medium text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{product.category}</span>
          </div>

          {/* Product Title */}
          <h4 
            onClick={() => onQuickView(product)}
            className="font-sans text-sm font-semibold text-slate-900 group-hover:text-[#2874f0] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h4>

          {/* Wholesale Rating Stars - Flipkart Green Pill */}
          <div className="flex items-center gap-2 mt-1">
            <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.2 rounded text-[11px] font-bold">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-current text-white" />
            </div>
            <span className="text-[11px] text-slate-500">({reviewsCount.toLocaleString()})</span>
          </div>

          {/* Price & Wholesale Set Block (Protected for logged-in retailers only) */}
          {currentUser ? (
            (() => {
              const pairsPerSet = parseInt(product.pairsPerSet, 10) || 12;
              const setRate = pairsPerSet * mrpPrice;
              return (
                <>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Rate:</span>
                        <span className="text-lg font-black text-slate-900 font-mono">
                          ₹{mrpPrice.toLocaleString('en-IN')}
                          <span className="text-[10px] font-normal text-slate-500 ml-0.5">/pair</span>
                        </span>
                      </div>
                    </div>

                    {/* Wholesale Set Packing Pill */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px] bg-blue-50/80 border border-blue-200/80 px-2 py-1 rounded">
                      <span className="font-bold text-blue-900">
                        1 Set = {pairsPerSet} Pairs
                      </span>
                      <span className="font-mono font-bold text-[#2874f0]">
                        ₹{setRate.toLocaleString('en-IN')}<span className="text-[9px] text-slate-500">/set</span>
                      </span>
                    </div>
                  </div>

                  {/* Dispatch & Size Curve Specs */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                    <span className="flex items-center gap-1 text-slate-700 truncate max-w-[150px]">
                      <Truck className="w-3 h-3 text-[#2874f0] shrink-0" />
                      <span className="truncate">{product.sizeCurve || product.sizeRange || 'Full Curve'}</span>
                    </span>
                    <span className="text-emerald-700 font-semibold shrink-0">
                      MOQ: 1 Set
                    </span>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>🔒 Retailer Login for Prices</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Wholesale rates & carton pricing protected</span>
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
                    className={`w-full py-2 px-3 rounded text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                      justAdded
                        ? 'bg-[#388e3c] text-white shadow-emerald-500/30'
                        : 'bg-[#fb641b] hover:bg-[#e04f09] text-white shadow-sm'
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
                  className="py-1.5 px-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold tracking-wider transition-colors text-center cursor-pointer"
                >
                  Specs
                </button>
                
                <button
                  type="button"
                  onClick={() => onEnquire(product)}
                  className="py-1.5 px-2 rounded bg-white hover:bg-blue-50 border border-blue-300 text-[#2874f0] text-xs font-semibold tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
                className="w-full py-2 px-3 rounded bg-blue-50 hover:bg-[#2874f0] text-[#2874f0] hover:text-white border border-blue-300 hover:border-[#2874f0] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
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
