import { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, LineChart, Line, ReferenceLine
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, AlertTriangle, Info, AlertCircle, Flame, Zap, Leaf } from 'lucide-react'
import { generatePowerCurve, generateGasCurve, generateCarbonCurve, generateForwardCurve, alerts } from '../data/marketData'

const YELLOW = '#FBCE07'
const BLUE = '#3B82F6'
const GREEN = '#10B981'
const PURPLE = '#8B5CF6'

export default function MarketOverview() {
  const powerCurve = useMemo(() => generatePowerCurve(), [])
  const gasCurve = useMemo(() => generateGasCurve(), [])
  const carbonCurve = useMemo(() => generateCarbonCurve(), [])
  const forwardCurve = useMemo(() => generateForwardCurve(82.1), [])

  const now = new Date().toISOString()

  const fmt = (iso: string) => format(parseISO(iso), 'HH:mm')

  return (
    <div className="space-y-5">
      {/* KPI tiles */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard icon={<Zap size={18} />} label="UK Power Day-Ahead" value="£115.20" unit="/MWh" change={+6.7} sub="Peak: £187.40 @ 18:30" accent={YELLOW} />
        <KpiCard icon={<Flame size={18} />} label="NBP Natural Gas" value="82.1p" unit="/th" change={+2.7} sub="Winter contract: 134.2p" accent={BLUE} />
        <KpiCard icon={<Leaf size={18} />} label="EUA Carbon" value="€65.10" unit="/t" change={+2.6} sub="Dec-25 settlement" accent={GREEN} />
        <KpiCard icon={<TrendingUp size={18} />} label="System Net Imbalance" value="-420 MW" unit="" change={-1.2} sub="BM cashout: £142/MWh" accent={PURPLE} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Power intraday */}
        <div className="col-span-2 bg-[#111827] rounded-xl p-5 border border-[#1F2937]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold text-sm">UK Power — Intraday Price</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">Half-hourly settlement prices vs. forecast (£/MWh)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <LegendDot color={YELLOW} label="Actual" />
              <LegendDot color="#4B5563" label="Forecast" dashed />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={powerCurve} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={YELLOW} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={YELLOW} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="time" tickFormatter={fmt} tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} interval={5} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip content={<CustomTooltip unit="£/MWh" />} />
              <ReferenceLine x={now} stroke="#DD1D21" strokeDasharray="4 4" label={{ value: 'NOW', fill: '#DD1D21', fontSize: 9 }} />
              <Area type="monotone" dataKey="value" stroke={YELLOW} strokeWidth={2} fill="url(#powerGrad)" dot={false} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#4B5563" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon */}
        <div className="bg-[#111827] rounded-xl p-5 border border-[#1F2937]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold text-sm">EUA Carbon</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">€/tonne CO₂</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={carbonCurve} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="time" tickFormatter={fmt} tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} interval={8} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<CustomTooltip unit="€/t" />} />
              <Area type="monotone" dataKey="value" stroke={GREEN} strokeWidth={2} fill="url(#carbonGrad)" dot={false} name="EUA" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forward curve + Gas + Alerts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Forward curves */}
        <div className="col-span-2 bg-[#111827] rounded-xl p-5 border border-[#1F2937]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold text-sm">Forward Curve — Monthly Settlements</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">Gas (p/th), Power (£/MWh), Carbon (€/t)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <LegendDot color={BLUE} label="Gas" />
              <LegendDot color={YELLOW} label="Power" />
              <LegendDot color={GREEN} label="Carbon" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={forwardCurve} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ForwardTooltip />} />
              <Line type="monotone" dataKey="gas" stroke={BLUE} strokeWidth={2} dot={false} name="Gas" />
              <Line type="monotone" dataKey="power" stroke={YELLOW} strokeWidth={2} dot={false} name="Power" />
              <Line type="monotone" dataKey="carbon" stroke={GREEN} strokeWidth={2} dot={false} name="Carbon" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts panel */}
        <div className="bg-[#111827] rounded-xl p-5 border border-[#1F2937] flex flex-col">
          <h2 className="text-white font-semibold text-sm mb-4">Live Alerts</h2>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {alerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      {/* Gas intraday */}
      <div className="bg-[#111827] rounded-xl p-5 border border-[#1F2937]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-sm">NBP Natural Gas — Intraday</h2>
            <p className="text-[#6B7280] text-xs mt-0.5">p/therm</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <LegendDot color={BLUE} label="Actual" />
            <LegendDot color="#4B5563" label="Forecast" dashed />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={gasCurve} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BLUE} stopOpacity={0.2} />
                <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="time" tickFormatter={fmt} tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} interval={5} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit="p/th" />} />
            <ReferenceLine x={now} stroke="#DD1D21" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="value" stroke={BLUE} strokeWidth={2} fill="url(#gasGrad)" dot={false} name="Gas" />
            <Line type="monotone" dataKey="forecast" stroke="#4B5563" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, unit, change, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; unit: string; change: number; sub: string; accent: string
}) {
  const positive = change >= 0
  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-[#1F2937]">
      <div className="flex items-start justify-between mb-3">
        <div style={{ color: accent }}>{icon}</div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}<span className="text-sm text-[#6B7280] ml-1 font-normal">{unit}</span></div>
      <div className="text-[#6B7280] text-xs mb-1">{label}</div>
      <div className="text-[#4B5563] text-[10px]">{sub}</div>
    </div>
  )
}

function AlertItem({ alert }: { alert: typeof alerts[0] }) {
  const icons = { critical: <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />, warning: <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />, info: <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" /> }
  const borders = { critical: 'border-l-red-500', warning: 'border-l-yellow-500', info: 'border-l-blue-500' }
  const mins = Math.round((Date.now() - new Date(alert.timestamp).getTime()) / 60000)
  return (
    <div className={`border-l-2 ${borders[alert.severity]} pl-3 py-1`}>
      <div className="flex gap-2">
        {icons[alert.severity]}
        <p className="text-[#D1D5DB] text-xs leading-snug">{alert.message}</p>
      </div>
      <p className="text-[#4B5563] text-[10px] mt-1 ml-5">{mins}m ago · {alert.category}</p>
    </div>
  )
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
      <div className={`w-5 h-px ${dashed ? 'border-t border-dashed' : ''}`} style={{ backgroundColor: dashed ? 'transparent' : color, borderColor: dashed ? color : undefined }} />
      {label}
    </div>
  )
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#9CA3AF] mb-1">{label ? format(parseISO(label), 'HH:mm dd MMM') : ''}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value} {unit}</p>
      ))}
    </div>
  )
}

function ForwardTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#9CA3AF] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}
