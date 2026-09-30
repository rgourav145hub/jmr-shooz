export interface BusinessStat {
  id: string
  number: string
  label: string
  sublabel: string
  description: string
}

export const COMPANY_STATS: BusinessStat[] = [
  {
    id: 's1',
    number: '450+',
    label: 'Authorized Retailers',
    sublabel: 'Across 38 Metropolitan & Regional Zones',
    description: 'Active departmental stores, multi-brand footwear outlets, and boutique sneaker chains relying on JMR Shooz stock continuity.'
  },
  {
    id: 's2',
    number: '18+',
    label: 'Global & Regional Brands',
    sublabel: 'Exclusive Distribution Agreements',
    description: 'Hand-picked portfolio of athletic, formal, lifestyle, and industrial footwear brands distributed with strict margin protection.'
  },
  {
    id: 's3',
    number: '2.4M+',
    label: 'Pairs Distributed Annually',
    sublabel: 'Rapidly Growing B2B Fulfillment Volume',
    description: 'High-velocity logistics network managing full carton, multi-tier assortments, and rapid replenish runs.'
  },
  {
    id: 's4',
    number: '99.4%',
    label: 'On-Time Dispatch Rate',
    sublabel: '48-Hour Regional Dispatch SLA',
    description: 'Automated barcoded warehouse management ensuring zero carton mispicks and immediate freight handoff.'
  },
  {
    id: 's5',
    number: '6',
    label: 'Regional Distribution Hubs',
    sublabel: '160,000+ sq. ft. Total Warehouse Space',
    description: 'Strategically located hubs positioned close to major commercial transit corridors for rapid replenishment.'
  },
  {
    id: 's6',
    number: '15+',
    label: 'Years of Market Trust',
    sublabel: 'Founded on Integrity & Dealer Support',
    description: 'Deep-rooted relationships with footwear retail families, institutional suppliers, and international brand owners.'
  }
]
