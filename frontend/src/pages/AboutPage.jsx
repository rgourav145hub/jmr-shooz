import { useNavigate } from 'react-router-dom';
import React from 'react';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Warehouse, 
  Layers, 
  TrendingUp, 
  Globe2,
  Clock
} from 'lucide-react';

const AboutPage = function({ openEnquiryModal }) {
  const navigate = useNavigate();
  const milestones = [
    {
      year: '2008',
      title: 'Foundation & Regional Roots',
      description: 'JMR Shooz commenced operations as a dedicated regional distributor representing artisanal leather formal shoe brands for departmental retailers.'
    },
    {
      year: '2014',
      title: 'Athletic & Lifestyle Portfolio Expansion',
      description: 'Secured official regional distribution contracts for high-performance athletic and lifestyle sneaker brands across 120+ retail store doors.'
    },
    {
      year: '2019',
      title: 'Central Logistics Hub Commissioned',
      description: 'Constructed our flagship 150,000 sq. ft. central warehouse hub with automated inventory scanning and temperature-regulated leather storage.'
    },
    {
      year: '2024',
      title: 'Pan-National Distribution Network',
      description: 'Scaled to over 480 active retail stockists and 14 premier footwear brands with daily cross-docking and guaranteed 24-48h dispatches.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Page Header */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <Warehouse className="w-3.5 h-3.5" />
            <span>Distribution Excellence Since 2008</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            About <span className="text-brand-gold">JMR Shooz</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            We are a premier B2B footwear brand distributor committed to bridging global footwear manufacturers with leading retail chains, multi-brand department stores, and independent shoe boutiques.
          </p>
        </div>
      </div>

      {/* Core Narrative & Image */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                Our Corporate Mission
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                Building Resilient Footwear Supply Chains That Power Retail Growth.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                The modern retail footwear landscape demands agility, uncompromising authenticity, and reliable stock availability. At JMR Shooz, we act as the strategic bridge between global footwear artisans and retail storefronts.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                We handle import licensing, customs clearance, inventory financing, climate-controlled warehousing, and rapid retail store replenishment—enabling retailers to focus on customer experience while maintaining strong inventory turnover.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-brand-border/60">
                <div className="bg-brand-card p-4 rounded-xl border border-brand-border/50">
                  <span className="text-brand-gold font-display text-2xl font-bold block">100%</span>
                  <span className="text-xs text-brand-muted">Direct Manufacturer Contracts</span>
                </div>
                <div className="bg-brand-card p-4 rounded-xl border border-brand-border/50">
                  <span className="text-brand-gold font-display text-2xl font-bold block">150K+ sq.ft</span>
                  <span className="text-xs text-brand-muted">Modern Warehousing Facility</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-brand-gold/30 shadow-xl aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
                  alt="JMR Shooz Footwear Warehouse and Quality Inspection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-brand-darker/90 backdrop-blur-md border border-brand-border">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Zero-Defect Quality Protocol</h5>
                  <p className="text-[11px] text-brand-muted mt-0.5">Every shipment is batch-checked for leather grade, sole bonding, and packaging integrity before store dispatch.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* The 4 Distribution Pillars */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Infrastructure</span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Our Distribution Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border hover:border-brand-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <Warehouse className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Climate Warehousing</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Temperature and humidity regulated storage ensures fine leather hides, suede, and adhesive bonds retain factory-fresh quality.
            </p>
          </div>

          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border hover:border-brand-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">24-48h Store Logistics</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Express pallet and carton dispatches to retail store doors ensuring you never face stockouts during peak shopping periods.
            </p>
          </div>

          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border hover:border-brand-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Brand Integrity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict territorial non-compete agreements to protect your retail margins and prevent channel dilution in your market.
            </p>
          </div>

          <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border hover:border-brand-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Margin Architecture</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Structured trade margins between 38% and 52% with tiered volume rebates and markdown protection support.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Milestones */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-brand-darker rounded-3xl border border-brand-border p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Company Timeline</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              The Journey of JMR Shooz
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative space-y-2">
                <div className="text-brand-gold font-display text-3xl font-black">
                  {m.year}
                </div>
                <h5 className="text-white font-bold text-sm">
                  {m.title}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h4 className="font-display text-2xl font-bold text-white">
          Experience the Difference of a Premier Footwear Distributor
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-6">
          Connect with our corporate team to explore retail brand stock allocation for your region.
        </p>
        <button
          onClick={() => openEnquiryModal()}
          className="px-8 py-3.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:brightness-110 transition-all"
        >
          Contact Corporate Operations
        </button>
      </div>

    </div>
  );
}

export default React.memo(AboutPage);
