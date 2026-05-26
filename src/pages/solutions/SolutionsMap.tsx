import { useState } from 'react'
import { X, TrendingUp, Leaf, ArrowUpRight, CheckCircle } from 'lucide-react'
import { solutions, goalLabels, industryLabels, stackRoleLabels } from '../../data/solutionsData'
import type { Solution, GoalFilter, IndustryFilter } from '../../data/solutionsData'

const ROLE_COLORS: Record<Solution['stackRole'], string> = {
  generate: '#FBCE07',
  store: '#10B981',
  procure: '#3B82F6',
  manage: '#F97316',
  offset: '#34D399',
  flex: '#06B6D4',
}

export default function SolutionsMap() {
  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all')
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>('all')
  const [selected, setSelected] = useState<Solution | null>(null)

  const filtered = solutions.filter(s => {
    const goalOk = goalFilter === 'all' || s.goals.includes(goalFilter)
    const indOk = industryFilter === 'all' || s.industries.includes(industryFilter)
    return goalOk && indOk
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[#6B7280] text-[10px] uppercase tracking-widest mb-2">Filter by goal</p>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(goalLabels) as GoalFilter[]).map(g => (
              <FilterPill key={g} label={goalLabels[g]} active={goalFilter === g} onClick={() => setGoalFilter(g)} />
            ))}
          </div>
        </div>
        <div className="w-px h-10 bg-[#1F2937]" />
        <div>
          <p className="text-[#6B7280] text-[10px] uppercase tracking-widest mb-2">Filter by industry</p>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(industryLabels) as IndustryFilter[]).map(i => (
              <FilterPill key={i} label={industryLabels[i]} active={industryFilter === i} onClick={() => setIndustryFilter(i)} />
            ))}
          </div>
        </div>
        <div className="ml-auto text-[#6B7280] text-xs">
          <span className="text-white font-semibold">{filtered.length}</span> / {solutions.length} solutions
        </div>
      </div>

      {/* Stack role legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-[#4B5563] uppercase tracking-widest">Stack role:</span>
        {(Object.entries(stackRoleLabels) as [Solution['stackRole'], string][]).map(([role, label]) => (
          <div key={role} className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[role] }} />
            {label}
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(s => (
          <SolutionCard key={s.id} solution={s} onExpand={() => setSelected(s)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-4 py-16 text-center text-[#4B5563]">
            No solutions match these filters — try adjusting your criteria.
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {selected && (
        <ExpandedPanel solution={selected} onClose={() => setSelected(null)} allSolutions={solutions} />
      )}
    </div>
  )
}

function SolutionCard({ solution: s, onExpand }: { solution: Solution; onExpand: () => void }) {
  return (
    <button
      onClick={onExpand}
      className="group text-left bg-[#111827] rounded-xl border border-[#1F2937] hover:border-opacity-60 transition-all hover:shadow-lg hover:shadow-black/20 overflow-hidden"
      style={{ '--hover-border': s.color } as React.CSSProperties}
      onMouseEnter={e => (e.currentTarget.style.borderColor = s.color + '60')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1F2937')}
    >
      {/* Top colour bar */}
      <div className="h-1 w-full" style={{ backgroundColor: s.color }} />

      <div className="p-4">
        {/* Icon + role badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: s.colorDim }}>
            {s.icon}
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
            style={{ color: ROLE_COLORS[s.stackRole], borderColor: ROLE_COLORS[s.stackRole] + '40', backgroundColor: ROLE_COLORS[s.stackRole] + '10' }}>
            {stackRoleLabels[s.stackRole]}
          </span>
        </div>

        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">{s.name}</h3>
        <p className="text-[#6B7280] text-xs leading-snug mb-4">{s.tagline}</p>

        {/* Key metrics */}
        <div className="space-y-2">
          <MetricRow icon={<TrendingUp size={11} />} label="Typical saving" value={s.typicalSaving} color={s.color} />
          <MetricRow icon={<Leaf size={11} />} label="Carbon reduction" value={`${s.carbonReduction} tCO₂/yr`} color="#10B981" />
          {s.paybackYears > 0 && (
            <MetricRow icon={<span className="text-[9px]">⏱</span>} label="Payback" value={`${s.paybackYears} yrs`} color="#9CA3AF" />
          )}
        </div>

        {/* Goal tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {s.goals.map(g => (
            <span key={g} className="text-[9px] bg-[#1F2937] text-[#9CA3AF] px-1.5 py-0.5 rounded capitalize">{g}</span>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-[#1F2937] flex items-center justify-between">
          <span className="text-[10px] text-[#4B5563]">{s.compatibleWith.length} compatible solutions</span>
          <ArrowUpRight size={13} className="text-[#4B5563] group-hover:text-[#FBCE07] transition-colors" />
        </div>
      </div>
    </button>
  )
}

function ExpandedPanel({ solution: s, onClose, allSolutions }: { solution: Solution; onClose: () => void; allSolutions: Solution[] }) {
  const compatible = allSolutions.filter(sol => s.compatibleWith.includes(sol.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl bg-[#111827] rounded-2xl border overflow-hidden shadow-2xl"
        style={{ borderColor: s.color + '40' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-1.5 w-full" style={{ backgroundColor: s.color }} />
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: s.colorDim }}>
              {s.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-lg">{s.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
                  style={{ color: ROLE_COLORS[s.stackRole], borderColor: ROLE_COLORS[s.stackRole] + '40', backgroundColor: ROLE_COLORS[s.stackRole] + '10' }}>
                  {stackRoleLabels[s.stackRole]}
                </span>
              </div>
              <p className="text-[#9CA3AF] text-sm">{s.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 grid grid-cols-3 gap-5">
          {/* Left — description + case study */}
          <div className="col-span-2 space-y-4">
            <p className="text-[#D1D5DB] text-sm leading-relaxed">{s.description}</p>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard label="Typical Saving" value={s.typicalSaving} color={s.color} />
              <MetricCard label="Annual Carbon Cut" value={`${s.carbonReduction} tCO₂`} color="#10B981" />
              <MetricCard label="ROI" value={s.roi > 0 ? `${s.roi}%` : 'N/A'} color="#8B5CF6" />
              <MetricCard label="Capex Range" value={s.capex} color="#6B7280" />
              {s.paybackYears > 0 && <MetricCard label="Payback" value={`${s.paybackYears} yrs`} color="#F97316" />}
            </div>

            {/* Case study */}
            <div className="bg-[#0D1117] rounded-xl p-4 border border-[#1F2937]">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-widest mb-2">Case Study</p>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">{s.caseStudy.name}</p>
                  <p className="text-[#6B7280] text-xs">{s.caseStudy.industry}</p>
                  <p className="text-[#D1D5DB] text-xs mt-1 leading-snug">{s.caseStudy.result}</p>
                  <p className="text-green-400 text-xs font-semibold mt-1">{s.caseStudy.saving}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map(t => (
                <span key={t} className="text-[10px] bg-[#1F2937] text-[#9CA3AF] px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          {/* Right — compatible solutions */}
          <div>
            <p className="text-[#6B7280] text-xs font-medium mb-3">Works best with</p>
            <div className="space-y-2">
              {compatible.map(c => (
                <div key={c.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0D1117] border border-[#1F2937]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: c.colorDim }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium leading-tight">{c.name}</p>
                    <p className="text-[#4B5563] text-[10px]">{stackRoleLabels[c.stackRole]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#1F2937]">
              <p className="text-[#6B7280] text-xs font-medium mb-2">Best for industries</p>
              <div className="flex flex-wrap gap-1">
                {s.industries.map(ind => (
                  <span key={ind} className="text-[10px] bg-[#1F2937] text-[#9CA3AF] px-2 py-0.5 rounded-full capitalize">{ind}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-[#FBCE07] text-[#0A0E1A]'
          : 'bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:text-white hover:border-[#374151]'
      }`}
    >
      {label}
    </button>
  )
}

function MetricRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-[#6B7280]" style={{ color: color + 'aa' }}>{icon}{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0D1117] rounded-lg p-3 border border-[#1F2937]">
      <p className="text-[#6B7280] text-[10px] mb-1">{label}</p>
      <p className="font-bold text-sm" style={{ color }}>{value}</p>
    </div>
  )
}
