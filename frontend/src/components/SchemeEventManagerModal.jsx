import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Tag, 
  MapPin, 
  FileText, 
  Sparkles, 
  Trash2, 
  Save, 
  CheckCircle, 
  Flame, 
  Camera, 
  Info,
  Gift
} from 'lucide-react';
import { 
  apiGetSchemesEvents, 
  apiCreateSchemeEvent, 
  apiUpdateSchemeEvent, 
  apiDeleteSchemeEvent 
} from '../services/api';

const PRESET_SHOWCASE_IMAGES = [
  {
    name: 'Festive B2B Scheme',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
    type: 'scheme'
  },
  {
    name: 'Trade Expo & Exhibition',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    type: 'event'
  },
  {
    name: 'Warehouse & Cargo Logistics',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    type: 'scheme'
  },
  {
    name: 'Modern Barcoded Godown',
    url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
    type: 'photo'
  },
  {
    name: 'Footwear Retail Showroom',
    url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=80',
    type: 'photo'
  },
  {
    name: 'Executive Dealer Meet',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
    type: 'event'
  }
];

export default function SchemeEventManagerModal({ isOpen, onClose, editingItem, onSaved, onNotification }) {
  const [formData, setFormData] = useState({
    type: 'scheme', // 'scheme' | 'event' | 'photo'
    title: '',
    subtitle: '',
    badge: '🔥 Trade Scheme',
    badgeColor: 'amber',
    validTill: '',
    location: '',
    discountCode: '',
    image: '',
    description: '',
    terms: ''
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || 'scheme',
        title: editingItem.title || '',
        subtitle: editingItem.subtitle || '',
        badge: editingItem.badge || (editingItem.type === 'scheme' ? '🔥 Trade Scheme' : editingItem.type === 'event' ? '📅 Trade Event' : '📸 Gallery Photo'),
        badgeColor: editingItem.badgeColor || 'amber',
        validTill: editingItem.validTill || '',
        location: editingItem.location || '',
        discountCode: editingItem.discountCode || '',
        image: editingItem.image || '',
        description: editingItem.description || '',
        terms: editingItem.terms || ''
      });
      setImagePreview(editingItem.image || '');
    } else {
      setFormData({
        type: 'scheme',
        title: '',
        subtitle: '',
        badge: '🔥 Trade Scheme',
        badgeColor: 'amber',
        validTill: 'Valid till 31st Oct 2026',
        location: 'All Pan-India Retailers',
        discountCode: 'JMR-FESTIVE-15',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
        description: '',
        terms: 'Applicable on wholesale orders of 15 sets or more. Fast dispatch via central godown.'
      });
      setImagePreview('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleTypeSelect = (type) => {
    let defaultBadge = '🔥 Trade Scheme';
    let defaultColor = 'amber';
    if (type === 'event') {
      defaultBadge = '📅 Upcoming Event';
      defaultColor = 'indigo';
    } else if (type === 'photo') {
      defaultBadge = '📸 Facility Photo';
      defaultColor = 'purple';
    }

    setFormData(prev => ({
      ...prev,
      type,
      badge: defaultBadge,
      badgeColor: defaultColor
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Title.');
      return;
    }
    if (!formData.image.trim()) {
      alert('Please upload an image or enter an Image URL.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem?.id) {
        await apiUpdateSchemeEvent(editingItem.id, formData);
        if (onNotification) {
          onNotification({
            message: 'Showcase Item Updated',
            subtext: `"${formData.title}" has been updated on the Home Page.`
          });
        }
      } else {
        await apiCreateSchemeEvent(formData);
        if (onNotification) {
          onNotification({
            message: 'New Item Published',
            subtext: `"${formData.title}" is now active on the Home Page.`
          });
        }
      }

      setLoading(false);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setLoading(false);
      alert('Error saving showcase item. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!editingItem?.id) return;
    if (window.confirm(`Are you sure you want to delete "${editingItem.title}"?`)) {
      setLoading(true);
      await apiDeleteSchemeEvent(editingItem.id);
      setLoading(false);
      if (onNotification) {
        onNotification({
          message: 'Item Deleted',
          subtext: `Removed from Home Page showcase.`
        });
      }
      if (onSaved) onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-brand-dark border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingItem ? 'Edit Scheme / Event / Photo' : 'Upload Scheme / Event / Photo'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Home Page Showcase Desk · Add wholesale schemes, trade events, or warehouse photos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-brand-card text-slate-300 hover:text-white border border-brand-border cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Item Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
              Select Category (कैटेगरी चुनें) *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleTypeSelect('scheme')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  formData.type === 'scheme'
                    ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 shadow-gold-sm'
                    : 'bg-brand-card border-brand-border text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Trade Scheme</span>
                  <span className="text-[10px] text-amber-300/80">योजना / छूट</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('event')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  formData.type === 'event'
                    ? 'bg-indigo-500/15 border-indigo-500/80 text-indigo-300 shadow-gold-sm'
                    : 'bg-brand-card border-brand-border text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Trade Event</span>
                  <span className="text-[10px] text-indigo-300/80">इवेंट / एक्सपो</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('photo')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  formData.type === 'photo'
                    ? 'bg-purple-500/15 border-purple-500/80 text-purple-300 shadow-gold-sm'
                    : 'bg-brand-card border-brand-border text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Photo / Gallery</span>
                  <span className="text-[10px] text-purple-300/80">फोटो / गोदाम</span>
                </div>
              </button>
            </div>
          </div>

          {/* Image Upload & Presets */}
          <div className="bg-brand-card/60 p-4 rounded-2xl border border-brand-border space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Showcase Banner / Photo (फोटो अपलोड या URL) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-black/40 aspect-video flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800')}
                  />
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span>No image selected</span>
                  </div>
                )}
                {formData.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-brand-gold text-[10px] font-bold border border-brand-gold/40">
                    {formData.badge}
                  </span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Option A: Upload File from Phone / Computer
                  </span>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-card border border-dashed border-brand-border hover:border-brand-gold text-slate-300 hover:text-white cursor-pointer transition-colors text-xs">
                    <Upload className="w-4 h-4 text-brand-gold" />
                    <span>Choose Photo File (Max 5MB)</span>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <span className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Option B: Or Paste Image URL
                  </span>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, image: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Quick Footwear Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SHOWCASE_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: preset.url }));
                          setImagePreview(preset.url);
                        }}
                        className="px-2 py-0.5 rounded bg-brand-surface hover:bg-brand-gold/20 text-slate-300 hover:text-brand-gold border border-brand-border text-[10px] transition-colors cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Title (शीर्षक) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Diwali Festive Booking: 15 Sets Par 1 Set Free!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Subtitle / Tagline (सब-टाइटल)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Exclusive Wholesale Retailer Pre-Booking Offer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Badge & Dates/Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Display Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. 🔥 Trade Scheme"
                className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Validity / Event Date
              </label>
              <input
                type="text"
                value={formData.validTill}
                onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                placeholder="e.g. Valid till 31st Oct 2026"
                className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                {formData.type === 'scheme' ? 'Promo / Scheme Code' : 'Location / Station'}
              </label>
              <input
                type="text"
                value={formData.type === 'scheme' ? formData.discountCode : formData.location}
                onChange={(e) => {
                  if (formData.type === 'scheme') {
                    setFormData({ ...formData, discountCode: e.target.value });
                  } else {
                    setFormData({ ...formData, location: e.target.value });
                  }
                }}
                placeholder={formData.type === 'scheme' ? 'e.g. JMR-DIWALI-15' : 'e.g. Pragati Maidan, New Delhi'}
                className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Detailed Description (विस्तृत विवरण)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Scheme highlights, carton allocation details, discounts, delivery guarantees..."
              className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Terms & Conditions / Guidelines (शर्तें एवं नियम)
            </label>
            <input
              type="text"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              placeholder="e.g. Applicable on confirmed orders of 15 sets or more. 1 scheme per GSTIN."
              className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
            {editingItem?.id ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-surface text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-brand-border"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark hover:brightness-110 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-gold-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish to Home Page'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
