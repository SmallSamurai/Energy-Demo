import { useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, Cell, LineChart, Line, ReferenceLine
} from 'recharts'

type CalcId = 'solar' | 'bess' | 'ppa' | 'hvac' | 'ev' | 'efficiency'

const CALCS: { id: CalcId; icon: string; name: string; color: string }[] = [
  { id: 'solar', icon: '☀️', name: 'Solar PV', color: '#FBCE07' },
  { id: 'bess', icon: '🔋', name: 'Battery Storage', color: '#10B981' },
  { id: 'ppa', icon: '📋', name: 'Renewable PPA', color: '#3B82F6' },
  { id: 'hvac', icon: '❄️', name: 'HVAC LoadFlex', color: '#06B6D4' },
  { id: 'ev', icon: '⚡', name: 'EV Fleet Charging', color: '#8B5CF6' },
  { id: 'efficiency', icon: '🔍', name: 'Efficiency Audit', color: '#EC4899' },
]

export default function ImpactCalculator() {
  const [activeCalc, setActiveCalc] = useState<CalcId>('solar')

  return (
    <div className="space-y-5">
      {/* Calculator tabs */}
      <div className="flex gap-2 flex-wrap">
        {CALCS.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCalc(c.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              activeCalc === c.id
                ? 'text-[#0A0E1A] border-transparent'
                : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-200'
            }`}
            style={activeCalc === c.id ? { backgroundColor: c.color, borderColor: c.color } : {}}
          >
            <span>{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {activeCalc === 'solar' && <SolarCalc />}
      {activeCalc === 'bess' && <BessCalc />}
      {activeCalc === 'ppa' && <PpaCalc />}
      {activeCalc === 'hvac' && <HvacCalc />}
      {activeCalc === 'ev' && <EvCalc />}
      {activeCalc === 'efficiency' && <EfficiencyCalc />}
    </div>
  )
}

// ─── Solar Calculator ────────────────────────────────────────────────────────

function SolarCalc() {
  const [roofArea, setRoofArea] = useState(2000)
  const [tariff, setTariff] = useState(24)
  const [exportRate, setExportRate] = useState(7.5)
  const [annualConsumption, setAnnualConsumption] = useState(850000)

  const kwp = Math.round(roofArea * 0.12)
  const annualGen = Math.round(kwp * 950)
  const selfConsume = Math.round(annualGen * 0.68)
  const exported = annualGen - selfConsume
  const annualSaving = Math.round(selfConsume * (tariff / 100) + exported * (exportRate / 100))
  const capex = Math.round(kwp * 850)
  const payback = capex / annualSaving
  const carbonSaving = Math.round(annualGen * 0.233)

  const cashflowData = Array.from({ length: 25 }, (_, i) => ({
    year: `Y${i + 1}`,
    cumulative: Math.round(-capex + annualSaving * (i + 1) * 1.02 ** i),
    annual: Math.round(annualSaving * 1.02 ** i),
  }))

  const breakEvenYear = cashflowData.findIndex(d => d.cumulative >= 0) + 1

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="Solar PV Inputs" color="#FBCE07" icon="☀️">
          <SliderInput label="Available roof/ground area" value={roofArea} min={200} max={20000} step={200} unit="m²" onChange={setRoofArea} color="#FBCE07" />
          <SliderInput label="Import tariff" value={tariff} min={10} max={45} step={0.5} unit="¢/kWh" onChange={setTariff} color="#FBCE07" />
          <SliderInput label="Export / Net Metering rate" value={exportRate} min={3} max={20} step={0.5} unit="¢/kWh" onChange={setExportRate} color="#FBCE07" />
          <SliderInput label="Annual consumption" value={annualConsumption} min={50000} max={5000000} step={50000} unit="kWh/yr" onChange={setAnnualConsumption} color="#FBCE07" />
        </CalcPanel>

        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="System size" value={`${kwp} kWp`} color="#FBCE07" />
          <ResultTile label="Annual generation" value={`${(annualGen / 1000).toFixed(0)} MWh`} color="#FBCE07" />
          <ResultTile label="Annual saving" value={`$${(annualSaving / 1000).toFixed(1)}k`} color="#10B981" big />
          <ResultTile label="Carbon saved" value={`${carbonSaving} tCO₂`} color="#10B981" />
          <ResultTile label="Est. capex" value={`$${(capex / 1000).toFixed(0)}k`} color="#6B7280" />
          <ResultTile label="Payback" value={`${payback.toFixed(1)} yrs`} color="#F97316" />
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">25-Year Cumulative Cashflow</h3>
          <p className="text-gray-600 text-xs mb-4">Break-even at Year {breakEvenYear} · IRR ~{(100 / payback * 0.85).toFixed(0)}%</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashflowData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="solarCFGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FBCE07" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FBCE07" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="year" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${(Number(v) / 1000).toFixed(1)}k`]} />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="cumulative" stroke="#FBCE07" strokeWidth={2} fill="url(#solarCFGrad)" name="Cumulative P&L" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">Annual Revenue Breakdown</h3>
          <p className="text-gray-600 text-xs mb-4">Self-consumption saving vs. export revenue</p>
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="space-y-3">
                <RevenueBar label="Self-consumption saving" value={selfConsume * (tariff / 100)} total={annualSaving} color="#FBCE07" />
                <RevenueBar label="Export / SEG income" value={exported * (exportRate / 100)} total={annualSaving} color="#F97316" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-1">Self-sufficiency</p>
              <p className="text-3xl font-bold" style={{ color: '#FBCE07' }}>{Math.min(100, Math.round((selfConsume / annualConsumption) * 100))}%</p>
              <p className="text-gray-600 text-[10px]">of annual demand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── BESS Calculator ─────────────────────────────────────────────────────────

function BessCalc() {
  const [capacity, setCapacity] = useState(500)
  const [peakTariff, setPeakTariff] = useState(35)
  const [offPeakTariff, setOffPeakTariff] = useState(12)
  const [peakDemand, setPeakDemand] = useState(800)
  const [cycles, setCycles] = useState(300)

  const arbitrageRevenue = Math.round(capacity * (peakTariff - offPeakTariff) / 100 * cycles)
  const demandReduction = Math.min(capacity, peakDemand * 0.4)
  const demandChargeSaving = Math.round(demandReduction * 12 * (peakTariff - offPeakTariff) / 100 * 30)
  const bmRevenue = Math.round(capacity * 0.6 * 35000 / 1000)
  const totalRevenue = arbitrageRevenue + demandChargeSaving + bmRevenue
  const capex = Math.round(capacity * 320000 / 1000)
  const payback = capex / totalRevenue

  const revenueData = [
    { name: 'Arbitrage', value: arbitrageRevenue },
    { name: 'Demand charge', value: demandChargeSaving },
    { name: 'BM / FFR', value: bmRevenue },
  ]
  const COLORS = ['#10B981', '#3B82F6', '#FBCE07']

  const sensitivityData = Array.from({ length: 10 }, (_, i) => {
    const spread = (offPeakTariff + i * 2)
    return {
      spread: `${offPeakTariff}→${offPeakTariff + i * 2}p`,
      revenue: Math.round(capacity * (spread - offPeakTariff) / 100 * cycles + bmRevenue),
    }
  })

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="BESS Inputs" color="#10B981" icon="🔋">
          <SliderInput label="System capacity" value={capacity} min={50} max={5000} step={50} unit="kWh" onChange={setCapacity} color="#10B981" />
          <SliderInput label="Peak tariff" value={peakTariff} min={20} max={60} step={1} unit="¢/kWh" onChange={setPeakTariff} color="#10B981" />
          <SliderInput label="Off-peak tariff" value={offPeakTariff} min={5} max={25} step={1} unit="¢/kWh" onChange={setOffPeakTariff} color="#10B981" />
          <SliderInput label="Peak demand" value={peakDemand} min={100} max={5000} step={50} unit="kW" onChange={setPeakDemand} color="#10B981" />
          <SliderInput label="Charge/discharge cycles" value={cycles} min={100} max={600} step={10} unit="/yr" onChange={setCycles} color="#10B981" />
        </CalcPanel>

        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Total revenue" value={`$${(totalRevenue / 1000).toFixed(0)}k/yr`} color="#10B981" big />
          <ResultTile label="Est. capex" value={`$${(capex / 1000).toFixed(0)}k`} color="#6B7280" />
          <ResultTile label="Payback" value={`${payback.toFixed(1)} yrs`} color="#F97316" />
          <ResultTile label="ROI" value={`${(100 / payback * 0.85).toFixed(0)}%`} color="#8B5CF6" />
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-900 font-semibold text-sm mb-1">Revenue Streams</h3>
            <p className="text-gray-600 text-xs mb-4">Annual income by source</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={revenueData} layout="vertical" margin={{ top: 5, right: 10, bottom: 0, left: 20 }}>
                <XAxis type="number" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#4B5563', fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${(Number(v) / 1000).toFixed(1)}k`]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {revenueData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-900 font-semibold text-sm mb-1">Tariff Spread Sensitivity</h3>
            <p className="text-gray-600 text-xs mb-4">Revenue vs. peak/off-peak spread</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={sensitivityData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="spread" tick={{ fill: '#4B5563', fontSize: 9 }} tickLine={false} interval={2} />
                <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${(Number(v) / 1000).toFixed(1)}k`]} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-gray-900 font-semibold text-sm mb-2">Revenue Breakdown Detail</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {revenueData.map((r, i) => (
              <div key={r.name} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: COLORS[i] }} />
                <p className="text-gray-600 text-xs">{r.name}</p>
                <p className="text-gray-900 font-bold mt-1">${(r.value / 1000).toFixed(1)}k/yr</p>
                <p className="text-gray-600 text-[10px]">{((r.value / totalRevenue) * 100).toFixed(0)}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PPA Calculator ───────────────────────────────────────────────────────────

function PpaCalc() {
  const [annualVolume, setAnnualVolume] = useState(5000000)
  const [ppaPrice, setPpaPrice] = useState(62)
  const [currentTariff, setCurrentTariff] = useState(115)
  const [escalator, setEscalator] = useState(2)
  const [term, setTerm] = useState(12)

  const annualSaving = Math.round(annualVolume * (currentTariff - ppaPrice) / 100000)
  const totalSaving = Array.from({ length: term }, (_, i) => {
    const market = currentTariff * (1.04 ** i)
    const ppa = ppaPrice * (1 + escalator / 100) ** i
    return annualVolume * (market - ppa) / 100000
  }).reduce((a, b) => a + b, 0)

  const termData = Array.from({ length: term }, (_, i) => ({
    year: `Y${i + 1}`,
    market: parseFloat((currentTariff * 1.04 ** i).toFixed(2)),
    ppa: parseFloat((ppaPrice * (1 + escalator / 100) ** i).toFixed(2)),
    saving: parseFloat(((currentTariff * 1.04 ** i - ppaPrice * (1 + escalator / 100) ** i) * annualVolume / 100000).toFixed(0)),
  }))

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="PPA Inputs" color="#3B82F6" icon="📋">
          <SliderInput label="Annual volume" value={annualVolume} min={500000} max={50000000} step={500000} unit="kWh/yr" onChange={setAnnualVolume} color="#3B82F6" />
          <SliderInput label="PPA strike price" value={ppaPrice} min={40} max={120} step={1} unit="$/MWh" onChange={setPpaPrice} color="#3B82F6" />
          <SliderInput label="Current market tariff" value={currentTariff} min={80} max={200} step={1} unit="$/MWh" onChange={setCurrentTariff} color="#3B82F6" />
          <SliderInput label="PPA price escalator" value={escalator} min={0} max={5} step={0.25} unit="%/yr" onChange={setEscalator} color="#3B82F6" />
          <SliderInput label="Contract term" value={term} min={5} max={20} step={1} unit="years" onChange={setTerm} color="#3B82F6" />
        </CalcPanel>
        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Year 1 saving" value={`$${(annualSaving / 1000).toFixed(0)}k`} color="#3B82F6" big />
          <ResultTile label={`${term}yr total saving`} value={`$${(totalSaving / 1000000).toFixed(1)}M`} color="#10B981" big />
          <ResultTile label="Carbon coverage" value="100% Scope 2" color="#10B981" />
          <ResultTile label="Discount vs market" value={`${((currentTariff - ppaPrice) / currentTariff * 100).toFixed(0)}%`} color="#FBCE07" />
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">PPA vs. Market Price Over Contract Term</h3>
          <p className="text-gray-600 text-xs mb-4">Assumes 4% market escalation vs. {escalator}% PPA escalator</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={termData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="year" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${v}/MWh`]} />
              <Line type="monotone" dataKey="market" stroke="#DD1D21" strokeWidth={2} dot={false} name="Market price" />
              <Line type="monotone" dataKey="ppa" stroke="#3B82F6" strokeWidth={2} dot={false} name="PPA price" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">Annual Saving vs. Market</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={termData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${(Number(v) / 1000).toFixed(0)}k`]} />
              <Bar dataKey="saving" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Annual saving" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── HVAC LoadFlex Calculator ─────────────────────────────────────────────────

function HvacCalc() {
  const [hvacLoad, setHvacLoad] = useState(400)
  const [flexPct, setFlexPct] = useState(35)
  const [peakHours, setPeakHours] = useState(1200)
  const [demandRevenue, setDemandRevenue] = useState(40)

  const flexCapacity = Math.round(hvacLoad * flexPct / 100)
  const peakSaving = Math.round(flexCapacity * peakHours * 0.35 / 100)
  const drRevenue = Math.round(flexCapacity * demandRevenue)
  const total = peakSaving + drRevenue
  const capex = Math.round(hvacLoad * 80)
  const payback = capex / total

  const monthlyData = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
    month: m,
    saving: Math.round(total / 12 * (i >= 5 && i <= 8 ? 1.4 : i <= 1 || i >= 10 ? 1.2 : 0.8)),
  }))

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="HVAC LoadFlex Inputs" color="#06B6D4" icon="❄️">
          <SliderInput label="Total HVAC load" value={hvacLoad} min={50} max={3000} step={50} unit="kW" onChange={setHvacLoad} color="#06B6D4" />
          <SliderInput label="Flexible portion" value={flexPct} min={10} max={60} step={5} unit="%" onChange={setFlexPct} color="#06B6D4" />
          <SliderInput label="Peak hours / year" value={peakHours} min={200} max={2500} step={100} unit="hrs/yr" onChange={setPeakHours} color="#06B6D4" />
          <SliderInput label="Demand response rate" value={demandRevenue} min={10} max={100} step={5} unit="$/kW/yr" onChange={setDemandRevenue} color="#06B6D4" />
        </CalcPanel>
        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Flex capacity" value={`${flexCapacity} kW`} color="#06B6D4" />
          <ResultTile label="Peak saving" value={`$${(peakSaving / 1000).toFixed(0)}k/yr`} color="#FBCE07" />
          <ResultTile label="DR revenue" value={`$${(drRevenue / 1000).toFixed(0)}k/yr`} color="#10B981" />
          <ResultTile label="Payback" value={`${payback.toFixed(1)} yrs`} color="#F97316" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">Monthly Flexibility Revenue</h3>
          <p className="text-gray-600 text-xs mb-4">Higher in summer (cooling) and winter (heating) peaks</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="hvacGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4B5563', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`$${(Number(v) / 1000).toFixed(1)}k`]} />
              <Bar dataKey="saving" fill="url(#hvacGrad)" radius={[4, 4, 0, 0]} name="Monthly saving" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── EV Calculator ────────────────────────────────────────────────────────────

function EvCalc() {
  const [vehicles, setVehicles] = useState(50)
  const [avgMileage, setAvgMileage] = useState(25000)
  const [offPeakPct, setOffPeakPct] = useState(70)
  const [peakRate, setPeakRate] = useState(35)
  const [offPeakRate, setOffPeakRate] = useState(11)

  const annualKwh = Math.round(vehicles * avgMileage * 0.3 / 1000) * 1000
  const peakKwh = Math.round(annualKwh * (1 - offPeakPct / 100))
  const offPeakKwh = Math.round(annualKwh * offPeakPct / 100)
  const smartCost = Math.round(peakKwh * peakRate / 100 + offPeakKwh * offPeakRate / 100)
  const dumbCost = Math.round(annualKwh * peakRate / 100)
  const annualSaving = dumbCost - smartCost
  const capex = Math.round(vehicles * 2800)
  const payback = capex / annualSaving
  const carbonSaving = Math.round(annualKwh * 0.180)

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="EV Fleet Inputs" color="#8B5CF6" icon="⚡">
          <SliderInput label="Fleet size" value={vehicles} min={5} max={500} step={5} unit="vehicles" onChange={setVehicles} color="#8B5CF6" />
          <SliderInput label="Avg annual mileage" value={avgMileage} min={5000} max={80000} step={1000} unit="miles/yr" onChange={setAvgMileage} color="#8B5CF6" />
          <SliderInput label="Off-peak charging %" value={offPeakPct} min={20} max={95} step={5} unit="%" onChange={setOffPeakPct} color="#8B5CF6" />
          <SliderInput label="Peak rate" value={peakRate} min={20} max={60} step={1} unit="¢/kWh" onChange={setPeakRate} color="#8B5CF6" />
          <SliderInput label="Off-peak rate" value={offPeakRate} min={5} max={25} step={1} unit="¢/kWh" onChange={setOffPeakRate} color="#8B5CF6" />
        </CalcPanel>
        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Annual saving" value={`$${(annualSaving / 1000).toFixed(0)}k`} color="#8B5CF6" big />
          <ResultTile label="Carbon saved" value={`${carbonSaving} tCO₂`} color="#10B981" />
          <ResultTile label="Capex" value={`$${(capex / 1000).toFixed(0)}k`} color="#6B7280" />
          <ResultTile label="Payback" value={`${payback.toFixed(1)} yrs`} color="#F97316" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">Smart vs. Unmanaged Charging Cost</h3>
          <p className="text-gray-600 text-xs mb-4">{offPeakPct}% off-peak charging shifts ${(annualSaving / 1000).toFixed(0)}k/yr in cost</p>
          <div className="flex gap-8 items-end mb-6">
            <CostBar label="Unmanaged" value={dumbCost} max={dumbCost} color="#DD1D21" />
            <CostBar label="Smart charging" value={smartCost} max={dumbCost} color="#8B5CF6" />
            <div className="text-center pb-2">
              <p className="text-gray-600 text-xs mb-1">Annual saving</p>
              <p className="text-3xl font-bold text-green-600">${(annualSaving / 1000).toFixed(0)}k</p>
              <p className="text-gray-600 text-xs">{((annualSaving / dumbCost) * 100).toFixed(0)}% reduction</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-600">Total annual kWh</p>
              <p className="text-gray-900 font-bold mt-1">{(annualKwh / 1000).toFixed(0)} MWh</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-600">Off-peak kWh</p>
              <p className="text-gray-900 font-bold mt-1">{(offPeakKwh / 1000).toFixed(0)} MWh ({offPeakPct}%)</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-600">Cost per vehicle</p>
              <p className="text-gray-900 font-bold mt-1">${(smartCost / vehicles).toFixed(0)}/yr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Efficiency Calculator ────────────────────────────────────────────────────

function EfficiencyCalc() {
  const [annualBill, setAnnualBill] = useState(500000)
  const [reductionPct, setReductionPct] = useState(16)
  const [auditCost, setAuditCost] = useState(15000)

  const annualSaving = Math.round(annualBill * reductionPct / 100)
  const payback = auditCost / annualSaving
  const carbonSaving = Math.round(annualBill / 115 * 1000 * reductionPct / 100 * 0.233)
  const fiveYrSaving = annualSaving * 5

  const breakdownData = [
    { name: 'Lighting & controls', pct: 28, saving: Math.round(annualSaving * 0.28) },
    { name: 'HVAC optimisation', pct: 34, saving: Math.round(annualSaving * 0.34) },
    { name: 'Compressed air', pct: 14, saving: Math.round(annualSaving * 0.14) },
    { name: 'Process heat', pct: 12, saving: Math.round(annualSaving * 0.12) },
    { name: 'Behaviour & metering', pct: 12, saving: Math.round(annualSaving * 0.12) },
  ]
  const COLORS = ['#FBCE07', '#06B6D4', '#8B5CF6', '#F97316', '#10B981']

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-1 space-y-4">
        <CalcPanel title="Efficiency Audit Inputs" color="#EC4899" icon="🔍">
          <SliderInput label="Annual energy bill" value={annualBill} min={50000} max={5000000} step={10000} unit="$/yr" onChange={setAnnualBill} color="#EC4899" />
          <SliderInput label="Expected reduction" value={reductionPct} min={5} max={30} step={1} unit="%" onChange={setReductionPct} color="#EC4899" />
          <SliderInput label="Audit cost" value={auditCost} min={5000} max={50000} step={1000} unit="$" onChange={setAuditCost} color="#EC4899" />
        </CalcPanel>
        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Annual saving" value={`$${(annualSaving / 1000).toFixed(0)}k`} color="#EC4899" big />
          <ResultTile label="5yr saving" value={`$${(fiveYrSaving / 1000).toFixed(0)}k`} color="#10B981" big />
          <ResultTile label="Payback" value={`${(payback * 12).toFixed(0)} months`} color="#F97316" />
          <ResultTile label="Carbon saved" value={`${carbonSaving} tCO₂`} color="#10B981" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">
          <h3 className="text-gray-900 font-semibold text-sm mb-1">Typical Saving Breakdown by Category</h3>
          <p className="text-gray-600 text-xs mb-4">Based on Shell Energy US DOE Better Buildings benchmarks</p>
          <div className="space-y-4">
            {breakdownData.map((d, i) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{d.pct}%</span>
                    <span className="text-gray-900 font-medium w-20 text-right">${(d.saving / 1000).toFixed(0)}k/yr</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct * 3}%`, backgroundColor: COLORS[i] }} />
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
              <span className="text-gray-600">Total annual saving</span>
              <span className="text-gray-900 font-bold">${(annualSaving / 1000).toFixed(0)}k ({reductionPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

function CalcPanel({ title, icon, children }: { title: string; color?: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <span>{icon}</span>
        <h3 className="text-gray-900 font-semibold text-sm">{title}</h3>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  )
}

function SliderInput({ label, value, min, max, step, unit, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; color: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium" style={{ color }}>{value.toLocaleString()} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color, background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #1F2937 ${pct}%, #1F2937 100%)` }}
      />
      <div className="flex justify-between text-[9px] text-gray-600 mt-0.5">
        <span>{min.toLocaleString()}</span><span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

function ResultTile({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <p className="text-gray-600 text-[10px] mb-1">{label}</p>
      <p className={`font-bold ${big ? 'text-xl' : 'text-sm'}`} style={{ color }}>{value}</p>
    </div>
  )
}

function RevenueBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return (
    <div className="flex-1">
      <p className="text-gray-600 text-xs mb-2">{label}</p>
      <div className="flex items-end gap-2">
        <div className="w-16 rounded-t-lg" style={{ height: `${(value / total) * 120}px`, backgroundColor: color }} />
        <p className="text-gray-900 text-sm font-bold pb-1">${(value / 1000).toFixed(0)}k/yr</p>
      </div>
    </div>
  )
}

function CostBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-gray-900 text-sm font-bold">${(value / 1000).toFixed(0)}k</p>
      <div className="w-16 rounded-t-lg" style={{ height: `${(value / max) * 120}px`, backgroundColor: color }} />
      <p className="text-gray-600 text-xs">{label}</p>
    </div>
  )
}
