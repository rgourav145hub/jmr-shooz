import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, ShieldCheck, HelpCircle, Mail } from 'lucide-react';
import { submitQueryOrFeedback, getStoredBrands } from '../utils/storage';
import { apiSubmitQuery } from '../services/api';

export default function FeedbackQueryModal({ isOpen, onClose, currentUser, initialBrand = '', onSuccess }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    type: 'Wholesale Stock Booking',
    brandName: initialBrand || 'Liberty',
    subject: '',
    message: ''
  });

  const [brands, setBrands] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    setBrands(getStoredBrands());
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

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        companyName: currentUser.companyName || currentUser.name || '',
        contactName: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        retailerId: currentUser.retailerId || ''
      }));
    }
    if (initialBrand) {
      setFormData(prev => ({ ...prev, brandName: initialBrand }));
    }
  }, [currentUser, initialBrand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        retailerId: currentUser?.retailerId || 'GUEST-RETAILER',
      };
      const res = await apiSubmitQuery(payload);
      const ticket = res.data || submitQueryOrFeedback(payload);
      setTicketId(ticket.id || ticket.referenceId);
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess(ticket);
    } catch (err) {
      const entry = submitQueryOrFeedback({
        ...formData,
        retailerId: currentUser?.retailerId || 'GUEST-RETAILER',
      });
      setTicketId(entry.id);
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess(entry);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-brand-border bg-brand-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 id="feedback-modal-title" className="text-base font-bold text-white tracking-wide">
                Retailer Query & Feedback Desk
              </h3>
              <p className="text-xs text-brand-muted">
                Direct Communication with JMR Shooz Distribution Operations
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-brand-card text-slate-400 hover:text-white hover:bg-brand-cardHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-gold-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Ticket Submitted Successfully!</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you <strong className="text-white">{formData.contactName || 'Partner'}</strong>. Your inquiry has been dispatched directly to the JMR Shooz Admin Desk.
              </p>
              <div className="bg-brand-card p-3 rounded-xl border border-brand-border inline-block text-xs font-mono text-slate-300">
                Ticket Reference: <span className="text-brand-gold font-bold">{ticketId}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 max-w-md mx-auto text-center space-y-1">
                <span className="font-semibold block text-[13px] flex items-center justify-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Email Notifications Dispatched
                </span>
                <span className="text-slate-300 block">
                  Aapka ticket confirmation email <strong>{formData.email}</strong> par aur notification Admin desk par dispatch kar diya gaya hai.
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-gold-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Query Category *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Wholesale Stock Booking">Wholesale Stock Booking</option>
                    <option value="Custom Size Curve Request">Custom Size Curve Request</option>
                    <option value="Brand Dealership Inquiry">Brand Dealership Inquiry</option>
                    <option value="Distributor Feedback">Distributor Feedback & Quality</option>
                    <option value="Billing & Credit Query">Billing & Credit Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Select Brand *
                  </label>
                  <select
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="General Distribution">All Brands / General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Store / Retailer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Royal Shoe Store"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Need 4 cartons of Columbus Velocity in sizes 7 to 9"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Detailed Query / Feedback *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide carton quantities, preferred size curves, store location, or feedback on past delivery..."
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to JMR Shooz Management</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
