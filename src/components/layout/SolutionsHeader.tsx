const PAGE_META: Record<string, { title: string; subtitle: string; badge?: string }> = {
  map: { title: 'Solutions Explorer', subtitle: 'Discover and filter the full Shell Energy solutions portfolio', badge: '8 solutions' },
  calculator: { title: 'Impact Calculator', subtitle: 'Model financial returns, payback and carbon reduction for any solution', badge: 'Live modelling' },
  '360': { title: 'Solutions 360', subtitle: 'Your full energy solutions stack — combined financial, carbon and flow view', badge: 'Portfolio view' },
  agent: { title: 'Solutions Advisor', subtitle: 'Get personalised recommendations powered by Shell Energy MCP tools', badge: 'AI-powered' },
}

export default function SolutionsHeader({ page }: { page: string }) {
  const meta = PAGE_META[page] ?? PAGE_META.map
  return (
    <header className="h-14 bg-[#0D1117] border-b border-[#1F2937] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-white font-semibold text-base leading-tight">{meta.title}</h1>
          <p className="text-[#6B7280] text-xs">{meta.subtitle}</p>
        </div>
        {meta.badge && (
          <span className="text-[10px] bg-[#FBCE07]/10 text-[#FBCE07] border border-[#FBCE07]/20 px-2 py-0.5 rounded-full font-medium">
            {meta.badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
        <span>Shell Energy Solutions</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#FBCE07]" />
        <span className="text-white">UK Commercial</span>
      </div>
    </header>
  )
}
