import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Compass, ShoppingCart, User, Store, ShieldCheck, MessageSquare, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function MobileBottomNav({ openAuthModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart, totalItems } = useCart();
  const { currentUser, isAdmin, isRetailer } = useAuth();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (currentUser) {
      if (isAdmin) {
        handleNavClick('/admin');
      } else {
        handleNavClick('/retailer');
      }
    } else {
      if (openAuthModal) {
        openAuthModal('login', 'retailer');
      } else {
        navigate('/retailer');
      }
    }
  };

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname === '/products';
  const isBrands = location.pathname === '/brands';
  const isAbout = location.pathname === '/about';
  const isAccount = location.pathname === '/retailer' || location.pathname === '/admin';

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-t border-blue-900/40 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 py-1.5 pb-safe"
    >
      <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNavClick('/')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
            isHome ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Catalog (Logged in) OR Brands (Guest) */}
        {currentUser ? (
          <button
            type="button"
            onClick={() => handleNavClick('/products')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              isCatalog ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Package className={`w-5 h-5 ${isCatalog ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
              {isCatalog && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Catalog</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick('/brands')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              isBrands ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Compass className={`w-5 h-5 ${isBrands ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
              {isBrands && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Brands</span>
          </button>
        )}

        {/* 3. Brands (Logged in) OR About (Guest) */}
        {currentUser ? (
          <button
            type="button"
            onClick={() => handleNavClick('/brands')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              isBrands ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Compass className={`w-5 h-5 ${isBrands ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
              {isBrands && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Brands</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick('/about')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              isAbout ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Info className={`w-5 h-5 ${isAbout ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
              {isAbout && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">About</span>
          </button>
        )}

        {/* 4. Wholesale Cart (for logged in) OR Trade Enquiry (for guests) */}
        {currentUser ? (
          <button
            type="button"
            onClick={openCart}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-amber-300 transition-all cursor-pointer active:scale-90 relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 text-slate-300 font-medium tracking-tight">Cart</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick('/contact')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              location.pathname === '/contact' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <MessageSquare className={`w-5 h-5 ${location.pathname === '/contact' ? 'stroke-[2.5] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
              {location.pathname === '/contact' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Enquiry</span>
          </button>
        )}

        {/* 5. Account / Portal */}
        <button
          type="button"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
            isAccount ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className="w-5 h-5 rounded-full object-cover border border-amber-400" 
              />
            ) : currentUser ? (
              isAdmin ? (
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              ) : (
                <Store className="w-5 h-5 text-amber-400" />
              )
            ) : (
              <User className="w-5 h-5" />
            )}
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
            {currentUser ? (isAdmin ? 'Admin' : 'Portal') : 'Login'}
          </span>
        </button>

      </div>
    </nav>
  );
}
