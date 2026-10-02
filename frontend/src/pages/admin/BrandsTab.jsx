import React, { useState } from 'react';
import { Trash2, Edit3, Plus, Building2, Search, ExternalLink } from 'lucide-react';

export default function BrandsTab({ activeTab, brands = [], setShowAddBrandModal, onEditBrand, onDeleteBrand }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (activeTab !== 'brands') return null;

  const filteredBrands = brands.filter(b => 
    !searchTerm || 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.origin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3 h-3" />
            <span>Authorized Portfolios ({brands.length} Brands)</span>
          </div>
          <h3 className="font-bold text-white text-lg">Active Distributed Footwear Brands</h3>
          <p className="text-xs text-brand-muted">
            Manage official brand partnerships, retail margin brackets, and distribution hubs.
          </p>
        </div>

        <button
          onClick={() => setShowAddBrandModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-gold-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-brand-card/40 border-b border-brand-border/60">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by brand name, origin..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Origin / Hub</th>
              <th className="py-3 px-4">Retail Margin</th>
              <th className="py-3 px-4">Carton MOQ</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                  No brands match your search.
                </td>
              </tr>
            ) : (
              filteredBrands.map((b) => (
                <tr key={b.id} className="hover:bg-brand-card/40 transition-colors">
                  
                  {/* Brand info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {b.bannerImage ? (
                        <img 
                          src={b.bannerImage} 
                          alt={b.name} 
                          className="w-10 h-10 object-cover rounded-lg bg-black/40 border border-brand-border shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand-card border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0">
                          {b.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block text-sm">{b.name}</span>
                        <span className="text-[10px] text-brand-muted line-clamp-1">{b.tagline || b.partnershipType}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-slate-200">{b.category}</td>

                  {/* Origin */}
                  <td className="py-3.5 px-4 text-slate-400">{b.origin}</td>

                  {/* Retail Margin */}
                  <td className="py-3.5 px-4 text-brand-gold font-bold">{b.retailMargin}</td>

                  {/* MOQ */}
                  <td className="py-3.5 px-4 font-mono">{b.moq || b.cartonSize || '36 pairs'}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      Active Partner
                    </span>
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditBrand(b)}
                        className="p-2 rounded-lg bg-brand-card hover:bg-blue-600/30 text-blue-400 hover:text-blue-200 border border-blue-500/20 transition-colors cursor-pointer"
                        title="Edit Brand"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteBrand(b.id, b.name)}
                        className="p-2 rounded-lg bg-brand-card hover:bg-red-950/80 text-red-400 hover:text-red-200 border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete Brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
