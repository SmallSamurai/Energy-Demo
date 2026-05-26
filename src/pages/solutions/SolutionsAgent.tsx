import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, RefreshCw, User, ChevronRight, Database, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  timestamp: Date
}

interface ToolCall {
  tool: string
  label: string
  description: string
  status: 'running' | 'complete'
  result?: string
}

const MCP_TOOLS = [
  { name: 'solutions_catalogue', label: 'Solutions Catalogue', description: 'All 8 solutions, specs & case studies' },
  { name: 'impact_model', label: 'Impact Model', description: 'Financial & carbon calculators' },
  { name: 'customer_profile', label: 'Customer Profile', description: 'Industry benchmarks & consumption data' },
  { name: 'carbon_registry', label: 'Carbon Registry', description: 'SBTi targets, EUAs, offsets' },
  { name: 'market_signals', label: 'Market Signals', description: 'Tariff forecasts, PPA pricing' },
  { name: 'compatibility_graph', label: 'Compatibility Graph', description: 'Solution interdependencies' },
]

const SUGGESTED = [
  { label: 'Which solutions suit a food manufacturer targeting net zero by 2030?', icon: '🏭', category: 'Recommendation' },
  { label: 'Model the ROI of solar + BESS + LoadFlex for a large retail estate', icon: '🛒', category: 'Calculator' },
  { label: 'What\'s the optimal deployment sequence to maximise early payback?', icon: '📅', category: 'Strategy' },
  { label: 'Compare PPA vs. rooftop solar for our Scope 2 reduction target', icon: '📋', category: 'Compare' },
  { label: 'How much carbon can we cut with a $500k budget?', icon: '🌿', category: 'Carbon' },
  { label: 'Explain how the Smart Energy Hub connects to our existing SCADA', icon: '🧠', category: 'Technical' },
  { label: 'Which solutions qualify for ENERGY STAR or ITC incentives?', icon: '📑', category: 'Compliance' },
  { label: 'What\'s the business case for demand response for a hospital?', icon: '🏥', category: 'Sector' },
]

type SimResponse = { toolCalls: ToolCall[]; answer: string }

const RESPONSES: Record<string, SimResponse> = {
  'Which solutions suit a food manufacturer targeting net zero by 2030?': {
    toolCalls: [
      { tool: 'customer_profile', label: 'Customer Profile', description: 'Loading food manufacturing energy benchmarks', status: 'complete', result: 'Avg consumption: 4.2 GWh/yr · High process heat · 24/7 operation · Large roof assets typical' },
      { tool: 'carbon_registry', label: 'Carbon Registry', description: 'Checking SBTi net zero pathway for 2030', status: 'complete', result: 'SBTi net zero by 2030 requires ~80% absolute Scope 1+2 reduction vs 2024 baseline' },
      { tool: 'solutions_catalogue', label: 'Solutions Catalogue', description: 'Filtering solutions for food manufacturing + net zero goal', status: 'complete', result: '6 solutions matched: PPA, Solar, BESS, Efficiency Audit, Carbon Credits, Smart Hub' },
      { tool: 'impact_model', label: 'Impact Model', description: 'Modelling combined carbon reduction for matched solutions', status: 'complete', result: 'Combined reduction: 3,820 tCO₂/yr · $487k/yr saving · $1.8M capex · 3.7yr blended payback' },
    ],
    answer: `**Recommended solutions for a food manufacturer — net zero by 2030**

Based on your operational profile (high process load, 24/7 operation, large roof area) and SBTi 2030 commitment, here's the prioritised stack:

**Priority 1 — Start immediately (quick payback)**
- **Energy Efficiency Audit** — Identify 12–18% consumption reduction with minimal capex. At typical food manufacturing scale (4.2 GWh/yr), this saves $58–88k/yr and pays back in under 12 months. This is always step one — it reduces the size of every other solution you need to buy.
- **HVAC LoadFlex** — Your process cooling and HVAC load is significant. We can make 30–40% of it flexible for demand response, generating $35–60k/yr in balancing market revenue.

**Priority 2 — Deploy in Year 1–2 (Scope 2 attack)**
- **Renewable PPA** — For a 4.2 GWh/yr consumer, a 10–15 year PPA can cover 100% of your electricity demand at $62–70/MWh vs. current $115/MWh market. This single step eliminates your entire Scope 2 and saves $220–280k/yr.
- **Rooftop Solar** — Food manufacturing sites typically have large flat roofs ideal for solar. A 500–800 kWp system provides 475–760 MWh/yr of self-generated power at zero marginal cost.

**Priority 3 — Optimise and store (Year 2–3)**
- **Battery BESS** — Store cheap overnight power (or solar surplus) for peak demand periods. At your scale, a 500 kWh system creates $80–120k/yr in combined arbitrage, peak shaving and BM revenue.
- **Smart Energy Hub** — Orchestrates all of the above. As you add solar, BESS and LoadFlex, the Hub's AI dispatch optimisation typically adds 15–20% incremental efficiency.

**Carbon offset (residual)**
- **Carbon Credits** — For the ~12–20% of emissions you can't eliminate by 2030 (mostly Scope 1 process heat), a verified carbon offset bundle bridges the gap to net zero.

**Summary:**

| Solution | Annual Saving | Carbon Reduction | Payback |
|---|---|---|---|
| Efficiency Audit | $72k | 200 tCO₂ | <1 yr |
| Renewable PPA | $252k | 1,200 tCO₂ | Immediate |
| Rooftop Solar | $96k | 180 tCO₂ | 5.5 yrs |
| HVAC LoadFlex | $48k | 95 tCO₂ | 2.8 yrs |
| BESS | $100k | 180 tCO₂ | 6.8 yrs |
| Smart Hub | $45k | 150 tCO₂ | 3.1 yrs |

**Total: $613k/yr saving · 2,005 tCO₂/yr reduction · 4.1yr blended payback**

This gets you to approximately 75% of your 2024 baseline by 2030 — the remaining 5–8% via Carbon Credits.`
  },
  'What\'s the optimal deployment sequence to maximise early payback?': {
    toolCalls: [
      { tool: 'impact_model', label: 'Impact Model', description: 'Calculating payback periods across all 8 solutions', status: 'complete', result: 'Efficiency: 1.2yr · LoadFlex: 2.8yr · EV: 3.4yr · Hub: 3.1yr · Solar: 5.2yr · PPA: immediate · BESS: 6.8yr' },
      { tool: 'compatibility_graph', label: 'Compatibility Graph', description: 'Checking deployment dependencies between solutions', status: 'complete', result: 'Hub requires at least 2 other assets. BESS amplifies solar ROI by ~22%. PPA can be contracted in parallel with any.' },
      { tool: 'market_signals', label: 'Market Signals', description: 'Checking current PPA pricing and tariff forecasts', status: 'complete', result: 'PPA pricing window favourable — generator surplus in 2025. Grid tariffs forecast +8%/yr. Act on PPA this year.' },
    ],
    answer: `**Optimal deployment sequence — maximising early payback**

The golden rule: **eliminate waste before you generate**, and **contract before you build**.

**Phase 1 — Year 1 (immediate return, minimal risk)**

1. **Renewable PPA** — Contract first. Zero capex, $0 payback period, immediate Scope 2 elimination and $120–340k/yr saving from day one. Current PPA pricing is at a 5-year low — this is the right moment to lock in a 12–15 year contract before the next demand cycle tightens supply.

2. **Energy Efficiency Audit** — Run in parallel with PPA contracting. At $5–35k cost and typically 12–18% consumption reduction, this is the highest ROI action in the portfolio (85% IRR). It also reduces the size of solar and BESS you'll need to buy in later phases, saving capital.

**Phase 2 — Year 1–2 (revenue + demand reduction)**

3. **HVAC LoadFlex** — 2.8 year payback, $25–120k capex, starts generating demand response revenue immediately after commissioning. Commission this before winter peak to capture maximum BM revenue in Year 1.

4. **EV Fleet Charging** — If you have a fleet, smart charging pays back in 3.4 years and cuts a meaningful slice of Scope 3. Can often be co-funded via federal EV infrastructure grants or state incentives.

**Phase 3 — Year 2–3 (generation + orchestration)**

5. **Smart Energy Hub** — Deploy once you have LoadFlex and PPA in place. The Hub's value compounds with each asset you add — wait until you have enough assets for it to orchestrate. 3.1 year payback.

6. **Rooftop Solar** — 5.2 year payback, but delivers the cheapest electricity unit cost in your portfolio (effectively free after payback). Size appropriately against your daytime load profile.

**Phase 4 — Year 3+ (optimise and offset)**

7. **BESS** — Deploy alongside or just after solar to capture solar surplus and arbitrage. The BESS ROI improves materially (by ~22%) when paired with solar vs. standalone.

8. **Carbon Credits** — Use to bridge any residual gap to your net zero target while Phases 1–4 compound.

**Cumulative saving by year:**
- End of Year 1: $180–400k/yr (PPA + audit + LoadFlex)
- End of Year 2: $320–600k/yr (+ EV + Hub)
- End of Year 3: $500–800k/yr (+ solar + BESS)
- End of Year 5: Full stack at $600k–1M/yr`
  },
  'How much carbon can we cut with a $500k budget?': {
    toolCalls: [
      { tool: 'impact_model', label: 'Impact Model', description: 'Running carbon/$ efficiency analysis across all solutions', status: 'complete', result: 'Efficiency: $125/tCO₂. PPA: $0/tCO₂ (contractual). Solar: $893/tCO₂. BESS: $1,778/tCO₂. LoadFlex: $263/tCO₂.' },
      { tool: 'solutions_catalogue', label: 'Solutions Catalogue', description: 'Identifying solutions within $500k budget envelope', status: 'complete', result: '5 solutions can be deployed for <$500k total: Audit $20k, PPA $0, LoadFlex $75k, Solar $255k, EV $150k' },
      { tool: 'compatibility_graph', label: 'Compatibility Graph', description: 'Optimising solution combination for maximum carbon/$', status: 'complete', result: 'Optimal $500k stack: Audit + PPA + LoadFlex + partial solar. Estimated 1,800 tCO₂/yr reduction.' },
    ],
    answer: `**Carbon reduction with a $500k budget**

With $500k deployed strategically, you can achieve **approximately 1,800–2,200 tCO₂/yr reduction** — the key is maximising carbon-per-pound efficiency.

**Carbon efficiency ranking (tCO₂ per $1k capex):**

| Solution | Capex Range | Carbon Reduction | $/tCO₂ |
|---|---|---|---|
| Renewable PPA | $0 | 1,200 tCO₂ | **$0** — highest priority |
| Efficiency Audit | $20k | 120–200 tCO₂ | **$125/tCO₂** |
| HVAC LoadFlex | $75k | 95 tCO₂ | **$263/tCO₂** |
| Rooftop Solar | $255k | 180–280 tCO₂ | **$893/tCO₂** |
| EV Smart Charging | $150k | 220 tCO₂ | **$682/tCO₂** |

**Recommended $500k allocation:**

1. **Renewable PPA** — $0 capex → 1,200 tCO₂ eliminated (Scope 2). Start here, it costs nothing upfront and delivers the biggest single reduction. This alone gets you 25–30% toward a typical 2030 target.

2. **Efficiency Audit** — $20k → ~160 tCO₂ reduction. Spend this before anything else. It's the highest ROI action and reduces downstream capex.

3. **HVAC LoadFlex** — $75k → 95 tCO₂ + $48k/yr demand response revenue. Starts paying for itself in Year 3 while cutting emissions.

4. **Remaining $405k → Solar PV** — At $850/kWp, $405k buys approximately 476 kWp. At UK irradiance, this generates ~450 MWh/yr of zero-carbon power, cutting ~105 tCO₂/yr.

**Total: ~1,560 tCO₂/yr reduction + $300k+/yr saving from PPA + audit + DR revenue**

If you want to stretch to 2,000 tCO₂, adding a small 100 kWh BESS (~$85k) alongside the solar maximises self-consumption and adds ~40 tCO₂ via peak-shaving (reduces grid draw at coal/gas-heavy peak hours).`
  },
}

const DEFAULT: SimResponse = {
  toolCalls: [
    { tool: 'solutions_catalogue', label: 'Solutions Catalogue', description: 'Searching relevant solutions', status: 'complete', result: 'Matched solutions retrieved' },
    { tool: 'impact_model', label: 'Impact Model', description: 'Running financial and carbon analysis', status: 'complete', result: 'Impact model complete' },
    { tool: 'customer_profile', label: 'Customer Profile', description: 'Loading industry benchmarks', status: 'complete', result: 'Benchmarks loaded' },
  ],
  answer: `Based on the information available, here's what I can tell you:

Shell Energy's solutions portfolio spans **8 core offerings** across generation, storage, procurement, flexibility, management and offsets. Together they can deliver:

- **$100k–$800k+/yr** in combined energy savings
- **500–4,600 tCO₂/yr** in carbon reduction
- **1–7 year payback** depending on your mix

**My recommendation** is to start with the two zero-risk actions:
1. **Energy Efficiency Audit** — find the free money first
2. **Renewable PPA** — eliminate Scope 2 at zero capex

Then layer in generation, storage and flexibility in order of your payback targets.

Would you like me to model a specific combination, compare two solutions, or build a deployment roadmap for your organisation?`
}

export default function SolutionsAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTools, setActiveTools] = useState<ToolCall[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, activeTools])

  async function send(text: string) {
    if (!text.trim() || isTyping) return
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }])
    setInput('')
    setIsTyping(true)

    const response = RESPONSES[text] ?? DEFAULT
    const tools = response.toolCalls.map(t => ({ ...t, status: 'running' as const }))

    for (let i = 0; i < tools.length; i++) {
      await delay(500 + Math.random() * 400)
      setActiveTools(tools.slice(0, i + 1))
      await delay(700 + Math.random() * 500)
      setActiveTools(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'complete' } : t))
    }

    await delay(600)
    setActiveTools([])
    setIsTyping(false)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response.answer,
      toolCalls: response.toolCalls.map(t => ({ ...t, status: 'complete' })),
      timestamp: new Date(),
    }])
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center">
              <BrainCircuit size={16} className="text-[#FBCE07]" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Shell Energy Solutions Advisor</div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Connected to {MCP_TOOLS.length} MCP sources · 8 solutions in catalogue
              </div>
            </div>
          </div>
          <button onClick={() => { setMessages([]); setActiveTools([]) }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
            <RefreshCw size={12} /> New
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center mb-4">
                <BrainCircuit size={28} className="text-[#FBCE07]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Solutions Advisor</h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-8">
                Get personalised energy solutions recommendations, ROI modelling, carbon impact analysis and deployment strategy — powered by Shell Energy's MCP data tools.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTED.slice(0, 4).map(q => (
                  <button key={q.label} onClick={() => send(q.label)}
                    className="text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-[#FBCE07]/30 hover:bg-[#FBCE07]/5 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{q.icon}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{q.category}</span>
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
                {msg.toolCalls && (
                  <div className="mb-3 space-y-1.5">
                    {msg.toolCalls.map((tc, j) => <ToolBubble key={j} tc={tc} />)}
                  </div>
                )}
                <div className={`rounded-xl px-4 py-3 ${msg.role === 'user' ? 'bg-[#FBCE07]/10 border border-[#FBCE07]/20 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  <MarkdownText content={msg.content} />
                  <p className="text-[10px] text-gray-400 mt-2">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#374151] flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={13} className="text-gray-500" />
                </div>
              )}
            </div>
          ))}

          {isTyping && activeTools.length > 0 && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FBCE07]/10 border border-[#FBCE07]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <BrainCircuit size={13} className="text-[#FBCE07]" />
              </div>
              <div className="space-y-1.5">
                {activeTools.map((tc, j) => <ToolBubble key={j} tc={tc} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#FBCE07]/40 transition-colors"
              placeholder="Ask about solutions, ROI, carbon impact, deployment strategy..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              disabled={isTyping}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-lg bg-[#FBCE07] hover:bg-[#F59E0B] disabled:opacity-30 flex items-center justify-center transition-colors">
              <Send size={16} className="text-[#0A0E1A]" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">MCP-connected · solutions catalogue · impact model · carbon registry · market signals</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-56 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-[#FBCE07]" />
            <h3 className="text-white text-xs font-semibold">MCP Sources</h3>
          </div>
          <div className="space-y-2">
            {MCP_TOOLS.map(t => (
              <div key={t.name} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 text-[11px] font-medium">{t.label}</p>
                  <p className="text-gray-400 text-[10px]">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-white text-xs font-semibold mb-3">More questions</h3>
          <div className="space-y-1.5">
            {SUGGESTED.slice(4).map(q => (
              <button key={q.label} onClick={() => send(q.label)} disabled={isTyping}
                className="w-full text-left text-[10px] text-gray-500 hover:text-gray-900 flex items-start gap-1.5 py-1 px-1.5 rounded hover:bg-gray-100 transition-all disabled:opacity-40">
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

function ToolBubble({ tc }: { tc: ToolCall }) {
  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${tc.status === 'running' ? 'bg-[#FBCE07]/5 border-[#FBCE07]/20' : 'bg-white border-gray-200'}`}>
      {tc.status === 'running'
        ? <Loader2 size={11} className="animate-spin text-[#FBCE07] mt-0.5 flex-shrink-0" />
        : <div className="w-2 h-2 rounded-full bg-green-400 mt-1 flex-shrink-0" />}
      <div>
        <span className="text-[#FBCE07] font-medium">{tc.label}</span>
        <span className="text-gray-400 ml-1">— {tc.description}</span>
        {tc.status === 'complete' && tc.result && <p className="text-gray-500 mt-0.5 text-[10px]">↳ {tc.result}</p>}
      </div>
    </div>
  )
}

function MarkdownText({ content }: { content: string }) {
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**'))
          return <p key={i} className="text-white font-semibold mt-3 first:mt-0">{line.slice(2, -2)}</p>
        if (line.startsWith('| ')) return <TableRow key={i} line={line} />
        if (line.startsWith('|---')) return null
        if (line.startsWith('- ')) return <li key={i} className="text-gray-700 ml-4 list-disc marker:text-[#FBCE07]">{renderInline(line.slice(2))}</li>
        if (line.match(/^\d+\. /)) return <li key={i} className="text-gray-700 ml-4 list-decimal marker:text-[#FBCE07]">{renderInline(line.replace(/^\d+\. /, ''))}</li>
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i} className="text-gray-700">{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

function TableRow({ line }: { line: string }) {
  const cells = line.split('|').filter(c => c.trim())
  return (
    <div className="flex gap-0 text-[11px] border-b border-gray-200">
      {cells.map((cell, i) => (
        <div key={i} className="px-2 py-1 flex-1 text-gray-700">{cell.trim()}</div>
      ))}
    </div>
  )
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }
