import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import {
  Menu,
  X,
  FileSpreadsheet,
  ArrowRight,
  PhoneCall,
  ChevronRight
} from 'lucide-react'

export type NavTab = 'home' | 'brands' | 'products' | 'about' | 'management' | 'contact'

interface NavbarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  enquiryCount: number
  onOpenEnquiryDrawer: () => void
}

export function Navbar({
  activeTab,
  onSelectTab,
  enquiryCount,
  onOpenEnquiryDrawer
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'brands', label: 'Brands' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About JMR' },
    { id: 'management', label: 'Management' },
    { id: 'contact', label: 'Contact' }
  ]

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl shadow-black/50 py-3.5'
          : 'bg-gradient-to-b from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('home')}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Wholesale Enquiry Drawer Badge */}
          <button
            onClick={onOpenEnquiryDrawer}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:border-amber-400/50 hover:text-white transition duration-200 text-xs font-semibold cursor-pointer group"
            title="View Selected Wholesale Items for Enquiry"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            <span>Enquiry List</span>
            {enquiryCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black text-[11px] font-black animate-pulse">
                {enquiryCount}
              </span>
            )}
          </button>

          {/* Highlighted Business Enquiry Button */}
          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-[position:right_center] text-slate-950 text-xs xl:text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span>Business Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Action & Hamburger */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={onOpenEnquiryDrawer}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400"
            aria-label="Enquiry List"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {enquiryCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black text-[11px] font-black flex items-center justify-center">
                {enquiryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[70px] bg-[#0B0F17]/98 border-b border-slate-800 p-6 backdrop-blur-2xl shadow-2xl transition-all">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              )
            })}
          </div>

          <div className="pt-6 mt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              <span>Submit Business Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+919800012345"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Dealer Helpline: +91 98000 12345</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
