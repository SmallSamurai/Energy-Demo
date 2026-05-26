import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import SolutionsSidebar from './components/layout/SolutionsSidebar'
import SolutionsHeader from './components/layout/SolutionsHeader'
import MarketOverview from './pages/MarketOverview'
import Portfolio from './pages/Portfolio'
import Dispatch from './pages/Dispatch'
import Analytics from './pages/Analytics'
import AgentPage from './pages/Agent'
import SolutionsMap from './pages/solutions/SolutionsMap'
import ImpactCalculator from './pages/solutions/ImpactCalculator'
import Solutions360 from './pages/solutions/Solutions360'
import SolutionsAgent from './pages/solutions/SolutionsAgent'
import { alerts } from './data/marketData'

const WHOLESALE_META: Record<string, { title: string; subtitle: string }> = {
  market:    { title: 'Market Overview',         subtitle: 'Live prices, forward curves & market alerts' },
  portfolio: { title: 'Portfolio & Positions',   subtitle: 'Open positions, P&L attribution & risk exposure' },
  dispatch:  { title: 'Dispatch & Flexibility',  subtitle: 'Asset fleet, balancing market & generation timeline' },
  analytics: { title: 'Analytics & Forecasting', subtitle: 'Price scenarios, demand correlation & model performance' },
  agent:     { title: 'Energy Intelligence Agent', subtitle: 'Ask anything — powered by MCP data tools' },
}

type AppMode = 'wholesale' | 'solutions'

export default function App() {
  const [mode, setMode] = useState<AppMode>('wholesale')
  const [wholesalePage, setWholesalePage] = useState('market')
  const [solutionsPage, setSolutionsPage] = useState('map')
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <ModeToggle mode={mode} onSwitch={setMode} />

      {mode === 'wholesale' ? (
        <>
          <Sidebar active={wholesalePage} onNavigate={setWholesalePage} alertCount={criticalAlerts} />
          <div className="flex-1 ml-60 flex flex-col min-h-screen">
            <Header
              title={WHOLESALE_META[wholesalePage]?.title ?? 'Market Overview'}
              subtitle={WHOLESALE_META[wholesalePage]?.subtitle}
            />
            <main className="flex-1 p-5 overflow-auto">
              {wholesalePage === 'market'    && <MarketOverview />}
              {wholesalePage === 'portfolio' && <Portfolio />}
              {wholesalePage === 'dispatch'  && <Dispatch />}
              {wholesalePage === 'analytics' && <Analytics />}
              {wholesalePage === 'agent'     && <AgentPage />}
            </main>
          </div>
        </>
      ) : (
        <>
          <SolutionsSidebar active={solutionsPage} onNavigate={setSolutionsPage} />
          <div className="flex-1 ml-60 flex flex-col min-h-screen">
            <SolutionsHeader page={solutionsPage} />
            <main className="flex-1 p-5 overflow-auto">
              {solutionsPage === 'map'        && <SolutionsMap />}
              {solutionsPage === 'calculator' && <ImpactCalculator />}
              {solutionsPage === '360'        && <Solutions360 />}
              {solutionsPage === 'agent'      && <SolutionsAgent />}
            </main>
          </div>
        </>
      )}
    </div>
  )
}

function ModeToggle({ mode, onSwitch }: { mode: AppMode; onSwitch: (m: AppMode) => void }) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-lg shadow-gray-200/60">
      <button
        onClick={() => onSwitch('wholesale')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
          mode === 'wholesale' ? 'bg-[#FBCE07] text-[#0A0E1A] shadow-sm' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        <span>📈</span> Wholesale Trading
      </button>
      <button
        onClick={() => onSwitch('solutions')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
          mode === 'solutions' ? 'bg-[#FBCE07] text-[#0A0E1A] shadow-sm' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        <span>⚡</span> Energy Solutions
      </button>
    </div>
  )
}
