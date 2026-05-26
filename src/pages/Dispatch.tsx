import { useState } from 'react'
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip, AreaChart, Area
} from 'recharts'
import { Zap, Battery, Wind, Sun, Droplets, Flame, CheckCircle, XCircle } from 'lucide-react'
import { assets, balancingBids } from '../data/marketData'
import type { Asset } from '../types'

const TYPE_COLORS: Record<Asset['type'], string> = {
  gas: '#F59E0B',
  wind: '#3B82F6',
  solar: '#FBCE07',
  battery: '#10B981',
  hydro: '#06B6D4',
  coal: '#6B7280',
}

const TYPE_ICONS: Record<Asset['type'], React.ReactNode> = {
  gas: <Flame size={14} />,
  wind: <Wind size={14} />,
  solar: <Sun size={14} />,
  battery: <Battery size={14} />,
  hydro: <Droplets size={14} />,
  coal: <Zap size={14} />,
}

const STATUS_STYLES: Record<Asset['status'], string> = {
  online: 'bg-green-400/10 text-green-400 border-green-400/20',
  offline: 'bg-red-400/10 text-red-400 border-red-400/20',
  standby: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  maintenance: 'bg-[#6B7280]/10 text-gray-600 border-[#6B7280]/20',
}

export default function Dispatch() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  const totalCapacity = assets.reduce((s, a) => s + a.capacity, 0)
  const totalAvailable = assets.reduce((s, a) => s + a.available, 0)
  const totalDispatched = assets.reduce((s, a) => s + a.dispatched, 0)
  const flexAssets = assets.filter(a => a.flexibility && a.status === 'online')

  const dispatchTimeline = Array.from({ length: 24 }, (_, i) => {
    const h = i
    return {
      hour: `${String(h).padStart(2, '0')}:00`,
      gas: h >= 6 && h < 22 ? 400 + Math.random() * 200 : 100 + Math.random() * 100,
      wind: 800 + Math.random() * 800,
      solar: h >= 7 && h <= 19 ? Math.max(0, Math.sin((h - 7) / 12 * Math.PI) * 350) : 0,
      battery: (h >= 7 && h <= 9) || (h >= 17 && h <= 20) ? 80 + Math.random() * 40 : h >= 0 && h <= 5 ? -60 : 0,
      hydro: 120 + Math.random() * 60,
    }
  })

  const flexRevenue = [
    { service: 'FFR', revenue: 42600, bids: 3, accepted: 2 },
    { service: 'DC High', revenue: 18400, bids: 2, accepted: 1 },
    { service: 'Dynamic Reg.', revenue: 31200, bids: 4, accepted: 3 },
    { service: 'BM Up', revenue: 87500, bids: 5, accepted: 4 },
    { service: 'BM Down', revenue: 24300, bids: 3, accepted: 2 },
  ]

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Installed Capacity" value={`${(totalCapacity / 1000).toFixed(1)} GW`} sub={`${assets.length} assets`} color="#FBCE07" />
        <StatCard label="Currently Available" value={`${(totalAvailable / 1000).toFixed(1)} GW`} sub={`${((totalAvailable / totalCapacity) * 100).toFixed(0)}% availability`} color="#10B981" />
        <StatCard label="Active Dispatch" value={`${(totalDispatched / 1000).toFixed(1)} GW`} sub={`${((totalDispatched / totalAvailable) * 100).toFixed(0)}% utilisation`} color="#3B82F6" />
        <StatCard label="Flexibility Assets" value={`${flexAssets.length}`} sub={`${flexAssets.reduce((s, a) => s + a.capacity, 0)} MW available`} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Asset grid */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Asset Fleet</h2>
          <p className="text-gray-600 text-xs mb-4">Click an asset to see detail</p>
          <div className="space-y-2">
            {assets.map(asset => (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                className={`rounded-lg p-3 border cursor-pointer transition-all ${
                  selectedAsset === asset.id ? 'border-[#FBCE07]/40 bg-[#FBCE07]/5' : 'border-gray-200 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: TYPE_COLORS[asset.type] }}>{TYPE_ICONS[asset.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-sm font-medium truncate">{asset.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {asset.flexibility && (
                          <span className="text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 px-1.5 py-0.5 rounded font-medium">FLEX</span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize ${STATUS_STYLES[asset.status]}`}>{asset.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                          <span>Dispatched: {asset.dispatched} MW</span>
                          <span>Cap: {asset.capacity} MW</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${(asset.dispatched / asset.capacity) * 100}%`, backgroundColor: TYPE_COLORS[asset.type] }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600 w-16 text-right">{asset.region}</span>
                    </div>
                  </div>
                </div>
                {selectedAsset === asset.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-3 text-xs">
                    <div><p className="text-gray-600">Available</p><p className="text-white font-medium">{asset.available} MW</p></div>
                    <div><p className="text-gray-600">Utilisation</p><p className="text-white font-medium">{asset.available ? ((asset.dispatched / asset.available) * 100).toFixed(0) : 0}%</p></div>
                    <div><p className="text-gray-600">BM Eligible</p><p className={asset.flexibility ? 'text-green-400 font-medium' : 'text-gray-600'}>{asset.flexibility ? 'Yes' : 'No'}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Balancing bids */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-white font-semibold text-sm mb-1">Balancing Market Bids</h2>
          <p className="text-gray-600 text-xs mb-4">Today's BM submissions</p>
          <div className="space-y-3">
            {balancingBids.map((bid, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-white text-xs font-medium">{bid.assetName}</p>
                    <p className="text-gray-600 text-[10px]">{bid.period} · {bid.direction === 'up' ? '↑ Up-reg' : '↓ Down-reg'}</p>
                  </div>
                  {bid.accepted
                    ? <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    : <XCircle size={14} className="text-gray-600 flex-shrink-0" />}
                </div>
                <div className="flex gap-4 text-[10px]">
                  <span className="text-gray-600">Vol: <span className="text-white">{bid.volume} MW</span></span>
                  <span className="text-gray-600">Price: <span className="text-white">${bid.price}/MWh</span></span>
                  <span className={bid.accepted ? 'text-green-400' : 'text-gray-600'}>{bid.accepted ? 'Accepted' : 'Rejected'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-white text-xs font-medium mb-3">Flexibility Revenue (MTD)</h3>
            <div className="space-y-2">
              {flexRevenue.map(f => (
                <div key={f.service} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{f.service}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-[10px]">{f.accepted}/{f.bids}</span>
                    <span className="text-green-400 font-medium">${(f.revenue / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs border-t border-gray-200 pt-2 mt-2">
                <span className="text-white font-medium">Total</span>
                <span className="text-[#FBCE07] font-bold">${(flexRevenue.reduce((s, f) => s + f.revenue, 0) / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch timeline */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-sm">Generation Dispatch Timeline — Today</h2>
            <p className="text-gray-600 text-xs">Stacked output by technology type (MW)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {[['Gas', '#F59E0B'], ['Wind', '#3B82F6'], ['Solar', '#FBCE07'], ['Hydro', '#06B6D4']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-gray-600">
                <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: c as string }} />
                {l}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dispatchTimeline} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
            <defs>
              {[['gasGrad', '#F59E0B'], ['windGrad', '#3B82F6'], ['solarGrad', '#FBCE07'], ['hydroGrad', '#06B6D4']].map(([id, color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="hour" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}MW`} />
            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${Number(v).toFixed(0)} MW`]} />
            <Area type="monotone" dataKey="hydro" stackId="1" stroke="#06B6D4" fill="url(#hydroGrad)" name="Hydro" />
            <Area type="monotone" dataKey="solar" stackId="1" stroke="#FBCE07" fill="url(#solarGrad)" name="Solar" />
            <Area type="monotone" dataKey="wind" stackId="1" stroke="#3B82F6" fill="url(#windGrad)" name="Wind" />
            <Area type="monotone" dataKey="gas" stackId="1" stroke="#F59E0B" fill="url(#gasGrad)" name="Gas" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="w-1 h-6 rounded-full mb-3" style={{ backgroundColor: color }} />
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-gray-600 text-xs">{label}</div>
      <div className="text-gray-600 text-[10px] mt-1">{sub}</div>
    </div>
  )
}
