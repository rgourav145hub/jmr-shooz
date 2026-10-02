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
    <div className="min-h-screen bg-brand-dark text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-28 overflow-hidden bg-radial-gradient">
        {/* Ambient background glow & grid */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-gold/10 blur-[130px] pointer-events-none rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f233010_1px,transparent_1px),linear-gradient(to_bottom,#1f233010_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-wider uppercase shadow-gold-sm">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></span>
                <span>{settings?.heroBadge || 'Authorized National Footwear Distributor'}</span>
              </div>

              {/* Strong Headline */}
              <h1 className="font-display text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Powering Retail Footwear Networks with <span className="gold-text-gradient">World-Class Brands</span>.
              </h1>

              {/* Company Introduction */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-white font-semibold">JMR Shooz</strong> bridges international footwear manufacturing excellence with premier retail chains, department stores, and independent boutiques. We provide streamlined wholesale distribution, high retailer margins, and guaranteed supply continuity.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/brands')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-extrabold text-xs sm:text-sm uppercase tracking-widest hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore Brands</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => openEnquiryModal()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-surface hover:bg-brand-card text-white border border-brand-gold/40 text-xs sm:text-sm uppercase tracking-widest font-semibold hover:border-brand-gold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Building2 className="w-4 h-4 text-brand-gold" />
                  <span>Business Enquiry</span>
                </button>
              </div>

              {/* Key Trust Pillars */}
              <div className="pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white">100% Direct</div>
                  <div className="text-[11px] text-brand-muted uppercase tracking-wider">Manufacturer Authenticity</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-brand-gold">480+ Stores</div>
                  <div className="text-[11px] text-brand-muted uppercase tracking-wider">Active Retail Network</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white">24-48h</div>
                  <div className="text-[11px] text-brand-muted uppercase tracking-wider">Central Hub Logistics</div>
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
                    <div className="relative rounded-3xl bg-brand-surface border border-brand-border p-5 shadow-2xl overflow-hidden group">
                      
                      {/* Image Frame */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card">
                        <img 
                          src={currentSlide.imageUrl} 
                          alt={currentSlide.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/30"></div>
                        
                        {/* Top Badges & Image Action */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-dark/85 text-brand-gold border border-brand-gold/40 backdrop-blur-md shadow-md">
                            {currentSlide.badge || 'Showcase'}
                          </span>

                          {isAdmin && currentUser && (
                            <button
                              onClick={() => setIsBannerModalOpen(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold text-brand-dark font-bold text-[11px] uppercase tracking-wider shadow-gold-sm hover:brightness-110 transition-all cursor-pointer"
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
                            className="pointer-events-auto p-2 rounded-full bg-brand-dark/70 hover:bg-brand-dark text-white hover:text-brand-gold border border-brand-border backdrop-blur-sm transition-all cursor-pointer"
                            aria-label="Previous Slide"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentBannerIdx(prev => (prev === banners.length - 1 ? 0 : prev + 1));
                            }}
                            className="pointer-events-auto p-2 rounded-full bg-brand-dark/70 hover:bg-brand-dark text-white hover:text-brand-gold border border-brand-border backdrop-blur-sm transition-all cursor-pointer"
                            aria-label="Next Slide"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Slide Caption */}
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                          <span className="text-[11px] text-brand-gold font-semibold uppercase tracking-widest block">
                            {currentSlide.tag || 'Wholesale Distribution'}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                            {currentSlide.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Highlights */}
                      <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                        {currentUser ? (
                          <>
                            <div>
                              <span className="text-brand-muted block text-[10px] uppercase">Wholesale Trade</span>
                              <span className="font-bold text-brand-gold text-sm font-mono">
                                {currentSlide.wholesaleRate || 'Wholesale MOQ'}
                              </span>
                            </div>
                            <div>
                              <span className="text-brand-muted block text-[10px] uppercase">Suggested MSRP</span>
                              <span className="font-semibold text-white font-mono">
                                {currentSlide.suggestedRetail || 'Competitive Trade'}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate('/products')}
                              className="px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
                            >
                              View Catalog
                            </button>
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                              <div>
                                <span className="text-brand-muted block text-[10px] uppercase tracking-wider">B2B Protected</span>
                                <span className="text-xs font-semibold text-amber-300">
                                  🔒 Login to View Wholesale Rates & MSRP
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => openAuthModal && openAuthModal('login', 'retailer')}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all shrink-0"
                            >
                              Retailer Login
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Carousel Indicator Dots */}
                      <div className="mt-3 pt-2 border-t border-brand-border/40 flex items-center justify-center gap-1.5">
                        {banners.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setCurrentBannerIdx(dotIdx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              currentBannerIdx === dotIdx ? 'w-6 bg-brand-gold' : 'w-1.5 bg-brand-border hover:bg-slate-500'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>

                    </div>
                  );
                })()}

                {/* Floating Micro Badge */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-brand-darker border border-brand-gold/40 p-4 rounded-2xl shadow-xl items-center gap-3 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Official Distributor</h5>
                    <p className="text-[10px] text-brand-muted">Protected Territories & Contracts</p>
                  </div>
                </div>

                {/* Floating Second Badge */}
                <div className="hidden sm:flex absolute -top-5 -right-5 bg-brand-darker border border-brand-gold/40 p-3.5 rounded-2xl shadow-xl items-center gap-3 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">National Logistics</h5>
                    <p className="text-[10px] text-brand-muted">Daily Pallet Dispatches</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK CATEGORY ICONS BAR */}
      <section className="bg-[#0b0f19] border-b border-blue-900/30 py-4 px-4 overflow-x-auto shadow-inner">
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
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-800/80 transition-all duration-300 group flex-1 cursor-pointer"
            >
              <div className="w-13 h-13 rounded-2xl bg-slate-900/90 border border-slate-700/80 group-hover:border-blue-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-115 group-hover:shadow-blue-500/25 transition-all duration-300">
                {item.icon}
              </div>
              <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                activeCategory === item.category ? 'text-amber-400 font-black' : 'text-slate-300 group-hover:text-blue-400'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* JMR LIGHTNING DEAL OF THE DAY STRIP */}
      {settings?.dealActive !== false && (
        <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/80 border-b border-blue-900/40 py-5 px-4">
          <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-xl shrink-0 animate-bounce">
                <Zap className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-jmr-deal text-xs font-black">{settings?.dealTag || '⚡ LIGHTNING WHOLESALE DEAL'}</span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    ⏱️ Ends in: {formatTime(timeLeft)}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {settings?.dealTitle || 'Wholesale Festive Stock Replenishment Mela'}
                </h3>
                <p className="text-xs text-slate-300">
                  {settings?.dealSubtitle || 'Guaranteed 40%-52% Retailer Profit Margin + Direct Dispatch in 24-48 Hours.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/products');
                }}
                className="btn-jmr-primary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <span>{settings?.dealPrimaryBtnText || 'Explore Deals'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEnquiryModal()}
                className="btn-jmr-accent px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <span>{settings?.dealSecondaryBtnText || 'Book Bulk Stock'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. FEATURED BRANDS SECTION */}
      <section className="py-20 bg-brand-darker border-y border-brand-border relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">
                <Compass className="w-4 h-4" />
                <span>Curated Brand Roster</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Brands Distributed by <span className="text-brand-gold">JMR Shooz</span>
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                We represent leading footwear brands across lifestyle, athletic, luxury formal, and rugged outdoor categories with exclusive regional distribution rights.
              </p>
            </div>

            <button
              onClick={() => navigate('/brands')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors self-start md:self-auto"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand) => (
              <div 
                key={brand.id}
                className="group bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-gold/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-gold-glow/20 relative overflow-hidden"
              >
                {/* Admin Brand Controls Bar */}
                {(canEditBrands || canDeleteBrands) && (
                  <div className="bg-amber-400/10 border-b border-amber-400/30 px-3 py-1 flex items-center justify-between -mx-6 -mt-6 mb-4 z-20 relative">
                    <span className="text-[10px] font-black uppercase text-amber-300">Admin</span>
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
                {/* Background ambient image glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-all"></div>

                <div>
                  {/* Brand Monogram Mark */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/30 flex items-center justify-center text-brand-gold font-display font-black text-lg group-hover:scale-110 transition-transform">
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-card text-slate-300 border border-brand-border">
                      {brand.origin}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-brand-gold font-medium mt-0.5">
                    {brand.category}
                  </p>
                  
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-1.5 border-t border-brand-border/60 pt-3 text-[11px] text-slate-300">
                    {(brand.highlights || []).filter(h => !h.toLowerCase().includes('margin')).slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-brand-muted">
                    {brand.stats?.activeSkus || 'Ready in Hub'}
                  </span>
                  <button
                    onClick={() => navigate('/brands')}
                    className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-white transition-colors"
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
      <section id="catalog-section" className="py-20 bg-brand-dark relative border-t border-brand-border/40">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {currentUser ? (
            <>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block mb-2">
                  Wholesale Showcase
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Featured Footwear Collections
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Explore best-selling retail models available for volume store allocation and recurring wholesale fulfillment.
                </p>

                {/* Category Filter Pills */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                        activeCategory === cat
                          ? 'bg-brand-gold text-brand-dark font-bold shadow-gold-sm'
                          : 'bg-brand-surface text-slate-300 hover:text-white border border-brand-border'
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
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Add Footwear Model (Admin)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Product Cards Grid */}
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

              {/* View All CTA */}
              <div className="mt-14 text-center">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-card hover:bg-brand-cardHover text-white border border-brand-gold/40 hover:border-brand-gold text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
                >
                  <span>Explore Full Wholesale Catalog ({(products || []).length}+ Models)</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-brand-surface rounded-3xl border border-brand-gold/30 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
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
                As an authorized tier-1 footwear distributor, individual shoe articles, size curves, and wholesale rate contracts are exclusively reserved for verified retail partners. Guests can explore our authorized brand portfolio.
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
                  onClick={() => navigate('/brands')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-brand-gold" />
                  <span>Browse Brands Roster</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">100% Authorized Factory Direct Sourcing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Guaranteed Retailer Margin (40%-52%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Pan-India Bilti Hub Dispatch in 24-48h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* 3B. WHOLESALE TRADE SCHEMES, EVENTS & GALLERY SHOWCASE */}
      <section id="schemes-events-section" className="py-20 bg-brand-surface/70 border-t border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header & Admin Upload Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30 mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>Special Wholesale Programs & Trade Media</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
                Wholesale Schemes, Trade Events & Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-sm hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Upload Scheme / Event / Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-brand-border/60 pb-4">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeSchemeTab === tab.id
                    ? 'bg-brand-gold text-brand-dark shadow-gold-sm'
                    : 'bg-brand-card hover:bg-brand-cardHover text-slate-300 border border-brand-border'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeSchemeTab === tab.id ? 'bg-black/20 text-brand-dark' : 'bg-brand-surface text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemesEvents
              .filter(item => activeSchemeTab === 'All' || item.type === activeSchemeTab)
              .map(item => {
                const isScheme = item.type === 'scheme';
                const isEvent = item.type === 'event';

                return (
                  <div
                    key={item.id}
                    className="bg-brand-card/80 border border-brand-border hover:border-brand-gold/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-black/50">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-80" />

                        {/* Badges on top of image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border ${
                            item.badgeColor === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : item.badgeColor === 'indigo'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : item.badgeColor === 'purple'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
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
                                className="p-1.5 rounded-lg bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-slate-200 border border-white/20 transition-colors cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-black/70 hover:bg-red-500 hover:text-white text-red-300 border border-white/20 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Date or Location floating badge */}
                        {(item.validTill || item.location) && (
                          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2 text-[11px] text-slate-300 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-white/10">
                            {item.validTill && (
                              <span className="flex items-center gap-1 font-medium truncate">
                                <Calendar className="w-3 h-3 text-brand-gold shrink-0" />
                                <span>{item.validTill}</span>
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1 font-medium truncate ml-auto text-amber-300">
                                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>{item.location}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <h4 className="text-base font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs font-semibold text-amber-300/90 leading-tight">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Promo Code Box for Schemes */}
                        {isScheme && item.discountCode && (
                          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-bold">
                                Wholesale Scheme Code:
                              </span>
                              <span className="font-mono font-bold text-white text-xs">
                                {item.discountCode}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copySchemeCode(item.discountCode)}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
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
                    <div className="px-5 pb-5 pt-2 border-t border-brand-border/40 flex items-center justify-between text-xs">
                      {item.terms ? (
                        <span className="text-[10px] text-slate-400 line-clamp-1 italic max-w-[200px]" title={item.terms}>
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
                        className="text-brand-gold hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ml-auto"
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
      <section className="py-20 bg-brand-darker border-y border-brand-border relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block mb-2">
              Distributor Excellence
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Why Premier Retailers Choose <span className="text-brand-gold">JMR Shooz</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              We eliminate wholesale friction with authentic stock allocations, flexible ordering terms, and strategic retail support designed to protect and expand your store profitability.
            </p>
          </div>

          {/* Grid of 6 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((prop) => (
              <div 
                key={prop.id}
                className="p-7 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/30 flex items-center justify-center mb-5 group-hover:bg-brand-gold/15 group-hover:border-brand-gold transition-colors">
                  {getPropIcon(prop.icon)}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-gold transition-colors">
                  {prop.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. BUSINESS STATISTICS SECTION (Editable Placeholders) */}
      <section className="py-16 bg-gradient-to-b from-brand-surface to-brand-dark relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Scale & Impact
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Distribution Network in Numbers
            </h3>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {statsData.map((stat) => (
              <div 
                key={stat.id}
                className="bg-brand-card/80 border border-brand-border p-6 rounded-2xl text-center relative group hover:border-brand-gold/50 transition-all"
              >
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-brand-gold tracking-tight group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-white mt-2">
                  {stat.label}
                </div>
                <p className="text-[10px] text-brand-muted mt-1">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. 3 OWNERS & CENTRAL GODOWN LOGISTICS SHOWCASE */}
      <section className="py-20 bg-brand-dark border-t border-brand-border relative">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Ownership & Direct Leadership</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
              3 Managing Partners & Central Distribution Godown
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct executive accountability and our central warehouse facility powering hundreds of retail footwear stores.
            </p>
          </div>

          {/* 3 OWNERS COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(threeOwnersData?.owners || []).map((o, idx) => (
              <div 
                key={o.id || idx}
                className="bg-brand-surface rounded-3xl border border-brand-border hover:border-brand-gold/50 p-6 shadow-xl transition-all flex flex-col justify-between relative group hover:shadow-gold-glow/10"
              >
                <div>
                  {/* Photo & Role Badge */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card mb-5 border border-brand-border/60">
                    <img
                      src={o.photo}
                      alt={o.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-dark/85 text-brand-gold border border-brand-gold/30">
                        Owner #{idx + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[11px] text-brand-gold font-bold uppercase tracking-wider block">
                        {o.experience || 'Footwear Industry Veteran'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">
                    {o.name}
                  </h3>
                  <p className="text-xs text-brand-gold font-medium mt-0.5">
                    {o.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {o.division}
                  </p>
                </div>

                {/* Direct Contact Coordinates */}
                <div className="mt-5 pt-4 border-t border-brand-border/60 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 hover:text-brand-gold transition-colors">
                    <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <a href={`tel:${o.phone}`} className="font-mono">
                      {o.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 hover:text-brand-gold transition-colors">
                    <Mail className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <a href={`mailto:${o.email}`} className="font-mono truncate">
                      {o.email}
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* CENTRAL GODOWN / WAREHOUSE FACILITY CARD */}
          {threeOwnersData?.godown && (
            <div className="bg-gradient-to-br from-brand-surface via-brand-card/90 to-brand-surface rounded-3xl border border-brand-gold/40 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[90px] rounded-full pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
                    <Warehouse className="w-4 h-4" />
                    <span>Central Footwear Storage & Logistics Hub</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {threeOwnersData.godown.facilityName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">Godown Address:</span>
                        <p>{threeOwnersData.godown.address}</p>
                        <p className="text-brand-gold mt-0.5">{threeOwnersData.godown.landmark}</p>
                        <p className="font-mono text-slate-400">{threeOwnersData.godown.city}, {threeOwnersData.godown.state} — {threeOwnersData.godown.pincode}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>Godown Helpline: <strong className="text-white font-mono">{threeOwnersData.godown.contactPhone}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>Dispatch Desk: <strong className="text-white font-mono">{threeOwnersData.godown.email}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Boxes className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>Facility Capacity: <strong className="text-brand-gold">{threeOwnersData.godown.storageCapacity}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end gap-3 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-brand-border/80 pt-6 lg:pt-0 lg:pl-8">
                  <div className="bg-brand-dark/80 px-4 py-3 rounded-2xl border border-brand-border w-full text-center">
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">Dispatch Turnaround</span>
                    <span className="text-lg font-bold text-brand-gold block">{threeOwnersData.godown.dispatchTime}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{threeOwnersData.godown.workingHours}</span>
                  </div>

                  <button
                    onClick={() => navigate('/owner')}
                    className="w-full py-3 px-5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
      <section className="py-16 bg-gradient-to-r from-brand-darker via-brand-surface to-brand-darker border-t border-brand-border text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-gold-sm">
            <Building2 className="w-6 h-6" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Distribute Premium Footwear in Your Retail Stores?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Get access to official wholesale line sheets, tier margin structures, and protected geographic stock allocations.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openEnquiryModal()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold-dark text-brand-dark font-black text-xs sm:text-sm uppercase tracking-widest hover:brightness-110 shadow-gold-glow transition-all cursor-pointer"
            >
              Submit Retail Business Enquiry
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-card hover:bg-brand-cardHover text-white border border-brand-border text-xs sm:text-sm uppercase tracking-widest font-semibold transition-colors cursor-pointer"
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
