import { useState } from 'react'
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, LineChart, Line
} from 'recharts'
import { TrendingUp, Leaf, Zap } from 'lucide-react'
import { solutions, portfolioSummary, stackTimelineData, carbonPathwayData } from '../../data/solutionsData'

const SOL_COLORS: Record<string, string> = {
  solar: '#FBCE07', bess: '#10B981', ppa: '#3B82F6', hvac: '#06B6D4',
  ev: '#8B5CF6', carbon: '#34D399', hub: '#F97316', efficiency: '#EC4899',
}

export default function Solutions360() {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null)
  const [activeStack, setActiveStack] = useState<string[]>(solutions.map(s => s.id))

  const activeSolutions = solutions.filter(s => activeStack.includes(s.id))
  const totalSaving = activeSolutions.reduce((sum, s) => {
    const mid = parseFloat(s.typicalSaving.replace(/[^0-9–-]/g, '').split(/[–-]/)[0]) * 1000
    return sum + (isNaN(mid) ? 0 : mid)
  }, 0)
  const totalCarbon = activeSolutions.reduce((s, sol) => s + sol.carbonReduction, 0)

  const toggleSolution = (id: string) => {
    setActiveStack(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-5">
      {/* Portfolio KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard icon={<TrendingUp size={16} />} label="Combined Annual Saving" value={`$${(portfolioSummary.totalAnnualSaving / 1000).toFixed(0)}k`} sub="All 8 solutions deployed" color="#FBCE07" />
        <KpiCard icon={<Leaf size={16} />} label="Total Carbon Reduction" value={`${(portfolioSummary.totalCarbonReduction / 1000).toFixed(1)}k tCO₂`} sub="vs. 2024 baseline" color="#10B981" />
        <KpiCard icon={<span className="text-sm">💰</span>} label="Total Capex" value={`$${(portfolioSummary.totalCapex / 1000000).toFixed(1)}M`} sub="Full stack deployment" color="#3B82F6" />
        <KpiCard icon={<span className="text-sm">⏱</span>} label="Blended Payback" value={`${portfolioSummary.blendedPayback} yrs`} sub="Portfolio average" color="#F97316" />
        <KpiCard icon={<Zap size={16} />} label="Blended ROI" value={`${portfolioSummary.blendedRoi}%`} sub="IRR across all solutions" color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Energy Flow Diagram */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Integrated Energy Flow</h2>
          <p className="text-gray-400 text-xs mb-5">How your solutions interact — hover to highlight flows</p>
          <EnergyFlow hoveredFlow={hoveredFlow} setHoveredFlow={setHoveredFlow} />
        </div>

        {/* Scope breakdown */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Carbon Scope Reduction</h2>
          <p className="text-gray-400 text-xs mb-4">% of each scope addressed by solutions</p>
          <div className="space-y-5">
            {[
              { scope: 'Scope 1', pct: portfolioSummary.scopeReduction.scope1, desc: 'Direct operational emissions', color: '#DD1D21' },
              { scope: 'Scope 2', pct: portfolioSummary.scopeReduction.scope2, desc: 'Purchased electricity — PPA + solar', color: '#FBCE07' },
              { scope: 'Scope 3', pct: portfolioSummary.scopeReduction.scope3, desc: 'Fleet EV transition', color: '#3B82F6' },
            ].map(s => (
              <div key={s.scope}>
                <div className="flex justify-between text-xs mb-2">
                  <div>
                    <span className="text-white font-semibold">{s.scope}</span>
                    <span className="text-gray-400 ml-2">{s.desc}</span>
                  </div>
                  <span className="font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-white text-xs font-semibold mb-3">Per-solution Carbon Impact</h3>
            <div className="space-y-2">
              {solutions.sort((a, b) => b.carbonReduction - a.carbonReduction).map(s => (
                <div key={s.id} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-center">{s.icon}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(s.carbonReduction / 2400) * 100}%`, backgroundColor: SOL_COLORS[s.id] }} />
                  </div>
                  <span className="text-gray-500 w-20 text-right">{s.carbonReduction} tCO₂</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Carbon pathway */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Decarbonisation Pathway</h2>
          <p className="text-gray-400 text-xs mb-4">Actual trajectory vs. SBTi-aligned target (tCO₂/yr)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={carbonPathwayData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(1)}kt`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v} tCO₂`]} />
              <Line type="monotone" dataKey="baseline" stroke="#374151" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="No action" />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="SBTi Target" />
              <Line type="monotone" dataKey="actual" stroke="#FBCE07" strokeWidth={2.5} dot={{ fill: '#FBCE07', r: 3 }} name="With solutions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked financial timeline */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Cumulative Savings by Solution</h2>
          <p className="text-gray-400 text-xs mb-4">Stacked annual savings as each solution comes online ($k/yr)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stackTimelineData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}k`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${v}k`]} />
              {Object.keys(SOL_COLORS).map(id => (
                <Bar key={id} dataKey={id} stackId="a" fill={SOL_COLORS[id]} name={solutions.find(s => s.id === id)?.name ?? id} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stack builder */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-sm">Build Your Stack</h2>
            <p className="text-gray-400 text-xs mt-0.5">Toggle solutions on/off to model your specific deployment — metrics update in real-time</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Selected stack</p>
            <p className="text-white font-bold">${(totalSaving / 1000).toFixed(0)}k/yr · {totalCarbon.toLocaleString()} tCO₂</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {solutions.map(s => {
            const active = activeStack.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleSolution(s.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  active ? 'border-opacity-40' : 'border-gray-200 opacity-40'
                }`}
                style={active ? { borderColor: SOL_COLORS[s.id] + '60', backgroundColor: SOL_COLORS[s.id] + '08' } : {}}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: SOL_COLORS[s.id] + (active ? '20' : '10') }}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${active ? 'text-white' : 'text-gray-400'}`}>{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.carbonReduction} tCO₂</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Energy Flow Diagram ──────────────────────────────────────────────────────

const FLOW_NODES = [
  // Sources (left)
  { id: 'grid', label: 'Grid Import', value: '2,800 kWh', icon: '🔌', x: 4, y: 20, type: 'source', color: '#6B7280' },
  { id: 'solar', label: 'Solar PV', value: '1,200 kWh', icon: '☀️', x: 4, y: 50, type: 'source', color: '#FBCE07' },
  { id: 'ppa', label: 'PPA Power', value: '1,600 kWh', icon: '📋', x: 4, y: 80, type: 'source', color: '#3B82F6' },
  // Buffer (centre-left)
  { id: 'bess', label: 'BESS', value: '±800 kWh', icon: '🔋', x: 35, y: 50, type: 'buffer', color: '#10B981' },
  // Hub (centre)
  { id: 'hub', label: 'Smart Hub', value: 'AI Dispatch', icon: '🧠', x: 58, y: 50, type: 'hub', color: '#F97316' },
  // Consumers (right)
  { id: 'building', label: 'Building Load', value: '3,200 kWh', icon: '🏭', x: 85, y: 20, type: 'consume', color: '#9CA3AF' },
  { id: 'hvac', label: 'HVAC', value: '1,400 kWh', icon: '❄️', x: 85, y: 50, type: 'consume', color: '#06B6D4' },
  { id: 'ev', label: 'EV Fleet', value: '900 kWh', icon: '⚡', x: 85, y: 80, type: 'consume', color: '#8B5CF6' },
  { id: 'export', label: 'BM Export', value: '700 kWh', icon: '↗', x: 85, y: 95, type: 'export', color: '#34D399' },
]

const FLOWS = [
  { from: 'grid', to: 'hub', label: 'Import' },
  { from: 'solar', to: 'bess', label: 'Charge' },
  { from: 'solar', to: 'hub', label: 'Direct' },
  { from: 'ppa', to: 'hub', label: 'Settled' },
  { from: 'bess', to: 'hub', label: 'Dispatch' },
  { from: 'hub', to: 'building', label: '' },
  { from: 'hub', to: 'hvac', label: 'LoadFlex' },
  { from: 'hub', to: 'ev', label: 'Smart charge' },
  { from: 'hub', to: 'export', label: 'BM bid' },
]

function EnergyFlow({ hoveredFlow, setHoveredFlow }: { hoveredFlow: string | null; setHoveredFlow: (id: string | null) => void }) {
  const getNode = (id: string) => FLOW_NODES.find(n => n.id === id)!

  return (
    <div className="relative w-full h-64 select-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {FLOWS.map(flow => {
          const from = getNode(flow.from)
          const to = getNode(flow.to)
          const flowId = `${flow.from}-${flow.to}`
          const active = hoveredFlow === flowId || hoveredFlow === null
          return (
            <g key={flowId} onMouseEnter={() => setHoveredFlow(flowId)} onMouseLeave={() => setHoveredFlow(null)} style={{ cursor: 'pointer' }}>
              <line
                x1={from.x + 4} y1={from.y}
                x2={to.x - 4} y2={to.y}
                stroke={active ? (from.color) : '#1F2937'}
                strokeWidth={active && hoveredFlow === flowId ? 0.8 : 0.4}
                strokeDasharray={active && hoveredFlow !== flowId ? '' : '2 1'}
                opacity={active ? 1 : 0.3}
                style={{ transition: 'all 0.2s' }}
              />
            </g>
          )
        })}
      </svg>

      {FLOW_NODES.map(node => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer group"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setHoveredFlow(node.id)}
          onMouseLeave={() => setHoveredFlow(null)}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-all group-hover:scale-110"
            style={{
              backgroundColor: node.color + '15',
              borderColor: node.color + (node.type === 'hub' ? 'ff' : '40'),
              boxShadow: node.type === 'hub' ? `0 0 12px ${node.color}40` : 'none',
            }}
          >
            {node.icon}
          </div>
          <div className="text-center">
            <p className="text-white text-[9px] font-medium leading-tight whitespace-nowrap">{node.label}</p>
            <p className="text-gray-400 text-[8px] whitespace-nowrap">{node.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="mb-2" style={{ color }}>{icon}</div>
      <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
      <p className="text-gray-400 text-[10px] mt-1">{sub}</p>
    </div>
  )
}
