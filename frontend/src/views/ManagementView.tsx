import { FOUNDER_DATA, EXECUTIVES_DATA } from '../data/leadershipData'
import {
  Award,
  Sparkles,
  ChevronRight,
  Handshake
} from 'lucide-react'
import type { NavTab } from '../components/Navbar'

interface ManagementViewProps {
  onSelectTab: (tab: NavTab) => void
}

export function ManagementView({ onSelectTab }: ManagementViewProps) {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Executive Leadership & Governance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Owner & Management
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Led by experienced footwear trade veterans committed to integrity, transparency, and sustainable profitability for our retail partners.
        </p>
      </div>

      {/* Founder Profile In-Depth */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121826] via-[#151D2F] to-[#121826] border border-amber-400/30 p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Founder Photo & Badges */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-64 h-80 rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
              <img
                src={FOUNDER_DATA.image}
                alt={FOUNDER_DATA.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <div className="text-white font-bold text-base font-heading">
                  {FOUNDER_DATA.name}
                </div>
                <div className="text-xs text-amber-300 font-medium">
                  {FOUNDER_DATA.title}
                </div>
              </div>
            </div>

            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-center">
              24+ Years Experience in Footwear Distribution
            </div>
          </div>

          {/* Founder Detailed Narrative */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Award className="w-4 h-4" />
              <span>Founder's Vision & Operating Philosophy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading leading-tight">
              "We Win Only When Our Footwear Retailers Prosper."
            </h2>

            <blockquote className="p-4 rounded-2xl bg-slate-900/70 border-l-4 border-amber-400 text-sm text-slate-200 italic leading-relaxed">
              "{FOUNDER_DATA.quote}"
            </blockquote>

            <p className="text-sm text-slate-300 leading-relaxed">
              {FOUNDER_DATA.bio}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Under Mr. Rawat's stewardship, JMR Shooz has continually invested in automated inventory replenishment, ensuring that retailers never suffer the common industry bottleneck of waiting weeks for top-selling replenishment sizes.
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition cursor-pointer flex items-center gap-2"
              >
                <span>Direct Dealer Registration Request</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Management Team Grid */}
      <div className="space-y-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Core Leadership
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Executive Leadership Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Meet the operational leaders driving our supply chain speed, brand portfolio curation, and dealer support desks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXECUTIVES_DATA.map((exec, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#121826] border border-slate-800 hover:border-amber-400/40 transition duration-300 overflow-hidden flex flex-col group shadow-xl"
            >
              {/* Executive Image */}
              <div className="relative h-64 bg-slate-950 overflow-hidden">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white font-heading">
                    {exec.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {exec.role}
                  </p>
                </div>
              </div>

              {/* Executive Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {exec.experience}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {exec.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Core Operational Focus
                  </span>
                  <span className="text-xs text-slate-200 font-medium block mt-0.5">
                    {exec.directFocus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dealer Protection Charter */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#121826] border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-heading">
              The JMR Dealer Protection Covenant
            </h3>
            <p className="text-xs text-slate-400">
              Contractual pledges made by JMR Shooz management to our authorized retail network.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Territory Non-Compete
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We respect geographic retail boundaries. An authorized JMR dealer will never find another competing retailer selling the identical brand line within their contracted zoning radius.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              2. Defect Replacement Assurance
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Any factory manufacturing defect reported within 60 days of carton receipt is immediately credited or replaced with zero hassle during your next restock run.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Fair Festive Allocation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              During peak Diwali, Eid, and wedding seasons, high-velocity footwear inventory is allocated proportionately based on pre-bookings rather than sold to the highest single bidder.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
