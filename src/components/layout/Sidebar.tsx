import { BarChart2, Activity, Layers, Zap, BrainCircuit, Bell, Settings, ChevronRight } from 'lucide-react'

interface SidebarProps { active: string; onNavigate: (page: string) => void; alertCount: number }

const nav = [
  { id: 'market',    label: 'Market Overview',       icon: Activity },
  { id: 'portfolio', label: 'Portfolio & Positions',  icon: Layers },
  { id: 'dispatch',  label: 'Dispatch & Flexibility', icon: Zap },
  { id: 'analytics', label: 'Analytics & Forecast',   icon: BarChart2 },
]

export default function Sidebar({ active, onNavigate, alertCount }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FBCE07] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[#111827] font-black text-xs">SE</span>
          </div>
          <div>
            <div className="text-gray-900 font-bold text-sm leading-tight">Shell Energy</div>
            <div className="text-gray-600 text-[10px] leading-tight tracking-wider uppercase">Market Command Centre</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] text-gray-600 uppercase tracking-widest px-3 mb-2 pt-1">Trading</div>
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              active === id
                ? 'bg-[#FBCE07]/20 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} className={active === id ? 'text-gray-800' : 'text-gray-600'} />
              <span>{label}</span>
            </div>
            {active === id && <ChevronRight size={12} className="text-gray-600" />}
          </button>
        ))}

        <div className="text-[10px] text-gray-600 uppercase tracking-widest px-3 mt-5 mb-2">AI Assistant</div>
        <button
          onClick={() => onNavigate('agent')}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            active === 'agent'
              ? 'bg-[#FBCE07]/20 text-gray-900 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrainCircuit size={16} className={active === 'agent' ? 'text-gray-800' : 'text-gray-600'} />
            <span>Energy Agent</span>
          </div>
          <span className="text-[10px] bg-[#FBCE07] text-[#111827] px-1.5 py-0.5 rounded font-bold">MCP</span>
        </button>
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
          <Bell size={16} className="text-gray-600" />
          <span>Alerts</span>
          {alertCount > 0 && (
            <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{alertCount}</span>
          )}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
          <Settings size={16} className="text-gray-600" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
