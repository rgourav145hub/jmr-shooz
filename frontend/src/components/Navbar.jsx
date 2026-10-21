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
  ShoppingCart,
  Heart
} from 'lucide-react';
import { useAdminEdit } from '../contexts/AdminEditContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
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
  const { totalWishlist, openWishlist } = useWishlist();
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

      {/* 2. Main Navigation Bar (Flipkart Signature Royal Blue) */}
      <div className="bg-[#2874f0] text-white py-2.5 shadow-md border-b border-blue-600 transition-all duration-300">
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-5 xl:px-6 2xl:px-8">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 xl:gap-3">
          
            {/* JMR SHOOZ Logo - Flipkart style */}
            <button 
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2 group text-left focus:outline-none shrink-0"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-md bg-white border border-amber-300 flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-all">
                <svg 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full text-[#2874f0]"
                >
                  <path 
                    d="M6 26C10 24 16 25 22 21C27 18 31 11 34 11C35 11 36 12 35 14C33 18 29 23 23 26C17 29 11 29 6 26Z" 
                    fill="currentColor" 
                  />
                  <path 
                    d="M10 29C16 29 22 27 27 23" 
                    stroke="#FF9F00" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="15" r="2.5" fill="#FF9F00" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 leading-none">
                  <span className="font-sans text-base sm:text-lg xl:text-xl font-black italic tracking-tight text-white">
                    JMR
                  </span>
                  <span className="font-sans text-base sm:text-lg xl:text-xl font-bold tracking-tight text-[#ffea00]">
                    Shooz
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-100 italic">
                  <span>Explore</span>
                  <span className="font-bold text-[#ffea00]">Plus</span>
                  <span className="text-[#ffea00] font-black text-xs">★</span>
                </div>
              </div>
            </button>

            {/* Desktop Search Bar with Live Autocomplete Dropdown - Clean White Style */}
            <div 
              ref={searchContainerRef}
              className="relative hidden md:flex items-center min-w-[160px] lg:min-w-[220px] xl:min-w-[320px] 2xl:min-w-[420px] flex-1 max-w-[500px] mx-2"
            >
              <form 
                onSubmit={handleSearchSubmit}
                className="w-full relative flex items-center bg-white rounded shadow-sm focus-within:ring-2 focus-within:ring-amber-300 transition-all overflow-hidden"
              >
                <div className="relative w-full flex items-center">
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
                    placeholder={currentUser ? "Search for footwear models, brands, or SKU..." : "Search for authorized brands (Login for articles & rates)..."}
                    className="w-full pl-3.5 pr-8 py-2 text-slate-900 font-medium text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-white hover:bg-slate-50 text-[#2874f0] px-3.5 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 border-l border-slate-100 cursor-pointer"
                  title="Search Footwear Catalog"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Live Search Autocomplete Dropdown Menu */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
                    
                    {/* 1. Brands Section */}
                    {matchingBrands.length > 0 && (
                      <div className="p-3 bg-white">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#2874f0] mb-2 px-1">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            Brands ({matchingBrands.length})
                          </span>
                          <span className="text-[10px] text-slate-500 lowercase font-normal">click to view catalog</span>
                        </div>
                        <div className="space-y-1">
                          {matchingBrands.map((brand) => (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => handleSelectBrand(brand)}
                              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all text-left group border border-transparent hover:border-slate-200"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2874f0] font-black text-xs uppercase group-hover:bg-[#2874f0] group-hover:text-white transition-colors">
                                  {brand.name.substring(0, 2)}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                                    {brand.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">
                                    {brand.category || brand.tagline}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium shrink-0">
                                {brand.stats?.activeSkus || 'Brand'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Articles / Footwear Models Section */}
                    {matchingProducts.length > 0 && (
                      <div className="p-3 bg-white">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#2874f0] mb-2 px-1">
                          <span className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5" />
                            Articles & Models ({matchingProducts.length})
                          </span>
                          <span className="text-[10px] text-slate-500 lowercase font-normal">click to view</span>
                        </div>
                        <div className="space-y-1">
                          {matchingProducts.map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => handleSelectProduct(prod)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all text-left group border border-transparent hover:border-slate-200"
                            >
                              <img 
                                src={prod.image} 
                                alt={prod.name}
                                className="w-11 h-11 rounded-md object-contain bg-slate-50 border border-slate-200 shrink-0 p-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors truncate">
                                  {prod.name}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                  <span className="text-slate-800 font-semibold">{prod.brandName}</span>
                                  <span>•</span>
                                  <span className="font-mono text-slate-600">{prod.sku}</span>
                                  {prod.category && (
                                    <>
                                      <span>•</span>
                                      <span>{prod.category}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs font-black text-slate-900">₹{getProductMrp(prod)}</div>
                                {prod.moq && (
                                  <div className="text-[9px] text-[#388e3c] font-bold">{prod.moq}</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No matches fallback */}
                    {!hasMatches && (
                      <div className="p-6 text-center text-slate-500 space-y-2 bg-white">
                        <Search className="w-6 h-6 mx-auto text-slate-400 opacity-60" />
                        <p className="text-xs text-slate-700">
                          No brands or footwear articles found for <span className="text-[#2874f0] font-bold">"{searchQuery}"</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Try searching by brand name (e.g. Liberty, Paragon), article type (e.g. Derby, Runner), or SKU code.
                        </p>
                      </div>
                    )}

                    {!currentUser && (
                      <div className="p-2.5 bg-blue-50 border-t border-blue-100 text-center text-[10px] sm:text-[11px] text-[#2874f0] font-medium flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                        <span>Wholesale master rates are protected. Sign in as Retailer to view full rates.</span>
                      </div>
                    )}

                    {/* Search All Footer CTA */}
                    <div className="p-2.5 bg-slate-50 flex items-center justify-between text-xs border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#2874f0] hover:bg-blue-600 text-white font-bold transition-all text-center shadow-sm"
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
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const isSecondary = link.id === 'about' || link.id === 'owner';
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-2 xl:px-3 py-1.5 text-xs font-bold transition-all duration-150 rounded-md ${
                      isSecondary ? 'hidden xl:inline-block' : ''
                    } ${
                      isActive
                        ? 'text-white bg-blue-700/80 shadow-inner'
                        : 'text-blue-50 hover:text-white hover:bg-blue-600/70'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-yellow-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* In-app Notification Bell (ONLY for authenticated users - Desktop) */}
            {currentUser && <NotificationBell className="hidden lg:flex shrink-0" />}

            {/* Wholesale Shortlist / Wishlist Button (Desktop & Tablet) */}
            <button
              onClick={openWishlist}
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white hover:bg-blue-600/70 transition-all group shrink-0 font-medium"
              title="View Shortlisted Articles (Wishlist)"
            >
              <div className="relative">
                <Heart className={`w-4 h-4 text-white group-hover:scale-110 transition-transform ${totalWishlist > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
                {totalWishlist > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-black text-[9px] min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center shadow-md">
                    {totalWishlist > 99 ? '99+' : totalWishlist}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-white hidden xl:inline">Wishlist</span>
            </button>

            {/* Wholesale Cart Button (Desktop & Tablet) - ONLY for logged-in users */}
            {currentUser && (
              <button
                onClick={openCart}
                className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white hover:bg-blue-600/70 transition-all group shrink-0 font-medium"
                title="View Wholesale Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ffea00] text-slate-950 font-black text-[9px] min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center shadow-md">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-white hidden xl:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="text-xs font-mono font-black text-[#ffea00] hidden 2xl:inline">
                    (₹{totalAmount.toLocaleString('en-IN')})
                  </span>
                )}
              </button>
            )}

            {/* Action CTAs: Auth Portals & Logout / Sign In */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm p-1 rounded-md border border-white/20 shrink-0">
                  {isRetailer ? (
                    <button
                      onClick={() => handleNavClick('/retailer')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-[#2874f0] hover:bg-slate-50 text-xs font-bold shadow-sm transition-all"
                      title="Open Retailer Dashboard"
                    >
                      {currentUser?.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt="Profile" 
                          className="w-4 h-4 rounded-full object-cover border border-blue-400 shrink-0" 
                        />
                      ) : (
                        <Store className="w-3.5 h-3.5 text-[#2874f0]" />
                      )}
                      <span className="font-mono text-xs font-bold max-w-[85px] truncate">
                        {currentUser.retailerId || currentUser.name || 'Retailer'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('/admin')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-800 text-xs font-bold text-white shadow-sm"
                      title="Open Admin Suite"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
                      <span className="text-xs font-bold">
                        Admin Suite
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => openAuthModal('login', isAdmin ? 'retailer' : 'admin')}
                    className="px-2 py-1 rounded text-blue-100 hover:text-white hover:bg-white/10 text-[10px] font-medium transition-colors hidden 2xl:inline"
                    title="Switch Account"
                  >
                    Switch
                  </button>

                  <button
                    onClick={() => openQueryModal()}
                    className="p-1.5 rounded text-white hover:bg-white/10 transition-colors"
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
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Logout / Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  {/* Flipkart Classic White Login Button */}
                  <button
                    onClick={() => openAuthModal('login', 'retailer')}
                    className="px-5 py-1.5 rounded-sm bg-white hover:bg-slate-50 text-[#2874f0] font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                    title="Retailer / Partner Login"
                  >
                    Login
                  </button>

                  {/* Admin Login */}
                  <button
                    onClick={() => openAuthModal('login', 'admin')}
                    className="px-2.5 py-1.5 rounded-sm border border-blue-400/50 hover:bg-blue-600/50 text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                    title="System Admin Login"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                    <span className="hidden xl:inline">Admin</span>
                  </button>

                  {/* Sign Up / Become a Partner */}
                  <button
                    onClick={() => openAuthModal('register', 'retailer')}
                    className="px-3 py-1.5 rounded-sm bg-[#ff9f00] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Register as New Retailer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu, Wishlist & Cart Toggle Buttons */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-2">
              {/* Mobile Notification Bell (ONLY for authenticated users) */}
              {currentUser && <NotificationBell />}

              {/* Mobile Wishlist Button */}
              <button
                onClick={openWishlist}
                className="relative p-2 rounded-md text-white hover:bg-blue-600/70 active:scale-95 cursor-pointer"
                title="Shortlisted Articles (Wishlist)"
              >
                <Heart className={`w-5 h-5 ${totalWishlist > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
                {totalWishlist > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {totalWishlist}
                  </span>
                )}
              </button>

              {/* Mobile Cart Button (ONLY for logged-in users) */}
              {currentUser && (
                <button
                  onClick={openCart}
                  className="relative p-2 rounded-md text-white hover:bg-blue-600/70 active:scale-95 cursor-pointer"
                  title="Wholesale Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffea00] text-slate-950 font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}

              {!currentUser ? (
                <button
                  onClick={() => openAuthModal('login', 'retailer')}
                  className="px-3 py-1.5 rounded-sm bg-white text-[#2874f0] text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick(isAdmin ? '/admin' : '/retailer')}
                  className="p-1 rounded-md bg-white text-[#2874f0] flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <Store className="w-4 h-4 text-[#2874f0]" />
                  )}
                  <span className="text-[10px] font-bold max-w-[60px] truncate hidden xs:inline">
                    {isAdmin ? 'Admin' : (currentUser.retailerId || 'Portal')}
                  </span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-md text-white hover:bg-blue-600/70 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>

          </div>

          {/* Integrated Mobile Search Bar - Always accessible on phone screens */}
          <div className="md:hidden mt-2 pt-2 border-t border-blue-500/60">
            <div ref={mobileSearchContainerRef} className="relative">
              <form 
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-sm bg-white shadow-sm overflow-hidden"
              >
                <div className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    className="highlighted-search-input w-full pl-9 pr-8 py-2 text-slate-900 font-medium text-xs focus:outline-none"
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
                  className="bg-[#2874f0] text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider shrink-0 active:scale-95 cursor-pointer"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Mobile Live Autocomplete Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
                    {matchingBrands.length > 0 && (
                      <div className="p-2.5 bg-white">
                        <div className="text-[10px] font-bold text-[#2874f0] uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between">
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
                              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs font-semibold text-slate-900"
                            >
                              <span>{b.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingProducts.length > 0 && (
                      <div className="p-2.5 bg-white">
                        <div className="text-[10px] font-bold text-[#2874f0] uppercase tracking-wider px-1 mb-1.5">
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
                              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs text-slate-900"
                            >
                              <div className="truncate pr-2">
                                <div className="font-semibold truncate">{p.name}</div>
                                <div className="text-[10px] text-slate-500">{p.brandName} • {p.sku}</div>
                              </div>
                              <span className="text-slate-900 font-bold shrink-0 text-xs">₹{getProductMrp(p)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs py-2 bg-[#2874f0] text-white font-bold hover:bg-blue-600"
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

      {/* Flipkart-Style Category Strip */}
      <div className="bg-white border-b border-slate-200 shadow-sm hidden md:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 whitespace-nowrap gap-4">
          <button onClick={() => navigate('/products')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>👟 All Footwear</span>
          </button>
          <button onClick={() => navigate('/products?category=Formal')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>👞 Formal Shoes</span>
          </button>
          <button onClick={() => navigate('/products?category=Casual')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>👟 Casual & Loafers</span>
          </button>
          <button onClick={() => navigate('/products?category=Sports')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>🏃 Sports & Gym</span>
          </button>
          <button onClick={() => navigate('/products?category=Boots')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>🥾 Boots & Safety</span>
          </button>
          <button onClick={() => navigate('/products?category=School')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>🎒 School Shoes</span>
          </button>
          <button onClick={() => navigate('/brands')} className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1">
            <span>🏢 Top Brands</span>
          </button>
          <button onClick={() => navigate('/deals')} className="flex items-center gap-1.5 text-[#fb641b] font-bold hover:underline py-1">
            <span>🔥 Wholesale Deals</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 px-5 py-5 shadow-2xl space-y-3 max-h-[75vh] overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200 text-slate-800">

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.path)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
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
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-[#2874f0] font-bold text-xs uppercase transition-all"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#2874f0]" />
                Wholesale Cart ({totalItems} items)
              </span>
              <span className="font-mono font-bold">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </button>
          )}

          {isRetailer && (
            <button
              onClick={() => handleNavClick('/retailer')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-[#2874f0] bg-blue-50 border border-blue-200 uppercase"
            >
              <span>Retailer Portal ({currentUser.retailerId || 'Retailer'})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 uppercase"
            >
              <span>Admin Management Suite</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', isAdmin ? 'retailer' : 'admin'); }}
                  className="w-full py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold uppercase tracking-wider text-center text-slate-800"
                >
                  Switch Role / Other Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full py-2.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider text-center"
                >
                  Sign Out ({currentUser.name})
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', 'retailer'); }}
                  className="w-full py-2.5 rounded-md bg-[#2874f0] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Store className="w-4 h-4 text-white" />
                  <span>Retailer Login</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login', 'admin'); }}
                  className="w-full py-2.5 rounded-md bg-slate-100 border border-purple-200 text-purple-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('register', 'retailer'); }}
                  className="w-full py-2.5 rounded-md bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
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
