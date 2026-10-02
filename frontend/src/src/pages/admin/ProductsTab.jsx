import React, { useState } from 'react';
import { Trash2, Edit3, Search, Plus, Package, Eye, Star } from 'lucide-react';

export default function ProductsTab({ activeTab, products = [], setShowAddProductModal, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (activeTab !== 'products') return null;

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Package className="w-3 h-3" />
            <span>Master Inventory ({products.length} SKUs)</span>
          </div>
          <h3 className="font-bold text-white text-lg">Wholesale Footwear SKU Directory</h3>
          <p className="text-xs text-brand-muted">
            Add new shoes, modify wholesale rates, edit specs, or remove discontinued lines.
          </p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-gold-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shoe Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-brand-card/40 border-b border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by model, brand, SKU..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Formal', 'Athletic', 'Casual', 'Boots'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-colors shrink-0 cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-brand-gold text-brand-dark font-bold' 
                  : 'bg-brand-card hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Model & SKU</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Wholesale Rate</th>
              <th className="py-3 px-4">Retail MSRP</th>
              <th className="py-3 px-4">Carton MOQ</th>
              <th className="py-3 px-4">Stock Tag</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                  No footwear models match your search or filter.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-brand-card/40 transition-colors">
                  
                  {/* Model & SKU */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-11 h-11 object-cover rounded-lg bg-black/40 border border-brand-border shrink-0" 
                      />
                      <div>
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        <span className="text-[10px] text-brand-muted font-mono">{p.sku}</span>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-card text-brand-gold font-semibold border border-brand-border">
                      {p.brandName}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-slate-300">{p.category}</td>

                  {/* Wholesale Price */}
                  <td className="py-3.5 px-4 text-amber-300 font-mono font-bold text-sm">
                    {p.wholesaleRate ? (p.wholesaleRate.startsWith('₹') ? p.wholesaleRate : `₹${p.wholesaleRate}`) : '₹650'}
                  </td>

                  {/* MSRP */}
                  <td className="py-3.5 px-4 text-slate-300 line-through">
                    {p.suggestedRetailPrice}
                  </td>

                  {/* MOQ */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                    {p.moq || p.cartonSize || '36 Pairs'}
                  </td>

                  {/* Tag */}
                  <td className="py-3.5 px-4">
                    {p.tag ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30">
                        {p.tag}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">—</span>
                    )}
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditProduct(p)}
                        className="p-2 rounded-lg bg-brand-card hover:bg-blue-600/30 text-blue-400 hover:text-blue-200 border border-blue-500/20 transition-colors cursor-pointer"
                        title="Edit Shoe Specs & Pricing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteProduct(p.id, p.name)}
                        className="p-2 rounded-lg bg-brand-card hover:bg-red-950/80 text-red-400 hover:text-red-200 border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete SKU"
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
