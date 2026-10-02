import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { apiUpdateCompanySettings } from '../../services/api';
import { 
  Save, 
  CheckCircle, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { INITIAL_COMPANY_SETTINGS } from '../../utils/storage';

export default function WebsiteSettingsTab() {
  const { settings, refreshSettings } = useData();
  const [formData, setFormData] = useState(INITIAL_COMPANY_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('ticker'); // 'ticker', 'deal', 'hero', 'company', 'social'

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...settings
      }));
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiUpdateCompanySettings(formData);
      if (refreshSettings) await refreshSettings();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all website settings and announcements to factory default?')) {
      setFormData(INITIAL_COMPANY_SETTINGS);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Master Content Management System (CMS)</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">Full Website Content & Announcement Control</h2>
          <p className="text-xs text-brand-muted mt-1">
            Edit text, prices, announcements, top tickers, deal strips, and company coordinates live across the entire website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Website content updated live! Changes are instantly reflected across Header, Homepage, and Footer.</span>
        </div>
      )}

      {/* Segmented Control Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3 overflow-x-auto">
        {[
          { id: 'ticker', label: '1. Top Deal Ticker', icon: Zap },
          { id: 'deal', label: '2. Lightning Deal Strip', icon: Flame },
          { id: 'hero', label: '3. Homepage Hero Banner', icon: Sparkles },
          { id: 'company', label: '4. Contact & GST Coordinates', icon: MapPin },
          { id: 'social', label: '5. Social & About Summary', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                activeSubTab === tab.id
                  ? 'bg-brand-gold text-brand-dark shadow-gold-sm'
                  : 'bg-brand-card hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-surface rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xl">
        
        {/* SUB-TAB 1: TOP DEAL TICKER */}
        {activeSubTab === 'ticker' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Top Navbar Wholesale Deal Ticker</span>
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Appears at the very top of every page (above the logo & search bar).
                </p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer bg-brand-card px-3.5 py-1.5 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  name="tickerActive"
                  checked={formData.tickerActive !== false}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">Enable Ticker</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ticker Badge (Pill)
                </label>
                <input
                  type="text"
                  name="tickerBadge"
                  value={formData.tickerBadge || ''}
                  onChange={handleChange}
                  placeholder="e.g. B2B SUPER SALE"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Trade Support Phone / WhatsApp
                </label>
                <input
                  type="text"
                  name="tickerPhone"
                  value={formData.tickerPhone || ''}
                  onChange={handleChange}
                  placeholder="e.g. +91 98111 22334"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Main Announcement Headline
              </label>
              <input
                type="text"
                name="tickerText"
                value={formData.tickerText || ''}
                onChange={handleChange}
                placeholder="e.g. ⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Dispatch Guarantee Note
                </label>
                <input
                  type="text"
                  name="tickerDispatch"
                  value={formData.tickerDispatch || ''}
                  onChange={handleChange}
                  placeholder="e.g. 🚚 Pan-India Hub Dispatch: 24-48h"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Retailer Margin Guarantee Note
                </label>
                <input
                  type="text"
                  name="tickerMargin"
                  value={formData.tickerMargin || ''}
                  onChange={handleChange}
                  placeholder="e.g. 🏷️ Guaranteed 40%-52% Retailer Margin"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Live Ticker Preview */}
            <div className="pt-4 border-t border-brand-border/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Live Preview of Top Ticker:</span>
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {formData.tickerBadge || 'B2B SUPER SALE'}
                  </span>
                  <span>{formData.tickerText || '⚡ Direct Manufacturer Wholesale Rates'}</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-200">
                  <span>{formData.tickerDispatch}</span>
                  <span>{formData.tickerMargin}</span>
                  <span>📞 {formData.tickerPhone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: LIGHTNING DEAL STRIP */}
        {activeSubTab === 'deal' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>Homepage Lightning Deal of the Day Banner</span>
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Live countdown promotional strip displayed prominently beneath the category bar on the homepage.
                </p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer bg-brand-card px-3.5 py-1.5 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  name="dealActive"
                  checked={formData.dealActive !== false}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">Enable Deal Strip</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Deal Tag (Glowing Badge)
                </label>
                <input
                  type="text"
                  name="dealTag"
                  value={formData.dealTag || ''}
                  onChange={handleChange}
                  placeholder="⚡ LIGHTNING WHOLESALE DEAL"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Countdown Timer Duration (Seconds)
                </label>
                <input
                  type="number"
                  name="dealCountdownSeconds"
                  value={formData.dealCountdownSeconds || 28800}
                  onChange={handleChange}
                  placeholder="28800 (8 Hours)"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Deal Title / Campaign Name
              </label>
              <input
                type="text"
                name="dealTitle"
                value={formData.dealTitle || ''}
                onChange={handleChange}
                placeholder="e.g. Wholesale Festive Stock Replenishment Mela"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Deal Subtitle & Value Proposition
              </label>
              <textarea
                name="dealSubtitle"
                rows="2"
                value={formData.dealSubtitle || ''}
                onChange={handleChange}
                placeholder="Guaranteed 40%-52% Retailer Profit Margin + Direct Dispatch in 24-48 Hours."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Primary Action Button Text
                </label>
                <input
                  type="text"
                  name="dealPrimaryBtnText"
                  value={formData.dealPrimaryBtnText || 'Explore Deals'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Secondary Action Button Text
                </label>
                <input
                  type="text"
                  name="dealSecondaryBtnText"
                  value={formData.dealSecondaryBtnText || 'Book Bulk Stock'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: HOMEPAGE HERO BANNER */}
        {activeSubTab === 'hero' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-brand-border pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span>Homepage Hero Main Headline</span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                The primary commercial headline that introduces JMR Shooz to visiting retailers.
              </p>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Hero Top Badge
              </label>
              <input
                type="text"
                name="heroBadge"
                value={formData.heroBadge || ''}
                onChange={handleChange}
                placeholder="e.g. Direct Manufacturer Trade Distribution"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Main Hero Headline
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle || ''}
                onChange={handleChange}
                placeholder="India's Premier B2B Footwear Distribution Network"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-base font-bold focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                name="heroSubtitle"
                rows="3"
                value={formData.heroSubtitle || ''}
                onChange={handleChange}
                placeholder="Empowering 480+ footwear retailers with genuine manufacturer-direct inventory..."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>
          </div>
        )}

        {/* SUB-TAB 4: CONTACT & GST COORDINATES */}
        {activeSubTab === 'company' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-brand-border pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Official Contact & Legal Coordinates</span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Displayed in the Footer, Contact Page, About Page, and Invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Trade Calling Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+91 98200 12345"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Trade WhatsApp Number (For Stock Inquiries)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={handleChange}
                  placeholder="+91 98111 22334"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Wholesale Desk Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="wholesale@jmrshooz.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                  Company GSTIN / Tax Identification
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin || ''}
                  onChange={handleChange}
                  placeholder="07AAACJ1234F1Z8"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-amber-500/40 text-amber-300 text-sm focus:outline-none focus:border-brand-gold font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Central Logistics Hub & Office Address
              </label>
              <textarea
                name="address"
                rows="2"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Full address of JMR Shooz Headquarters / Godown Hub..."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>
          </div>
        )}

        {/* SUB-TAB 5: SOCIAL & ABOUT SUMMARY */}
        {activeSubTab === 'social' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-brand-border pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>About Us Summary & Social Channels</span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Brand narrative displayed in footer and about sections, with external social profiles.
              </p>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                About JMR Shooz Summary Paragraph
              </label>
              <textarea
                name="aboutText"
                rows="3"
                value={formData.aboutText || ''}
                onChange={handleChange}
                placeholder="JMR Shooz is India's leading authorized B2B footwear distribution enterprise..."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/jmrshooz"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/jmrshooz"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/jmrshooz"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/jmrshooz"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="pt-6 mt-6 border-t border-brand-border flex items-center justify-between">
          <span className="text-xs text-brand-muted">
            All changes apply across the application in real-time.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
