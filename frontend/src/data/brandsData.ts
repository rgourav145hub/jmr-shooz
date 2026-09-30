export interface Brand {
  id: string
  name: string
  slug: string
  tagline: string
  category: 'Athletic & Sport' | 'Luxury & Formal' | 'Urban & Casual' | 'Outdoor & Rugged' | 'Comfort & Orthopedic' | 'Youth & Kids'
  origin: string
  establishedYear: number
  minimumOrderCartons: number
  marginRange: string
  featured: boolean
  logoInitials: string
  heroImage: string
  description: string
  highlights: string[]
  catalogItemsCount: number
}

export const BRANDS_DATA: Brand[] = [
  {
    id: 'b1',
    name: 'AeroStep Italia',
    slug: 'aerostep-italia',
    tagline: 'Artisanal Italian Leather Footwear for Discerning Gentlemen',
    category: 'Luxury & Formal',
    origin: 'Milan, Italy',
    establishedYear: 1994,
    minimumOrderCartons: 5,
    marginRange: '42% - 55%',
    featured: true,
    logoInitials: 'AI',
    heroImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop',
    description: 'AeroStep Italia crafts bespoke-grade formal dress shoes, Goodyear-welted oxfords, and hand-finished Chelsea boots. Distributed exclusively by JMR Shooz across tier-1 retail department chains.',
    highlights: ['Full-Grain Calfskin Leather', 'Goodyear Welt Construction', 'Hand-Polished Finish', 'Memory Leather Footbed'],
    catalogItemsCount: 48
  },
  {
    id: 'b2',
    name: 'Vanguard Athletics',
    slug: 'vanguard-athletics',
    tagline: 'High-Impact Carbon-Plate Running & Gym Performance Gear',
    category: 'Athletic & Sport',
    origin: 'Oregon, USA',
    establishedYear: 2011,
    minimumOrderCartons: 8,
    marginRange: '38% - 48%',
    featured: true,
    logoInitials: 'VA',
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    description: 'Engineered for athletes and fitness enthusiasts. Vanguard utilizes nitrogen-infused propulsion foam and aerated carbon mesh to deliver top-tier speed and endurance footwear.',
    highlights: ['Nitrogen-Infused Midsole', 'Ultra-Breathable Knit', 'Anti-Abrasion Rubber Outsole', 'Dynamic Arch Lockdown'],
    catalogItemsCount: 64
  },
  {
    id: 'b3',
    name: 'UrbanStride Co.',
    slug: 'urbanstride-co',
    tagline: 'Contemporary Streetwear & Minimalist Everyday Sneakers',
    category: 'Urban & Casual',
    origin: 'London, UK',
    establishedYear: 2017,
    minimumOrderCartons: 6,
    marginRange: '40% - 50%',
    featured: true,
    logoInitials: 'US',
    heroImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop',
    description: 'Leading the modern streetwear footwear revolution with clean silhouette cupsoles, sustainable vulcanized canvas, and retro court classics beloved by Gen Z and millennials.',
    highlights: ['Recycled Organic Canvas', 'Cupsole Stability', 'CloudCushion Insole', 'Clean Minimal Aesthetic'],
    catalogItemsCount: 52
  },
  {
    id: 'b4',
    name: 'TerraTrek Footwear',
    slug: 'terratrek-footwear',
    tagline: 'All-Terrain Waterproof Hiking & Heavy-Duty Tactical Boots',
    category: 'Outdoor & Rugged',
    origin: 'Munich, Germany',
    establishedYear: 2005,
    minimumOrderCartons: 5,
    marginRange: '44% - 52%',
    featured: true,
    logoInitials: 'TT',
    heroImage: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1200&auto=format&fit=crop',
    description: 'Battle-tested outdoor footwear featuring Gore-level waterproofing, reinforced steel shanks, and Vibram lugged outsoles engineered for extreme mountain conditions.',
    highlights: ['HydroShield Waterproofing', 'Deep Grip Lug Traction', 'Ankle Stabilizing Collar', 'Composite Toe Defense'],
    catalogItemsCount: 36
  },
  {
    id: 'b5',
    name: 'Veloce Sport',
    slug: 'veloce-sport',
    tagline: 'Precision Court, Tennis & Indoor Training Footwear',
    category: 'Athletic & Sport',
    origin: 'Barcelona, Spain',
    establishedYear: 2015,
    minimumOrderCartons: 6,
    marginRange: '36% - 46%',
    featured: false,
    logoInitials: 'VS',
    heroImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop',
    description: 'Specialized agility and court footwear engineered with lateral anti-roll guards, non-marking gum rubbers, and torsion control plates for tournament players.',
    highlights: ['Non-Marking Outsole', 'Torsion Control Shank', 'Lateral Anti-Twist Frame', 'High-Response Cushioning'],
    catalogItemsCount: 30
  },
  {
    id: 'b6',
    name: 'Monarch & Hyde',
    slug: 'monarch-hyde',
    tagline: 'Heritage Brogues, Penny Loafers & Executive Monks',
    category: 'Luxury & Formal',
    origin: 'Northamptonshire, UK',
    establishedYear: 1988,
    minimumOrderCartons: 4,
    marginRange: '45% - 58%',
    featured: true,
    logoInitials: 'MH',
    heroImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200&auto=format&fit=crop',
    description: 'Prestigious English heritage cobblers producing timeless Goodyear welted oxford shoes and penny loafers using hand-selected European crust leathers.',
    highlights: ['Burnished Crust Leather', 'Oak Bark Tanned Soles', 'Bespoke Brass Eyelets', 'Heritage Last Shapes'],
    catalogItemsCount: 42
  },
  {
    id: 'b7',
    name: 'CloudWalk Comfort',
    slug: 'cloudwalk-comfort',
    tagline: 'Ergonomic Podiatrist-Approved Daily Comfort & Healthcare Shoes',
    category: 'Comfort & Orthopedic',
    origin: 'Zurich, Switzerland',
    establishedYear: 2013,
    minimumOrderCartons: 5,
    marginRange: '40% - 50%',
    featured: false,
    logoInitials: 'CW',
    heroImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
    description: 'Designed in collaboration with Swiss orthopedic surgeons. CloudWalk delivers shock-absorbing, wide toe-box footwear engineered for all-day standing professionals.',
    highlights: ['Anatomical Arch Support', 'Slip-Resistant Grip', 'Removable Orthotic Footbed', 'Anti-Fatigue Midsole'],
    catalogItemsCount: 28
  },
  {
    id: 'b8',
    name: 'LittleStride',
    slug: 'littlestride',
    tagline: 'High-Durability Youth, School & Active Footwear',
    category: 'Youth & Kids',
    origin: 'Melbourne, Australia',
    establishedYear: 2018,
    minimumOrderCartons: 8,
    marginRange: '35% - 45%',
    featured: false,
    logoInitials: 'LS',
    heroImage: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1200&auto=format&fit=crop',
    description: 'Child-proof, scuff-resistant school shoes and playful sports sneakers designed for active kids, featuring easy Velcro fastenings and natural growth footbeds.',
    highlights: ['Scuff-Proof Leather', 'Double Stitch Reinforcement', 'Quick Velcro Fasteners', 'Non-Toxic Materials'],
    catalogItemsCount: 34
  }
]
