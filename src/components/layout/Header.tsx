import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Wifi, TrendingUp, TrendingDown } from 'lucide-react'

interface HeaderProps { title: string; subtitle?: string }

export default function Header({ title, subtitle }: HeaderProps) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const marketOpen = now.getHours() >= 8 && now.getHours() < 17

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      <div>
        <h1 className="text-gray-900 font-bold text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 text-xs">
          <Ticker label="Henry Hub Gas" value="3.82" unit="$/MMBtu" change={+2.7} />
          <Ticker label="ERCOT Power" value="58.40" unit="$/MWh" change={+6.7} />
          <Ticker label="Carbon (CA)" value="32.15" unit="$/t" change={+1.4} />
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className={marketOpen ? 'text-green-600 font-medium' : 'text-gray-400'}>{marketOpen ? 'LIVE' : 'CLOSED'}</span>
        </div>
        <div className="text-right">
          <div className="text-gray-900 text-sm font-mono font-semibold">{format(now, 'HH:mm:ss')}</div>
          <div className="text-gray-400 text-[10px]">{format(now, 'EEE dd MMM yyyy')} CT</div>
        </div>
        <Wifi size={14} className="text-gray-300" />
      </div>
    </header>
  )
}

function Ticker({ label, value, unit, change }: { label: string; value: string; unit: string; change: number }) {
  const positive = change >= 0
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
      <span className="text-gray-400">{unit}</span>
      <span className={`flex items-center gap-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>
        {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {positive ? '+' : ''}{change}%
      </span>
    </div>
  )
}
