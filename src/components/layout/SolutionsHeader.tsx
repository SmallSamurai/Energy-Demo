const PAGE_META: Record<string, { title: string; subtitle: string; badge?: string }> = {
  map:        { title: 'Solutions Explorer',    subtitle: 'Discover and filter the full Shell Energy solutions portfolio', badge: '8 solutions' },
  calculator: { title: 'Impact Calculator',     subtitle: 'Model financial returns, payback and carbon reduction for any solution', badge: 'Live modelling' },
  '360':      { title: 'Solutions 360',         subtitle: 'Your full energy solutions stack — combined financial, carbon and flow view', badge: 'Portfolio view' },
  agent:      { title: 'Solutions Advisor',     subtitle: 'Get personalized recommendations powered by Shell Energy MCP tools', badge: 'AI-powered' },
}

export default function SolutionsHeader({ page }: { page: string }) {
  const meta = PAGE_META[page] ?? PAGE_META.map
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-gray-900 font-bold text-base leading-tight">{meta.title}</h1>
          <p className="text-gray-600 text-xs">{meta.subtitle}</p>
        </div>
        {meta.badge && (
          <span className="text-[10px] bg-[#FBCE07]/20 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
            {meta.badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span>Shell Energy Solutions</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#FBCE07]" />
        <span className="text-gray-700 font-medium">US Commercial</span>
      </div>
    </header>
  )
}
