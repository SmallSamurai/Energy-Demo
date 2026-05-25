import type { PricePoint, Asset, Position, Alert, BalancingBid, WeatherPoint } from '../types'

// Generate realistic intraday power price curve (£/MWh)
export function generatePriceCurve(base: number, volatility: number, points: number): PricePoint[] {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  const result: PricePoint[] = []
  let price = base
  for (let i = -24; i < points; i++) {
    const t = new Date(now.getTime() + i * 30 * 60 * 1000)
    const hour = t.getHours()
    // Morning peak 7-9, evening peak 17-20
    const peakFactor = (hour >= 7 && hour <= 9) ? 1.3
      : (hour >= 17 && hour <= 20) ? 1.45
      : (hour >= 0 && hour <= 5) ? 0.65
      : 1.0
    const noise = (Math.random() - 0.48) * volatility
    price = Math.max(5, price * 0.92 + base * 0.08 * peakFactor + noise)
    result.push({
      time: t.toISOString(),
      value: parseFloat(price.toFixed(2)),
      forecast: i > 0 ? parseFloat((price * (1 + (Math.random() - 0.5) * 0.06)).toFixed(2)) : undefined,
    })
  }
  return result
}

export function generateGasCurve(): PricePoint[] {
  return generatePriceCurve(82, 4, 48)
}

export function generatePowerCurve(): PricePoint[] {
  return generatePriceCurve(115, 12, 48)
}

export function generateCarbonCurve(): PricePoint[] {
  return generatePriceCurve(65, 1.5, 48)
}

// Forward curves — monthly settlement prices
export function generateForwardCurve(spot: number): Array<{ month: string; gas: number; power: number; carbon: number }> {
  const months = ['Jun-25','Jul-25','Aug-25','Sep-25','Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Q2-26','Q3-26']
  return months.map((month, i) => ({
    month,
    gas: parseFloat((spot * (0.98 + i * 0.012 + (Math.random() - 0.5) * 0.04)).toFixed(2)),
    power: parseFloat((spot * 1.38 * (0.97 + i * 0.015 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
    carbon: parseFloat((65 * (1 + i * 0.008 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
  }))
}

export const assets: Asset[] = [
  { id: 'a1', name: 'Keadby 2 CCGT', type: 'gas', capacity: 840, available: 820, dispatched: 610, status: 'online', region: 'Yorkshire', flexibility: true },
  { id: 'a2', name: 'Hornsea 3 Offshore', type: 'wind', capacity: 2850, available: 1920, dispatched: 1740, status: 'online', region: 'Yorkshire', flexibility: false },
  { id: 'a3', name: 'Lincs Onshore Wind', type: 'wind', capacity: 270, available: 210, dispatched: 190, status: 'online', region: 'East Midlands', flexibility: false },
  { id: 'a4', name: 'Thurcroft BESS', type: 'battery', capacity: 100, available: 100, dispatched: 45, status: 'online', region: 'Yorkshire', flexibility: true },
  { id: 'a5', name: 'Rotherham BESS', type: 'battery', capacity: 50, available: 50, dispatched: 0, status: 'standby', region: 'Yorkshire', flexibility: true },
  { id: 'a6', name: 'Midlands Solar Farm', type: 'solar', capacity: 420, available: 310, dispatched: 290, status: 'online', region: 'East Midlands', flexibility: false },
  { id: 'a7', name: 'Grangemouth CHP', type: 'gas', capacity: 180, available: 0, dispatched: 0, status: 'maintenance', region: 'Scotland', flexibility: true },
  { id: 'a8', name: 'Foyers Hydro', type: 'hydro', capacity: 300, available: 300, dispatched: 180, status: 'online', region: 'Scotland', flexibility: true },
]

export const positions: Position[] = [
  { product: 'NBP Gas', period: 'Jun-25', volume: 450, avgPrice: 79.4, marketPrice: 82.1, pnl: 121500, type: 'long' },
  { product: 'NBP Gas', period: 'Q3-25', volume: -280, avgPrice: 84.2, marketPrice: 83.6, pnl: 16800, type: 'short' },
  { product: 'UK Power', period: 'Jun-25', volume: 320, avgPrice: 108.5, marketPrice: 115.2, pnl: 214400, type: 'long' },
  { product: 'UK Power', period: 'Jul-25', volume: 180, avgPrice: 112.0, marketPrice: 117.8, pnl: 104400, type: 'long' },
  { product: 'UK Power', period: 'Q4-25', volume: -500, avgPrice: 135.0, marketPrice: 128.5, pnl: 325000, type: 'short' },
  { product: 'EUA Carbon', period: 'Dec-25', volume: 200, avgPrice: 62.5, marketPrice: 65.1, pnl: 52000, type: 'long' },
  { product: 'EUA Carbon', period: 'Dec-26', volume: -150, avgPrice: 68.0, marketPrice: 66.4, pnl: 24000, type: 'short' },
  { product: 'UK Power', period: 'Win-25', volume: 220, avgPrice: 138.5, marketPrice: 142.1, pnl: 79200, type: 'long' },
]

export const alerts: Alert[] = [
  { id: 'al1', severity: 'critical', message: 'Day-ahead power price spike: £187.40/MWh at 18:30 — 62% above forecast', timestamp: new Date(Date.now() - 8 * 60000).toISOString(), category: 'price' },
  { id: 'al2', severity: 'warning', message: 'Keadby 2 CCGT output reduced to 73% — grid operator constraint notification', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), category: 'grid' },
  { id: 'al3', severity: 'warning', message: 'Q4-25 Power short position VaR limit: 87% of £2.1M threshold', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), category: 'position' },
  { id: 'al4', severity: 'info', message: 'Met Office warning: Storm Arwen forecast to increase wind output by ~800MW Wed/Thu', timestamp: new Date(Date.now() - 90 * 60000).toISOString(), category: 'weather' },
  { id: 'al5', severity: 'info', message: 'Thurcroft BESS accepted for BM FFR service — £4,200 revenue confirmed', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), category: 'grid' },
]

export const balancingBids: BalancingBid[] = [
  { assetId: 'a1', assetName: 'Keadby 2 CCGT', volume: 120, price: 145.0, direction: 'up', accepted: true, period: '17:30' },
  { assetId: 'a4', assetName: 'Thurcroft BESS', volume: 45, price: 138.5, direction: 'up', accepted: true, period: '17:30' },
  { assetId: 'a8', assetName: 'Foyers Hydro', volume: 60, price: 128.0, direction: 'up', accepted: false, period: '17:30' },
  { assetId: 'a4', assetName: 'Thurcroft BESS', volume: 50, price: 12.5, direction: 'down', accepted: true, period: '03:00' },
  { assetId: 'a5', assetName: 'Rotherham BESS', volume: 50, price: 15.0, direction: 'down', accepted: false, period: '03:00' },
  { assetId: 'a1', assetName: 'Keadby 2 CCGT', volume: 200, price: 89.0, direction: 'down', accepted: true, period: '02:00' },
]

export function generateWeatherDemand(): WeatherPoint[] {
  const result: WeatherPoint[] = []
  const now = new Date()
  for (let i = -12; i < 36; i++) {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000)
    const hour = t.getHours()
    const temp = 12 + Math.sin(hour / 24 * Math.PI * 2 - 1) * 6 + (Math.random() - 0.5) * 2
    const wind = 8 + Math.random() * 18
    const solar = Math.max(0, Math.sin((hour - 6) / 12 * Math.PI) * 600 * Math.random())
    const demand = 32000 + (hour >= 7 && hour <= 21 ? 8000 : 0) + (temp < 8 ? 4000 : 0) + (Math.random() - 0.5) * 1500
    result.push({ time: t.toISOString(), temp: parseFloat(temp.toFixed(1)), wind: parseFloat(wind.toFixed(1)), solar: parseFloat(solar.toFixed(0)), demand: parseFloat(demand.toFixed(0)) })
  }
  return result
}

export const pnlWaterfall = [
  { name: 'Opening P&L', value: 820000, cumulative: 820000, type: 'base' },
  { name: 'NBP Gas Δ', value: 138300, cumulative: 958300, type: 'positive' },
  { name: 'UK Power Δ', value: 723000, cumulative: 1681300, type: 'positive' },
  { name: 'EUA Carbon Δ', value: 76000, cumulative: 1757300, type: 'positive' },
  { name: 'BM Revenue', value: 42600, cumulative: 1799900, type: 'positive' },
  { name: 'Hedge Costs', value: -124500, cumulative: 1675400, type: 'negative' },
  { name: 'Imbalance Charges', value: -38200, cumulative: 1637200, type: 'negative' },
  { name: 'Closing P&L', value: 1637200, cumulative: 1637200, type: 'total' },
]

export const exposureHeatmap = [
  { period: 'Jun-25', gas: 68, power: 82, carbon: 45 },
  { period: 'Jul-25', gas: 52, power: 75, carbon: 38 },
  { period: 'Aug-25', gas: 44, power: 61, carbon: 32 },
  { period: 'Sep-25', gas: 38, power: 58, carbon: 28 },
  { period: 'Oct-25', gas: 72, power: 88, carbon: 55 },
  { period: 'Nov-25', gas: 85, power: 94, carbon: 62 },
  { period: 'Dec-25', gas: 91, power: 98, carbon: 70 },
  { period: 'Q1-26', gas: 60, power: 72, carbon: 42 },
]
