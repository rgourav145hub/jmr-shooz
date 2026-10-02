import ImageUploader from '../../components/ImageUploader';
import React from 'react';
import { Check, CheckCircle, Eye, Image as ImageIcon, Layers, Plus, RotateCcw, Trash2 } from 'lucide-react';

const BannersTab = ({ BANNER_PRESETS, activeTab, banners, bannersSuccess, handleAddBanner, handleResetBanners, handleDeleteBanner, newBanner, setNewBanner }) => {
  return (
    <>
{/* TAB 5: HOME BANNERS & IMAGES MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Homepage Dynamic Media Suite</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Homepage Hero Showcase & Promotional Banners</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Add, update, or remove the rotating footwear visual slides on the Homepage. Instant real-time updates for all website visitors.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                
                  <button
                    type="button"
                    onClick={() => window.open('/', '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Home Page</span>
                  </button>
                
                <button
                  type="button"
                  onClick={handleResetBanners}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {bannersSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Homepage promotional banner updated successfully! Check the live homepage slider.</span>
              </div>
            )}

            {/* ADD NEW BANNER SLIDE */}
            <div className="bg-brand-surface rounded-2xl border border-brand-gold/30 p-6 sm:p-8 shadow-xl">
              <div className="border-b border-brand-border/80 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Promotional Footwear Slide</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a 1-click curated footwear model preset or enter custom image URL and details.
                  </p>
                </div>
              </div>

              {/* 1-Click Curated Presets */}
              <div className="mb-6 bg-brand-card/60 rounded-xl p-4 border border-brand-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
                  ⚡ 1-Click Footwear Presets (Liberty, Columbus, Aerowalk, Leather Range, Fuel, Onsole):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {BANNER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewBanner(prev => ({ ...prev, ...preset }))}
                      className="p-2.5 rounded-lg bg-brand-dark/80 hover:bg-brand-gold/15 border border-brand-border hover:border-brand-gold/60 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-brand-gold block truncate">
                        {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                      </span>
                      <span className="text-[9px] text-brand-muted block uppercase tracking-wider truncate">
                        {preset.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Inputs */}
                <form onSubmit={handleAddBanner} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Shoe / Model Title <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      placeholder="e.g. Liberty Fortune Executive Derby"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      placeholder="e.g. Ultra-Comfort Micro-Cushion Sole with Full-Grain Burnished Leather"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Highlight</label>
                      <input
                        type="text"
                        value={newBanner.badge}
                        onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
                        placeholder="e.g. Trending Wholesale SKU"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Footwear Category Tag</label>
                      <input
                        type="text"
                        value={newBanner.tag}
                        onChange={(e) => setNewBanner({ ...newBanner, tag: e.target.value })}
                        placeholder="e.g. Formal / Sports / Daily Comfort"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Suggested Retail MSRP</label>
                      <input
                        type="text"
                        value={newBanner.suggestedRetail}
                        onChange={(e) => setNewBanner({ ...newBanner, suggestedRetail: e.target.value })}
                        placeholder="e.g. ₹2,499 / pair"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Wholesale Trade Rate</label>
                      <input
                        type="text"
                        value={newBanner.wholesaleRate}
                        onChange={(e) => setNewBanner({ ...newBanner, wholesaleRate: e.target.value })}
                        placeholder="e.g. ₹1,150 / pair"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Promotional Image URL <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={newBanner.imageUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                      placeholder="Paste direct image URL (Unsplash, CDN, or uploaded link)"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Slide to Homepage Hero Carousel</span>
                    </button>
                  </div>
                </form>

                {/* Live Card Preview */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Live Homepage Preview:</span>
                    <span className="text-[10px] text-brand-gold font-mono">Hero Visual Mockup</span>
                  </div>

                  <div className="flex-grow rounded-2xl bg-gradient-to-b from-brand-card to-brand-dark border border-brand-gold/40 p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-wider border border-brand-gold/30">
                          {newBanner.tag || 'Footwear'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {newBanner.badge || 'Distributor Allocation'}
                        </span>
                      </div>

                      <div className="w-full h-44 rounded-xl overflow-hidden bg-brand-dark border border-brand-border relative mb-3">
                        <img
                          src={newBanner.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>

                      <h5 className="text-base font-bold text-white leading-tight">
                        {newBanner.title || 'Footwear Model Title'}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {newBanner.subtitle || 'High-grade sole construction with maximum retail turnover.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-brand-muted block uppercase">Wholesale Trade</span>
                        <span className="font-bold text-brand-gold font-mono">{newBanner.wholesaleRate || '₹0 / pair'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-muted block uppercase">Retail MSRP</span>
                        <span className="font-medium text-slate-300 font-mono line-through">{newBanner.suggestedRetail || '₹0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE BANNERS LIST */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border/80">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-gold" />
                    <span>Active Slides on Homepage Carousel ({banners.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    These slides rotate automatically on the hero section of the Homepage. Retailers and visitors can browse through them.
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                  {banners.length} Live Slides
                </span>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12 bg-brand-card/30 rounded-2xl border border-dashed border-brand-border">
                  <ImageIcon className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-bold">No slides active</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Add a new slide above or restore default curated footwear slides.</p>
                  <button
                    type="button"
                    onClick={handleResetBanners}
                    className="px-4 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110"
                  >
                    Restore Default Slides
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id || index}
                      className="bg-brand-card rounded-2xl border border-brand-border/80 overflow-hidden hover:border-brand-gold/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-40 bg-brand-dark overflow-hidden">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20">
                            Slide #{index + 1}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold">
                            {banner.tag || 'Footwear'}
                          </div>
                        </div>

                        <div className="p-4">
                          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mb-1">
                            {banner.badge || 'Distributor SKU'}
                          </span>
                          <h5 className="font-bold text-white text-xs leading-snug line-clamp-1">
                            {banner.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {banner.subtitle}
                          </p>

                          <div className="mt-3 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Wholesale: <strong className="text-brand-gold font-mono">{banner.wholesaleRate || 'Trade'}</strong></span>
                            <span className="text-slate-400">MSRP: <strong className="text-slate-300 font-mono">{banner.suggestedRetail || 'MSRP'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-brand-dark/50 border-t border-brand-border flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active on Hero
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 border border-red-500/30 transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        

        
      )}
    </>
  );
};

export default BannersTab;
