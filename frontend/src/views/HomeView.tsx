import { useState } from 'react'
import { BRANDS_DATA, type Brand } from '../data/brandsData'
import { PRODUCTS_DATA, type Product } from '../data/productsData'
import { COMPANY_STATS } from '../data/statsData'
import { FOUNDER_DATA, DISTRIBUTION_PILLARS } from '../data/leadershipData'
import type { NavTab } from '../components/Navbar'
import {
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  BadgeCheck,
  Truck,
  Sparkles,
  Plus,
  Eye,
  CheckCircle2,
  Award,
  ChevronRight,
  PhoneCall
} from 'lucide-react'

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void
  onOpenProductModal: (product: Product) => void
  onOpenBrandModal: (brand: Brand) => void
  onAddToEnquiry: (product: Product, cartons?: number) => void
}

export function HomeView({
  onSelectTab,
  onOpenProductModal,
  onOpenBrandModal,
  onAddToEnquiry
}: HomeViewProps) {
  const [activeHeroTab, setActiveHeroTab] = useState<number>(0)

  const featuredBrands = BRANDS_DATA.filter((b) => b.featured).slice(0, 4)
  const featuredProducts = PRODUCTS_DATA.filter((p) => p.isFeatured).slice(0, 6)

  const heroShowcase = [
    {
      brand: 'AeroStep Italia',
      title: 'Milano Medallion Oxford',
      category: 'Luxury Formal',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=900&auto=format&fit=crop',
      moq: '3 Cartons',
      margin: '45% - 55%'
    },
    {
      brand: 'Vanguard Athletics',
      title: 'NitroPro Carbon Runner',
      category: 'Performance Sports',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop',
      moq: '5 Cartons',
      margin: '38% - 48%'
    },
    {
      brand: 'UrbanStride Co.',
      title: 'Classic Retro Low-Top',
      category: 'Streetwear Canvas',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=900&auto=format&fit=crop',
      moq: '4 Cartons',
      margin: '40% - 50%'
    }
  ]

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-amber-400" />
      case 'PackageCheck':
        return <PackageCheck className="w-6 h-6 text-amber-400" />
      case 'BadgeCheck':
        return <BadgeCheck className="w-6 h-6 text-amber-400" />
      case 'Truck':
        return <Truck className="w-6 h-6 text-amber-400" />
      default:
        return <ShieldCheck className="w-6 h-6 text-amber-400" />
    }
  }

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Subtle Luxury Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Premier Footwear Brand Distributor</span>
              </div>

              {/* Strong Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.12]">
                Connecting World-Class{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Footwear Brands
                </span>{' '}
                with Leading Retail Networks.
              </h1>

              {/* Short Company Introduction */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                <strong className="text-white font-semibold">JMR Shooz</strong> is a premier brand distribution partner for athletic, formal, and lifestyle footwear. We supply authorized retailers and departmental stores with guaranteed authentic stock, protected dealer margins, and reliable 48-hour regional replenishment.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onSelectTab('brands')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-amber-400/50 hover:border-amber-400 text-white hover:text-amber-300 font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition duration-300 cursor-pointer"
                >
                  <span>Explore Partner Brands</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectTab('contact')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Business Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Authentic Sourcing
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">48-Hr</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Dispatch SLA
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">450+</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Active Retailers
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Card / Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 to-amber-200/10 rounded-3xl blur-md" />

                <div className="relative rounded-3xl bg-[#121826] border border-amber-400/40 overflow-hidden shadow-2xl">
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden group">
                    <img
                      src={heroShowcase[activeHeroTab].image}
                      alt={heroShowcase[activeHeroTab].title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-black/30" />

                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-amber-400/30">
                      {heroShowcase[activeHeroTab].category}
                    </div>

                    <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      Wholesale Stock Ready
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          {heroShowcase[activeHeroTab].brand}
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                          {heroShowcase[activeHeroTab].title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                          Dealer Margin
                        </span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {heroShowcase[activeHeroTab].margin}
                        </span>
                      </div>
                    </div>

                    {/* Selector Pills */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      {heroShowcase.map((item, idx) => (
                        <button
                          key={item.brand}
                          onClick={() => setActiveHeroTab(idx)}
                          className={`p-2 rounded-xl text-left transition cursor-pointer ${
                            activeHeroTab === idx
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="text-[10px] uppercase truncate">{item.brand}</div>
                          <div className="text-[11px] truncate">{item.category.split(' ')[0]}</div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onSelectTab('products')}
                        className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-bold text-white hover:text-amber-300 flex items-center justify-center gap-2 transition"
                      >
                        <span>Browse Full Wholesale Footwear Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BUSINESS STATISTICS SECTION (Editable Placeholders) */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#121826] border border-amber-400/25 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Scale & Reach
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                Distribution Network by the Numbers
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Proven supply chain capability serving independent retailers, departmental stores, and online commercial partners.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              {COMPANY_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/40 transition duration-300 group"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 font-mono tracking-tight group-hover:scale-105 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold text-white mt-1.5 leading-tight">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug hidden sm:block">
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BRANDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              <span>Official Distributor Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Featured Footwear Brands
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Authorized partner brands distributed exclusively across regional territories.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('brands')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 self-start md:self-auto cursor-pointer"
          >
            <span>View All {BRANDS_DATA.length} Brands</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBrands.map((brand) => (
            <div
              key={brand.id}
              className="rounded-3xl bg-[#121826] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg hover:shadow-amber-500/5"
            >
              {/* Brand Image Preview */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={brand.heroImage}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-300">
                  {brand.origin}
                </div>
              </div>

              {/* Brand Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    {brand.category}
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading mt-0.5">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">Carton MOQ:</span>
                    <span className="font-bold text-amber-400">{brand.minimumOrderCartons} Cartons</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenBrandModal(brand)}
                      className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Dossier</span>
                    </button>
                    <button
                      onClick={() => onSelectTab('contact')}
                      className="py-2 px-3 rounded-xl bg-amber-400/10 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-amber-300 transition cursor-pointer text-center"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Wholesale Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Trending Wholesale Footwear Lines
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top velocity styles packaged in standard assorted carton curves for immediate retailer shipment.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('products')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 self-start md:self-auto cursor-pointer"
          >
            <span>Explore All Footwear Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-[#121826] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Product Image */}
              <div
                onClick={() => onOpenProductModal(product)}
                className="relative aspect-square bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-400 border border-amber-400/20">
                  {product.brandName}
                </div>
                {product.isBestSeller && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    High Velocity
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300">
                  SKU: {product.sku}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onOpenProductModal(product)}
                    className="text-base font-bold text-white font-heading hover:text-amber-400 transition cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    {product.cartonSize} • {product.sizeRun}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Est. Wholesale
                    </div>
                    <div className="text-base font-bold text-amber-300 font-mono">
                      ₹{(product.wholesaleEstimatePerPair * 83).toLocaleString('en-IN')}
                      <span className="text-xs text-slate-400 font-normal"> /pr</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProductModal(product)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAddToEnquiry(product, product.minimumOrderCartons)}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
                      title="Add Carton to Wholesale Enquiry List"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE JMR SHOOZ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            The Distributor Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
            Why Footwear Retailers Choose JMR Shooz
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Built specifically to solve footwear retailers biggest headaches: margin collapse, dead stock, and unpredictable delivery timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISTRIBUTION_PILLARS.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[#121826] border border-slate-800/90 hover:border-amber-400/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-5">
                  {getPillarIcon(pillar.iconName)}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
                  {pillar.subtitle}
                </div>
                <h3 className="text-lg font-bold text-white font-heading mt-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-3">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Standard Dealer SLA</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOUNDER / MANAGEMENT INTRO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#121826] via-[#151D2F] to-[#121826] border border-amber-400/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Founder Photo */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
                <img
                  src={FOUNDER_DATA.image}
                  alt={FOUNDER_DATA.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="text-white font-bold text-sm font-heading">{FOUNDER_DATA.name}</div>
                  <div className="text-[11px] text-amber-300 font-medium">{FOUNDER_DATA.title}</div>
                </div>
              </div>
            </div>

            {/* Founder Statement */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Leadership Commitment
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 italic leading-relaxed">
                "{FOUNDER_DATA.quote}"
              </blockquote>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                {FOUNDER_DATA.bio}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onSelectTab('management')}
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white hover:text-amber-300 font-semibold text-xs transition"
                >
                  Meet the Management & Logistics Team
                </button>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
                >
                  Schedule Dealer Onboarding Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUSINESS ENQUIRY CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 sm:p-12 text-slate-950 shadow-2xl shadow-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full">
              Dealership Expansion 2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-slate-950">
              Apply to Become an Authorized JMR Shooz Retailer
            </h2>
            <p className="text-sm font-medium text-slate-900 max-w-xl">
              Gain exclusive territorial distribution access to top tier footwear brands, wholesale volume discounts, and 48-hour restocking dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onSelectTab('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 text-white hover:text-amber-300 font-bold text-sm shadow-xl hover:scale-105 transition cursor-pointer"
            >
              Submit Dealer Application
            </button>
            <a
              href="tel:+919800012345"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/20 hover:bg-white/30 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+91 98000 12345</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
