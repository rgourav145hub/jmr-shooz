import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getStoredBrands } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { useAdminEdit } from '../contexts/AdminEditContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Globe, 
  Clock, 
  PackageCheck,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';

const BrandsPage = function({ openAuthModal, openEnquiryModal, onEnquireBrand }) {
  const navigate = useNavigate();
  const [brands, setBrands] = useState(() => getStoredBrands());
  const { currentUser, isAdmin, isMasterAdmin, hasPermission } = useAuth();
  const { isEditModeActive, openEditBrand, openAddBrand, confirmDeleteBrand } = useAdminEdit();

  const canEdit = isAdmin && isEditModeActive && hasPermission('manage_brands');
  const canDelete = isAdmin && isEditModeActive && (isMasterAdmin || hasPermission('delete_brands'));

  useEffect(() => {
    setBrands(getStoredBrands());
    const handleUpdate = () => setBrands(getStoredBrands());
    window.addEventListener('jmr_brands_updated', handleUpdate);
    return () => window.removeEventListener('jmr_brands_updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Page Header */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Official Footwear Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Brands Distributed by <span className="text-brand-gold">JMR Shooz</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            We hold exclusive national and regional distribution contracts for world-class footwear brands. Every brand in our portfolio is backed by genuine manufacturer agreements, dedicated marketing kits, and predictable warehouse stock replenishment.
          </p>

          {/* Admin Add Brand CTA */}
          {canEdit && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={openAddBrand}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Brand Portfolio (Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brands Detailed Showcase List */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {brands.map((brand, index) => (
          <div 
            key={brand.id}
            className="bg-brand-surface rounded-3xl border border-brand-border hover:border-brand-gold/40 transition-all duration-300 overflow-hidden shadow-xl relative"
          >
            {/* Admin Brand Controls Bar */}
            {(canEdit || canDelete) && (
              <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-b border-amber-400/30 px-6 py-2 flex items-center justify-between z-20">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Authority: {brand.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => openEditBrand(brand)}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Brand Details</span>
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => confirmDeleteBrand(brand)}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Brand</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Brand Visual Column */}
              <div className={`lg:col-span-5 relative min-h-[320px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img 
                  src={brand.bannerImage} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface lg:from-transparent lg:to-black/30"></div>

                {/* Floating Brand Monogram */}
                <div className="absolute bottom-4 left-4 bg-brand-darker/90 backdrop-blur-md p-4 rounded-2xl border border-brand-border flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold font-display font-extrabold text-xl">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-none">{brand.name}</h4>
                    <span className="text-[11px] text-brand-muted uppercase tracking-wider">{brand.logoSubtext}</span>
                  </div>
                </div>
              </div>

              {/* Brand Content & Specs Column */}
              <div className={`lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                      {brand.partnershipType}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 bg-brand-card border border-brand-border">
                      Origin: {brand.origin}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 bg-brand-card border border-brand-border">
                      Est. {brand.established}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {brand.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-brand-gold mt-1">
                    {brand.tagline}
                  </p>

                  <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                    {brand.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                    {(brand.highlights || []).filter(h => !h.toLowerCase().includes('margin')).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 bg-brand-card/40 p-2.5 rounded-lg border border-brand-border/40">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Distribution Metrics */}
                  <div className="mt-6 pt-5 border-t border-brand-border/60 grid grid-cols-3 gap-3 text-center sm:text-left">
                    <div className="bg-brand-card/70 p-3 rounded-xl border border-brand-border/40">
                      <span className="text-brand-muted block text-[10px] uppercase tracking-wider">Dispatch Hub</span>
                      <span className="font-bold text-brand-gold text-sm sm:text-base">{brand.stats?.leadTime || '24-48 Hours'}</span>
                    </div>
                    <div className="bg-brand-card/70 p-3 rounded-xl border border-brand-border/40">
                      <span className="text-brand-muted block text-[10px] uppercase tracking-wider">Standard MOQ</span>
                      <span className="font-bold text-white text-sm sm:text-base">{brand.moq}</span>
                    </div>
                    <div className="bg-brand-card/70 p-3 rounded-xl border border-brand-border/40">
                      <span className="text-brand-muted block text-[10px] uppercase tracking-wider">Territory</span>
                      <span className="font-bold text-white text-sm sm:text-base">{brand.stats?.territory || 'National Network'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-5 border-t border-brand-border flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => {
                      if (onEnquireBrand) onEnquireBrand(brand);
                      else openEnquiryModal();
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Enquire Wholesale for {brand.name}</span>
                  </button>

                  {currentUser ? (
                    <button
                      onClick={() => navigate(`/products?brand=${brand.id}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>View Brand SKUs</span>
                      <ArrowRight className="w-4 h-4 text-brand-gold" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthModal ? openAuthModal('login', 'retailer') : navigate('/retailer')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/30 text-amber-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      title="Retailer login required to view articles and prices"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>🔒 Login to View SKUs & Prices</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Brand Distribution Application Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-radial-gradient bg-brand-surface border border-brand-gold/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Are You a Footwear Brand Seeking Distribution?
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mt-3">
            JMR Shooz actively partners with international footwear manufacturers seeking reliable, high-volume retail penetration across departmental stores and footwear boutique networks.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => openEnquiryModal()}
              className="px-8 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest shadow-gold-sm transition-all cursor-pointer"
            >
              Propose Brand Distribution Partnership
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default React.memo(BrandsPage);
