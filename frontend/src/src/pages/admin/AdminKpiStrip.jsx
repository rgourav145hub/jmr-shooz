import { getRegisteredUsers } from '../../utils/storage';
import React from 'react';

const AdminKpiStrip = ({ brands = [], products = [], queries = [], setActiveTab }) => {
  const safeBrands = Array.isArray(brands) ? brands : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeQueries = Array.isArray(queries) ? queries : [];
  const safeUsers = Array.isArray(getRegisteredUsers()) ? getRegisteredUsers() : [];

  return (
    <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('brands')} className="bg-brand-surface p-5 rounded-2xl border border-brand-border cursor-pointer hover:bg-brand-surface/80 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Live Brands</span>
          <span className="text-3xl font-display font-extrabold text-brand-gold mt-1 block">{safeBrands.length}</span>
          <span className="text-[11px] text-slate-400">Liberty, Columbus, Aerowalk, etc.</span>
        </div>

        <div onClick={() => setActiveTab('products')} className="bg-brand-surface p-5 rounded-2xl border border-brand-border cursor-pointer hover:bg-brand-surface/80 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Active SKUs</span>
          <span className="text-3xl font-display font-extrabold text-white mt-1 block">{safeProducts.length}</span>
          <span className="text-[11px] text-slate-400">Wholesale Footwear Models</span>
        </div>

        <div onClick={() => setActiveTab('retailers')} className="bg-brand-surface p-5 rounded-2xl border border-brand-border cursor-pointer hover:bg-brand-surface/80 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Registered Retailers</span>
          <span className="text-3xl font-display font-extrabold text-white mt-1 block">
            {safeUsers.filter(u => u && (u.userType === 'retailer' || u.accountType === 'retailer') && u.status !== 'pending').length}
          </span>
          <span className="text-[11px] text-slate-400">Active B2B Stockists</span>
        </div>

        <div onClick={() => setActiveTab('queries')} className="bg-brand-surface p-5 rounded-2xl border border-brand-border cursor-pointer hover:bg-brand-surface/80 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Pending Queries</span>
          <span className="text-3xl font-display font-extrabold text-amber-400 mt-1 block">
            {safeQueries.filter(q => q && q.status === 'Pending').length}
          </span>
          <span className="text-[11px] text-slate-400">Requires Dispatch Review</span>
        </div>
      </div>
    </div>
  );
};

export default AdminKpiStrip;
