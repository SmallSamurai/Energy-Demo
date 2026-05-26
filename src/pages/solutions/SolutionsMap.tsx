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
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Filter by goal</p>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(goalLabels) as GoalFilter[]).map(g => (
              <FilterPill key={g} label={goalLabels[g]} active={goalFilter === g} onClick={() => setGoalFilter(g)} />
            ))}
          </div>
        </div>
        <div className="w-px h-10 bg-gray-100" />
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Filter by industry</p>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(industryLabels) as IndustryFilter[]).map(i => (
              <FilterPill key={i} label={industryLabels[i]} active={industryFilter === i} onClick={() => setIndustryFilter(i)} />
            ))}
          </div>
        </div>
        <div className="ml-auto text-gray-400 text-xs">
          <span className="text-white font-semibold">{filtered.length}</span> / {solutions.length} solutions
        </div>
      </div>

      {/* Stack role legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Stack role:</span>
        {(Object.entries(stackRoleLabels) as [Solution['stackRole'], string][]).map(([role, label]) => (
          <div key={role} className="flex items-center gap-1.5 text-[10px] text-gray-500">
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
          <div className="col-span-4 py-16 text-center text-gray-400">
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
      className="group text-left bg-white rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/80 overflow-hidden flex flex-col"
      onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Hero illustration band */}
      <div className="relative h-28 flex items-center justify-center overflow-hidden" style={{ backgroundColor: s.colorDim }}>
        <CardIllustration id={s.id} color={s.color} />
        {/* Stack role badge */}
        <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-white/80 backdrop-blur-sm"
          style={{ color: ROLE_COLORS[s.stackRole], borderColor: ROLE_COLORS[s.stackRole] + '60' }}>
          {stackRoleLabels[s.stackRole]}
        </span>
        {/* ROI badge */}
        {s.roi > 0 && (
          <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/80 backdrop-blur-sm text-gray-700">
            {s.roi}% ROI
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{s.icon}</span>
          <h3 className="text-gray-900 font-bold text-sm leading-tight">{s.name}</h3>
        </div>
        <p className="text-gray-500 text-xs leading-snug mb-4 flex-1">{s.tagline}</p>

        {/* Key metrics */}
        <div className="space-y-1.5">
          <MetricRow icon={<TrendingUp size={11} />} label="Typical saving" value={s.typicalSaving} color={s.color} />
          <MetricRow icon={<Leaf size={11} />} label="Carbon reduction" value={`${s.carbonReduction} tCO₂/yr`} color="#10B981" />
          {s.paybackYears > 0 && (
            <MetricRow icon={<span className="text-[9px]">⏱</span>} label="Payback" value={`${s.paybackYears} yrs`} color="#6B7280" />
          )}
        </div>

        {/* Goal tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {s.goals.map(g => (
            <span key={g} className="text-[9px] font-medium px-2 py-0.5 rounded-full capitalize border"
              style={{ color: s.color, backgroundColor: s.colorDim, borderColor: s.color + '40' }}>{g}</span>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{s.compatibleWith.length} compatible solutions</span>
          <ArrowUpRight size={13} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
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
        className="w-full max-w-3xl bg-white rounded-2xl border overflow-hidden shadow-2xl"
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
              <p className="text-gray-500 text-sm">{s.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 grid grid-cols-3 gap-5">
          {/* Left — description + case study */}
          <div className="col-span-2 space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">{s.description}</p>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard label="Typical Saving" value={s.typicalSaving} color={s.color} />
              <MetricCard label="Annual Carbon Cut" value={`${s.carbonReduction} tCO₂`} color="#10B981" />
              <MetricCard label="ROI" value={s.roi > 0 ? `${s.roi}%` : 'N/A'} color="#8B5CF6" />
              <MetricCard label="Capex Range" value={s.capex} color="#6B7280" />
              {s.paybackYears > 0 && <MetricCard label="Payback" value={`${s.paybackYears} yrs`} color="#F97316" />}
            </div>

            {/* Case study */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Case Study</p>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">{s.caseStudy.name}</p>
                  <p className="text-gray-400 text-xs">{s.caseStudy.industry}</p>
                  <p className="text-gray-700 text-xs mt-1 leading-snug">{s.caseStudy.result}</p>
                  <p className="text-green-400 text-xs font-semibold mt-1">{s.caseStudy.saving}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map(t => (
                <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          {/* Right — compatible solutions */}
          <div>
            <p className="text-gray-400 text-xs font-medium mb-3">Works best with</p>
            <div className="space-y-2">
              {compatible.map(c => (
                <div key={c.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: c.colorDim }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium leading-tight">{c.name}</p>
                    <p className="text-gray-400 text-[10px]">{stackRoleLabels[c.stackRole]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-400 text-xs font-medium mb-2">Best for industries</p>
              <div className="flex flex-wrap gap-1">
                {s.industries.map(ind => (
                  <span key={ind} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{ind}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Per-solution SVG illustration ──────────────────────────────────────────
function CardIllustration({ id, color }: { id: string; color: string }) {
  const c = color
  const illustrations: Record<string, React.ReactNode> = {
    solar: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <circle cx="60" cy="30" r="18" fill={c} opacity="0.9"/>
        {[0,45,90,135,180,225,270,315].map((deg,i) => (
          <line key={i} x1={60+22*Math.cos(deg*Math.PI/180)} y1={30+22*Math.sin(deg*Math.PI/180)} x2={60+30*Math.cos(deg*Math.PI/180)} y2={30+30*Math.sin(deg*Math.PI/180)} stroke={c} strokeWidth="3" strokeLinecap="round"/>
        ))}
        <rect x="10" y="58" width="22" height="14" rx="2" fill={c} opacity="0.3"/>
        <line x1="12" y1="61" x2="29" y2="61" stroke={c} strokeWidth="1"/>
        <line x1="12" y1="65" x2="29" y2="65" stroke={c} strokeWidth="1"/>
        <line x1="21" y1="58" x2="21" y2="72" stroke={c} strokeWidth="1"/>
        <rect x="40" y="55" width="22" height="17" rx="2" fill={c} opacity="0.5"/>
        <line x1="42" y1="59" x2="59" y2="59" stroke={c} strokeWidth="1"/>
        <line x1="42" y1="63" x2="59" y2="63" stroke={c} strokeWidth="1"/>
        <line x1="42" y1="67" x2="59" y2="67" stroke={c} strokeWidth="1"/>
        <line x1="51" y1="55" x2="51" y2="72" stroke={c} strokeWidth="1"/>
        <rect x="70" y="58" width="40" height="14" rx="2" fill={c} opacity="0.7"/>
        <line x1="73" y1="62" x2="107" y2="62" stroke="white" strokeWidth="1" opacity="0.6"/>
        <line x1="73" y1="66" x2="107" y2="66" stroke="white" strokeWidth="1" opacity="0.6"/>
        <line x1="90" y1="58" x2="90" y2="72" stroke="white" strokeWidth="1" opacity="0.6"/>
      </svg>
    ),
    bess: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <rect x="20" y="20" width="80" height="45" rx="6" fill={c} opacity="0.15" stroke={c} strokeWidth="2"/>
        <rect x="26" y="27" width="16" height="31" rx="3" fill={c} opacity="0.6"/>
        <rect x="46" y="27" width="16" height="31" rx="3" fill={c} opacity="0.8"/>
        <rect x="66" y="27" width="16" height="20" rx="3" fill={c} opacity="0.4"/>
        <rect x="86" y="27" width="8" height="31" rx="3" fill={c} opacity="0.3"/>
        <rect x="50" y="10" width="8" height="10" rx="2" fill={c}/>
        <polyline points="50,68 42,75 55,75 47,80" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    ppa: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        {[0,1,2,3,4,5,6].map(i => (
          <ellipse key={i} cx={15+i*14} cy={50-Math.sin(i*0.7)*20} rx="4" ry="18" fill={c} opacity={0.2+i*0.1} transform={`rotate(-15,${15+i*14},${50-Math.sin(i*0.7)*20})`}/>
        ))}
        <path d="M10 55 Q30 20 55 45 Q75 60 100 30" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="55" cy="45" r="5" fill={c}/>
        <text x="60" y="25" fontSize="9" fill={c} fontWeight="bold" opacity="0.8">FIXED</text>
        <text x="60" y="35" fontSize="9" fill={c} opacity="0.6">RATE</text>
      </svg>
    ),
    hvac: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <rect x="25" y="25" width="70" height="35" rx="8" fill={c} opacity="0.15" stroke={c} strokeWidth="2"/>
        <circle cx="60" cy="42" r="12" fill="none" stroke={c} strokeWidth="2" opacity="0.5"/>
        <circle cx="60" cy="42" r="6" fill={c} opacity="0.7"/>
        {[0,60,120,180,240,300].map((deg,i) => (
          <line key={i} x1={60+6*Math.cos(deg*Math.PI/180)} y1={42+6*Math.sin(deg*Math.PI/180)} x2={60+11*Math.cos(deg*Math.PI/180)} y2={42+11*Math.sin(deg*Math.PI/180)} stroke={c} strokeWidth="2.5"/>
        ))}
        {[0,1,2].map(i => <line key={i} x1={30+i*6} y1={32} x2={30+i*6} y2={28} stroke={c} strokeWidth="1.5" opacity="0.6"/>)}
        {[0,1,2].map(i => <line key={i} x1={78+i*6} y1={52} x2={78+i*6} y2={56} stroke={c} strokeWidth="1.5" opacity="0.6"/>)}
        <text x="32" y="68" fontSize="7" fill={c} fontWeight="bold" opacity="0.8">DEMAND RESPONSE</text>
      </svg>
    ),
    ev: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <rect x="15" y="38" width="65" height="22" rx="5" fill={c} opacity="0.2" stroke={c} strokeWidth="2"/>
        <rect x="25" y="28" width="45" height="14" rx="4" fill={c} opacity="0.4"/>
        <circle cx="30" cy="62" r="7" fill={c} opacity="0.7"/>
        <circle cx="30" cy="62" r="3" fill="white" opacity="0.8"/>
        <circle cx="65" cy="62" r="7" fill={c} opacity="0.7"/>
        <circle cx="65" cy="62" r="3" fill="white" opacity="0.8"/>
        <line x1="80" y1="30" x2="92" y2="30" stroke={c} strokeWidth="2.5"/>
        <line x1="92" y1="30" x2="92" y2="50" stroke={c} strokeWidth="2"/>
        <circle cx="92" cy="55" r="5" fill={c} opacity="0.8"/>
        <polyline points="88,44 92,50 96,44" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="83" y="70" fontSize="7" fill={c} fontWeight="bold" opacity="0.8">SMART</text>
      </svg>
    ),
    carbon: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <ellipse cx="60" cy="65" rx="35" ry="8" fill={c} opacity="0.15"/>
        <rect x="55" y="35" width="10" height="30" rx="2" fill={c} opacity="0.5"/>
        {[[50,28,12],[40,18,9],[72,22,11],[80,30,8]].map(([x,y,r],i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.3+i*0.15}/>
        ))}
        <path d="M35 55 Q40 35 55 30 Q65 25 70 38 Q80 25 85 40" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4"/>
        <text x="38" y="74" fontSize="8" fill={c} fontWeight="bold" opacity="0.8">NET ZERO</text>
      </svg>
    ),
    hub: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <circle cx="60" cy="40" r="12" fill={c} opacity="0.8"/>
        <text x="54" y="44" fontSize="12">🧠</text>
        {[[20,20],[100,20],[20,60],[100,60],[60,10],[60,72]].map(([x,y],i) => (
          <g key={i}>
            <line x1="60" y1="40" x2={x} y2={y} stroke={c} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2"/>
            <circle cx={x} cy={y} r="6" fill={c} opacity={0.2+i*0.08} stroke={c} strokeWidth="1.5"/>
          </g>
        ))}
      </svg>
    ),
    efficiency: (
      <svg viewBox="0 0 120 80" className="w-32 h-20 opacity-90">
        <rect x="20" y="25" width="80" height="40" rx="4" fill="none" stroke={c} strokeWidth="2" opacity="0.4"/>
        {[0,1,2,3].map(i => (
          <rect key={i} x={28+i*18} y={32} width={12} height={26} rx="2" fill={c} opacity={0.15+i*0.18}/>
        ))}
        <polyline points="28,50 46,38 64,44 82,30 100,35" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="82" cy="30" r="4" fill={c}/>
        <text x="30" y="72" fontSize="7" fill={c} fontWeight="bold" opacity="0.8">ENERGY STAR AUDIT</text>
      </svg>
    ),
  }
  return <>{illustrations[id] ?? <span className="text-5xl opacity-30">{id}</span>}</>
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-[#FBCE07] text-[#0A0E1A]'
          : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

function MetricRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-gray-400" style={{ color: color + 'aa' }}>{icon}{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <p className="text-gray-400 text-[10px] mb-1">{label}</p>
      <p className="font-bold text-sm" style={{ color }}>{value}</p>
    </div>
  )
}
