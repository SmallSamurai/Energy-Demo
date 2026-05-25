import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Wifi, TrendingUp, TrendingDown } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const marketOpen = now.getHours() >= 6 && now.getHours() < 22

  return (
    <header className="h-14 bg-[#0D1117] border-b border-[#1F2937] flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-white font-semibold text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-[#6B7280] text-xs">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-5">
        {/* Live price tickers */}
        <div className="flex items-center gap-4 text-xs">
          <Ticker label="NBP Gas" value="82.1" unit="p/th" change={+2.7} />
          <Ticker label="UK Power" value="115.2" unit="£/MWh" change={+6.7} />
          <Ticker label="EUA" value="65.1" unit="€/t" change={+2.6} />
        </div>

        <div className="w-px h-6 bg-[#1F2937]" />

        {/* Market status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-green-400 animate-pulse' : 'bg-[#6B7280]'}`} />
          <span className={marketOpen ? 'text-green-400' : 'text-[#6B7280]'}>{marketOpen ? 'LIVE' : 'CLOSED'}</span>
        </div>

        {/* Time */}
        <div className="text-right">
          <div className="text-white text-sm font-mono font-medium">{format(now, 'HH:mm:ss')}</div>
          <div className="text-[#6B7280] text-[10px]">{format(now, 'EEE dd MMM yyyy')} UTC</div>
        </div>

        <Wifi size={14} className="text-[#4B5563]" />
      </div>
    </header>
  )
}

function Ticker({ label, value, unit, change }: { label: string; value: string; unit: string; change: number }) {
  const positive = change >= 0
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-white font-medium">{value}</span>
      <span className="text-[#4B5563]">{unit}</span>
      <span className={`flex items-center gap-0.5 ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {positive ? '+' : ''}{change}%
      </span>
    </div>
  )
}
