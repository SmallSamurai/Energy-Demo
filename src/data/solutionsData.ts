export type SolutionId = 'solar' | 'bess' | 'ppa' | 'hvac' | 'ev' | 'carbon' | 'hub' | 'efficiency'
export type GoalFilter = 'all' | 'cost' | 'carbon' | 'resilience' | 'revenue'
export type IndustryFilter = 'all' | 'manufacturing' | 'retail' | 'healthcare' | 'logistics' | 'office'

export interface Solution {
  id: SolutionId
  name: string
  tagline: string
  description: string
  icon: string
  illustration: string   // SVG/emoji art for card hero
  color: string
  colorDim: string
  goals: GoalFilter[]
  industries: IndustryFilter[]
  typicalSaving: string
  paybackYears: number
  carbonReduction: number
  capex: string
  roi: number
  compatibleWith: SolutionId[]
  stackRole: 'generate' | 'store' | 'procure' | 'manage' | 'offset' | 'flex'
  caseStudy: { name: string; industry: string; result: string; saving: string }
  tags: string[]
}

export const solutions: Solution[] = [
  {
    id: 'solar',
    name: 'Commercial Solar PV',
    tagline: 'Generate clean power from your own assets',
    description: 'Behind-the-meter solar PV across rooftop and ground-mounted configurations. Sized to your load profile, with excess export to grid or storage.',
    icon: '☀️',
    illustration: '🌞',
    color: '#F59E0B',
    colorDim: '#FEF3C7',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'logistics', 'office'],
    typicalSaving: '$52k–$210k/yr',
    paybackYears: 5.2,
    carbonReduction: 280,
    capex: '$290k–$1.4M',
    roi: 19,
    compatibleWith: ['bess', 'hub', 'ev', 'efficiency'],
    stackRole: 'generate',
    caseStudy: { name: 'Sysco Corporation', industry: 'Food Distribution', result: '2.4 MW rooftop across 8 distribution centers — 41% daytime self-sufficiency', saving: '$148k/yr' },
    tags: ['PV', 'ITC Credit', 'Behind-the-meter', 'Net Metering'],
  },
  {
    id: 'bess',
    name: 'Battery Energy Storage',
    tagline: 'Store cheap energy, sell high — or use as backup',
    description: 'Grid-scale and behind-the-meter BESS for peak shaving, time-of-use arbitrage, backup power and ERCOT/PJM ancillary market participation.',
    icon: '🔋',
    illustration: '⚡',
    color: '#10B981',
    colorDim: '#D1FAE5',
    goals: ['cost', 'resilience', 'revenue'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics'],
    typicalSaving: '$70k–$280k/yr',
    paybackYears: 6.8,
    carbonReduction: 180,
    capex: '$460k–$2.9M',
    roi: 15,
    compatibleWith: ['solar', 'hub', 'hvac', 'ev'],
    stackRole: 'store',
    caseStudy: { name: 'HCA Healthcare (Texas)', industry: 'Healthcare', result: '600 kWh BESS — peak demand cut 44%, critical backup power for ICU systems', saving: '$102k/yr' },
    tags: ['Peak shaving', 'Arbitrage', 'Backup', 'ERCOT Ancillary'],
  },
  {
    id: 'ppa',
    name: 'Renewable PPA',
    tagline: 'Lock in clean power at a fixed price for 10–15 years',
    description: 'Corporate Power Purchase Agreements with wind and solar generators. Hedge against market volatility and deliver Scope 2 zero-carbon electricity across your US portfolio.',
    icon: '📋',
    illustration: '🌬️',
    color: '#3B82F6',
    colorDim: '#DBEAFE',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'office', 'logistics'],
    typicalSaving: '$140k–$940k/yr',
    paybackYears: 0,
    carbonReduction: 1200,
    capex: '$0 (contractual)',
    roi: 22,
    compatibleWith: ['carbon', 'hub', 'efficiency'],
    stackRole: 'procure',
    caseStudy: { name: 'Target Corporation', industry: 'Retail', result: '15-year PPA across 500 stores — 100% renewable-matched electricity, Scope 2 zero', saving: '$398k/yr vs market' },
    tags: ['Scope 2', 'RECs', 'Fixed price', 'Zero carbon'],
  },
  {
    id: 'hvac',
    name: 'HVAC LoadFlex',
    tagline: 'Turn your HVAC into a demand response revenue stream',
    description: 'Demand response technology applied to HVAC systems. Pre-cool during off-peak periods, curtail during demand events — without occupant disruption. Earn ERCOT or PJM demand response revenue.',
    icon: '❄️',
    illustration: '🌡️',
    color: '#06B6D4',
    colorDim: '#CFFAFE',
    goals: ['cost', 'revenue'],
    industries: ['retail', 'office', 'healthcare'],
    typicalSaving: '$21k–$88k/yr',
    paybackYears: 2.8,
    carbonReduction: 95,
    capex: '$29k–$140k',
    roi: 36,
    compatibleWith: ['bess', 'hub', 'efficiency'],
    stackRole: 'flex',
    caseStudy: { name: 'Walmart (12 TX stores)', industry: 'Retail', result: 'LoadFlex across refrigeration & HVAC — 2.1 MW ERCOT demand response capacity', saving: '$61k/yr demand revenue' },
    tags: ['Demand response', 'ERCOT', 'PJM', 'Thermal storage'],
  },
  {
    id: 'ev',
    name: 'EV Fleet Charging',
    tagline: 'Smart charging that minimizes cost and grid impact',
    description: 'Smart EV charging infrastructure for fleets and staff. Managed charging schedules aligned to TOU tariffs, solar output, and ERCOT/PJM grid signals.',
    icon: '⚡',
    illustration: '🚗',
    color: '#8B5CF6',
    colorDim: '#EDE9FE',
    goals: ['cost', 'carbon'],
    industries: ['logistics', 'retail', 'manufacturing'],
    typicalSaving: '$26k–$105k/yr',
    paybackYears: 3.4,
    carbonReduction: 220,
    capex: '$93k–$700k',
    roi: 29,
    compatibleWith: ['solar', 'bess', 'hub'],
    stackRole: 'manage',
    caseStudy: { name: 'Amazon Logistics (Texas)', industry: 'Logistics', result: '240-vehicle EV fleet — smart charging reduced peak demand 58%', saving: '$86k/yr energy + grid costs' },
    tags: ['V2G', 'Smart charging', 'Fleet', 'NEVI'],
  },
  {
    id: 'carbon',
    name: 'Carbon Credits & Offsets',
    tagline: 'Compensate unavoidable emissions with verified US credits',
    description: 'Nature-based and technology-backed carbon credits, voluntary offset bundles, and California Carbon Allowance (CCA) procurement. Aligned to SBTi and SEC climate disclosure frameworks.',
    icon: '🌿',
    illustration: '🌲',
    color: '#34D399',
    colorDim: '#D1FAE5',
    goals: ['carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: 'Net zero pathway',
    paybackYears: 0,
    carbonReduction: 2400,
    capex: '$9k–$230k/yr',
    roi: 0,
    compatibleWith: ['ppa', 'hub', 'efficiency'],
    stackRole: 'offset',
    caseStudy: { name: 'Vulcan Materials', industry: 'Construction', result: '14,000 tCO₂ offset via REDD+ forestry + direct air capture bundle', saving: '$0 — SEC compliance met' },
    tags: ['SBTi', 'SEC Climate', 'VCM', 'CCA', 'RGGI'],
  },
  {
    id: 'hub',
    name: 'Smart Energy Hub',
    tagline: 'One platform to orchestrate your entire energy estate',
    description: 'Shell Energy Hub integrates solar, BESS, EV charging, HVAC and market data into a single management layer. AI-driven dispatch optimization across all assets for maximum financial and carbon performance.',
    icon: '🧠',
    illustration: '🖥️',
    color: '#F97316',
    colorDim: '#FFEDD5',
    goals: ['cost', 'carbon', 'resilience', 'revenue'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: '$35k–$140k/yr incremental',
    paybackYears: 3.1,
    carbonReduction: 150,
    capex: '$52k–$325k',
    roi: 32,
    compatibleWith: ['solar', 'bess', 'ev', 'hvac', 'ppa', 'efficiency'],
    stackRole: 'manage',
    caseStudy: { name: 'Union Pacific (8 depots)', industry: 'Infrastructure', result: 'Hub orchestrating solar + BESS + EV across 8 depots — 63% renewable self-sufficiency', saving: '$245k/yr combined' },
    tags: ['SCADA', 'AI dispatch', 'API', 'Dashboard'],
  },
  {
    id: 'efficiency',
    name: 'Energy Efficiency Audit',
    tagline: 'Find the hidden savings before investing in generation',
    description: 'Comprehensive energy audit identifying behavioral, process, and facility improvements. Typically surfaces 12–22% consumption reduction before any capital investment. Aligned with ENERGY STAR and DOE Better Buildings.',
    icon: '🔍',
    illustration: '📊',
    color: '#EC4899',
    colorDim: '#FCE7F3',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: '$17k–$105k/yr',
    paybackYears: 1.2,
    carbonReduction: 120,
    capex: '$6k–$40k',
    roi: 85,
    compatibleWith: ['hub', 'hvac', 'solar', 'ppa'],
    stackRole: 'manage',
    caseStudy: { name: 'Brookfield Properties', industry: 'Commercial Real Estate', result: 'ENERGY STAR audit identified $79k savings — 19% consumption reduction, zero capex', saving: '$79k/yr' },
    tags: ['ENERGY STAR', 'DOE Better Buildings', 'Audit', 'Quick wins'],
  },
]

export const stackRoleLabels: Record<Solution['stackRole'], string> = {
  generate: 'Generate',
  store: 'Store',
  procure: 'Procure',
  manage: 'Manage',
  offset: 'Offset',
  flex: 'Flex & Respond',
}

export const goalLabels: Record<GoalFilter, string> = {
  all: 'All Goals',
  cost: 'Reduce Cost',
  carbon: 'Cut Carbon',
  resilience: 'Build Resilience',
  revenue: 'Generate Revenue',
}

export const industryLabels: Record<IndustryFilter, string> = {
  all: 'All Industries',
  manufacturing: 'Manufacturing',
  retail: 'Retail',
  healthcare: 'Healthcare',
  logistics: 'Logistics',
  office: 'Office / Commercial',
}

export const portfolioSummary = {
  totalAnnualSaving: 795000,
  totalCarbonReduction: 4643,
  totalCapex: 2540000,
  blendedPayback: 4.6,
  blendedRoi: 28,
  scopeReduction: { scope1: 12, scope2: 78, scope3: 8 },
}

export const energyFlowNodes = [
  { id: 'grid',     label: 'Grid Import',    value: 2800,  type: 'source'  },
  { id: 'solar',    label: 'Solar PV',        value: 1200,  type: 'source'  },
  { id: 'ppa',      label: 'PPA Renewable',   value: 1600,  type: 'source'  },
  { id: 'bess',     label: 'BESS',            value: 800,   type: 'buffer'  },
  { id: 'hub',      label: 'Smart Hub',       value: 6400,  type: 'manage'  },
  { id: 'building', label: 'Building Load',   value: 3200,  type: 'consume' },
  { id: 'hvac',     label: 'HVAC',            value: 1400,  type: 'consume' },
  { id: 'ev',       label: 'EV Fleet',        value: 900,   type: 'consume' },
  { id: 'export',   label: 'Grid Export / DR',value: 700,   type: 'export'  },
]

export const stackTimelineData = [
  { year: '2025', solar:   0, bess:  0, ppa: 140, hvac: 21, ev:  0, carbon:  9, efficiency: 79, hub:  35 },
  { year: '2026', solar: 148, bess:  0, ppa: 140, hvac: 61, ev: 26, carbon: 14, efficiency: 79, hub:  52 },
  { year: '2027', solar: 148, bess: 102,ppa: 140, hvac: 61, ev: 86, carbon: 14, efficiency: 79, hub:  93 },
  { year: '2028', solar: 148, bess: 102,ppa: 398, hvac: 61, ev: 86, carbon: 17, efficiency: 79, hub:  93 },
  { year: '2029', solar: 148, bess: 102,ppa: 398, hvac: 61, ev: 86, carbon: 17, efficiency: 79, hub: 128 },
  { year: '2030', solar: 210, bess: 186,ppa: 398, hvac: 88, ev: 105,carbon: 23, efficiency: 79, hub: 140 },
]

export const carbonPathwayData = [
  { year: '2024', baseline: 4800, actual: 4800, target: 4800 },
  { year: '2025', baseline: 4800, actual: 4200, target: 4100 },
  { year: '2026', baseline: 4800, actual: 3400, target: 3300 },
  { year: '2027', baseline: 4800, actual: 2800, target: 2700 },
  { year: '2028', baseline: 4800, actual: 2200, target: 2000 },
  { year: '2029', baseline: 4800, actual: 1600, target: 1400 },
  { year: '2030', baseline: 4800, actual: 980,  target: 800  },
]
