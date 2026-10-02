import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { getStoredBrands, getStoredProducts } from '../utils/storage';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Building2, 
  Store, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  UserPlus, 
  MessageSquare,
  Sparkles,
  Search,
  Zap,
  ArrowRight,
  Package,
  Layers,
  Edit3,
  ShoppingCart
} from 'lucide-react';
import { useAdminEdit } from '../contexts/AdminEditContext';
import { useCart } from '../contexts/CartContext';
import { getProductMrp } from '../utils/pricing';
import NotificationBell from './NotificationBell';

export default function Navbar({ 
  openAuthModal, 
  openQueryModal,
  onQuickView
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isRetailer, hasPermission } = useAuth();
  const { totalItems, totalAmount, openCart } = useCart();
  const { openEditTicker, isEditModeActive } = useAdminEdit();
  const canEditTicker = isAdmin && isEditModeActive && hasPermission('manage_cms');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  // Data
  const dataContext = useData();
  const settings = dataContext?.settings;

  // Retrieve brands and products with fallback to stored defaults
  const allBrands = useMemo(() => {
    if (dataContext?.brands && dataContext.brands.length > 0) return dataContext.brands;
    return getStoredBrands();
  }, [dataContext?.brands]);

  const allProducts = useMemo(() => {
    if (dataContext?.products && dataContext.products.length > 0) return dataContext.products;
    return getStoredProducts();
  }, [dataContext?.products]);

  // Matching brands and articles / products based on user query
  const { matchingBrands, matchingProducts, hasMatches } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { matchingBrands: [], matchingProducts: [], hasMatches: false };
    }

    const brands = allBrands.filter((b) => {
      const name = b.name?.toLowerCase() || '';
      const tagline = b.tagline?.toLowerCase() || '';
      const cat = b.category?.toLowerCase() || '';
      return name.includes(q) || tagline.includes(q) || cat.includes(q);
    }).slice(0, 4);

    // Only logged-in users get footwear articles in search; guests ONLY see brands!
    const products = currentUser ? allProducts.filter((p) => {
      const name = p.name?.toLowerCase() || '';
      const sku = p.sku?.toLowerCase() || '';
      const brand = p.brandName?.toLowerCase() || '';
      const cat = p.category?.toLowerCase() || '';
      const tag = p.tag?.toLowerCase() || '';
      const desc = p.description?.toLowerCase() || '';
      const colors = Array.isArray(p.colors) ? p.colors.join(' ').toLowerCase() : '';
      return (
        name.includes(q) ||
        sku.includes(q) ||
        brand.includes(q) ||
        cat.includes(q) ||
        tag.includes(q) ||
        desc.includes(q) ||
        colors.includes(q)
      );
    }).slice(0, 6) : [];

    return {
      matchingBrands: brands,
      matchingProducts: products,
      hasMatches: brands.length > 0 || products.length > 0
    };
  }, [searchQuery, allBrands, allProducts, currentUser]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(e.target) &&
        (!mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(e.target))
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For guests: only show Brands (no Products link). Logged-in users see full catalog.
  const navLinks = useMemo(() => {
    const list = [
      { id: 'home', path: '/', label: 'Home' },
      { id: 'brands', path: '/brands', label: 'Brands' },
    ];
    if (currentUser) {
      list.push({ id: 'products', path: '/products', label: 'Products' });
    }
    list.push(
      { id: 'about', path: '/about', label: 'About' },
      { id: 'owner', path: '/owner', label: 'Owner' },
      { id: 'contact', path: '/contact', label: 'Contact' }
    );
    return list;
  }, [currentUser]);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    if (!currentUser) {
      // Guests only see brands
      navigate(query ? `/brands?search=${encodeURIComponent(query)}` : '/brands');
      return;
    }
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  const handleSelectBrand = (brand) => {
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
    navigate(`/products?brand=${encodeURIComponent(brand.id)}`);
  };

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
    if (onQuickView) {
      onQuickView(product);
    }
    navigate(`/products?search=${encodeURIComponent(product.sku || product.name)}`);
  };

  const tickerActive = settings?.tickerActive !== false;
  const tickerBadge = settings?.tickerBadge || 'B2B SUPER SALE';
  const tickerText = settings?.tickerText || '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk';
  const tickerDispatch = settings?.tickerDispatch || '🚚 Pan-India Hub Dispatch: 24-48h';
  const tickerMargin = settings?.tickerMargin || '🏷️ Guaranteed 40%-52% Retailer Margin';
  const tickerPhone = settings?.tickerPhone || '+91 98111 22334';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* 1. Wholesale Top Deal Ticker */}
      {tickerActive && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white text-[11px] font-semibold py-1 px-4 overflow-hidden shadow-inner">
          <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider animate-pulse">
                {tickerBadge}
              </span>
              <span className="text-[10px] sm:text-[11px] truncate max-w-[220px] xs:max-w-none">{tickerText}</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-wider text-slate-200">
              {tickerDispatch && <span className="flex items-center gap-1">{tickerDispatch}</span>}
              {tickerMargin && <span className="flex items-center gap-1">{tickerMargin}</span>}
              {tickerPhone && <span className="flex items-center gap-1">📞 Trade Support: {tickerPhone}</span>}
              {canEditTicker && (
                <button
                  type="button"
                  onClick={openEditTicker}
                  className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title="Live Edit Deals Ticker"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit Ticker</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0f172a]/95 backdrop-blur-md border-b border-blue-900/40 py-2.5 shadow-2xl' 
            : 'bg-gradient-to-b from-[#0f172a] via-[#0f172a]/90 to-transparent py-3'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-5 xl:px-6 2xl:px-8">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 xl:gap-3">
          
            {/* JMR SHOOZ Logo */}
            <button 
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2 group text-left focus:outline-none shrink-0"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-lg bg-gradient-to-br from-brand-surface to-brand-dark border border-brand-gold/40 flex items-center justify-center p-1.5 shadow-gold-sm group-hover:border-brand-gold transition-all duration-300">
                <svg 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full text-brand-gold"
                >
                  <path 
                    d="M6 26C10 24 16 25 22 21C27 18 31 11 34 11C35 11 36 12 35 14C33 18 29 23 23 26C17 29 11 29 6 26Z" 
                    fill="currentColor" 
                    fillOpacity="0.85"
                  />
                  <path 
                    d="M10 29C16 29 22 27 27 23" 
                    stroke="#E2CDB2" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="15" r="2" fill="#E2CDB2" />
                </svg>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-brand-gold rounded-full border-2 border-brand-dark"></div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-display text-base sm:text-lg xl:text-xl font-black tracking-widest text-white group-hover:text-brand-gold transition-colors">
                    JMR
                  </span>
                  <span className="font-sans text-base sm:text-lg xl:text-xl font-light tracking-widest text-brand-gold">
                    SHOOZ
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8px] xl:text-[9px] tracking-[0.2em] uppercase text-brand-muted font-medium -mt-1 group-hover:text-slate-300 transition-colors">
                  Footwear Distributor
                </span>
              </div>
            </button>

            {/* Desktop Search Bar with Live Autocomplete Dropdown - Highlighted Theme */}
            <div 
              ref={searchContainerRef}
              className="relative hidden md:flex items-center min-w-[120px] lg:min-w-[160px] xl:min-w-[200px] 2xl:min-w-[260px] flex-1 max-w-[220px] lg:max-w-[260px] xl:max-w-[320px] 2xl:max-w-[380px] mx-1 sm:mx-2"
            >
              <form 
                onSubmit={handleSearchSubmit}
                className="w-full relative flex items-center bg-white rounded-xl border-2 border-amber-400 hover:border-amber-500 shadow-md focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/50 transition-all overflow-hidden"
              >
                <div className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                    }}
                    placeholder={currentUser ? "Search footwear models, brands, or SKU..." : "Search authorized brands (Login for articles & rates)..."}
                    className="highlighted-search-input w-full pl-9 pr-8 py-2 text-slate-950 font-bold text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 border-l border-amber-400 active:scale-95 shadow-sm cursor-pointer"
                  title="Search Footwear Catalog"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Search</span>
                </button>
              </form>

              {/* Live Search Autocomplete Dropdown Menu */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800">
                    
                    {/* 1. Brands Section */}
                    {matchingBrands.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 px-1">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3 h-3" />
                            Brands ({matchingBrands.length})
                          </span>
                          <span className="text-[10px] text-slate-400 lowercase font-normal">click to view catalog</span>
                        </div>
                        <div className="space-y-1">
                          {matchingBrands.map((brand) => (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => handleSelectBrand(brand)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-all text-left group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-xs uppercase group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                                  {brand.name.substring(0, 2)}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                    {brand.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1">
                                    {brand.category || brand.tagline}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-400/20 group-hover:border-amber-400/40 shrink-0">
                                {brand.stats?.activeSkus || 'Brand'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Articles / Footwear Models Section */}
                    {matchingProducts.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-2 px-1">
                          <span className="flex items-center gap-1.5">
                            <Package className="w-3 h-3" />
                            Articles & Models ({matchingProducts.length})
                          </span>
                          <span className="text-[10px] text-slate-400 lowercase font-normal">click to quick view</span>
                        </div>
                        <div className="space-y-1">
                          {matchingProducts.map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => handleSelectProduct(prod)}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-all text-left group"
                            >
                              <img 
                                src={prod.image} 
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0 group-hover:border-amber-400 transition-colors"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {prod.name}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  <span className="text-amber-400/90 font-medium">{prod.brandName}</span>
                                  <span>•</span>
                                  <span className="font-mono text-slate-300">{prod.sku}</span>
                                  {prod.category && (
                                    <>
                                      <span>•</span>
                                      <span>{prod.category}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs font-bold text-amber-400">MRP: ₹{getProductMrp(prod)}/pr</div>
                                {prod.moq && (
                                  <div className="text-[9px] text-slate-400">{prod.moq}</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No matches fallback */}
                    {!hasMatches && (
                      <div className="p-6 text-center text-slate-400 space-y-2">
                        <Search className="w-6 h-6 mx-auto text-slate-500 opacity-60" />
                        <p className="text-xs text-slate-300">
                          No brands or footwear articles found for <span className="text-amber-300 font-semibold">"{searchQuery}"</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Try searching by brand name (e.g. Liberty), article type (e.g. Derby, Runner), or SKU code.
                        </p>
                      </div>
                    )}

                    {!currentUser && (
                      <div className="p-2.5 bg-amber-400/10 border-t border-amber-400/20 text-center text-[10px] sm:text-[11px] text-amber-300 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Footwear models & wholesale rates are protected. Sign in as Retailer to view articles.</span>
                      </div>
                    )}

                    {/* Search All Footer CTA */}
                    <div className="p-2.5 bg-slate-900/90 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold transition-all text-center"
                      >
                        <span>{currentUser ? `Search full catalog for "${searchQuery}"` : `Search brands directory for "${searchQuery}"`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                // On medium-large screens (1024-1279px), prioritize primary links so nothing overflows
                const isSecondary = link.id === 'about' || link.id === 'owner';
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-1.5 xl:px-2.5 py-1 text-[11px] xl:text-xs font-bold uppercase transition-all duration-200 rounded-lg ${
                      isSecondary ? 'hidden xl:inline-block' : ''
                    } ${
                      isActive
                        ? 'text-brand-gold font-bold bg-white/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-brand-gold rounded-full shadow-gold-sm" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* In-app Notification Bell (ONLY for authenticated users - Desktop) */}
            {currentUser && <NotificationBell className="hidden lg:flex shrink-0" />}

            {/* Wholesale Cart Button (Desktop & Tablet) - ONLY for logged-in users */}
            {currentUser && (
              <button
                onClick={openCart}
                className="relative hidden sm:flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/40 hover:border-amber-400 text-amber-300 transition-all group shadow-sm active:scale-95 shrink-0"
                title="View Wholesale Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-200 hidden xl:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="text-xs font-mono font-bold text-amber-400 hidden 2xl:inline">
                    (₹{totalAmount.toLocaleString('en-IN')})
                  </span>
                )}
              </button>
            )}

            {/* Action CTAs: Auth Portals & Logout / Sign In */}
            <div className="hidden sm:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1 xl:gap-1.5 bg-brand-surface p-1 rounded-xl border border-brand-border shrink-0 shadow-sm">
                  {isRetailer ? (
                    <button
                      onClick={() => handleNavClick('/retailer')}
                      className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardHover text-xs text-white"
                      title="Open Retailer Dashboard"
                    >
                      {currentUser?.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt="Profile" 
                          className="w-4 h-4 xl:w-5 xl:h-5 rounded-full object-cover border border-brand-gold shrink-0" 
                        />
                      ) : (
                        <Store className="w-3.5 h-3.5 text-brand-gold" />
                      )}
                      <span className="font-mono text-[10px] xl:text-[11px] font-bold text-brand-gold max-w-[70px] xl:max-w-[100px] truncate">
                        {currentUser.retailerId || currentUser.name || 'Retailer'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('/admin')}
                      className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-xs text-white"
                      title="Open Admin Suite"
                    >
                      {currentUser?.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt="Profile" 
                          className="w-4 h-4 xl:w-5 xl:h-5 rounded-full object-cover border border-purple-400 shrink-0" 
                        />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="text-[10px] xl:text-[11px] font-bold text-purple-300">
                        Admin Suite
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => openAuthModal('login', isAdmin ? 'retailer' : 'admin')}
                    className="px-1.5 py-1 rounded-lg text-slate-300 hover:text-brand-gold hover:bg-white/5 text-[10px] font-medium transition-colors hidden 2xl:inline"
                    title="Switch Account"
                  >
                    Switch
                  </button>

                  <button
                    onClick={() => openQueryModal()}
                    className="p-1 xl:p-1.5 rounded-lg bg-brand-gold/15 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                    title="Submit Query or Feedback"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  {/* Prominent, Always-Visible Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex items-center gap-1 px-2 xl:px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-[10px] xl:text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Logout / Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
                  {/* Retailer Login */}
                  <button
                    onClick={() => openAuthModal('login', 'retailer')}
                    className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-card border border-brand-gold/40 text-brand-gold hover:text-white font-bold text-[11px] xl:text-xs uppercase tracking-wider transition-all flex items-center gap-1 xl:gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    title="Retailer / Partner Login"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Retailer Login</span>
                  </button>

                  {/* Admin Login */}
                  <button
                    onClick={() => openAuthModal('login', 'admin')}
                    className="px-2 xl:px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-[11px] xl:text-xs uppercase tracking-wider transition-all flex items-center gap-1 xl:gap-1.5 cursor-pointer"
                    title="System Admin Login"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin</span>
                  </button>

                  {/* Sign Up */}
                  <button
                    onClick={() => openAuthModal('register', 'retailer')}
                    className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-extrabold text-[11px] xl:text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Register as New Retailer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu & Cart Toggle Buttons */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              {/* Mobile Notification Bell (ONLY for authenticated users) */}
              {currentUser && <NotificationBell />}

              {/* Mobile Cart Button (ONLY for logged-in users) */}
              {currentUser && (
                <button
                  onClick={openCart}
                  className="relative p-2 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-400 hover:text-amber-300 active:scale-95 cursor-pointer"
                  title="Wholesale Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}

              {!currentUser ? (
                <button
                  onClick={() => openAuthModal('login', 'retailer')}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick(isAdmin ? '/admin' : '/retailer')}
                  className="p-1 rounded-xl bg-brand-surface border border-brand-gold/40 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-lg object-cover" />
                  ) : (
                    <Store className="w-4 h-4 text-brand-gold" />
                  )}
                  <span className="text-[10px] font-bold text-brand-gold max-w-[60px] truncate hidden xs:inline">
                    {isAdmin ? 'Admin' : (currentUser.retailerId || 'Portal')}
                  </span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-brand-surface border border-brand-border text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-brand-gold" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Integrated Mobile Search Bar - Always accessible on phone screens */}
          <div className="md:hidden mt-2 pt-2 border-t border-slate-800/80">
            <div ref={mobileSearchContainerRef} className="relative">
              <form 
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-xl bg-white border-2 border-amber-400 shadow-md focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/50 overflow-hidden"
              >
                <div className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="mobile-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                    }}
                    placeholder="Search footwear models, brands, or SKU..."
                    className="highlighted-search-input w-full pl-9 pr-8 py-2 text-slate-950 font-bold text-xs focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-2 text-xs font-black uppercase tracking-wider shrink-0 border-l border-amber-400 active:scale-95 cursor-pointer"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Mobile Live Autocomplete Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a]/98 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-800">
                    {matchingBrands.length > 0 && (
                      <div className="p-2.5">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between">
                          <span>Brands ({matchingBrands.length})</span>
                        </div>
                        <div className="space-y-1">
                          {matchingBrands.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                handleSelectBrand(b);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left text-xs font-semibold text-white"
                            >
                              <span>{b.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingProducts.length > 0 && (
                      <div className="p-2.5">
                        <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider px-1 mb-1.5">
                          Articles ({matchingProducts.length})
                        </div>
                        <div className="space-y-1">
                          {matchingProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleSelectProduct(p);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left text-xs text-white"
                            >
                              <div className="truncate pr-2">
                                <div className="font-semibold truncate">{p.name}</div>
                                <div className="text-[10px] text-slate-400">{p.brandName} • {p.sku}</div>
                              </div>
                              <span className="text-amber-400 font-bold shrink-0 text-xs">₹{getProductMrp(p)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs py-2 bg-amber-400/20 text-amber-300 font-bold hover:bg-amber-400/30"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0f172a]/98 backdrop-blur-2xl border-b border-brand-border px-5 py-5 shadow-2xl space-y-3 max-h-[75vh] overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.path)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-brand-gold/15 text-brand-gold border-l-2 border-brand-gold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-brand-muted" />
              </button>
            ))}
          </div>

          {/* Mobile Cart Button - ONLY for logged-in users */}
          {currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase transition-all"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                Wholesale Cart ({totalItems} items)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </button>
          )}

          {isRetailer && (
            <button
              onClick={() => handleNavClick('/retailer')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/40 uppercase"
            >
              <span>Retailer Wholesale Portal ({currentUser.retailerId || 'Retailer'})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/40 uppercase"
            >
              <span>Admin Management Suite</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', isAdmin ? 'retailer' : 'admin'); }}
                  className="w-full py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-bold uppercase tracking-wider text-center text-slate-200"
                >
                  Switch Role / Other Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full py-2.5 rounded-xl bg-red-950/40 text-red-300 border border-red-900 text-xs font-bold uppercase tracking-wider text-center"
                >
                  Sign Out ({currentUser.name})
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', 'retailer'); }}
                  className="w-full py-2.5 rounded-xl bg-brand-surface border border-brand-border text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-brand-gold" />
                  <span>User / Retailer Login</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', 'admin'); }}
                  className="w-full py-2.5 rounded-xl bg-brand-surface border border-purple-500/40 text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('register', 'retailer'); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account (Sign Up)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
