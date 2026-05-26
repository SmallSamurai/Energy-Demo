export type SolutionId = 'solar' | 'bess' | 'ppa' | 'hvac' | 'ev' | 'carbon' | 'hub' | 'efficiency'

export type GoalFilter = 'all' | 'cost' | 'carbon' | 'resilience' | 'revenue'
export type IndustryFilter = 'all' | 'manufacturing' | 'retail' | 'healthcare' | 'logistics' | 'office'

export interface Solution {
  id: SolutionId
  name: string
  tagline: string
  description: string
  icon: string
  color: string
  colorDim: string
  goals: GoalFilter[]
  industries: IndustryFilter[]
  typicalSaving: string
  paybackYears: number
  carbonReduction: number // tCO2/yr typical
  capex: string
  roi: number // %
  compatibleWith: SolutionId[]
  stackRole: 'generate' | 'store' | 'procure' | 'manage' | 'offset' | 'flex'
  caseStudy: { name: string; industry: string; result: string; saving: string }
  tags: string[]
}

export const solutions: Solution[] = [
  {
    id: 'solar',
    name: 'Rooftop & Ground Solar',
    tagline: 'Generate clean power from your own assets',
    description: 'Behind-the-meter solar PV across rooftop and ground-mounted configurations. Sized to your load profile, with excess export to grid.',
    icon: '☀️',
    color: '#FBCE07',
    colorDim: '#FBCE0715',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'logistics', 'office'],
    typicalSaving: '£45k–£180k/yr',
    paybackYears: 5.2,
    carbonReduction: 280,
    capex: '£250k–£1.2M',
    roi: 19,
    compatibleWith: ['bess', 'hub', 'ev', 'efficiency'],
    stackRole: 'generate',
    caseStudy: { name: 'Britvic Plc', industry: 'Food & Beverage', result: '2.1 MW rooftop — 38% daytime self-sufficiency', saving: '£127k/yr' },
    tags: ['PV', 'Behind-the-meter', 'REGO', 'Export'],
  },
  {
    id: 'bess',
    name: 'Battery Energy Storage',
    tagline: 'Store cheap energy, sell high — or use as backup',
    description: 'Grid-scale and behind-the-meter BESS for peak shaving, time-of-use arbitrage, backup power and balancing market participation.',
    icon: '🔋',
    color: '#10B981',
    colorDim: '#10B98115',
    goals: ['cost', 'resilience', 'revenue'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics'],
    typicalSaving: '£60k–£240k/yr',
    paybackYears: 6.8,
    carbonReduction: 180,
    capex: '£400k–£2.5M',
    roi: 15,
    compatibleWith: ['solar', 'hub', 'hvac', 'ev'],
    stackRole: 'store',
    caseStudy: { name: 'NHS Trust (Midlands)', industry: 'Healthcare', result: '500 kWh BESS — peak demand cut 42%, backup power for critical systems', saving: '£88k/yr' },
    tags: ['Peak shaving', 'Arbitrage', 'Backup', 'FFR'],
  },
  {
    id: 'ppa',
    name: 'Renewable PPA',
    tagline: 'Lock in clean power at a fixed price for 10–15 years',
    description: 'Corporate Power Purchase Agreements with wind and solar generators. Hedge against market volatility and deliver Scope 2 zero-carbon electricity.',
    icon: '📋',
    color: '#3B82F6',
    colorDim: '#3B82F615',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'office', 'logistics'],
    typicalSaving: '£120k–£800k/yr',
    paybackYears: 0,
    carbonReduction: 1200,
    capex: '£0 (contractual)',
    roi: 22,
    compatibleWith: ['carbon', 'hub', 'efficiency'],
    stackRole: 'procure',
    caseStudy: { name: 'Halfords Group', industry: 'Retail', result: '15-year PPA across 450 stores — 100% renewable matched electricity', saving: '£340k/yr vs market' },
    tags: ['Scope 2', 'REGOs', 'Fixed price', 'Zero carbon'],
  },
  {
    id: 'hvac',
    name: 'HVAC LoadFlex',
    tagline: 'Turn your heating & cooling into a revenue stream',
    description: 'Demand response technology applied to HVAC systems. Pre-cool or pre-heat during cheap periods, curtail during peak — without occupant disruption.',
    icon: '❄️',
    color: '#06B6D4',
    colorDim: '#06B6D415',
    goals: ['cost', 'revenue'],
    industries: ['retail', 'office', 'healthcare'],
    typicalSaving: '£18k–£75k/yr',
    paybackYears: 2.8,
    carbonReduction: 95,
    capex: '£25k–£120k',
    roi: 36,
    compatibleWith: ['bess', 'hub', 'efficiency'],
    stackRole: 'flex',
    caseStudy: { name: 'Tesco Extra (12 sites)', industry: 'Retail', result: 'LoadFlex across refrigeration & HVAC — 1.8 MW demand response capacity', saving: '£52k/yr demand revenue' },
    tags: ['Demand response', 'FFR', 'BM', 'Thermal storage'],
  },
  {
    id: 'ev',
    name: 'EV Fleet Charging',
    tagline: 'Smart charging that minimises cost and grid impact',
    description: 'Smart EV charging infrastructure for fleets and staff. Managed charging schedules aligned to tariffs, solar output, and grid signals.',
    icon: '⚡',
    color: '#8B5CF6',
    colorDim: '#8B5CF615',
    goals: ['cost', 'carbon'],
    industries: ['logistics', 'retail', 'manufacturing'],
    typicalSaving: '£22k–£90k/yr',
    paybackYears: 3.4,
    carbonReduction: 220,
    capex: '£80k–£600k',
    roi: 29,
    compatibleWith: ['solar', 'bess', 'hub'],
    stackRole: 'manage',
    caseStudy: { name: 'DPD UK', industry: 'Logistics', result: '200-vehicle EV fleet — smart charging reduced peak demand 55%', saving: '£74k/yr energy + grid costs' },
    tags: ['V2G', 'Smart charging', 'Fleet', 'Workplace'],
  },
  {
    id: 'carbon',
    name: 'Carbon Credits & Offsets',
    tagline: 'Compensate unavoidable emissions with verified credits',
    description: 'Nature-based and technology-backed carbon credits, voluntary offset bundles, and compliance EUA procurement. Aligned to SBTi and TCFD frameworks.',
    icon: '🌿',
    color: '#34D399',
    colorDim: '#34D39915',
    goals: ['carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: 'Net zero pathway',
    paybackYears: 0,
    carbonReduction: 2400,
    capex: '£8k–£200k/yr',
    roi: 0,
    compatibleWith: ['ppa', 'hub', 'efficiency'],
    stackRole: 'offset',
    caseStudy: { name: 'Aggregate Industries', industry: 'Construction', result: '12,000 tCO₂ offset via REDD+ forestry + direct air capture bundle', saving: '£0 — compliance met' },
    tags: ['SBTi', 'TCFD', 'VCM', 'CORSIA', 'EUA'],
  },
  {
    id: 'hub',
    name: 'Smart Energy Hub',
    tagline: 'One platform to orchestrate your entire energy estate',
    description: 'Shell Energy Hub integrates solar, BESS, EV charging, HVAC and market data into a single management layer. AI-driven dispatch optimisation across all assets.',
    icon: '🧠',
    color: '#F97316',
    colorDim: '#F9731615',
    goals: ['cost', 'carbon', 'resilience', 'revenue'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: '£30k–£120k/yr incremental',
    paybackYears: 3.1,
    carbonReduction: 150,
    capex: '£45k–£280k',
    roi: 32,
    compatibleWith: ['solar', 'bess', 'ev', 'hvac', 'ppa', 'efficiency'],
    stackRole: 'manage',
    caseStudy: { name: 'Network Rail (7 depots)', industry: 'Infrastructure', result: 'Hub orchestrating solar + BESS + EV across 7 depots — 61% renewable self-sufficiency', saving: '£210k/yr combined' },
    tags: ['SCADA', 'AI dispatch', 'API', 'Dashboard'],
  },
  {
    id: 'efficiency',
    name: 'Energy Efficiency Audit',
    tagline: 'Find the hidden savings before investing in generation',
    description: 'ESOS-compliant energy audit identifying behavioural, process, and fabric improvements. Typically surfaces 12–22% consumption reduction before any capital investment.',
    icon: '🔍',
    color: '#EC4899',
    colorDim: '#EC489915',
    goals: ['cost', 'carbon'],
    industries: ['manufacturing', 'retail', 'healthcare', 'logistics', 'office'],
    typicalSaving: '£15k–£90k/yr',
    paybackYears: 1.2,
    carbonReduction: 120,
    capex: '£5k–£35k',
    roi: 85,
    compatibleWith: ['hub', 'hvac', 'solar', 'ppa'],
    stackRole: 'manage',
    caseStudy: { name: 'Brindleyplace Estate', industry: 'Commercial Property', result: 'ESOS audit identified £68k savings — 18% consumption reduction with zero capex', saving: '£68k/yr' },
    tags: ['ESOS', 'ISO 50001', 'Audit', 'Quick wins'],
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

// Solutions 360 — combined portfolio data
export const portfolioSummary = {
  totalAnnualSaving: 681000,
  totalCarbonReduction: 4643,
  totalCapex: 2180000,
  blendedPayback: 4.6,
  blendedRoi: 28,
  scopeReduction: { scope1: 12, scope2: 78, scope3: 8 },
}

export const energyFlowNodes = [
  { id: 'grid', label: 'Grid Import', value: 2800, type: 'source' },
  { id: 'solar', label: 'Solar PV', value: 1200, type: 'source' },
  { id: 'ppa', label: 'PPA Renewable', value: 1600, type: 'source' },
  { id: 'bess', label: 'BESS', value: 800, type: 'buffer' },
  { id: 'hub', label: 'Smart Hub', value: 6400, type: 'manage' },
  { id: 'building', label: 'Building Load', value: 3200, type: 'consume' },
  { id: 'hvac', label: 'HVAC', value: 1400, type: 'consume' },
  { id: 'ev', label: 'EV Fleet', value: 900, type: 'consume' },
  { id: 'export', label: 'Grid Export / BM', value: 700, type: 'export' },
]

export const stackTimelineData = [
  { year: '2025', solar: 0, bess: 0, ppa: 120, hvac: 18, ev: 0, carbon: 8, efficiency: 68, hub: 30 },
  { year: '2026', solar: 127, bess: 0, ppa: 120, hvac: 52, ev: 22, carbon: 12, efficiency: 68, hub: 45 },
  { year: '2027', solar: 127, bess: 88, ppa: 120, hvac: 52, ev: 74, carbon: 12, efficiency: 68, hub: 80 },
  { year: '2028', solar: 127, bess: 88, ppa: 340, hvac: 52, ev: 74, carbon: 15, efficiency: 68, hub: 80 },
  { year: '2029', solar: 127, bess: 88, ppa: 340, hvac: 52, ev: 74, carbon: 15, efficiency: 68, hub: 110 },
  { year: '2030', solar: 180, bess: 160, ppa: 340, hvac: 75, ev: 90, carbon: 20, efficiency: 68, hub: 120 },
]

export const carbonPathwayData = [
  { year: '2024', baseline: 4800, actual: 4800, target: 4800 },
  { year: '2025', baseline: 4800, actual: 4200, target: 4100 },
  { year: '2026', baseline: 4800, actual: 3400, target: 3300 },
  { year: '2027', baseline: 4800, actual: 2800, target: 2700 },
  { year: '2028', baseline: 4800, actual: 2200, target: 2000 },
  { year: '2029', baseline: 4800, actual: 1600, target: 1400 },
  { year: '2030', baseline: 4800, actual: 980, target: 800 },
]
