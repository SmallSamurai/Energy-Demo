import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Database, BarChart2, Zap, ChevronRight, Loader2, RefreshCw, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  timestamp: Date
}

interface ToolCall {
  tool: string
  description: string
  status: 'running' | 'complete'
  result?: string
}

const SUGGESTED_QUERIES = [
  { label: 'Explain yesterday\'s price spike', icon: BarChart2, category: 'Market' },
  { label: 'What\'s driving the week-ahead gas curve?', icon: BarChart2, category: 'Market' },
  { label: 'Explain the basis risk on my current position', icon: Database, category: 'Portfolio' },
  { label: 'Which assets are eligible for tomorrow\'s balancing market?', icon: Zap, category: 'Dispatch' },
  { label: 'Model what a 10% carbon price increase does to my P&L', icon: BarChart2, category: 'Portfolio' },
  { label: 'Replay last week\'s dispatch decisions and identify missed BM revenue', icon: Zap, category: 'Dispatch' },
  { label: 'What\'s our net short exposure going into this winter?', icon: Database, category: 'Portfolio' },
  { label: 'Compare our forecast accuracy vs. market consensus on Q4-25 power', icon: BarChart2, category: 'Analytics' },
]

const MCP_TOOLS = [
  { name: 'market_data', label: 'Market Data API', description: 'Fetch live & historical prices' },
  { name: 'position_book', label: 'Position Book', description: 'Read open positions & P&L' },
  { name: 'asset_registry', label: 'Asset Registry', description: 'Query asset status & capacity' },
  { name: 'balancing_market', label: 'Balancing Market', description: 'BM bids, acceptances, cashout' },
  { name: 'weather_forecast', label: 'Weather Service', description: 'Met Office temperature & wind' },
  { name: 'forward_curves', label: 'Forward Curves', description: 'Monthly/seasonal settlements' },
  { name: 'risk_engine', label: 'Risk Engine', description: 'VaR, Greeks, scenario modelling' },
  { name: 'trade_history', label: 'Trade History', description: 'Historical executions & fills' },
]

type SimulatedResponse = {
  toolCalls: ToolCall[]
  answer: string
}

const RESPONSES: Record<string, SimulatedResponse> = {
  "Explain yesterday's price spike": {
    toolCalls: [
      { tool: 'market_data', description: 'Fetching yesterday intraday power prices (HH settlement)', status: 'complete', result: '$187.40/MWh peak at 18:30 — 62% above D-1 forecast' },
      { tool: 'weather_forecast', description: 'Pulling temperature and wind data for 25 May', status: 'complete', result: 'Temp: 8°C (4° below seasonal avg). Wind: 3.1m/s (low output)' },
      { tool: 'asset_registry', description: 'Checking scheduled unavailabilities and constraints', status: 'complete', result: 'Keadby 2 CCGT constrained off at 17:45 — 840 MW removed from dispatch merit order' },
      { tool: 'balancing_market', description: 'Reviewing BM cashout and accepted bids at 18:30', status: 'complete', result: 'System Net Imbalance Position: -980 MW (short). SO cashout: $187.40/MWh' },
    ],
    answer: `**Price spike analysis — 25 May 18:30 ($187.40/MWh)**

The spike was driven by three simultaneous factors compressing the supply stack:

**1. Keadby 2 constraint (primary driver)**
At 17:45, National Grid issued a constraint notification removing 840 MW of CCGT capacity from the Keadby 2 unit. This removed the cheapest marginal gas generation, forcing the SO to rely on more expensive peaking units to balance.

**2. Cold temperature + low wind**
Temperature at 8°C — 4 degrees below seasonal average — pushed residential demand roughly 3.2 GW higher than the day-ahead forecast. Simultaneously, wind output was only 3.1 m/s nationally, delivering ~18% of installed capacity. This tightened the supply-demand balance by an additional ~1.4 GW.

**3. BM cashout mechanics**
With the system running -980 MW short, the SO's last-resort purchases cleared at $187.40/MWh — well above the day-ahead settlement price of $115.20/MWh. This represents a $72.20/MWh imbalance premium.

**Impact on your portfolio:**
Your Keadby 2 Q2-25 long position benefited from the spike — estimated uplift of $41,600 on the evening peak exposure. However, the imbalance charge on your net short BM position partially offset this with a $12,400 cashout cost.

**Recommendation:** Consider submitting pre-gate-closure BM bids earlier on cold-snap days when wind is forecast below 4 m/s. The Thurcroft BESS had capacity to bid into this settlement period but no offer was submitted.`
  },
  "Which assets are eligible for tomorrow's balancing market?": {
    toolCalls: [
      { tool: 'asset_registry', description: 'Querying asset status and BM eligibility flags', status: 'complete', result: '5 of 8 assets BM-registered; 2 currently online + flexible' },
      { tool: 'weather_forecast', description: 'Fetching D+1 wind & solar forecast to estimate renewable output', status: 'complete', result: 'Wind: 12.4 m/s forecast — Hornsea expected ~78% capacity. Solar: moderate.' },
      { tool: 'balancing_market', description: 'Checking D+1 system balance forecast and SO procurement signals', status: 'complete', result: 'D+1 system expected long in morning, short 17:00–20:00. Dynamic Regulation open.' },
      { tool: 'risk_engine', description: 'Calculating expected BM revenue per eligible asset', status: 'complete', result: 'Keadby: $28–44k. Thurcroft BESS: $14–22k. Foyers Hydro: $8–12k range' },
    ],
    answer: `**D+1 Balancing Market eligibility — 26 May**

Based on current asset status and tomorrow's system balance forecast:

**Eligible and recommended for BM submission:**

| Asset | Type | Volume | Direction | Est. Revenue | Notes |
|---|---|---|---|---|---|
| Keadby 2 CCGT | Gas | 120–200 MW | Up-reg 17–20h | $28–44k | Submit offer ≤$145/MWh |
| Thurcroft BESS | Battery | 45–100 MW | Up 17–20h / Down 02–05h | $14–22k | Ideal for FFR + BM combo |
| Foyers Hydro | Hydro | 60–120 MW | Up-reg flexible | $8–12k | Response time 2min — useful for Dynamic Reg |

**Not eligible / excluded:**
- **Hornsea 3 Offshore** — non-dispatchable, no BM registration
- **Lincs Onshore Wind** — non-dispatchable
- **Midlands Solar** — non-dispatchable
- **Rotherham BESS** — currently in standby; check SOC before tomorrow
- **Grangemouth CHP** — under maintenance until 2 June

**System context:**
Tomorrow's forecast shows the system long by ~800 MW in the morning (Hornsea at near-full output), then turning short in the evening peak as demand rises. This creates a strong case for holding Keadby in reserve and offering into the 17:00–20:00 window. The Dynamic Regulation service is also open for Foyers Hydro given its fast response capability.

**Action:** Submit BM offers by 10:30 gate closure for all three eligible assets. Recommended pricing: Keadby $138–145/MWh, Thurcroft BESS $125–135/MWh up / $10–15/MWh down.`
  },
  "What's our net short exposure going into this winter?": {
    toolCalls: [
      { tool: 'position_book', description: 'Pulling all Q4-25 and Win-25 open positions', status: 'complete', result: 'Q4-25 Power: -500 MW net short @ $135/MWh avg. Win-25 Power: +220 MW long @ $138.50' },
      { tool: 'forward_curves', description: 'Fetching current Q4-25 and winter settlement prices', status: 'complete', result: 'Q4-25 Power: $128.50/MWh. Win-25 Power: $142.10/MWh' },
      { tool: 'risk_engine', description: 'Running VaR and scenario analysis on winter position book', status: 'complete', result: '1D VaR: $374k at 95% CI. Bull cold-snap scenario: +$840k P&L upside vs current MtM' },
      { tool: 'weather_forecast', description: 'Checking seasonal outlook for Q4-25', status: 'complete', result: 'Met Office: higher than avg probability of cold November. El Niño influence weakening.' },
    ],
    answer: `**Winter 2025 exposure summary**

**Net position:**
- Q4-25 Power: **-500 MW net short** at $135.00/MWh average vs current market $128.50/MWh
  - Current MtM P&L: **+$325,000** (market moved in our favour)
  - This short position benefits if power prices fall further, but creates risk if a cold snap drives prices higher
- Win-25 Power: **+220 MW net long** at $138.50/MWh vs current market $142.10/MWh
  - Current MtM P&L: **+$79,200**

**Risk profile:**
Your Q4-25 short is the dominant exposure. At 95% confidence, the 1D VaR on this position is **$374,000** — currently at 87% of your $430k limit. This warrants monitoring.

**Scenario analysis:**
| Scenario | Price Move | P&L Impact |
|---|---|---|
| Cold snap (Nov top-quintile) | +$25–40/MWh | -$650k to -$1.04M |
| Mild winter (Nov bottom-quartile) | -$15–25/MWh | +$390k to +$650k |
| Gas supply disruption | +$50/MWh | -$1.3M |
| Renewables oversupply | -$20/MWh | +$520k |

**Recommendation:**
Given the Met Office seasonal outlook flagging a higher probability of a cold November and the El Niño influence weakening (historically associated with colder UK winters), your Q4-25 short is approaching uncomfortable territory. Consider buying back 100–150 MW of the short to reduce VaR headroom, particularly if NBP gas prices tick upward next week as a leading indicator.`
  },
}

const DEFAULT_RESPONSE: SimulatedResponse = {
  toolCalls: [
    { tool: 'market_data', description: 'Fetching relevant market data', status: 'complete', result: 'Data retrieved successfully' },
    { tool: 'position_book', description: 'Reading current position book', status: 'complete', result: 'Position data loaded' },
    { tool: 'risk_engine', description: 'Running analysis', status: 'complete', result: 'Analysis complete' },
  ],
  answer: `I've pulled the relevant data across your market feeds, position book, and risk engine.

Based on current market conditions and your portfolio exposure, here's what stands out:

**Key findings:**
- Your current net position shows a mixed risk profile across gas, power, and carbon
- Market volatility remains elevated — the 20-day realised vol on UK power is 34%, well above the 5-year average of 22%
- Your hedge ratios are within policy limits but Q4-25 power short deserves attention given seasonal outlook

**Recommended actions:**
1. Review Q4-25 short position in light of recent Met Office seasonal guidance
2. Consider submitting Thurcroft BESS for tomorrow's FFR service window
3. Monitor NBP gas for any week-ahead supply disruption signals

Would you like me to drill deeper into any of these areas?`
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTools, setActiveTools] = useState<ToolCall[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeTools])

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const response = RESPONSES[text] ?? DEFAULT_RESPONSE
    const tools = response.toolCalls.map(t => ({ ...t, status: 'running' as const }))

    // Simulate tool calls appearing one by one
    for (let i = 0; i < tools.length; i++) {
      await delay(600 + Math.random() * 400)
      setActiveTools(tools.slice(0, i + 1))
      await delay(800 + Math.random() * 600)
      setActiveTools(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'complete' } : t))
    }

    await delay(700)
    setActiveTools([])
    setIsTyping(false)

    const assistantMsg: Message = {
      role: 'assistant',
      content: response.answer,
      toolCalls: response.toolCalls.map(t => ({ ...t, status: 'complete' })),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMsg])
  }

  function reset() {
    setMessages([])
    setActiveTools([])
    setInput('')
    setIsTyping(false)
  }

  const hasMsgs = messages.length > 0 || isTyping

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">
      {/* Main chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center">
              <BrainCircuit size={16} className="text-[#FBCE07]" />
            </div>
            <div>
              <div className="text-gray-900 font-semibold text-sm">Shell Energy Intelligence Agent</div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Connected to {MCP_TOOLS.length} MCP data sources
              </div>
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100">
            <RefreshCw size={12} /> New conversation
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {!hasMsgs && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center mb-4">
                <BrainCircuit size={28} className="text-[#FBCE07]" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Market Intelligence Agent</h3>
              <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-8">
                Ask anything about your portfolio, market conditions, asset dispatch, or risk exposure.
                The agent will pull live data from your connected MCP sources to answer.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_QUERIES.slice(0, 4).map(q => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.label)}
                    className="text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-[#FBCE07]/30 hover:bg-[#FBCE07]/5 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <q.icon size={12} className="text-[#FBCE07]" />
                      <span className="text-[10px] text-gray-600 uppercase tracking-wide">{q.category}</span>
                    </div>
                    <p className="text-gray-700 text-xs group-hover:text-gray-900 transition-colors">{q.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <BrainCircuit size={13} className="text-[#FBCE07]" />
                </div>
              )}
              <div className={`max-w-2xl ${msg.role === 'user' ? 'order-1' : ''}`}>
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {msg.toolCalls.map((tc, j) => (
                      <ToolCallBubble key={j} toolCall={tc} />
                    ))}
                  </div>
                )}
                <div className={`rounded-xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#FBCE07]/10 border border-[#FBCE07]/20 text-gray-900'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}>
                  <MarkdownText content={msg.content} />
                  <p className="text-[10px] text-gray-600 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#374151] flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={13} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {/* Active tool calls */}
          {isTyping && activeTools.length > 0 && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <BrainCircuit size={13} className="text-[#FBCE07]" />
              </div>
              <div className="space-y-1.5">
                {activeTools.map((tc, j) => (
                  <ToolCallBubble key={j} toolCall={tc} />
                ))}
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600">
                  <Loader2 size={12} className="animate-spin text-[#FBCE07]" />
                  Reasoning...
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#FBCE07]/40 transition-colors"
              placeholder="Ask about prices, positions, assets, risk..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={isTyping}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-lg bg-[#FBCE07] hover:bg-[#F59E0B] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={16} className="text-[#0A0E1A]" />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 text-center">
            Connected via MCP · Reads live market data, position book, asset registry, risk engine
          </p>
        </div>
      </div>

      {/* MCP tools sidebar */}
      <div className="w-56 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-[#FBCE07]" />
            <h3 className="text-gray-900 text-xs font-semibold">MCP Data Sources</h3>
          </div>
          <div className="space-y-2">
            {MCP_TOOLS.map(tool => (
              <div key={tool.name} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 text-[11px] font-medium">{tool.label}</p>
                  <p className="text-gray-600 text-[10px]">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-gray-900 text-xs font-semibold mb-3">Suggested Queries</h3>
          <div className="space-y-1.5">
            {SUGGESTED_QUERIES.slice(4).map(q => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.label)}
                disabled={isTyping}
                className="w-full text-left text-[10px] text-gray-600 hover:text-gray-900 flex items-start gap-1.5 py-1 px-1.5 rounded hover:bg-gray-100 transition-all disabled:opacity-40"
              >
                <ChevronRight size={9} className="mt-0.5 flex-shrink-0 text-[#FBCE07]" />
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolCallBubble({ toolCall }: { toolCall: ToolCall }) {
  const tool = MCP_TOOLS.find(t => t.name === toolCall.tool)
  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${
      toolCall.status === 'running'
        ? 'bg-[#FBCE07]/5 border-[#FBCE07]/20'
        : 'bg-white border-gray-200'
    }`}>
      {toolCall.status === 'running'
        ? <Loader2 size={11} className="animate-spin text-[#FBCE07] mt-0.5 flex-shrink-0" />
        : <div className="w-2 h-2 rounded-full bg-green-400 mt-1 flex-shrink-0" />}
      <div>
        <span className="text-[#FBCE07] font-medium">{tool?.label ?? toolCall.tool}</span>
        <span className="text-gray-600 ml-1">— {toolCall.description}</span>
        {toolCall.status === 'complete' && toolCall.result && (
          <p className="text-gray-600 mt-0.5 text-[10px]">↳ {toolCall.result}</p>
        )}
      </div>
    </div>
  )
}

function MarkdownText({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="text-gray-900 font-semibold mt-3 first:mt-0">{line.slice(2, -2)}</p>
        }
        if (line.startsWith('| ')) {
          return <TableRow key={i} line={line} />
        }
        if (line.startsWith('|---')) return null
        if (line.startsWith('- ')) {
          return <li key={i} className="text-gray-700 ml-4 list-disc marker:text-[#FBCE07]">{renderInline(line.slice(2))}</li>
        }
        if (line.match(/^\d+\. /)) {
          return <li key={i} className="text-gray-700 ml-4 list-decimal marker:text-[#FBCE07]">{renderInline(line.replace(/^\d+\. /, ''))}</li>
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i} className="text-gray-700">{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

function TableRow({ line }: { line: string }) {
  const cells = line.split('|').filter(c => c.trim() !== '')
  const isHeader = cells.every(c => c.trim().length > 0)
  return (
    <div className="flex gap-0 text-[11px] border-b border-gray-200">
      {cells.map((cell, i) => (
        <div key={i} className={`px-2 py-1 flex-1 ${isHeader ? 'text-[#FBCE07] font-medium' : 'text-gray-700'}`}>
          {cell.trim()}
        </div>
      ))}
    </div>
  )
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
