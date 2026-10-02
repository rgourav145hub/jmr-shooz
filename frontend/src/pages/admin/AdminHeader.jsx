import React from 'react';
import { Database, Package, Plus, ShieldCheck, Upload } from 'lucide-react';

const AdminHeader = ({ setShowAddBrandModal, setShowAddProductModal }) => {
  return (
    <>
{/* Top Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30">
                  Executive Control Suite
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <Database className="w-3 h-3" />
                  <span>Cloud Database Connected</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                JMR Shooz — Distribution Admin Portal
              </h1>
              <p className="text-xs text-brand-muted mt-0.5">
                Manage Brand Portfolios, Footwear Listings, Retailer Accounts & Inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddBrandModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Brand</span>
            </button>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Package className="w-4 h-4 text-brand-gold" />
              <span>Add Shoe Listing</span>
            </button>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default AdminHeader;
