import React, { useState, useEffect } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  RotateCcw,
  ExternalLink,
  Tag,
  ArrowRight
} from 'lucide-react';
import { 
  getHomeBanners, 
  saveHomeBanner, 
  deleteHomeBanner, 
  resetHomeBanners 
} from '../utils/storage';

const PRESET_IMAGES = [
  {
    name: 'Italian Blake Stitch Formal',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
    title: 'Veloce Milano Formal Sovereign',
    subtitle: 'Handcrafted Blake Stitch Genuine Italian Soles',
    badge: 'Flagship Luxury Line',
    tag: 'Formal Wholesale',
    suggestedRetail: '₹4,999 / pair',
    wholesaleRate: '₹2,250 / pair'
  },
  {
    name: 'Athletic Nitro Runner',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    title: 'Columbus Velocity Nitro Running Sneakers',
    subtitle: 'High-Rebound Dual-Density EVA Cushioning & Breathable Knit',
    badge: 'High Sell-Through',
    tag: 'Sports & Activewear',
    suggestedRetail: '₹2,499 / pair',
    wholesaleRate: '₹1,150 / pair'
  },
  {
    name: 'Ergonomic PU Comfort Slides',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    title: 'Aerowalk Featherlite Cloud Slides',
    subtitle: 'Direct Injected PU Sole with Anatomical Arch Support',
    badge: 'Daily High Demand',
    tag: 'Comfort Footwear',
    suggestedRetail: '₹899 / pair',
    wholesaleRate: '₹380 / pair'
  },
  {
    name: 'Genuine Leather Brogue',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80',
    title: 'Leather Range Imperial Heritage Brogue',
    subtitle: 'Burnished Tan Crust Leather with Goodyear Welt Construction',
    badge: '100% Genuine Leather',
    tag: 'Pure Leather',
    suggestedRetail: '₹5,499 / pair',
    wholesaleRate: '₹2,600 / pair'
  },
  {
    name: 'Urban Street Sneaker',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    title: 'Fuel HyperStreet Active Sneakers',
    subtitle: 'Shock Absorbing Cupsole with Aerodynamic Mesh Panels',
    badge: 'Youth Trending',
    tag: 'Lifestyle Sneakers',
    suggestedRetail: '₹2,799 / pair',
    wholesaleRate: '₹1,290 / pair'
  },
  {
    name: 'Executive Derby Classic',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80',
    title: 'Liberty Fortune Executive Derby',
    subtitle: 'Premium Full Grain Leather with Microfiber Ortho Insole',
    badge: 'Corporate Standard',
    tag: 'Formal Footwear',
    suggestedRetail: '₹3,299 / pair',
    wholesaleRate: '₹1,520 / pair'
  }
];

export default function HomeImageManagerModal({ isOpen, onClose, onBannerSaved }) {
  const [banners, setBanners] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    badge: 'Featured Showcase',
    tag: 'B2B Wholesale',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
    suggestedRetail: '₹2,999 / pair',
    wholesaleRate: '₹1,400 / pair'
  });
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBanners(getHomeBanners());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setNewSlide({
      title: preset.title,
      subtitle: preset.subtitle,
      badge: preset.badge,
      tag: preset.tag,
      imageUrl: preset.url,
      suggestedRetail: preset.suggestedRetail,
      wholesaleRate: preset.wholesaleRate
    });
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.imageUrl) return;

    const saved = saveHomeBanner(newSlide);
    setBanners(getHomeBanners());
    setActiveTab('list');
    setToastMsg('New Home Page Showcase Image Added!');
    setTimeout(() => setToastMsg(''), 3000);
    if (onBannerSaved) onBannerSaved(saved);
  };

  const handleDelete = (id) => {
    if (banners.length <= 1) {
      alert('You must keep at least 1 image on the home page showcase.');
      return;
    }
    deleteHomeBanner(id);
    setBanners(getHomeBanners());
    setToastMsg('Image removed from showcase.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset homepage images to original showcase?')) {
      const def = resetHomeBanners();
      setBanners(def);
      setToastMsg('Reset to default promotional images.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-dark/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Home Page Image & Showcase Manager
              </h3>
              <p className="text-xs text-brand-muted">
                Add, change or remove promotional images displayed in the main homepage hero.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-brand-card text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-brand-border bg-brand-card/40 px-6 gap-3">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Active Images ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'add'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Banner / Image</span>
          </button>
        </div>

        {/* Notification Toast */}
        {toastMsg && (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 py-2.5 px-6 flex items-center gap-2 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          
          {/* TAB 1: LIST ACTIVE BANNERS */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  These images rotate or can be clicked by visitors on the Home Page hero section.
                </span>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-brand-gold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Factory Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-brand-card/70 border border-brand-border hover:border-brand-gold/40 transition-all flex flex-col justify-between space-y-3 relative group"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-brand-dark border border-brand-border/60">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-dark/80 text-brand-gold border border-brand-gold/30">
                          {item.badge || 'Showcase'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-dark">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold block">
                        {item.tag || 'Wholesale Line'}
                      </span>
                      <h4 className="font-bold text-white text-xs sm:text-sm mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {item.subtitle}
                      </p>
                      {(item.wholesaleRate || item.suggestedRetail) && (
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 bg-brand-dark/50 p-1.5 rounded-lg border border-brand-border/40">
                          <span>Trade: <strong className="text-brand-gold">{item.wholesaleRate}</strong></span>
                          <span>MRP: <strong className="text-white">{item.suggestedRetail}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-brand-border/50 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Live on Homepage</span>
                      </span>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 hover:text-white border border-rose-800/50 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light shadow-gold-sm transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Home Image</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW BANNER FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSlide} className="space-y-6">
              
              {/* Presets Gallery */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose from Quick Footwear Presets (1-Click Select)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_IMAGES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-gold text-left transition-all group"
                    >
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-brand-dark mb-1.5">
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 block truncate">{p.name}</span>
                      <span className="text-[10px] text-brand-gold block">{p.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL & Live Preview */}
              <div className="pt-2 border-t border-brand-border/60">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Image Source URL (Paste your image link or upload host) *
                </label>
                <input
                  type="url"
                  required
                  value={newSlide.imageUrl}
                  onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

              {/* Preview banner */}
              <div className="p-4 rounded-2xl bg-brand-card/80 border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-brand-muted block mb-2">
                  Live Banner Preview
                </span>
                <div className="relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden bg-brand-dark border border-brand-gold/30">
                  <img
                    src={newSlide.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-transparent to-transparent"></div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-dark/80 text-brand-gold border border-brand-gold/40">
                      {newSlide.badge || 'Showcase'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                      {newSlide.tag || 'Wholesale'}
                    </span>
                    <h5 className="font-bold text-white text-sm">
                      {newSlide.title || 'Your Shoe Model Name'}
                    </h5>
                    <p className="text-[11px] text-slate-300 truncate">
                      {newSlide.subtitle || 'Shoe specifications and wholesale features'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Headline & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shoe / Brand Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    placeholder="e.g. Liberty Fortune Executive Derby"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge / Tagline
                  </label>
                  <input
                    type="text"
                    value={newSlide.badge}
                    onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                    placeholder="e.g. Festive Fast Seller"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle / Specification Description
                </label>
                <input
                  type="text"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted Blake Stitch with Direct PU Anti-Slip Outsole"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={newSlide.tag}
                    onChange={(e) => setNewSlide({ ...newSlide, tag: e.target.value })}
                    placeholder="e.g. Formal / Sports"
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Wholesale Trade Rate</label>
                  <input
                    type="text"
                    value={newSlide.wholesaleRate}
                    onChange={(e) => setNewSlide({ ...newSlide, wholesaleRate: e.target.value })}
                    placeholder="e.g. ₹1,250 / pair"
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs text-brand-gold font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Suggested Retail (MRP)</label>
                  <input
                    type="text"
                    value={newSlide.suggestedRetail}
                    onChange={(e) => setNewSlide({ ...newSlide, suggestedRetail: e.target.value })}
                    placeholder="e.g. ₹2,999 / pair"
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light shadow-gold-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Homepage Showcase</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
