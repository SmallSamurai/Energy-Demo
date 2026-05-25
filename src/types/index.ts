export interface PricePoint {
  time: string
  value: number
  forecast?: number
}

export interface Asset {
  id: string
  name: string
  type: 'gas' | 'wind' | 'solar' | 'battery' | 'hydro' | 'coal'
  capacity: number
  available: number
  dispatched: number
  status: 'online' | 'offline' | 'standby' | 'maintenance'
  region: string
  flexibility: boolean
}

export interface Position {
  product: string
  period: string
  volume: number
  avgPrice: number
  marketPrice: number
  pnl: number
  type: 'long' | 'short'
}

export interface Alert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  category: 'price' | 'grid' | 'position' | 'weather'
}

export interface BalancingBid {
  assetId: string
  assetName: string
  volume: number
  price: number
  direction: 'up' | 'down'
  accepted: boolean
  period: string
}

export interface WeatherPoint {
  time: string
  temp: number
  wind: number
  solar: number
  demand: number
}
