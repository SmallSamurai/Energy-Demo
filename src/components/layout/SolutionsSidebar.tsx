import { Map, Calculator, Layers3, BrainCircuit, ChevronRight } from 'lucide-react'

interface Props { active: string; onNavigate: (p: string) => void }

const nav = [
  { id: 'map', label: 'Solutions Explorer', icon: Map, sub: 'Discover & filter' },
  { id: 'calculator', label: 'Impact Calculator', icon: Calculator, sub: 'Model your ROI' },
  { id: '360', label: 'Solutions 360', icon: Layers3, sub: 'Full-stack view' },
]

export default function SolutionsSidebar({ active, onNavigate }: Props) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#0D1117] border-r border-[#1F2937] flex flex-col z-40">
      <div className="px-5 py-5 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FBCE07] flex items-center justify-center flex-shrink-0">
            <span className="text-[#0A0E1A] font-black text-xs">SE</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Shell Energy</div>
            <div className="text-[#6B7280] text-[10px] leading-tight tracking-wider uppercase">Energy Solutions</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-[10px] text-[#4B5563] uppercase tracking-widest px-3 mb-3">Explore</div>
        {nav.map(({ id, label, icon: Icon, sub }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active === id
                ? 'bg-[#FBCE07]/10 text-[#FBCE07] font-medium'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} />
              <div className="text-left">
                <div className="text-xs leading-tight">{label}</div>
                <div className="text-[10px] text-[#4B5563] leading-tight">{sub}</div>
              </div>
            </div>
            {active === id && <ChevronRight size={12} />}
          </button>
        ))}

        <div className="text-[10px] text-[#4B5563] uppercase tracking-widest px-3 mt-6 mb-3">AI Assistant</div>
        <button
          onClick={() => onNavigate('agent')}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            active === 'agent'
              ? 'bg-[#FBCE07]/10 text-[#FBCE07] font-medium'
              : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrainCircuit size={16} />
            <div className="text-left">
              <div className="text-xs leading-tight">Solutions Advisor</div>
              <div className="text-[10px] text-[#4B5563]">Recommend & explain</div>
            </div>
          </div>
          <span className="text-[10px] bg-[#FBCE07] text-[#0A0E1A] px-1.5 py-0.5 rounded font-bold">MCP</span>
        </button>
      </nav>

      <div className="px-4 py-4 border-t border-[#1F2937]">
        <div className="bg-[#FBCE07]/5 border border-[#FBCE07]/20 rounded-lg p-3">
          <p className="text-[#FBCE07] text-[11px] font-semibold mb-1">8 solutions available</p>
          <p className="text-[#6B7280] text-[10px] leading-snug">Solar · BESS · PPA · LoadFlex · EV · Carbon · Hub · Efficiency</p>
        </div>
      </div>
    </aside>
  )
}
