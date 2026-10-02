import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoredProducts, getStoredBrands } from '../utils/storage';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Package, RefreshCw, Plus, X, ShieldCheck, Users, Building2, ArrowRight, Compass, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdminEdit } from '../contexts/AdminEditContext';

const ProductsPage = function({ openAuthModal, onQuickView, onEnquire, openEnquiryModal }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(() => getStoredProducts());
  const [brands, setBrands] = useState(() => getStoredBrands());
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(() => searchParams.get('brand') || 'All');

  const { currentUser, isAdmin, hasPermission } = useAuth();
  const { isEditModeActive, openAddProduct } = useAdminEdit();
  const canAddProduct = isAdmin && isEditModeActive && hasPermission('manage_products');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedBrand(searchParams.get('brand') || 'All');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    setProducts(getStoredProducts());
    setBrands(getStoredBrands());

    const handleProdUpdate = () => setProducts(getStoredProducts());
    const handleBrandUpdate = () => setBrands(getStoredBrands());

    window.addEventListener('jmr_products_updated', handleProdUpdate);
    window.addEventListener('jmr_brands_updated', handleBrandUpdate);

    return () => {
      window.removeEventListener('jmr_products_updated', handleProdUpdate);
      window.removeEventListener('jmr_brands_updated', handleBrandUpdate);
    };
  }, []);

  const categories = ['All', 'Formal', 'Athletic', 'Boots', 'Casual'];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !term || 
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term) ||
        p.brandId?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.tag?.toLowerCase().includes(term) ||
        (Array.isArray(p.colors) && p.colors.some(c => c.toLowerCase().includes(term))) ||
        p.description?.toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || p.brandId === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  const allBrandsMatches = useMemo(() => {
    if (!searchTerm.trim() || selectedBrand === 'All') return 0;
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.tag?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }).length;
  }, [products, searchTerm, selectedBrand]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Header Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Official Wholesale Catalog</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Footwear Distribution Catalog
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Browse authentic footwear lines distributed by JMR Shooz. Filter by brand or category to request wholesale allocation for your retail storefronts.
          </p>

          {canAddProduct && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => openAddProduct(selectedBrand !== 'All' ? selectedBrand : '')}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Footwear Model (Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>

{/* IF LOGGED IN: SHOW FULL ARTICLES & PRICING CATALOG */
      currentUser ? (
        <>
          {/* Filter and Search Bar */}
          <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-brand-surface p-5 sm:p-6 rounded-2xl border border-brand-border shadow-xl space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search form with dedicated Search button and Clear button */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev);
                  if (searchTerm.trim()) next.set('search', searchTerm.trim());
                  else next.delete('search');
                  return next;
                });
              }}
              className="md:col-span-6 flex items-center rounded-xl bg-white border-2 border-amber-400 shadow-md focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/40 transition-all overflow-hidden"
            >
              <div className="relative w-full flex items-center">
                <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search models, brands, materials, or SKU (e.g. Oxford, JMR-VM)..."
                  className="highlighted-search-input w-full pl-10 pr-9 py-2.5 text-slate-950 font-bold text-sm focus:outline-none transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSearchParams(prev => {
                        const next = new URLSearchParams(prev);
                        next.delete('search');
                        return next;
                      });
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 border-l border-amber-400 active:scale-95 shadow-sm"
                title="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>


            {/* Brand Filter Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedBrand(val);
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    if (val !== 'All') next.set('brand', val);
                    else next.delete('brand');
                    return next;
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
              >
                <option value="All">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    if (val !== 'All') next.set('category', val);
                    else next.delete('category');
                    return next;
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Footwear Categories' : c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active filter tags & reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-brand-border/60">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Showing <strong className="text-brand-gold">{filteredProducts.length}</strong> wholesale footwear models</span>
            </div>

            {(searchTerm || selectedCategory !== 'All' || selectedBrand !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-brand-gold hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onEnquire={onEnquire}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-brand-surface rounded-2xl border border-brand-border max-w-lg mx-auto p-8 space-y-4">
            <Package className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className="text-lg font-bold text-white">No Matching Footwear Found</h4>
            <p className="text-xs text-slate-400">
              We could not find any models matching your criteria. Try adjusting the search term or category filters.
            </p>
            {allBrandsMatches > 0 && selectedBrand !== 'All' ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/40">
                  ⚡ Found <strong>{allBrandsMatches}</strong> footwear articles matching "{searchTerm}" in other brands!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('All');
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.delete('brand');
                      return next;
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Search Across All Brands ({allBrandsMatches} articles)
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-110 cursor-pointer"
              >
                Show All Models
              </button>
            )}
          </div>
        )}
      </div>

      {/* Catalog Custom Allocation Help */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-brand-surface border border-brand-border p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-white">Need a Custom Wholesale Line Sheet or Assortment Curve?</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Our footwear distribution specialists can prepare customized size curve allocations and tiered volume discounts for multi-door retail accounts.
            </p>
          </div>
          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-wider shadow-gold-sm transition-all shrink-0"
          >
            Request Custom Assortment
          </button>
        </div>
      </div>
    </>
  ) : (
    /* GUEST RESTRICTION VIEW: ONLY BRANDS VISIBLE, ARTICLES & PRICES PROTECTED */
    <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Security Gate Card */}
      <div className="bg-brand-surface rounded-3xl border border-brand-gold/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 mb-6 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block mb-2">
          B2B Distributor Access Control
        </span>
        <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
          Footwear Articles & Wholesale Pricing are Protected
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
          JMR Shooz is a verified B2B footwear distribution house. Individual footwear articles, SKU specifications, carton ratios, and factory pricing are restricted to registered retailer accounts. Please log in or browse our authorized brands portfolio below.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openAuthModal ? openAuthModal('login', 'retailer') : navigate('/retailer')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Retailer Login</span>
          </button>
          <button
            onClick={() => openAuthModal ? openAuthModal('register', 'retailer') : navigate('/retailer')}
            className="px-6 py-3.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-gold/40 text-brand-gold hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Register Wholesale Account</span>
          </button>
          <button
            onClick={() => openEnquiryModal ? openEnquiryModal() : navigate('/contact')}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-brand-gold" />
            <span>Submit Trade Inquiry</span>
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
            <span className="text-xs text-slate-300 font-medium">100% Factory Direct Brand Warranty</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Guaranteed Retailer Margin (40-52%)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Pan-India Bilti Hub Dispatch in 24-48h</span>
          </div>
        </div>
      </div>

      {/* Only Authorized Brands Showcase for Guests */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-gold" />
              <span>Authorized Footwear Brands Portfolio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Explore official manufacturing partners distributed by JMR Shooz across Northern & Central India.
            </p>
          </div>
          <button
            onClick={() => navigate('/brands')}
            className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Full Brand Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-gold/40 p-6 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                    {b.partnershipType || 'Official Distribution'}
                  </span>
                  <span className="text-[11px] text-slate-400">Est. {b.established}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                  {b.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {b.tagline || b.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-brand-border/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">Origin: <strong className="text-white">{b.origin}</strong></span>
                <button
                  onClick={() => openEnquiryModal ? openEnquiryModal() : navigate('/contact')}
                  className="px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-gold hover:text-brand-dark border border-brand-border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Enquire Brand</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

    </div>
  );
}

export default React.memo(ProductsPage);
