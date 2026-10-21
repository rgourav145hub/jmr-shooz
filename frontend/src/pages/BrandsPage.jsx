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
    <div className="min-h-screen bg-[#f1f2f4] pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-800">
      
      {/* Page Header */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-[#2874f0] text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>Official Footwear Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Brands Distributed by <span className="text-[#2874f0]">JMR Shooz</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We hold exclusive national and regional distribution contracts for world-class footwear brands. Every brand in our portfolio is backed by genuine manufacturer agreements, dedicated marketing kits, and predictable warehouse stock replenishment.
          </p>

          {/* Admin Add Brand CTA */}
          {canEdit && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={openAddBrand}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Brand Portfolio (Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brands Detailed Showcase List */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {brands.map((brand, index) => (
          <div 
            key={brand.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md relative"
          >
            {/* Admin Brand Controls Bar */}
            {(canEdit || canDelete) && (
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between z-20">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Authority: {brand.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => openEditBrand(brand)}
                      className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Brand Details</span>
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => confirmDeleteBrand(brand)}
                      className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
              <div className={`lg:col-span-5 relative min-h-[300px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img 
                  src={brand.bannerImage} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Floating Brand Monogram */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-md">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2874f0] font-display font-extrabold text-lg">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-none">{brand.name}</h4>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider">{brand.logoSubtext}</span>
                  </div>
                </div>
              </div>

              {/* Brand Content & Specs Column */}
              <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-[#2874f0] border border-blue-200">
                      {brand.partnershipType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200">
                      Origin: {brand.origin}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200">
                      Est. {brand.established}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {brand.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#2874f0] mt-0.5">
                    {brand.tagline}
                  </p>

                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {brand.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {(brand.highlights || []).filter(h => !h.toLowerCase().includes('margin')).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#388e3c] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Distribution Metrics */}
                  <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center sm:text-left">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Dispatch Hub</span>
                      <span className="font-bold text-[#2874f0] text-sm">{brand.stats?.leadTime || '24-48 Hours'}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Standard MOQ</span>
                      <span className="font-bold text-slate-900 text-sm">{brand.moq}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Territory</span>
                      <span className="font-bold text-slate-900 text-sm">{brand.stats?.territory || 'National'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      if (onEnquireBrand) onEnquireBrand(brand);
                      else openEnquiryModal();
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-md bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Enquire Wholesale for {brand.name}</span>
                  </button>

                  {currentUser ? (
                    <button
                      onClick={() => navigate(`/products?brand=${brand.id}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>View Brand SKUs</span>
                      <ArrowRight className="w-4 h-4 text-[#2874f0]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthModal ? openAuthModal('login', 'retailer') : navigate('/retailer')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-md bg-white hover:bg-blue-50 border border-[#2874f0] text-[#2874f0] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      title="Retailer login required to view articles and prices"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
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
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Are You a Footwear Brand Seeking Distribution?
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
            JMR Shooz actively partners with international footwear manufacturers seeking reliable, high-volume retail penetration across departmental stores and footwear boutique networks.
          </p>
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => openEnquiryModal()}
              className="px-8 py-3 rounded-md bg-[#2874f0] hover:bg-[#1a62d6] text-white font-bold text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer"
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
