import { useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell
} from 'recharts'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { positions, pnlWaterfall, exposureHeatmap } from '../data/marketData'

const YELLOW = '#FBCE07'
const GREEN = '#10B981'
const RED = '#DD1D21'
const BLUE = '#3B82F6'

export default function Portfolio() {
  const totalPnl = useMemo(() => positions.reduce((s, p) => s + p.pnl, 0), [])
  const longExposure = useMemo(() => positions.filter(p => p.type === 'long').reduce((s, p) => s + p.volume, 0), [])
  const shortExposure = useMemo(() => positions.filter(p => p.type === 'short').reduce((s, p) => s + p.volume, 0), [])

  const hedgeData = [
    { product: 'Gas', hedged: 68, open: 32 },
    { product: 'Power', hedged: 74, open: 26 },
    { product: 'Carbon', hedged: 55, open: 45 },
  ]

  const varData = [
    { period: '1D', gas: 42000, power: 118000, carbon: 28000 },
    { period: '5D', gas: 94000, power: 265000, carbon: 63000 },
    { period: '10D', gas: 133000, power: 374000, carbon: 89000 },
    { period: '1M', gas: 280000, power: 788000, carbon: 187000 },
  ]

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiTile label="Total MTD P&L" value={`$${(totalPnl / 1000).toFixed(0)}k`} change={+18.4} positive />
        <KpiTile label="Net Long Exposure" value={`${longExposure} MW`} change={+5.2} positive />
        <KpiTile label="Net Short Exposure" value={`${Math.abs(shortExposure)} MW`} change={-3.1} positive={false} />
        <KpiTile label="Portfolio VaR (1D)" value="$160k" change={-4.2} positive />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* P&L Waterfall */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">MTD P&L Attribution</h2>
          <p className="text-gray-600 text-xs mb-4">Waterfall by product and cost category</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pnlWaterfall} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 9 }} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<PnlTooltip />} />
              <Bar dataKey="cumulative" radius={[3, 3, 0, 0]}>
                {pnlWaterfall.map((entry) => (
                  <Cell key={entry.name} fill={
                    entry.type === 'positive' ? GREEN
                    : entry.type === 'negative' ? RED
                    : entry.type === 'total' ? YELLOW
                    : '#3B82F6'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Positions table */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">Open Positions</h2>
          <p className="text-gray-600 text-xs mb-4">Mark-to-market as of now</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-left pb-2 font-medium">Product</th>
                  <th className="text-left pb-2 font-medium">Period</th>
                  <th className="text-right pb-2 font-medium">Vol</th>
                  <th className="text-right pb-2 font-medium">Avg</th>
                  <th className="text-right pb-2 font-medium">Mkt</th>
                  <th className="text-right pb-2 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {positions.map((p, i) => {
                  const pnlPositive = p.pnl >= 0
                  return (
                    <tr key={i} className="hover:bg-gray-100/50 transition-colors">
                      <td className="py-2.5 text-gray-900 font-medium">{p.product}</td>
                      <td className="py-2.5 text-gray-600">{p.period}</td>
                      <td className="py-2.5 text-right">
                        <span className={`flex items-center justify-end gap-1 ${p.type === 'long' ? 'text-green-600' : 'text-red-500'}`}>
                          {p.type === 'long' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {Math.abs(p.volume)}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-gray-600">{p.avgPrice}</td>
                      <td className="py-2.5 text-right text-gray-900">{p.marketPrice}</td>
                      <td className={`py-2.5 text-right font-medium ${pnlPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {pnlPositive ? '+' : ''}${(p.pnl / 1000).toFixed(1)}k
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Hedge ratios */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">Hedge Ratios</h2>
          <p className="text-gray-600 text-xs mb-4">% of exposure hedged by product</p>
          <div className="space-y-4">
            {hedgeData.map(h => (
              <div key={h.product}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{h.product}</span>
                  <span className="text-gray-900 font-medium">{h.hedged}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FBCE07] to-[#F59E0B]" style={{ width: `${h.hedged}%` }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-gray-600">
                  <span>Hedged</span>
                  <span>{h.open}% open</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exposure heatmap */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">Exposure Heatmap</h2>
          <p className="text-gray-600 text-xs mb-4">Risk concentration by period and commodity (0–100 scale)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-left pb-2 font-medium w-20">Period</th>
                  <th className="text-center pb-2 font-medium">Gas</th>
                  <th className="text-center pb-2 font-medium">Power</th>
                  <th className="text-center pb-2 font-medium">Carbon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {exposureHeatmap.map(row => (
                  <tr key={row.period}>
                    <td className="py-2 text-gray-600 font-medium">{row.period}</td>
                    <td className="py-2 px-4"><HeatCell value={row.gas} /></td>
                    <td className="py-2 px-4"><HeatCell value={row.power} /></td>
                    <td className="py-2 px-4"><HeatCell value={row.carbon} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VaR */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h2 className="text-gray-900 font-semibold text-sm mb-1">Value at Risk (VaR) by Horizon</h2>
        <p className="text-gray-600 text-xs mb-4">95% confidence interval — potential loss by commodity</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={varData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: '#4B5563', fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`} contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="power" stackId="a" fill={YELLOW} name="Power" radius={[0, 0, 0, 0]} />
            <Bar dataKey="gas" stackId="a" fill={BLUE} name="Gas" />
            <Bar dataKey="carbon" stackId="a" fill={GREEN} name="Carbon" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function KpiTile({ label, value, change, positive }: { label: string; value: string; change: number; positive: boolean }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-xs">{label}</span>
        <span className={`text-xs flex items-center gap-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function HeatCell({ value }: { value: number }) {
  const opacity = value / 100
  const color = value >= 80 ? '#DD1D21' : value >= 60 ? '#F59E0B' : value >= 40 ? '#FBCE07' : '#10B981'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-5 rounded" style={{ background: color, opacity: 0.15 + opacity * 0.7 }}>
        <div className="h-full flex items-center justify-center text-[10px] font-bold" style={{ color, opacity: 1 }}>{value}</div>
      </div>
    </div>
  )
}

function PnlTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry = pnlWaterfall.find(e => e.name === label)
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-600 mb-1">{label}</p>
      {entry && <p className="text-gray-900 font-medium">P&L: ${(entry.cumulative / 1000).toFixed(1)}k</p>}
      {entry && entry.type !== 'base' && entry.type !== 'total' && (
        <p className={entry.type === 'positive' ? 'text-green-600' : 'text-red-500'}>
          Δ {entry.type === 'positive' ? '+' : ''}${(entry.value / 1000).toFixed(1)}k
        </p>
      )}
    </div>
  )
}
