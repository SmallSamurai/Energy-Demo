import { useMemo } from 'react'
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ComposedChart, Area, Line
} from 'recharts'
import { generateWeatherDemand, generateForwardCurve } from '../data/marketData'
import { format, parseISO } from 'date-fns'
import { TrendingUp, Thermometer } from 'lucide-react'

const YELLOW = '#FBCE07'
const BLUE = '#3B82F6'
const GREEN = '#10B981'
const PURPLE = '#8B5CF6'
const RED = '#DD1D21'

export default function Analytics() {
  const weather = useMemo(() => generateWeatherDemand(), [])
  const forward = useMemo(() => generateForwardCurve(82.1), [])

  const scatterData = useMemo(() => weather.map(w => ({ demand: w.demand, temp: w.temp, wind: w.wind })), [weather])

  const scenarioData = useMemo(() => forward.map(f => ({
    month: f.month,
    base: f.power,
    bull: parseFloat((f.power * 1.18).toFixed(2)),
    bear: parseFloat((f.power * 0.84).toFixed(2)),
  })), [forward])

  const fmtHour = (iso: string) => {
    try { return format(parseISO(iso), 'HH:mm') } catch { return iso }
  }

  const demandForecastData = weather.map(w => ({
    time: w.time,
    demand: w.demand,
    solar: w.solar,
    wind: parseFloat((w.wind * 120).toFixed(0)),
  }))

  const sparklineMetrics = [
    { label: 'Forecast Accuracy (7D)', value: '94.2%', delta: '+1.3%', positive: true },
    { label: 'Avg Imbalance Volume', value: '312 MW', delta: '-8%', positive: true },
    { label: 'Correlation R²', value: '0.87', delta: '+0.04', positive: true },
    { label: 'Model RMSE', value: '$4.12', delta: '-0.6', positive: true },
  ]

  const correlationMatrix = [
    { name: 'Gas vs Power', value: 0.82, color: YELLOW },
    { name: 'Temp vs Demand', value: -0.71, color: BLUE },
    { name: 'Wind vs Price', value: -0.68, color: GREEN },
    { name: 'Carbon vs Gas', value: 0.59, color: PURPLE },
    { name: 'Solar vs Peak', value: -0.44, color: RED },
  ]

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {sparklineMetrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-600 text-xs mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${m.positive ? 'text-green-600' : 'text-red-500'}`}>
              <TrendingUp size={11} /> {m.delta} vs last week
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Forward scenarios */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 font-semibold text-sm">Power Forward — Price Scenarios</h2>
              <p className="text-gray-600 text-xs mt-0.5">Base, Bull (+18%), Bear (-16%) cases ($/MWh)</p>
            </div>
            <div className="flex gap-3 text-xs">
              <LegendDot color={YELLOW} label="Base" />
              <LegendDot color={GREEN} label="Bull" />
              <LegendDot color={RED} label="Bear" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={scenarioData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={YELLOW} stopOpacity={0.08} />
                  <stop offset="95%" stopColor={YELLOW} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${v}/MWh`]} />
              <Area type="monotone" dataKey="bull" fill="url(#rangeGrad)" stroke={GREEN} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Bull" />
              <Line type="monotone" dataKey="base" stroke={YELLOW} strokeWidth={2.5} dot={false} name="Base" />
              <Line type="monotone" dataKey="bear" stroke={RED} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Bear" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Demand vs temperature scatter */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 font-semibold text-sm">Temperature vs. Demand Correlation</h2>
              <p className="text-gray-600 text-xs mt-0.5">Each point = 1 hour (MW vs °C)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Thermometer size={12} />R² = 0.71
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="temp" name="Temp" unit="°C" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} label={{ value: 'Temperature (°C)', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }} />
              <YAxis dataKey="demand" name="Demand" unit="MW" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v, name) => [name === 'Demand' ? `${Number(v).toFixed(0)} MW` : `${Number(v).toFixed(1)}°C`, name]} />
              <Scatter data={scatterData} fill={BLUE} fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weather + demand overlay */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 font-semibold text-sm">Demand Forecast with Renewables Overlay</h2>
            <p className="text-gray-600 text-xs mt-0.5">Forecast: 48h rolling window — shaded area = renewable generation</p>
          </div>
          <div className="flex gap-3 text-xs">
            <LegendDot color={BLUE} label="Demand (MW)" />
            <LegendDot color={YELLOW} label="Solar (MW)" />
            <LegendDot color={GREEN} label="Wind Est." />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={demandForecastData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
            <defs>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BLUE} stopOpacity={0.15} />
                <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="solarGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={YELLOW} stopOpacity={0.3} />
                <stop offset="95%" stopColor={YELLOW} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="windGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="time" tickFormatter={fmtHour} tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${Number(v).toFixed(0)} MW`]} labelFormatter={l => { try { return format(parseISO(String(l)), 'HH:mm dd MMM') } catch { return String(l) } }} />
            <Area type="monotone" dataKey="demand" stroke={BLUE} strokeWidth={2} fill="url(#demandGrad)" name="Demand" />
            <Area type="monotone" dataKey="solar" stroke={YELLOW} strokeWidth={1.5} fill="url(#solarGrad2)" name="Solar" />
            <Area type="monotone" dataKey="wind" stroke={GREEN} strokeWidth={1.5} fill="url(#windGrad2)" name="Wind Est." />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation + model stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">Correlation Matrix</h2>
          <p className="text-gray-600 text-xs mb-4">Key cross-commodity and weather correlations</p>
          <div className="space-y-3">
            {correlationMatrix.map(c => {
              const abs = Math.abs(c.value)
              const negative = c.value < 0
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-medium" style={{ color: c.color }}>{c.value > 0 ? '+' : ''}{c.value.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                    {negative && (
                      <div className="h-full rounded-full ml-auto" style={{ width: `${abs * 50}%`, backgroundColor: c.color, opacity: 0.7 }} />
                    )}
                    {!negative && (
                      <div className="h-full rounded-full" style={{ width: `${abs * 50}%`, backgroundColor: c.color, marginLeft: '50%' }} />
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] mt-0.5 text-gray-600">
                    <span>-1.0</span><span>0</span><span>+1.0</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-gray-900 font-semibold text-sm mb-1">Model Performance</h2>
          <p className="text-gray-600 text-xs mb-4">Price forecast model metrics — rolling 30 days</p>
          <div className="space-y-4">
            {[
              { label: 'Mean Absolute Error', value: '$3.82/MWh', pct: 76, color: GREEN },
              { label: 'Root Mean Sq Error', value: '$4.12/MWh', pct: 72, color: YELLOW },
              { label: 'Directional Accuracy', value: '87.4%', pct: 87, color: BLUE },
              { label: 'Spike Detection Rate', value: '91.2%', pct: 91, color: PURPLE },
              { label: 'Calibration Score', value: '0.94', pct: 94, color: GREEN },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="text-gray-900 font-medium">{m.value}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-gray-600">
      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}
