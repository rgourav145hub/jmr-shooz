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
    <div className="min-h-screen bg-[#f1f2f4] pt-24 sm:pt-28 md:pt-32 pb-20 text-[#212121]">
      
      {/* Header Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#2874f0] text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Package className="w-3.5 h-3.5" />
            <span>Official Wholesale Catalog</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Footwear Distribution Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Browse authentic footwear lines distributed by JMR Shooz. Filter by brand or category to request wholesale allocation for your retail storefronts.
          </p>

          {canAddProduct && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => openAddProduct(selectedBrand !== 'All' ? selectedBrand : '')}
                className="px-5 py-2 rounded-sm bg-[#ff9f00] hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Footwear Model (Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>

{/* IF LOGGED IN: SHOW FULL ARTICLES & PRICING CATALOG */}
      {currentUser ? (
        <>
          {/* Filter and Search Bar */}
          <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
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
                  className="md:col-span-6 flex items-center rounded-sm bg-white border-2 border-[#2874f0] shadow-xs focus-within:ring-2 focus-within:ring-blue-400/40 transition-all overflow-hidden"
                >
                  <div className="relative w-full flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search models, brands, materials, or SKU (e.g. Oxford, JMR-VM)..."
                      className="highlighted-search-input w-full pl-9 pr-8 py-2 text-slate-900 font-medium text-xs sm:text-sm focus:outline-none transition-colors"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2874f0] hover:bg-blue-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-xs cursor-pointer"
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
                    className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#2874f0] transition-colors"
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
                    className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#2874f0] transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Footwear Categories' : c}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Active filter tags & reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <span>Showing <strong className="text-[#2874f0] font-black">{filteredProducts.length}</strong> wholesale footwear models</span>
                </div>

                {(searchTerm || selectedCategory !== 'All' || selectedBrand !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 text-[#2874f0] hover:underline font-bold transition-colors cursor-pointer"
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
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h4 className="text-xl font-bold text-slate-900">Need a Custom Wholesale Line Sheet or Assortment Curve?</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Our footwear distribution specialists can prepare customized size curve allocations and tiered volume discounts for multi-door retail accounts.
            </p>
          </div>
          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-2.5 rounded-sm bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Request Custom Assortment
          </button>
        </div>
      </div>
    </>
  ) : (
    /* GUEST RESTRICTION VIEW: ONLY BRANDS VISIBLE, ARTICLES & PRICES PROTECTED */
    <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Security Gate Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
        <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#2874f0] mb-4 shadow-xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#2874f0] block mb-1">
          B2B Distributor Access Control
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Footwear Articles & Wholesale Pricing are Protected
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
          JMR Shooz is a verified B2B footwear distribution house. Individual footwear articles, SKU specifications, carton ratios, and factory pricing are restricted to registered retailer accounts. Please log in or browse our authorized brands portfolio below.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal ? openAuthModal('login', 'retailer') : navigate('/retailer')}
            className="px-6 py-2.5 rounded-sm bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Retailer Login</span>
          </button>
          <button
            onClick={() => openAuthModal ? openAuthModal('register', 'retailer') : navigate('/retailer')}
            className="px-6 py-2.5 rounded-sm bg-white hover:bg-slate-50 border border-[#2874f0] text-[#2874f0] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Register Wholesale Account</span>
          </button>
          <button
            onClick={() => openEnquiryModal ? openEnquiryModal() : navigate('/contact')}
            className="px-6 py-2.5 rounded-sm bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#2874f0]" />
            <span>Submit Trade Inquiry</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
            <span className="text-xs text-slate-700 font-medium">100% Factory Direct Brand Warranty</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
            <span className="text-xs text-slate-700 font-medium">Guaranteed Retailer Margin (40-52%)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
            <span className="text-xs text-slate-700 font-medium">Pan-India Bilti Hub Dispatch in 24-48h</span>
          </div>
        </div>
      </div>

      {/* Only Authorized Brands Showcase for Guests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#2874f0]" />
              <span>Authorized Footwear Brands Portfolio</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore official manufacturing partners distributed by JMR Shooz across Northern & Central India.
            </p>
          </div>
          <button
            onClick={() => navigate('/brands')}
            className="text-xs font-bold uppercase tracking-wider text-[#2874f0] hover:underline transition-colors flex items-center gap-1"
          >
            <span>Full Brand Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-[#2874f0]/60 p-5 flex flex-col justify-between transition-all group shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {b.partnershipType || 'Official Distribution'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Est. {b.established}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                  {b.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {b.tagline || b.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-600">Origin: <strong className="text-slate-900">{b.origin}</strong></span>
                <button
                  onClick={() => openEnquiryModal ? openEnquiryModal() : navigate('/contact')}
                  className="px-3 py-1.5 rounded-sm bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
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
