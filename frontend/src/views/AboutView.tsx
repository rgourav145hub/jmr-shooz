import {
  Truck,
  ShieldCheck,
  Warehouse,
  Sparkles,
  Barcode
} from 'lucide-react'
import type { NavTab } from '../components/Navbar'

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void
}

export function AboutView({ onSelectTab }: AboutViewProps) {
  const milestones = [
    {
      year: '2011',
      title: 'Foundation of JMR Distribution Hub',
      description: 'Established with a single 12,000 sq.ft facility representing 2 regional formal footwear brands with 25 independent shoe retail stores.'
    },
    {
      year: '2015',
      title: 'Pan-Regional Footwear Expansion',
      description: 'Expanded into performance athletic footwear and lifestyle streetwear sneakers, scaling network to over 150 footwear stockists.'
    },
    {
      year: '2019',
      title: 'Logistics Automation & Central Warehousing',
      description: 'Implemented high-speed barcode scanning, RFID carton tracking, and formalized the 48-Hour Regional Dispatch Guarantee.'
    },
    {
      year: '2023',
      title: 'International Brand Representation',
      description: 'Secured exclusive regional distribution rights for prestigious European and American performance and luxury footwear lines.'
    },
    {
      year: '2026',
      title: '450+ Retail Partners & 2.4M Pairs Annually',
      description: 'Today, JMR Shooz stands as a recognized benchmark in footwear distribution reliability, margin stability, and dealer trust.'
    }
  ]

  const facilities = [
    {
      title: 'Central Distribution Hub (Hub 1)',
      location: 'Industrial Corridor Zone A',
      capacity: '65,000 sq. ft. Automated Storage',
      features: 'High-density carton racking, climate-controlled leather footwear storage, automated barcode dispatch lanes.'
    },
    {
      title: 'Western Regional Transit Hub (Hub 2)',
      location: 'Metro Logistics Corridor',
      capacity: '35,000 sq. ft. Rapid Restock',
      features: 'Express cross-docking terminal ensuring same-day replenishment for metropolitan tier-1 department store chains.'
    },
    {
      title: 'Northern Commercial Hub (Hub 3)',
      location: 'Highway Commercial Express',
      capacity: '32,000 sq. ft. Multi-brand Facility',
      features: 'Specialized athletic & sports footwear handling with dedicated returned defect inspection benches.'
    },
    {
      title: 'Southern & Eastern Satellite Hubs (Hubs 4-6)',
      location: 'Strategic Regional Gateways',
      capacity: '28,000+ sq. ft. Combined Space',
      features: 'Localised buffer stock ensuring secondary towns and boutique retailers never encounter stockouts during peak festival seasons.'
    }
  ]

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Footwear Distribution Standard</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          About JMR Shooz
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          We are the dedicated bridge between international footwear engineering and domestic retail success. Founded on reliability, precision inventory, and dealer-first commercial policies.
        </p>
      </div>

      {/* Brand Story & Value Proposition Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-[#121826] border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="lg:col-span-6 space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Our Purpose & Vision
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading leading-snug">
            Empowering Footwear Retailers with Stock Continuity & Margin Protection.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In the competitive footwear landscape, retailers face two existential threats: stockouts of high-velocity fast-selling sizes during peak shopping seasons, and arbitrary price cuts from predatory online platforms.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            JMR Shooz was built to counter both. We negotiate exclusive distributor contracts that enforce strict retail price discipline, maintain deep buffer inventory across 6 regional transit hubs, and deliver scientifically balanced carton curve packs that clear uniformly.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-2xl font-black text-amber-400 font-mono">160,000+</span>
              <span className="text-xs text-slate-400 block mt-1 font-medium">Sq. Ft. Warehousing</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-2xl font-black text-emerald-400 font-mono">99.4%</span>
              <span className="text-xs text-slate-400 block mt-1 font-medium">48-Hr Dispatch SLA</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
              alt="JMR Shooz Warehouse Infrastructure"
              className="w-full h-80 sm:h-96 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-amber-400" />
                <span>Central Footwear Storage & Cross-Dock Hub 1</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Automated barcoded inventory system processing over 12,000 carton pairs daily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Ecosystem (3 Pillars) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            The JMR Distribution Standard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Three foundational pillars that protect our network of 450+ authorized shoe retailers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121826] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Authentic Direct Factory Line
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every single carton distributed by JMR Shooz is accompanied by official manufacturer origin invoices, GST billing, and factory authorization certificates. No counterfeit, gray market, or factory second stock.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121826] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Barcode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Barcoded Precision Picking
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Each footwear carton is scanned three times—at receiving, slotting, and transit staging. This eliminates mispicks, mismatched shoe pairs, and incorrect sizing runs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121826] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Express Freight Partnerships
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We maintain direct contracts with premier express logistics carriers, ensuring standard 48-hour delivery across tier-1 and tier-2 commercial retail zones with full GPS transit tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Warehouse Logistics Network Details */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#121826] border border-amber-400/20 space-y-8 shadow-xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Regional Infrastructure
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Our Warehousing & Fulfillment Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            160,000+ square feet of strategically positioned footwear warehousing engineered for rapid stock replenishment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-amber-400/40 transition"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white font-heading">
                  {fac.title}
                </h4>
                <span className="text-[11px] font-bold text-amber-400 font-mono">
                  {fac.capacity}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {fac.location}
              </div>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                {fac.features}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution Milestones Timeline */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Growth & Trust
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Our Journey in Footwear Distribution
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {milestones.map((item, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-[#121826] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-amber-400/30 transition"
            >
              <div className="text-2xl font-black text-amber-400 font-mono shrink-0 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30">
                {item.year}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-white font-heading">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-10 rounded-3xl bg-gradient-to-b from-[#121826] to-slate-900 border border-amber-400/30 space-y-4">
        <h3 className="text-2xl font-bold text-white font-heading">
          Ready to Partner with JMR Shooz?
        </h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Join 450+ successful shoe retailers who have eliminated out-of-stock sizes and scaled store revenue with our distributor support.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => onSelectTab('contact')}
            className="px-8 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Apply for Retail Dealership
          </button>
        </div>
      </div>
    </div>
  )
}
