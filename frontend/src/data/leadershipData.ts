export interface Executive {
  name: string
  role: string
  experience: string
  bio: string
  image: string
  directFocus: string
}

export interface CompanyValue {
  title: string
  subtitle: string
  description: string
  iconName: string
}

export const FOUNDER_DATA = {
  name: 'J. M. Rawat',
  title: 'Founder & Managing Director',
  quote: "Footwear retail thrives on two things: uncompromised product authenticity and unwavering stock continuity. At JMR Shooz, our retailers never lose a walk-in customer due to out-of-stock sizes. That is our distributor promise.",
  bio: 'With over 24 years in the footwear distribution and leather goods industry, J. M. Rawat founded JMR Shooz to bridge the gap between global footwear manufacturing standards and regional retail commercial growth. Under his leadership, JMR Shooz has evolved into one of the most reliable and tech-driven footwear distributors in the region.',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
}

export const EXECUTIVES_DATA: Executive[] = [
  {
    name: 'Vikramaditya Mehta',
    role: 'Chief Operating Officer (Logistics & Supply Chain)',
    experience: '18 Years Supply Chain Leadership',
    bio: 'Former head of supply chain operations for major retail conglomerates, Vikramaditya oversees JMR Shooz 6 regional fulfillment hubs and barcoded warehouse inventory systems.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    directFocus: 'Warehouse Automation, Freight Transit & 48h SLAs'
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Vice President — Brand Alliances & Portfolio',
    experience: '14 Years Footwear Merchandising',
    bio: 'Specializing in footwear trend forecasting and international licensing, Ananya curates our distributed brand portfolio, vetting brand quality, production capacity, and retail margin viability.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    directFocus: 'Brand Representation, Licensing & Tier-1 Assortments'
  },
  {
    name: 'Siddharth Nair',
    role: 'Head of Retailer Success & Dealership Accounts',
    experience: '12 Years Footwear Trade Relations',
    bio: 'Directly managing our network of 450+ authorized retailers, Siddharth ensures dealer margin protection, territory zoning agreements, and seasonal restocking credit lines.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    directFocus: 'Dealer Margin Protection & Territory Exclusivity'
  }
]

export const DISTRIBUTION_PILLARS: CompanyValue[] = [
  {
    title: 'Margin Protection & Anti-Dumping',
    subtitle: 'Strict MSRP Safeguards',
    description: 'We safeguard our brick-and-mortar retail partners against predatory online discounting. Every brand distributed by JMR Shooz adheres to strict retail price discipline.',
    iconName: 'ShieldCheck'
  },
  {
    title: 'Precision Size-Run Assortments',
    subtitle: 'No Dead Stock in Retailers Stockrooms',
    description: 'Our carton breakdown ratios are scientifically aligned with regional sales velocity (6-10 standard sizes), ensuring your stock clears uniformly without leftover orphan sizes.',
    iconName: 'PackageCheck'
  },
  {
    title: 'Guaranteed Authentic Supply Chain',
    subtitle: 'Direct Factory Sourcing Only',
    description: 'Zero gray-market exposure. Every carton arrives directly from brand factories with authorized manufacturer certifications and verifiable serial origin codes.',
    iconName: 'BadgeCheck'
  },
  {
    title: 'Rapid Restock Logistics',
    subtitle: '48-Hour Regional Dispatch Guarantee',
    description: 'With 160,000+ sq. ft. of strategically distributed inventory, fast-moving SKUs are picked, packed, and loaded onto express transit within 48 hours of order confirmation.',
    iconName: 'Truck'
  }
]
