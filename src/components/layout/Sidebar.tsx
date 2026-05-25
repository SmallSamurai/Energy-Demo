import { BarChart2, Activity, Layers, Zap, BrainCircuit, Bell, Settings, ChevronRight } from 'lucide-react'

interface SidebarProps {
  active: string
  onNavigate: (page: string) => void
  alertCount: number
}

const nav = [
  { id: 'market', label: 'Market Overview', icon: Activity },
  { id: 'portfolio', label: 'Portfolio & Positions', icon: Layers },
  { id: 'dispatch', label: 'Dispatch & Flexibility', icon: Zap },
  { id: 'analytics', label: 'Analytics & Forecast', icon: BarChart2 },
]

export default function Sidebar({ active, onNavigate, alertCount }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#0D1117] border-r border-[#1F2937] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FBCE07] flex items-center justify-center flex-shrink-0">
            <span className="text-[#0A0E1A] font-black text-xs">SE</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Shell Energy</div>
            <div className="text-[#6B7280] text-[10px] leading-tight tracking-wider uppercase">Market Command Centre</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] text-[#4B5563] uppercase tracking-widest px-3 mb-3">Trading</div>
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              active === id
                ? 'bg-[#FBCE07]/10 text-[#FBCE07] font-medium'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} />
              <span>{label}</span>
            </div>
            {active === id && <ChevronRight size={12} />}
          </button>
        ))}

        <div className="text-[10px] text-[#4B5563] uppercase tracking-widest px-3 mt-6 mb-3">AI Assistant</div>
        <button
          onClick={() => onNavigate('agent')}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
            active === 'agent'
              ? 'bg-[#FBCE07]/10 text-[#FBCE07] font-medium'
              : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrainCircuit size={16} />
            <span>Energy Agent</span>
          </div>
          <span className="text-[10px] bg-[#FBCE07] text-[#0A0E1A] px-1.5 py-0.5 rounded font-bold">MCP</span>
        </button>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1F2937] space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-all">
          <Bell size={16} />
          <span>Alerts</span>
          {alertCount > 0 && (
            <span className="ml-auto text-[10px] bg-[#DD1D21] text-white px-1.5 py-0.5 rounded-full font-bold">{alertCount}</span>
          )}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-all">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
