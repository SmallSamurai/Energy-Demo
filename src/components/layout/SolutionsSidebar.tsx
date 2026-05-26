import { Map, Calculator, Layers3, BrainCircuit, ChevronRight } from 'lucide-react'

interface Props { active: string; onNavigate: (p: string) => void }

const nav = [
  { id: 'map',        label: 'Solutions Explorer', icon: Map,       sub: 'Discover & filter' },
  { id: 'calculator', label: 'Impact Calculator',  icon: Calculator, sub: 'Model your ROI' },
  { id: '360',        label: 'Solutions 360',       icon: Layers3,   sub: 'Full-stack view' },
]

export default function SolutionsSidebar({ active, onNavigate }: Props) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-40 shadow-sm">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FBCE07] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[#111827] font-black text-xs">SE</span>
          </div>
          <div>
            <div className="text-gray-900 font-bold text-sm leading-tight">Shell Energy</div>
            <div className="text-gray-400 text-[10px] leading-tight tracking-wider uppercase">Energy Solutions</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2 pt-1">Explore</div>
        {nav.map(({ id, label, icon: Icon, sub }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active === id
                ? 'bg-[#FBCE07]/20 text-gray-900 font-semibold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} className={active === id ? 'text-gray-800' : 'text-gray-400'} />
              <div className="text-left">
                <div className="text-xs leading-tight">{label}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{sub}</div>
              </div>
            </div>
            {active === id && <ChevronRight size={12} className="text-gray-500" />}
          </button>
        ))}

        <div className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mt-5 mb-2">AI Assistant</div>
        <button
          onClick={() => onNavigate('agent')}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            active === 'agent'
              ? 'bg-[#FBCE07]/20 text-gray-900 font-semibold'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrainCircuit size={16} className={active === 'agent' ? 'text-gray-800' : 'text-gray-400'} />
            <div className="text-left">
              <div className="text-xs leading-tight">Solutions Advisor</div>
              <div className="text-[10px] text-gray-400">Recommend & explain</div>
            </div>
          </div>
          <span className="text-[10px] bg-[#FBCE07] text-[#111827] px-1.5 py-0.5 rounded font-bold">MCP</span>
        </button>
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-700 text-[11px] font-semibold mb-1">8 solutions available</p>
          <p className="text-amber-600 text-[10px] leading-snug">Solar · BESS · PPA · LoadFlex · EV · Carbon · Hub · Efficiency</p>
        </div>
      </div>
    </aside>
  )
}
