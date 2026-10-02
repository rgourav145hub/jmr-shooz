import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { apiSubmitQuery } from '../services/api';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle,
  Warehouse,
  ChevronDown
} from 'lucide-react';

const ContactPage = function({ onEnquirySuccess }) {
  const { settings } = useData();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    storeType: 'Independent Footwear Boutique',
    city: '',
    state: '',
    volume: '50 - 150 pairs / month',
    brandsOfInterest: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiSubmitQuery({
        type: 'Business Enquiry',
        ...formData
      });

      if (res.success) {
        const code = res.data?.id || `JMR-B2B-${Math.floor(100000 + Math.random() * 900000)}`;
        setRefCode(code);
        setSubmitted(true);
        if (onEnquirySuccess) {
          onEnquirySuccess({
            message: 'Business Enquiry Registered',
            subtext: `Ref: ${code}. Our wholesale representative will contact you within 24 hours.`
          });
        }
      } else {
        setErrorMsg(res.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setErrorMsg('An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'What are the typical Minimum Order Quantities (MOQs) for new retail stockists?',
      a: 'We understand retailers need to test customer response. Initial trial assortment packs start as low as 24 to 36 pairs across standard size curves, allowing you to sample multiple styles before placing enterprise bulk orders.'
    },
    {
      q: 'Are the footwear products 100% authentic with factory warranties?',
      a: 'Yes, without exception. JMR Shooz holds direct, authorized distributor contracts directly with brand headquarters. All pairs arrive in official branded retail packaging with original authenticity tags and manufacturer warranties.'
    },
    {
      q: 'What are your standard dispatch and delivery lead times?',
      a: 'Orders from our active central warehouse stock are dispatched within 24 to 48 business hours via tracked regional freight. For special factory pre-orders (upcoming seasonal collections), lead times range from 4 to 8 weeks.'
    },
    {
      q: 'Do you offer territorial protection for retail shoe boutiques?',
      a: 'Yes. Qualified retail partners who maintain agreed seasonal volume targets are granted protected geographic zones to ensure healthy retail margins without local price cannibalization.'
    },
    {
      q: 'Do you provide point-of-sale display stands and marketing collateral?',
      a: 'Yes. All authorized stockists receive complimentary point-of-sale acrylic displays, branded counter stands, and high-resolution digital image assets for your local advertising and social media channels.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Header Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Retailer Partnership Desk</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact & Business Enquiry
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Connect directly with JMR Shooz wholesale distribution team. Whether you manage a nationwide retail chain or an exclusive shoe boutique, we are ready to supply your storefronts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Distribution Hubs & Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-brand-surface p-7 rounded-3xl border border-brand-border space-y-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-white">
                Distribution Network Headquarters
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-border shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">Corporate Distribution Office</h5>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      {settings?.address || 'JMR Shooz Towers, Industrial Zone Blvd, Logistics District, Hub 4'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-border shrink-0 mt-0.5">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">Central 150K Logistics Facility</h5>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      Gate 3, Regional Freight Park, Airfreight & Port Corridor
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-border shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">Wholesale & Order Desk</h5>
                    <p className="text-slate-300 mt-1 text-xs font-mono">
                      {settings?.phone || '+1 (800) 567-SHOOZ (Toll-Free) / +91 98200 12345'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-border shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">B2B Account Inquiries</h5>
                    <p className="text-slate-300 mt-1 text-xs font-mono text-brand-gold">
                      wholesale@jmrshooz.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-border shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">Logistics & Dispatch Hours</h5>
                    <p className="text-slate-300 mt-1 text-xs">
                      Mon - Sat: 08:30 AM - 07:00 PM (Emergency weekend dispatches on call)
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct chat button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/180056774669?text=Hello%20JMR%20Shooz,%20I%20am%20a%20footwear%20retailer%20interested%20in%20carrying%20your%20distributed%20brands."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700/20 hover:bg-emerald-700/30 text-emerald-400 border border-emerald-600/40 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Directly via WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <h5 className="font-bold text-white text-sm">Protected Retail Accounts</h5>
                <p className="text-brand-muted mt-0.5">Your commercial information is held in strict B2B confidentiality.</p>
              </div>
            </div>

          </div>

          {/* Right Column: Full B2B Application Form */}
          <div className="lg:col-span-7">
            <div className="bg-brand-surface p-8 sm:p-10 rounded-3xl border border-brand-border shadow-2xl relative">
              
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Retail Account Application</span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  Submit Wholesale Business Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Fill out the form below to receive wholesale pricing sheets, size curve specifications, and retail credit terms.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-gold-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Wholesale Application Received</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you <strong className="text-white">{formData.contactName}</strong> from <strong className="text-brand-gold">{formData.companyName}</strong>. Your regional account coordinator has been alerted.
                  </p>
                  <div className="inline-block bg-brand-card px-5 py-3 rounded-xl border border-brand-border text-xs font-mono text-slate-300">
                    Reference Code: <span className="text-brand-gold font-bold">{refCode}</span>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Retail Store / Business Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Sterling Shoe Gallery"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
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
                        placeholder="e.g. David Harrison"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Official Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="buyer@sterlingshoes.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Contact Phone / Mobile *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 345-6789"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Retail Store Type
                      </label>
                      <select
                        name="storeType"
                        value={formData.storeType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      >
                        <option value="Independent Footwear Boutique">Independent Footwear Boutique</option>
                        <option value="Multi-Store Chain">Multi-Store Chain (3-10 Locations)</option>
                        <option value="Large Retail Enterprise">Large Retail Enterprise (10+ Doors)</option>
                        <option value="Department Store">Department Store</option>
                        <option value="E-commerce Fashion Retailer">E-commerce Fashion Retailer</option>
                        <option value="Sub-Distributor Wholesaler">Sub-Distributor / Wholesaler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Projected Monthly Pairs
                      </label>
                      <select
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      >
                        <option value="30 - 60 pairs (Test Batch)">30 - 60 pairs (Initial Trial Assortment)</option>
                        <option value="60 - 150 pairs / month">60 - 150 pairs / month</option>
                        <option value="150 - 500 pairs / month">150 - 500 pairs / month</option>
                        <option value="500+ pairs / month">500+ pairs / month (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        City & State / Region *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New York, NY / Bangalore, KA"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Brands / Categories of Interest
                      </label>
                      <input
                        type="text"
                        name="brandsOfInterest"
                        value={formData.brandsOfInterest}
                        onChange={handleChange}
                        placeholder="e.g. Veloce Milano, AeroStride, Boots"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Additional Notes or Store Details
                    </label>
                    <textarea
                      rows="3"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Share your current retail footwear brands, target demographic, or specific requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold-dark text-brand-dark font-black text-xs sm:text-sm uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Business Application</span>
                      </>
                    )}
                  </button>
                  {errorMsg && (
                    <div className="text-red-400 text-xs text-center mt-2">{errorMsg}</div>
                  )}
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Retail Partner FAQs Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Trade Information</span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Frequently Asked Questions by Retailers
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need to know about partnering with JMR Shooz as an authorized stockist.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm hover:text-brand-gold transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-brand-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default React.memo(ContactPage);
