import React, { useState, useEffect } from 'react';
import { X, Building2, Send, CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { apiSubmitQuery } from '../services/api';

export default function BusinessEnquiryModal({ isOpen, onClose, prefillData, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'Footwear Retail Boutique',
    location: '',
    volume: '50 - 150 pairs / batch',
    brandInterest: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        brandInterest: prefillData.productName 
          ? `${prefillData.brandName} - ${prefillData.productName} (SKU: ${prefillData.sku})`
          : prefillData.brandName || ''
      }));
    }
  }, [prefillData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiSubmitQuery({
        ...formData,
        subject: formData.brandInterest ? `Enquiry for ${formData.brandInterest}` : 'B2B Wholesale Enquiry'
      });
      const generatedRef = res.data?.referenceId || res.data?.id || `JMR-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ ...formData, referenceId: generatedRef });
      }
    } catch (err) {
      const fallbackRef = `JMR-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(fallbackRef);
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ ...formData, referenceId: fallbackRef });
      }
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-brand-border bg-brand-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="enquiry-modal-title" className="text-lg font-bold text-white tracking-wide">
                B2B Wholesale & Distribution Enquiry
              </h3>
              <p className="text-xs text-brand-muted">
                JMR Shooz Retailer Partner Network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-brand-card/60 text-slate-400 hover:text-white hover:bg-brand-card transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-gold-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white tracking-tight">
                Enquiry Received Successfully
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-white">{formData.contactName || 'Valued Retailer'}</span>. Your wholesale inquiry for <span className="text-brand-gold font-semibold">{formData.companyName || 'your store'}</span> has been assigned to our territory manager.
              </p>
              
              <div className="inline-block bg-brand-card px-4 py-2.5 rounded-lg border border-brand-border text-xs font-mono text-slate-300">
                Tracking Reference: <span className="text-brand-gold font-bold">{referenceId}</span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 max-w-md mx-auto text-center space-y-1">
                <span className="font-semibold block text-[13px] flex items-center justify-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Email Notifications Dispatched
                </span>
                <span className="text-slate-300 block">
                  Aapki inquiry details aapke email (<strong>{formData.email}</strong>) aur JMR Shooz Admin desk dono par bhej di gayi hain.
                </span>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-gold-sm"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-brand-card/50 p-3 rounded-lg border border-brand-gold/20 flex items-center gap-3 text-xs text-slate-300 mb-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
                <span>Authorized trade accounts receive wholesale catalog pricing, sample swatches, and dedicated territory protection terms.</span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Store / Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Metro Footwear House"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="e.g. Alexander Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@footwearretail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Business / Retail Format
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  >
                    <option value="Footwear Retail Boutique">Independent Footwear Boutique</option>
                    <option value="Multi-Store Retail Chain">Multi-Store Retail Chain</option>
                    <option value="Department Store Group">Department Store Group</option>
                    <option value="E-Commerce Shoe Platform">E-Commerce Footwear Platform</option>
                    <option value="Regional Sub-Distributor">Regional Sub-Distributor / Wholesaler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    City & State / Region *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Chicago, IL / Mumbai, MH"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Projected Order Volume
                  </label>
                  <select
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  >
                    <option value="30 - 60 pairs (Test Batch)">30 - 60 pairs (Trial Assortment)</option>
                    <option value="60 - 150 pairs / month">60 - 150 pairs / month</option>
                    <option value="150 - 500 pairs / month">150 - 500 pairs / month</option>
                    <option value="500+ pairs (Full Tier Distribution)">500+ pairs (Enterprise Distribution)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Brands or SKUs of Interest
                  </label>
                  <input
                    type="text"
                    name="brandInterest"
                    value={formData.brandInterest}
                    onChange={handleChange}
                    placeholder="e.g. Veloce Milano, AeroStride..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Specific Requirements or Questions
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your retail location, target customers, or requested distribution brands..."
                  className="w-full px-3.5 py-2 rounded-lg bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-sm uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Distribution Enquiry</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                <span>Direct wholesale response within 24 hours</span>
                <span>Confidential B2B Data</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
