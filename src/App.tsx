import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MarketOverview from './pages/MarketOverview'
import Portfolio from './pages/Portfolio'
import Dispatch from './pages/Dispatch'
import Analytics from './pages/Analytics'
import AgentPage from './pages/Agent'
import { alerts } from './data/marketData'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  market: { title: 'Market Overview', subtitle: 'Live prices, forward curves & market alerts' },
  portfolio: { title: 'Portfolio & Positions', subtitle: 'Open positions, P&L attribution & risk exposure' },
  dispatch: { title: 'Dispatch & Flexibility', subtitle: 'Asset fleet, balancing market & generation timeline' },
  analytics: { title: 'Analytics & Forecasting', subtitle: 'Price scenarios, demand correlation & model performance' },
  agent: { title: 'Energy Intelligence Agent', subtitle: 'Ask anything — powered by MCP data tools' },
}

export default function App() {
  const [page, setPage] = useState('market')
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length

  const meta = PAGE_META[page] ?? PAGE_META.market

  return (
    <div className="flex min-h-screen bg-[#0A0E1A]">
      <Sidebar active={page} onNavigate={setPage} alertCount={criticalAlerts} />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-5 overflow-auto">
          {page === 'market' && <MarketOverview />}
          {page === 'portfolio' && <Portfolio />}
          {page === 'dispatch' && <Dispatch />}
          {page === 'analytics' && <Analytics />}
          {page === 'agent' && <AgentPage />}
        </main>
      </div>
    </div>
  )
}
