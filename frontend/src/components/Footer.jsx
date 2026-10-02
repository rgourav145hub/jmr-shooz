import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function Footer({ openEnquiryModal }) {
  const { settings } = useData();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-darker border-t border-brand-border text-slate-400 text-sm">
      {/* Upper B2B Pre-Footer Callout */}
      <div className="border-b border-brand-border/60 bg-brand-surface/40">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 shadow-gold-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">100% Authorized Distributor</h4>
                <p className="text-xs text-brand-muted mt-0.5">Authentic factory warranty and certified inventory guarantees</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 shadow-gold-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Rapid Dispatch Logistics</h4>
                <p className="text-xs text-brand-muted mt-0.5">24 to 48-hour turnarounds from primary regional fulfillment hubs</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 shadow-gold-sm">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Tier-1 Retailer Margins</h4>
                <p className="text-xs text-brand-muted mt-0.5">Competitive wholesale trade tiers engineered for store profitability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-card border border-brand-gold/50 flex items-center justify-center p-1 text-brand-gold">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-brand-gold">
                  <path d="M6 26C10 24 16 25 22 21C27 18 31 11 34 11C35 11 36 12 35 14C33 18 29 23 23 26C17 29 11 29 6 26Z" fill="currentColor" fillOpacity="0.85"/>
                  <path d="M10 29C16 29 22 27 27 23" stroke="#E2CDB2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-widest text-white">JMR</span>
                <span className="font-sans text-xl font-light tracking-widest text-brand-gold ml-1.5">SHOOZ</span>
              </div>
            </div>

            <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-sm">
              Premier footwear brand distribution company bridging global craftsmanship with forward-thinking retail networks, department stores, and independent shoe boutiques.
            </p>

            <div className="mt-6 flex flex-col space-y-2 text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Logistics & Executive Distribution Hubs: National Operations</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Wholesale Desk: +1 (800) 567-SHOOZ / +91 98200 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Retail Partner Inquiries: wholesale@jmrshooz.com</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Navigation
            </h5>
            <ul className="space-y-2.5 text-xs tracking-wider">
              <li>
                <button onClick={() => handleNavClick('/')} className="hover:text-brand-gold transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/brands')} className="hover:text-brand-gold transition-colors">
                  Represented Brands
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/products')} className="hover:text-brand-gold transition-colors">
                  Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/about')} className="hover:text-brand-gold transition-colors">
                  About JMR Shooz
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/owner')} className="hover:text-brand-gold transition-colors">
                  Executive Leadership
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/contact')} className="hover:text-brand-gold transition-colors">
                  Contact & Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Brand Portfolios */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Footwear Segments
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Italian Formal & Calfskin</li>
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Goodyear-Welted Heritage Boots</li>
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Athletic & Carbon Running</li>
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Contemporary Streetwear Low-Tops</li>
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Designer Mules & Chic Heels</li>
              <li className="hover:text-brand-gold cursor-pointer" onClick={() => handleNavClick('/products')}>Industrial & Safety Footwear</li>
            </ul>
          </div>

          

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-14 pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-300 font-medium">JMR SHOOZ</span> Distribution Co. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-[11px] uppercase tracking-wider text-slate-500">
              Authorized Wholesale Footwear Distributor
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="text-[11px] text-slate-500">B2B Trade Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
