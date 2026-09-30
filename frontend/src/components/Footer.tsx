import { Logo } from './Logo'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Package,
  Award,
  ArrowUpRight
} from 'lucide-react'
import type { NavTab } from './Navbar'

interface FooterProps {
  onSelectTab: (tab: NavTab) => void
}

export function Footer({ onSelectTab }: FooterProps) {
  const handleNav = (tab: NavTab) => {
    onSelectTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#070A10] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Factory Authentic</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct manufacturer warranty & authorization papers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Carton-Assorted Packing</h4>
              <p className="text-xs text-slate-400 mt-0.5">Optimized size curves engineered to eliminate dead stock</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Protected Dealer Margins</h4>
              <p className="text-xs text-slate-400 mt-0.5">Strict territorial zoning and retail price compliance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-4">
              JMR Shooz is a premier footwear brand distributor serving footwear retailers, departmental stores, and specialty athletic chains across regional and national territories.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Wholesale Dealership Applications Open for 2026 Season
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore JMR
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition cursor-pointer">
                  Distribution Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('brands')} className="hover:text-amber-400 transition cursor-pointer">
                  Distributed Brands
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Footwear Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-400 transition cursor-pointer">
                  Supply Chain & Warehouses
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('management')} className="hover:text-amber-400 transition cursor-pointer">
                  Founder & Leadership
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-amber-400 transition cursor-pointer">
                  Dealer Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Footwear Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Wholesale Lines
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Performance & Athletic
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Executive Formal Dress
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Urban Streetwear Cupsoles
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Waterproof Tactical Boots
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Podiatric Comfort Shoes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-amber-400 transition cursor-pointer">
                  Youth & Kids School Line
                </button>
              </li>
            </ul>
          </div>

          {/* Distribution Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              B2B Headquarters
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  JMR House, Logistics Hub Corridor, Sector 18, Industrial Estate, Hub 400072
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98000 12345 / +91 98000 67890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>distribution@jmrshooz.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon – Sat: 09:30 AM – 07:00 PM</span>
              </li>
            </ul>

            <div className="mt-5">
              <button
                onClick={() => handleNav('contact')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <span>Request B2B Catalog Spec Sheet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} JMR SHOOZ Distribution Corp. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300">Authorized Brand Distributor Agreement #JMR-B2B-REG</span>
            <span className="text-slate-700">|</span>
            <button onClick={() => handleNav('contact')} className="hover:text-amber-400">
              Wholesale Privacy & Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
