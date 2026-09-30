export interface Product {
  id: string
  name: string
  sku: string
  brandId: string
  brandName: string
  category: 'Sneakers' | 'Formal Shoes' | 'Boots' | 'Casual' | 'Sports' | 'Comfort'
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids'
  cartonSize: string
  cartonPairs: number
  minimumOrderCartons: number
  sizeRun: string
  wholesaleEstimatePerPair: number
  msrpPerPair: number
  image: string
  gallery: string[]
  colorways: string[]
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  material: string
  soleMaterial: string
  inStockStatus: 'In Stock' | 'Pre-Order' | 'Limited Wholesale Stock'
  description: string
  specifications: { [key: string]: string }
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'p1',
    name: 'AeroStep Milano Medallion Oxford',
    sku: 'ASM-OXF-101',
    brandId: 'b1',
    brandName: 'AeroStep Italia',
    category: 'Formal Shoes',
    gender: 'Men',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 3,
    sizeRun: 'UK 6 - UK 11 (Assorted Pack)',
    wholesaleEstimatePerPair: 48,
    msrpPerPair: 125,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Espresso Brown', 'Onyx Black', 'Cognac Tan'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: 'Hand-burnished Full Grain Italian Calfskin',
    soleMaterial: 'Genuine Leather Sole with Rubber Injection Grip',
    inStockStatus: 'In Stock',
    description: 'The pinnacle of corporate elegance. Featuring intricate medallion toe broguing, Goodyear welt construction, and padded calfskin insoles designed for long corporate meetings.',
    specifications: {
      'Construction': 'Goodyear Welted',
      'Upper': 'Full-Grain Italian Calf',
      'Lining': 'Breathable Drum-Dyed Leather',
      'Standard Carton Pack': '12 Pairs (6/1, 7/2, 8/3, 9/3, 10/2, 11/1)',
      'Box Weight': '14.5 kg'
    }
  },
  {
    id: 'p2',
    name: 'Vanguard NitroPro Carbon Runner',
    sku: 'VNG-NIT-402',
    brandId: 'b2',
    brandName: 'Vanguard Athletics',
    category: 'Sports',
    gender: 'Unisex',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 5,
    sizeRun: 'UK 5 - UK 11.5',
    wholesaleEstimatePerPair: 42,
    msrpPerPair: 110,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Crimson Flare', 'Electric Volt', 'Obsidian Stealth'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    material: 'Aerated 3D Engineered Knit',
    soleMaterial: 'Dual-Density Nitrogen Superfoam + Carbon Fiber Plate',
    inStockStatus: 'In Stock',
    description: 'High-mileage marathon and interval trainer. Features an embedded full-length carbon composite plate that returns up to 86% of ground impact energy.',
    specifications: {
      'Propulsion Plate': 'Curved Carbon Fiber Blade',
      'Drop': '8mm Heel-to-Toe Drop',
      'Weight': '210g per single shoe',
      'Standard Carton Pack': '12 Pairs Assorted',
      'Box Weight': '8.2 kg'
    }
  },
  {
    id: 'p3',
    name: 'UrbanStride Classic Retro Low-Top',
    sku: 'UBS-CLS-019',
    brandId: 'b3',
    brandName: 'UrbanStride Co.',
    category: 'Sneakers',
    gender: 'Unisex',
    cartonSize: '18 Pairs / Carton',
    cartonPairs: 18,
    minimumOrderCartons: 4,
    sizeRun: 'UK 4 - UK 11',
    wholesaleEstimatePerPair: 26,
    msrpPerPair: 68,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Chalk White / Forest Green', 'Triple White', 'Mustard / White', 'Classic Black'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: '16oz Organic Heavyweight Canvas with Suede Heel Trim',
    soleMaterial: 'Vulcanized Gum Rubber Waffle Outsole',
    inStockStatus: 'In Stock',
    description: 'The top-selling lifestyle sneaker across college and city retailers. Combines timeless 70s skater DNA with reinforced double-stitch canvas.',
    specifications: {
      'Insole': 'Removable High-Resilience EVA Sockliner',
      'Eyelets': 'Antiqued Nickel Eyelets',
      'Durability': 'Double-Foxing Tape Wrap',
      'Standard Carton Pack': '18 Pairs',
      'Box Weight': '15.2 kg'
    }
  },
  {
    id: 'p4',
    name: 'TerraTrek Alpine Peak Waterproof Boot',
    sku: 'TTK-ALP-808',
    brandId: 'b4',
    brandName: 'TerraTrek Footwear',
    category: 'Boots',
    gender: 'Men',
    cartonSize: '8 Pairs / Carton',
    cartonPairs: 8,
    minimumOrderCartons: 3,
    sizeRun: 'UK 7 - UK 12',
    wholesaleEstimatePerPair: 56,
    msrpPerPair: 145,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Desert Ochre', 'Charcoal Gunmetal', 'Timber Brown'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    material: 'Nubuck Waterproof Hydro-Shield Leather',
    soleMaterial: 'Deep-Lug Vibram Mountain Grip Outsole',
    inStockStatus: 'In Stock',
    description: 'Industrial and high-altitude hiking boot with sealed internal membrane, steel toe reinforcement option, and shock-absorbing PU mid-stratum.',
    specifications: {
      'Waterproof Rating': '20,000 mm Hydrostatic Head',
      'Hardware': 'Rustproof Speed Lacing Hooks',
      'Toe Protection': 'Reinforced Rubber Scuff Guard',
      'Standard Carton Pack': '8 Pairs',
      'Box Weight': '16.8 kg'
    }
  },
  {
    id: 'p5',
    name: 'Monarch & Hyde Executive Penny Loafer',
    sku: 'MNH-PEN-512',
    brandId: 'b6',
    brandName: 'Monarch & Hyde',
    category: 'Formal Shoes',
    gender: 'Men',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 3,
    sizeRun: 'UK 6 - UK 11',
    wholesaleEstimatePerPair: 52,
    msrpPerPair: 135,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Oxblood Burgundy', 'Deep Navy Suede', 'Antique Walnut'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    material: 'Full-Grain French Calfskin with Hand-Burnished Patina',
    soleMaterial: 'Oak-Bark Tanned Leather Sole with Channeled Stitching',
    inStockStatus: 'In Stock',
    description: 'A sartorial staple for luxury gentlemen boutiques. Slip-on design with saddle strap cutout and hand-sewn apron detail.',
    specifications: {
      'Last Style': 'Classic Round Toe English Last',
      'Lining': 'Full Glove Leather Lining',
      'Heel': 'Stacked Leather with Rubber Dovetail Toplift',
      'Standard Carton Pack': '12 Pairs',
      'Box Weight': '13.5 kg'
    }
  },
  {
    id: 'p6',
    name: 'Veloce Court Ace Pro Tennis Shoes',
    sku: 'VEL-ACE-770',
    brandId: 'b5',
    brandName: 'Veloce Sport',
    category: 'Sports',
    gender: 'Unisex',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 4,
    sizeRun: 'UK 5 - UK 11',
    wholesaleEstimatePerPair: 38,
    msrpPerPair: 95,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Wimbledon White / Lime', 'Court Blue / Neon Orange'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    material: 'TPU Drag-Shield Mesh & Synthetic Overlays',
    soleMaterial: 'High-Density Non-Marking Herringbone Rubber',
    inStockStatus: 'In Stock',
    description: 'Tournament-ready hardcourt shoe featuring high-traction herringbone tread pattern and dual side stabilizers for high-speed directional changes.',
    specifications: {
      'Lateral Support': 'External TPU Anti-Twist Frame',
      'Toe Drag': 'Duraskin Abrasion Shield',
      'Standard Carton Pack': '12 Pairs',
      'Box Weight': '11.4 kg'
    }
  },
  {
    id: 'p7',
    name: 'CloudWalk Ortho-Glide Comfort Sneaker',
    sku: 'CWK-GLD-304',
    brandId: 'b7',
    brandName: 'CloudWalk Comfort',
    category: 'Comfort',
    gender: 'Women',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 3,
    sizeRun: 'UK 3 - UK 8',
    wholesaleEstimatePerPair: 32,
    msrpPerPair: 85,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Soft Pearl Grey', 'Blush Rose', 'Cloud White'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    material: 'Seamless Stretch Engineered Knit',
    soleMaterial: 'Bio-Mechanic Podiatric Air-Gel Midsole',
    inStockStatus: 'In Stock',
    description: 'Recommended by medical professionals and standing workers. Wide toe-box relieves bunions and plantar fasciitis pressure points.',
    specifications: {
      'Arch Support': 'Built-in Anatomical Thermoplastic Arch',
      'Insole': 'Memory Foam Antimicrobial Cushioning',
      'Standard Carton Pack': '12 Pairs',
      'Box Weight': '7.9 kg'
    }
  },
  {
    id: 'p8',
    name: 'LittleStride ArmorFlex Kids Runner',
    sku: 'LTS-ARM-911',
    brandId: 'b8',
    brandName: 'LittleStride',
    category: 'Casual',
    gender: 'Kids',
    cartonSize: '24 Pairs / Carton',
    cartonPairs: 24,
    minimumOrderCartons: 4,
    sizeRun: 'UK 10 Kids - UK 3 Youth',
    wholesaleEstimatePerPair: 18,
    msrpPerPair: 45,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Royal Blue / Solar Red', 'Rainbow Pastel', 'Stealth Graphite'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    material: 'Ripstop Microfiber & Scuff-Resistant Synthetic Leather',
    soleMaterial: 'Flexible Non-Marking EVA & Natural Rubber Pods',
    inStockStatus: 'In Stock',
    description: 'Indestructible kids shoe built for school playgrounds, featuring easy one-strap Velcro closure and high-visibility reflective heel strips.',
    specifications: {
      'Closure': 'Dual Hook-and-Loop Velcro System',
      'Safety': '3M Scotchlite Reflective Accents',
      'Standard Carton Pack': '24 Pairs Assorted Kids Sizes',
      'Box Weight': '12.8 kg'
    }
  },
  {
    id: 'p9',
    name: 'AeroStep Chelsea Boot Heritage',
    sku: 'ASM-CHL-205',
    brandId: 'b1',
    brandName: 'AeroStep Italia',
    category: 'Boots',
    gender: 'Men',
    cartonSize: '10 Pairs / Carton',
    cartonPairs: 10,
    minimumOrderCartons: 3,
    sizeRun: 'UK 6 - UK 11',
    wholesaleEstimatePerPair: 54,
    msrpPerPair: 139,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Caramel Suede', 'Midnight Black Boxcalf'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    material: 'Oiled Nubuck & Waxed Calf Suede',
    soleMaterial: 'Crepe-Finish Natural Rubber with Leather Welt',
    inStockStatus: 'In Stock',
    description: 'Timeless Chelsea silhouette with heavy-gauge elastic side gores and woven pull tabs for effortless on-and-off versatility.',
    specifications: {
      'Elastic Gores': 'Heavy-Duty Reinforced Italian Elastic',
      'Pull Tabs': 'Twin Front & Rear Jacquard Loops',
      'Standard Carton Pack': '10 Pairs',
      'Box Weight': '14.2 kg'
    }
  },
  {
    id: 'p10',
    name: 'UrbanStride Minimalist Court Leather',
    sku: 'UBS-CRT-450',
    brandId: 'b3',
    brandName: 'UrbanStride Co.',
    category: 'Sneakers',
    gender: 'Unisex',
    cartonSize: '15 Pairs / Carton',
    cartonPairs: 15,
    minimumOrderCartons: 4,
    sizeRun: 'UK 4 - UK 11',
    wholesaleEstimatePerPair: 34,
    msrpPerPair: 89,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Pristine White / Gold Foil', 'Off-White / Gum', 'Monochrome Black'],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    material: 'Tumbled Napa Leather Upper',
    soleMaterial: 'Stitched Margom-Style Rubber Cupsole',
    inStockStatus: 'In Stock',
    description: 'Clean luxury-inspired cupsole sneaker without overt branding. Gold heat-stamped model numbers on the lateral heel.',
    specifications: {
      'Laces': 'Waxed Egyptian Cotton',
      'Construction': '360° Stitched Cupsole Frame',
      'Standard Carton Pack': '15 Pairs',
      'Box Weight': '14.8 kg'
    }
  },
  {
    id: 'p11',
    name: 'TerraTrek Desert Tactical Boot',
    sku: 'TTK-TAC-900',
    brandId: 'b4',
    brandName: 'TerraTrek Footwear',
    category: 'Boots',
    gender: 'Men',
    cartonSize: '10 Pairs / Carton',
    cartonPairs: 10,
    minimumOrderCartons: 3,
    sizeRun: 'UK 6 - UK 12',
    wholesaleEstimatePerPair: 50,
    msrpPerPair: 129,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Coyote Tan', 'Olive Drab', 'Night Ops Black'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    material: '1000D Cordura Fabric & Suede Leather Combination',
    soleMaterial: 'Oil-Resistant High-Traction Carbon Rubber',
    inStockStatus: 'In Stock',
    description: 'Ultra-lightweight military tactical boot with quick side zipper access and moisture-wicking antimicrobial lining.',
    specifications: {
      'Side Zip': 'YKK Mil-Spec Heavy Gauge Zipper',
      'Shank': 'Non-Metallic Composite Arch Shank',
      'Standard Carton Pack': '10 Pairs',
      'Box Weight': '13.9 kg'
    }
  },
  {
    id: 'p12',
    name: 'Vanguard Velocity Aero Spike',
    sku: 'VNG-VEL-720',
    brandId: 'b2',
    brandName: 'Vanguard Athletics',
    category: 'Sports',
    gender: 'Unisex',
    cartonSize: '12 Pairs / Carton',
    cartonPairs: 12,
    minimumOrderCartons: 4,
    sizeRun: 'UK 6 - UK 11',
    wholesaleEstimatePerPair: 44,
    msrpPerPair: 115,
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=800&auto=format&fit=crop'
    ],
    colorways: ['Cyber Lime / Cyber Blue', 'Hot Pink / Neon Yellow'],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    material: 'Monofilament Ultralight Translucent Upper',
    soleMaterial: 'Pebax Track Plate with Replaceable Metal Spike Pins',
    inStockStatus: 'Limited Wholesale Stock',
    description: 'High-school and collegiate sprint track shoes delivering maximum stiffness and explosive forward propulsion out of starting blocks.',
    specifications: {
      'Spike Receptacles': '6-Pin Configuration with Key Tool Included',
      'Fit': 'Snug Competition Lockdown Fit',
      'Standard Carton Pack': '12 Pairs',
      'Box Weight': '6.8 kg'
    }
  }
]
