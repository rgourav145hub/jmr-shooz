import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Users, 
  CheckCircle, 
  ArrowUpRight, 
  Award, 
  Phone, 
  Mail, 
  ChevronRight,
  ChevronLeft,
  Boxes,
  Compass,
  MapPin,
  Warehouse,
  Image as ImageIcon,
  Edit3,
  Zap,
  Star,
  Flame,
  Calendar,
  Camera,
  Plus,
  Trash2,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { 
  getStoredBrands, 
  getStoredProducts, 
  getOwnerProfile,
  getHomeBanners,
  getThreeOwnersAndGodown,
  getStoredSchemesAndEvents,
  deleteSchemeOrEvent
} from '../utils/storage';
import { apiGetSchemesEvents, apiDeleteSchemeEvent } from '../services/api';
import { statsData, valueProps } from '../data/statsData';
import ProductCard from '../components/ProductCard';
import HomeImageManagerModal from '../components/HomeImageManagerModal';
import SchemeEventManagerModal from '../components/SchemeEventManagerModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdminEdit } from '../contexts/AdminEditContext';

const HomePage = function({ currentUser, openAuthModal, onQuickView, onEnquire, openEnquiryModal }) {
  const navigate = useNavigate();
  const { settings } = useData();
  const { isAdmin, isMasterAdmin, hasPermission } = useAuth();
  const { isEditModeActive, openAddProduct, openEditBrand, confirmDeleteBrand, openAddBrand } = useAdminEdit();
  const canEditBrands = isAdmin && isEditModeActive && hasPermission('manage_brands');
  const canDeleteBrands = isAdmin && isEditModeActive && (isMasterAdmin || hasPermission('delete_brands'));
  const canAddProduct = isAdmin && isEditModeActive && hasPermission('manage_products');
  const [activeCategory, setActiveCategory] = useState('All');
  const [brands, setBrands] = useState(() => getStoredBrands());
  const [products, setProducts] = useState(() => getStoredProducts());
  const [owner, setOwner] = useState(() => getOwnerProfile());
  const [banners, setBanners] = useState(() => getHomeBanners());
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [threeOwnersData, setThreeOwnersData] = useState(() => getThreeOwnersAndGodown());
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [schemesEvents, setSchemesEvents] = useState(() => getStoredSchemesAndEvents());
  const [activeSchemeTab, setActiveSchemeTab] = useState('All');
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [editingSchemeItem, setEditingSchemeItem] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(28540); // ~8 hours

  // Live countdown timer for Deal of the Day
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 28800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto carousel slide transition for Hero Banners
  React.useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const copySchemeCode = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
  };


  React.useEffect(() => {
    setBrands(getStoredBrands());
    setProducts(getStoredProducts());
    setOwner(getOwnerProfile());
    setBanners(getHomeBanners());
    setThreeOwnersData(getThreeOwnersAndGodown());

    const handleBrandsUpdate = () => setBrands(getStoredBrands());
    const handleProdsUpdate = () => setProducts(getStoredProducts());
    const handleOwnerUpdate = () => setOwner(getOwnerProfile());
    const handleBannersUpdate = () => {
      const b = getHomeBanners();
      setBanners(b);
      setCurrentBannerIdx(prev => (prev >= b.length ? 0 : prev));
    };
    const handle3OwnersUpdate = () => setThreeOwnersData(getThreeOwnersAndGodown());
    const handleSchemesUpdate = () => setSchemesEvents(getStoredSchemesAndEvents());
    apiGetSchemesEvents().then(res => { if (Array.isArray(res) && res.length > 0) setSchemesEvents(res); });

    window.addEventListener('jmr_brands_updated', handleBrandsUpdate);
    window.addEventListener('jmr_products_updated', handleProdsUpdate);
    window.addEventListener('jmr_owner_updated', handleOwnerUpdate);
    window.addEventListener('jmr_banners_updated', handleBannersUpdate);
    window.addEventListener('jmr_owners_godown_updated', handle3OwnersUpdate);
    window.addEventListener('jmr_schemes_events_updated', handleSchemesUpdate);

    return () => {
      window.removeEventListener('jmr_brands_updated', handleBrandsUpdate);
      window.removeEventListener('jmr_products_updated', handleProdsUpdate);
      window.removeEventListener('jmr_owner_updated', handleOwnerUpdate);
      window.removeEventListener('jmr_banners_updated', handleBannersUpdate);
      window.removeEventListener('jmr_owners_godown_updated', handle3OwnersUpdate);
    window.removeEventListener('jmr_schemes_events_updated', handleSchemesUpdate);
    };
  }, []);

  const featuredBrands = (brands || []).filter(b => b.featured).slice(0, 4);
  
  const categories = ['All', 'Formal', 'Athletic', 'Boots', 'Casual'];
  const filteredProducts = activeCategory === 'All' 
    ? products.slice(0, 6) 
    : products.filter(p => p.category === activeCategory);

  const getPropIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-brand-gold" />;
      case 'Truck': return <Truck className="w-6 h-6 text-brand-gold" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-brand-gold" />;
      case 'Layers': return <Layers className="w-6 h-6 text-brand-gold" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-brand-gold" />;
      case 'Users': return <Users className="w-6 h-6 text-brand-gold" />;
      default: return <Award className="w-6 h-6 text-brand-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#212121]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-blue-50/60 to-[#f1f2f4]">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-[#2874f0] text-xs font-bold tracking-wide uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2874f0] animate-ping"></span>
                <span>{settings?.heroBadge || 'Authorized National Footwear Distributor'}</span>
              </div>

              {/* Strong Headline */}
              <h1 className="font-display text-3xl sm:text-5xl xl:text-5xl font-black tracking-tight leading-[1.15] text-[#212121]">
                Powering Retail Footwear Networks with <span className="text-[#2874f0]">World-Class Brands</span>.
              </h1>

              {/* Company Introduction */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-slate-900 font-semibold">JMR Shooz</strong> bridges international footwear manufacturing excellence with premier retail chains, department stores, and independent boutiques. We provide streamlined wholesale distribution, high retailer margins, and guaranteed supply continuity.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/brands')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Brands</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => openEnquiryModal()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-white hover:bg-slate-50 text-[#2874f0] border border-[#2874f0] text-xs sm:text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#2874f0]" />
                  <span>Business Enquiry</span>
                </button>
              </div>

              {/* Key Trust Pillars */}
              <div className="pt-5 border-t border-slate-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900">100% Direct</div>
                  <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Manufacturer Authenticity</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-[#2874f0]">480+ Stores</div>
                  <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Active Retail Network</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-[#388e3c]">24-48h</div>
                  <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Central Hub Logistics</div>
                </div>
              </div>

            </div>

            {/* Right Visual Card Showcase — DYNAMIC HERO SLIDER */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Dynamic Hero Card */}
                {banners.length > 0 && (() => {
                  const currentSlide = banners[currentBannerIdx] || banners[0];
                  return (
                    <div className="relative rounded-2xl bg-white border border-slate-200 p-4 shadow-lg overflow-hidden group">
                      
                      {/* Image Frame */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={currentSlide.imageUrl} 
                          alt={currentSlide.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Top Badges & Image Action */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white text-[#2874f0] shadow-md">
                            {currentSlide.badge || 'Showcase'}
                          </span>

                          {isAdmin && currentUser && (
                            <button
                              onClick={() => setIsBannerModalOpen(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff9f00] text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                              title="Add or Change Home Images"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Change Images</span>
                            </button>
                          )}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentBannerIdx(prev => (prev === 0 ? banners.length - 1 : prev - 1));
                            }}
                            className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#2874f0] shadow-md transition-all cursor-pointer"
                            aria-label="Previous Slide"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentBannerIdx(prev => (prev === banners.length - 1 ? 0 : prev + 1));
                            }}
                            className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#2874f0] shadow-md transition-all cursor-pointer"
                            aria-label="Next Slide"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Slide Caption */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                            {currentSlide.tag || 'Wholesale Distribution'}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5 drop-shadow-md">
                            {currentSlide.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Highlights */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        {currentUser ? (
                          <>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Wholesale Trade</span>
                              <span className="font-bold text-[#2874f0] text-sm font-mono">
                                {currentSlide.wholesaleRate || 'Wholesale MOQ'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Suggested MSRP</span>
                              <span className="font-bold text-slate-900 font-mono">
                                {currentSlide.suggestedRetail || 'Competitive Trade'}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate('/products')}
                              className="px-3.5 py-1.5 rounded-sm bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs shadow-sm cursor-pointer"
                            >
                              View Catalog
                            </button>
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#2874f0] shrink-0" />
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">B2B Protected</span>
                                <span className="text-xs font-bold text-slate-800">
                                  🔒 Login to View Wholesale Rates
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => openAuthModal && openAuthModal('login', 'retailer')}
                              className="px-3.5 py-1.5 rounded-sm bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all shrink-0"
                            >
                              Retailer Login
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Carousel Indicator Dots */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5">
                        {banners.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setCurrentBannerIdx(dotIdx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              currentBannerIdx === dotIdx ? 'w-6 bg-[#2874f0]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>

                    </div>
                  );
                })()}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK CATEGORY ICONS BAR */}
      <section className="bg-white border-y border-slate-200 py-3 px-4 overflow-x-auto shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 min-w-[700px]">
          {[
            { label: 'All Catalog', icon: '👞', category: 'All' },
            { label: 'Formal Executive', icon: '👔', category: 'Formal' },
            { label: 'Sneakers & Sports', icon: '👟', category: 'Athletic' },
            { label: 'Casual & Sliders', icon: '🩴', category: 'Casual' },
            { label: 'Heavy Boots', icon: '🥾', category: 'Boots' },
            { label: 'Brand Stores', icon: '👑', path: '/brands' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path) navigate(item.path);
                else {
                  setActiveCategory(item.category);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group flex-1 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-[#2874f0] group-hover:bg-blue-50/50 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-all duration-200">
                {item.icon}
              </div>
              <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                activeCategory === item.category ? 'text-[#2874f0] font-black' : 'text-slate-700 group-hover:text-[#2874f0]'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* JMR LIGHTNING DEAL OF THE DAY STRIP */}
      {settings?.dealActive !== false && (
        <section className="bg-white border-b border-slate-200 py-4 px-4 shadow-xs">
          <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
                <Zap className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2 py-0.5 rounded">
                    {settings?.dealTag || '⚡ LIGHTNING WHOLESALE DEAL'}
                  </span>
                  <span className="text-xs font-bold text-[#2874f0] flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    ⏱️ Ends in: {formatTime(timeLeft)}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {settings?.dealTitle || 'Wholesale Festive Stock Replenishment Mela'}
                </h3>
                <p className="text-xs text-slate-600">
                  {settings?.dealSubtitle || 'Guaranteed 40%-52% Retailer Profit Margin + Direct Dispatch in 24-48 Hours.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/products');
                }}
                className="bg-[#fb641b] hover:bg-[#e85b17] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>{settings?.dealPrimaryBtnText || 'Explore Deals'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEnquiryModal()}
                className="bg-white hover:bg-slate-50 text-[#2874f0] border border-[#2874f0] px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>{settings?.dealSecondaryBtnText || 'Book Bulk Stock'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. FEATURED BRANDS SECTION */}
      <section className="py-14 bg-[#f1f2f4] border-b border-slate-200 relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2874f0] mb-1">
                <Compass className="w-4 h-4" />
                <span>Curated Brand Roster</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Brands Distributed by <span className="text-[#2874f0]">JMR Shooz</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                We represent leading footwear brands across lifestyle, athletic, luxury formal, and rugged outdoor categories with exclusive regional distribution rights.
              </p>
            </div>

            <button
              onClick={() => navigate('/brands')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2874f0] hover:text-blue-700 transition-colors self-start md:self-auto bg-white px-4 py-2 rounded-sm border border-slate-200 shadow-xs"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredBrands.map((brand) => (
              <div 
                key={brand.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-[#2874f0]/60 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Admin Brand Controls Bar */}
                {(canEditBrands || canDeleteBrands) && (
                  <div className="bg-amber-50 border-b border-amber-200 px-3 py-1 flex items-center justify-between -mx-5 -mt-5 mb-4 z-20 relative">
                    <span className="text-[10px] font-black uppercase text-amber-800">Admin</span>
                    <div className="flex items-center gap-1">
                      {canEditBrands && (
                        <button
                          type="button"
                          onClick={() => openEditBrand(brand)}
                          className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[9px] uppercase cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                      {canDeleteBrands && (
                        <button
                          type="button"
                          onClick={() => confirmDeleteBrand(brand)}
                          className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[9px] uppercase cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  {/* Brand Monogram Mark */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2874f0] font-black text-lg group-hover:scale-105 transition-transform">
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {brand.origin}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-[#2874f0] font-medium mt-0.5">
                    {brand.category}
                  </p>
                  
                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                    {(brand.highlights || []).filter(h => !h.toLowerCase().includes('margin')).slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#388e3c] shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {brand.stats?.activeSkus || 'Ready in Hub'}
                  </span>
                  <button
                    onClick={() => navigate('/brands')}
                    className="flex items-center gap-1 text-xs font-bold text-[#2874f0] hover:text-blue-700 transition-colors"
                  >
                    <span>Brand Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION (Gated strictly for authenticated retailers) */}
      <section id="catalog-section" className="py-14 bg-white relative border-b border-slate-200">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {currentUser ? (
            <>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2874f0] block mb-1">
                  Wholesale Showcase
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Featured Footwear Collections
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                  Explore best-selling retail models available for volume store allocation and recurring wholesale fulfillment.
                </p>

                {/* Category Filter Pills */}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-[#2874f0] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {canAddProduct && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => openAddProduct()}
                      className="px-4 py-2 rounded-sm bg-[#ff9f00] hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Add Footwear Model (Admin)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onEnquire={onEnquire}
                  />
                ))}
              </div>

              {/* View All CTA */}
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <span>Explore Full Wholesale Catalog ({(products || []).length}+ Models)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
              <div className="w-14 h-14 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto text-[#2874f0] mb-4 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2874f0] block mb-1">
                B2B Distributor Access Control
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Footwear Articles & Wholesale Pricing are Protected
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
                As an authorized tier-1 footwear distributor, individual shoe articles, size curves, and wholesale rate contracts are exclusively reserved for verified retail partners. Guests can explore our authorized brand portfolio.
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
                  onClick={() => navigate('/brands')}
                  className="px-6 py-2.5 rounded-sm bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#2874f0]" />
                  <span>Browse Brands Roster</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
                  <span className="text-xs text-slate-700 font-medium">100% Authorized Factory Direct Sourcing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
                  <span className="text-xs text-slate-700 font-medium">Guaranteed Retailer Margin (40%-52%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#388e3c] shrink-0" />
                  <span className="text-xs text-slate-700 font-medium">Pan-India Bilti Hub Dispatch in 24-48h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* 3B. WHOLESALE TRADE SCHEMES, EVENTS & GALLERY SHOWCASE */}
      <section id="schemes-events-section" className="py-14 bg-[#f1f2f4] border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header & Admin Upload Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#2874f0] text-xs font-bold uppercase tracking-wider border border-blue-200 mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Special Wholesale Programs & Trade Media</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Wholesale Schemes, Trade Events & Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                व्यापारिक योजनाएं, आगामी एक्सपो इवेंट्स एवं गोदाम गैलरी — सीधा JMR Shooz प्रबंधन द्वारा
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSchemeItem(null);
                    setIsSchemeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-sm bg-[#ff9f00] hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Upload Scheme / Event / Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 pb-3">
            {[
              { id: 'All', label: 'All Updates (सभी)', count: schemesEvents.length },
              { id: 'scheme', label: '🔥 Active Schemes (योजनाएं)', count: schemesEvents.filter(x => x.type === 'scheme').length },
              { id: 'event', label: '📅 Trade Events (इवेंट्स)', count: schemesEvents.filter(x => x.type === 'event').length },
              { id: 'photo', label: '📸 Gallery & Photos (गैलरी)', count: schemesEvents.filter(x => x.type === 'photo').length }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSchemeTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeSchemeTab === tab.id
                    ? 'bg-[#2874f0] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeSchemeTab === tab.id ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemesEvents
              .filter(item => activeSchemeTab === 'All' || item.type === activeSchemeTab)
              .map(item => {
                const isScheme = item.type === 'scheme';
                const isEvent = item.type === 'event';

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 hover:border-[#2874f0]/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between group transition-all duration-200"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                        {/* Badges on top of image */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-white text-[#2874f0] shadow-sm">
                            {item.badge || (isScheme ? '🔥 Trade Scheme' : isEvent ? '📅 Trade Event' : '📸 Warehouse Photo')}
                          </span>

                          {isAdmin && (
                            <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSchemeItem(item);
                                  setIsSchemeModalOpen(true);
                                }}
                                className="p-1 rounded-sm bg-white/90 hover:bg-[#2874f0] hover:text-white text-slate-800 shadow-sm transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Delete "${item.title}"?`)) {
                                    await apiDeleteSchemeEvent(item.id);
                                    setSchemesEvents(prev => prev.filter(x => x.id !== item.id));
                                  }
                                }}
                                className="p-1 rounded-sm bg-white/90 hover:bg-red-600 hover:text-white text-red-600 shadow-sm transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Date or Location floating badge */}
                        {(item.validTill || item.location) && (
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-2 text-[11px] text-white bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-sm">
                            {item.validTill && (
                              <span className="flex items-center gap-1 font-medium truncate">
                                <Calendar className="w-3 h-3 text-yellow-300 shrink-0" />
                                <span>{item.validTill}</span>
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1 font-medium truncate ml-auto text-amber-200">
                                <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                                <span>{item.location}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors leading-snug">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs font-semibold text-[#2874f0] leading-tight">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Promo Code Box for Schemes */}
                        {isScheme && item.discountCode && (
                          <div className="mt-2.5 p-2 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-amber-800 uppercase tracking-wider block font-bold">
                                Wholesale Scheme Code:
                              </span>
                              <span className="font-mono font-bold text-slate-900 text-xs">
                                {item.discountCode}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copySchemeCode(item.discountCode)}
                              className="px-2.5 py-1 rounded-sm bg-[#ff9f00] text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-amber-400 transition-colors cursor-pointer"
                            >
                              {copiedCode === item.discountCode ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-800" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {item.terms ? (
                        <span className="text-[10px] text-slate-500 line-clamp-1 italic max-w-[200px]" title={item.terms}>
                          * {item.terms}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">JMR Authorized Distribution</span>
                      )}

                      <button
                        type="button"
                        onClick={() => openEnquiryModal({
                          subject: `Scheme Inquiry: ${item.title}`,
                          message: `Namaste JMR Wholesale Desk, I want to book wholesale sets under the scheme: "${item.title}" (${item.discountCode || ''}).`
                        })}
                        className="text-[#2874f0] hover:text-blue-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                      >
                        <span>Enquire Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE JMR SHOOZ SECTION */}
      <section className="py-14 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2874f0] block mb-1">
              Distributor Excellence
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Premier Retailers Choose <span className="text-[#2874f0]">JMR Shooz</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              We eliminate wholesale friction with authentic stock allocations, flexible ordering terms, and strategic retail support designed to protect and expand your store profitability.
            </p>
          </div>

          {/* Grid of 6 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((prop) => (
              <div 
                key={prop.id}
                className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#2874f0]/50 hover:bg-white transition-all duration-200 group shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center mb-4 text-[#2874f0] group-hover:scale-105 transition-transform">
                  {getPropIcon(prop.icon)}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                  {prop.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. BUSINESS STATISTICS SECTION */}
      <section className="py-12 bg-[#f1f2f4] border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2874f0]">
              Scale & Impact
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Distribution Network in Numbers
            </h3>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statsData.map((stat) => (
              <div 
                key={stat.id}
                className="bg-white border border-slate-200 p-5 rounded-xl text-center relative group hover:border-[#2874f0]/50 transition-all shadow-xs hover:shadow-sm"
              >
                <div className="font-display text-3xl sm:text-4xl font-black text-[#2874f0] tracking-tight group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1.5">
                  {stat.label}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. 3 OWNERS & CENTRAL GODOWN LOGISTICS SHOWCASE */}
      <section className="py-14 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#2874f0] text-xs font-bold uppercase tracking-wider border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Ownership & Direct Leadership</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              3 Managing Partners & Central Distribution Godown
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct executive accountability and our central warehouse facility powering hundreds of retail footwear stores.
            </p>
          </div>

          {/* 3 OWNERS COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {(threeOwnersData?.owners || []).map((o, idx) => (
              <div 
                key={o.id || idx}
                className="bg-slate-50 rounded-xl border border-slate-200 hover:border-[#2874f0]/50 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Photo & Role Badge */}
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 mb-4 border border-slate-200">
                    <img
                      src={o.photo}
                      alt={o.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-white text-[#2874f0] shadow-sm">
                        Owner #{idx + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-xs block truncate">
                        {o.experience || 'Footwear Industry Veteran'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                    {o.name}
                  </h3>
                  <p className="text-xs text-[#2874f0] font-semibold mt-0.5">
                    {o.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {o.division}
                  </p>
                </div>

                {/* Direct Contact Coordinates */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 hover:text-[#2874f0] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                    <a href={`tel:${o.phone}`} className="font-mono text-xs">
                      {o.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 hover:text-[#2874f0] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                    <a href={`mailto:${o.email}`} className="font-mono text-xs truncate">
                      {o.email}
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* CENTRAL GODOWN / WAREHOUSE FACILITY CARD */}
          {threeOwnersData?.godown && (
            <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2874f0] text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                    <Warehouse className="w-4 h-4" />
                    <span>Central Footwear Storage & Logistics Hub</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {threeOwnersData.godown.facilityName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Godown Address:</span>
                        <p>{threeOwnersData.godown.address}</p>
                        <p className="text-[#2874f0] mt-0.5">{threeOwnersData.godown.landmark}</p>
                        <p className="font-mono text-slate-600">{threeOwnersData.godown.city}, {threeOwnersData.godown.state} — {threeOwnersData.godown.pincode}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                        <span>Godown Helpline: <strong className="text-slate-900 font-mono">{threeOwnersData.godown.contactPhone}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                        <span>Dispatch Desk: <strong className="text-slate-900 font-mono">{threeOwnersData.godown.email}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Boxes className="w-3.5 h-3.5 text-[#2874f0] shrink-0" />
                        <span>Facility Capacity: <strong className="text-slate-900">{threeOwnersData.godown.storageCapacity}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end gap-3 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-blue-200 pt-4 lg:pt-0 lg:pl-6">
                  <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 w-full text-center shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Dispatch Turnaround</span>
                    <span className="text-lg font-black text-[#2874f0] block">{threeOwnersData.godown.dispatchTime}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{threeOwnersData.godown.workingHours}</span>
                  </div>

                  <button
                    onClick={() => navigate('/owner')}
                    className="w-full py-2.5 px-4 rounded-sm bg-[#2874f0] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-600 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Full 3-Owner & Godown Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 7. CONTACT / BUSINESS ENQUIRY CTA BANNER */}
      <section className="py-14 bg-[#2874f0] text-white text-center relative overflow-hidden shadow-inner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Distribute Premium Footwear in Your Retail Stores?
          </h2>

          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto">
            Get access to official wholesale line sheets, tier margin structures, and protected geographic stock allocations.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openEnquiryModal()}
              className="w-full sm:w-auto px-8 py-3 rounded-sm bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Submit Retail Business Enquiry
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-3 rounded-sm bg-white hover:bg-slate-50 text-[#2874f0] text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
            >
              View Hub Addresses & Contacts
            </button>
          </div>

        </div>
      </section>

      {/* Scheme, Event & Photo Manager Modal */}
      <SchemeEventManagerModal
        isOpen={isSchemeModalOpen}
        onClose={() => {
          setIsSchemeModalOpen(false);
          setEditingSchemeItem(null);
        }}
        editingItem={editingSchemeItem}
        onSaved={() => {
          setSchemesEvents(getStoredSchemesAndEvents());
        }}
      />

      {/* Image Manager Modal */}
      <HomeImageManagerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onBannerSaved={() => {
          setBanners(getHomeBanners());
        }}
      />

    </div>
  );
}

export default React.memo(HomePage);
