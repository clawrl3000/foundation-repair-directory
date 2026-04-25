'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ── State data with multipliers and soil info ──────────────────────────────
const STATES = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', multiplier: 0.90, soil: 'Clay-heavy soils in central regions increase settling risk' },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', multiplier: 1.35, soil: 'Permafrost and frost heave create unique foundation challenges' },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', multiplier: 0.95, soil: 'Expansive clay soils in the Valley cause significant movement' },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', multiplier: 0.85, soil: 'Mixed clay and loam soils with moderate expansion potential' },
  { name: 'California', slug: 'california', abbr: 'CA', multiplier: 1.35, soil: 'Seismic activity and expansive clay soils in many regions' },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', multiplier: 1.10, soil: 'Bentonite clay soils along Front Range are highly expansive' },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', multiplier: 1.20, soil: 'Rocky terrain with frost heave concerns in winter' },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', multiplier: 1.10, soil: 'Coastal sandy soils with moderate settlement risk' },
  { name: 'Florida', slug: 'florida', abbr: 'FL', multiplier: 0.90, soil: 'Sandy soils and sinkholes create unique foundation risks' },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', multiplier: 0.90, soil: 'Red clay soils in northern regions expand significantly' },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', multiplier: 1.45, soil: 'Volcanic soil and high moisture create ongoing challenges' },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', multiplier: 0.95, soil: 'Loam and clay mix with frost heave in northern areas' },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', multiplier: 1.05, soil: 'Glacial clay soils in Chicago area are moderately expansive' },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', multiplier: 0.95, soil: 'Glacial till with clay layers cause uneven settling' },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', multiplier: 0.90, soil: 'Rich loam over clay subsoil; moderate expansion potential' },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', multiplier: 0.90, soil: 'Expansive clay soils in eastern regions' },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', multiplier: 0.90, soil: 'Limestone karst terrain creates sinkhole and settling risk' },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', multiplier: 0.90, soil: 'Soft alluvial soils with high moisture; significant settling' },
  { name: 'Maine', slug: 'maine', abbr: 'ME', multiplier: 1.10, soil: 'Rocky soil with deep frost lines increase foundation costs' },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', multiplier: 1.15, soil: 'Mixed soils; clay-heavy in central areas' },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', multiplier: 1.25, soil: 'Rocky terrain and older construction drive up repair costs' },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', multiplier: 1.00, soil: 'Glacial clay soils and deep frost lines' },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', multiplier: 1.00, soil: 'Deep frost lines and clay soils in southern regions' },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', multiplier: 0.85, soil: 'Yazoo clay in the Delta is among the most expansive nationally' },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', multiplier: 0.95, soil: 'Expansive clay soils throughout central Missouri' },
  { name: 'Montana', slug: 'montana', abbr: 'MT', multiplier: 1.00, soil: 'Frost heave and clay pockets in valley areas' },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', multiplier: 0.90, soil: 'Loess soils that compact and settle over time' },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', multiplier: 1.05, soil: 'Desert caliche and expansive clay in Las Vegas Valley' },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', multiplier: 1.15, soil: 'Granite bedrock and deep frost lines' },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', multiplier: 1.30, soil: 'Mixed soils; high labor costs drive up overall pricing' },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', multiplier: 0.90, soil: 'Adobe and expansive clay soils with low moisture' },
  { name: 'New York', slug: 'new-york', abbr: 'NY', multiplier: 1.30, soil: 'Rocky terrain upstate; high costs in metro areas' },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', multiplier: 0.95, soil: 'Red clay in Piedmont region causes significant heaving' },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', multiplier: 0.95, soil: 'Deep frost lines and glacial clay soils' },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', multiplier: 0.95, soil: 'Glacial clay till throughout much of the state' },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', multiplier: 0.85, soil: 'Highly expansive red clay soils statewide' },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', multiplier: 1.10, soil: 'High moisture and clay soils in the Willamette Valley' },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', multiplier: 1.10, soil: 'Varied terrain; limestone karst in central regions' },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', multiplier: 1.20, soil: 'Coastal soils with frost heave and high water tables' },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', multiplier: 0.90, soil: 'Sandy coastal soils and clay in upstate regions' },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', multiplier: 0.90, soil: 'Pierre shale and expansive clay in western areas' },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', multiplier: 0.90, soil: 'Clay-heavy soils and limestone karst across the state' },
  { name: 'Texas', slug: 'texas', abbr: 'TX', multiplier: 0.90, soil: 'Highly expansive black clay (vertisol) across central Texas' },
  { name: 'Utah', slug: 'utah', abbr: 'UT', multiplier: 1.00, soil: 'Lake sediment clays along the Wasatch Front' },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', multiplier: 1.10, soil: 'Rocky terrain with deep frost lines' },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', multiplier: 1.05, soil: 'Red clay in Piedmont; expansive soils near coast' },
  { name: 'Washington', slug: 'washington', abbr: 'WA', multiplier: 1.15, soil: 'Glacial till and high moisture in western regions' },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', multiplier: 0.90, soil: 'Hilly terrain with clay and shale soils' },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', multiplier: 0.95, soil: 'Glacial clay and deep frost lines' },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', multiplier: 0.95, soil: 'Bentonite clay deposits and frost heave' },
]

const FOUNDATION_TYPES = [
  { id: 'slab', label: 'Slab-on-Grade', icon: 'layers', factor: 1.0 },
  { id: 'pier-beam', label: 'Pier & Beam', icon: 'foundation', factor: 1.15 },
  { id: 'basement', label: 'Basement', icon: 'home', factor: 1.35 },
  { id: 'crawl-space', label: 'Crawl Space', icon: 'grid_guides', factor: 1.10 },
]

const SEVERITY_LEVELS = [
  { id: 'minor', label: 'Minor Cracks', icon: 'healing', description: 'Hairline cracks < 1/4 inch, cosmetic concerns', baseCost: 1200, factor: 1.0 },
  { id: 'moderate', label: 'Moderate Settling', icon: 'terrain', description: 'Cracks 1/4–1/2 inch, doors sticking, minor slopes', baseCost: 4500, factor: 2.2 },
  { id: 'major', label: 'Major Structural', icon: 'warning', description: 'Cracks > 1/2 inch, visible bowing, floor separation', baseCost: 12000, factor: 5.0 },
  { id: 'emergency', label: 'Emergency', icon: 'error', description: 'Active movement, wall separation, safety hazard', baseCost: 22000, factor: 8.5 },
]

const STORIES_OPTIONS = [
  { id: '1', label: '1 Story', factor: 1.0 },
  { id: '2', label: '2 Stories', factor: 1.20 },
  { id: '3+', label: '3+ Stories', factor: 1.45 },
]

// ── Pricing calculation ─────────────────────────────────────────────────────
interface CalcResult {
  lowEstimate: number
  highEstimate: number
  labor: number
  materials: number
  permits: number
  engineering: number
  stateMultiplier: number
  stateName: string
  stateSlug: string
  soil: string
  timeline: string
  severity: string
}

function calculateCost(
  stateIdx: number,
  foundationType: string,
  severity: string,
  sqft: number,
  stories: string
): CalcResult {
  const state = STATES[stateIdx]
  const foundation = FOUNDATION_TYPES.find(f => f.id === foundationType)!
  const sev = SEVERITY_LEVELS.find(s => s.id === severity)!
  const story = STORIES_OPTIONS.find(s => s.id === stories)!

  // Base cost from severity
  let base = sev.baseCost

  // Square footage factor (normalized around 1500 sqft)
  const sqftFactor = 0.7 + (sqft / 1500) * 0.3

  // Calculate mid-range estimate
  const mid = base * foundation.factor * story.factor * sqftFactor * state.multiplier

  // Low/high range: -20% to +35%
  const lowEstimate = Math.round(mid * 0.80 / 100) * 100
  const highEstimate = Math.round(mid * 1.35 / 100) * 100

  // Component breakdown (of mid estimate)
  const labor = Math.round(mid * 0.45)
  const materials = Math.round(mid * 0.30)
  const permits = Math.round(mid * 0.10)
  const engineering = Math.round(mid * 0.15)

  // Timeline based on severity
  const timelines: Record<string, string> = {
    minor: '1–3 days',
    moderate: '3–7 days',
    major: '1–3 weeks',
    emergency: '1–4 weeks (expedited scheduling available)',
  }

  return {
    lowEstimate,
    highEstimate,
    labor,
    materials,
    permits,
    engineering,
    stateMultiplier: state.multiplier,
    stateName: state.name,
    stateSlug: state.slug,
    soil: state.soil,
    timeline: timelines[severity],
    severity: sev.label,
  }
}

// ── Format currency ──────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CostCalculator() {
  // Read ?state=<slug> from URL — when linked from a state cost page, pre-select
  // the state and skip the user past step 0.
  const searchParams = useSearchParams()
  const prefillStateSlug = searchParams?.get('state')?.toLowerCase() || null
  const prefillStateIdx = prefillStateSlug
    ? STATES.findIndex(s => s.slug === prefillStateSlug)
    : -1
  const hasPrefill = prefillStateIdx >= 0

  const [step, setStep] = useState(hasPrefill ? 1 : 0)
  const [stateIdx, setStateIdx] = useState(hasPrefill ? prefillStateIdx : -1)
  const [foundationType, setFoundationType] = useState('')
  const [severity, setSeverity] = useState('')
  const [sqft, setSqft] = useState(1500)
  const [stories, setStories] = useState('')
  const [result, setResult] = useState<CalcResult | null>(null)
  const [animating, setAnimating] = useState(false)

  const totalSteps = 5

  const goTo = useCallback((next: number) => {
    setAnimating(true)
    setTimeout(() => {
      setStep(next)
      setAnimating(false)
    }, 250)
  }, [])

  const canProceed = () => {
    switch (step) {
      case 0: return stateIdx >= 0
      case 1: return foundationType !== ''
      case 2: return severity !== ''
      case 3: return sqft >= 500 && sqft <= 10000
      case 4: return stories !== ''
      default: return false
    }
  }

  const handleNext = () => {
    if (!canProceed()) return
    if (step < totalSteps - 1) {
      goTo(step + 1)
    } else {
      // Calculate
      const res = calculateCost(stateIdx, foundationType, severity, sqft, stories)
      setResult(res)
      goTo(totalSteps)
    }
  }

  const handleBack = () => {
    if (step > 0) goTo(step - 1)
  }

  const handleReset = () => {
    setResult(null)
    setStateIdx(-1)
    setFoundationType('')
    setSeverity('')
    setSqft(1500)
    setStories('')
    goTo(0)
  }

  const progressPct = result ? 100 : ((step) / totalSteps) * 100

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-400">
            {result ? 'Your Estimate' : `Step ${step + 1} of ${totalSteps}`}
          </span>
          <span className="text-sm font-medium text-amber-500">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2 bg-dominant-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps container */}
      <div className={`transition-all duration-250 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

        {/* Step 0: State selection */}
        {step === 0 && !result && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-2">Where is your property located?</h2>
            <p className="text-slate-400 mb-6">Foundation repair costs vary significantly by region due to labor rates, soil conditions, and permit requirements.</p>
            <select
              value={stateIdx}
              onChange={e => setStateIdx(Number(e.target.value))}
              className="w-full bg-dominant-700 border border-dominant-700 text-white rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value={-1} disabled>Select your state...</option>
              {STATES.map((s, i) => (
                <option key={s.abbr} value={i}>{s.name}</option>
              ))}
            </select>
            {stateIdx >= 0 && (
              <div className="mt-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">terrain</span>
                <div>
                  <p className="text-sm font-semibold text-amber-400">{STATES[stateIdx].name} Soil Conditions</p>
                  <p className="text-sm text-slate-300 mt-1">{STATES[stateIdx].soil}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Foundation type */}
        {step === 1 && !result && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-2">What type of foundation?</h2>
            <p className="text-slate-400 mb-6">Different foundation types require different repair methods and materials.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FOUNDATION_TYPES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFoundationType(f.id)}
                  className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                    foundationType === f.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-dominant-700 bg-dominant-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    foundationType === f.id ? 'bg-amber-500 text-slate-900' : 'bg-dominant-700 text-slate-400'
                  } transition-colors`}>
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <span className={`text-lg font-semibold ${foundationType === f.id ? 'text-white' : 'text-slate-300'}`}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Severity */}
        {step === 2 && !result && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-2">How severe is the damage?</h2>
            <p className="text-slate-400 mb-6">Select the option that best describes the current condition of your foundation.</p>
            <div className="space-y-3">
              {SEVERITY_LEVELS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={`w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                    severity === s.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-dominant-700 bg-dominant-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    severity === s.id ? 'bg-amber-500 text-slate-900' : 'bg-dominant-700 text-slate-400'
                  } transition-colors mt-0.5`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <div>
                    <span className={`text-lg font-semibold block ${severity === s.id ? 'text-white' : 'text-slate-300'}`}>{s.label}</span>
                    <span className="text-sm text-slate-400">{s.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Square footage */}
        {step === 3 && !result && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-2">What is your home&apos;s square footage?</h2>
            <p className="text-slate-400 mb-6">Larger homes typically require more piers, materials, and labor time.</p>
            <div className="bg-dominant-700/50 border border-dominant-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="sqft-input" className="text-slate-300 font-medium">Square Footage</label>
                <div className="flex items-center gap-2">
                  <input
                    id="sqft-input"
                    type="number"
                    min={500}
                    max={10000}
                    step={100}
                    value={sqft}
                    onChange={e => {
                      const v = parseInt(e.target.value)
                      if (!isNaN(v)) setSqft(Math.min(10000, Math.max(500, v)))
                    }}
                    className="w-24 bg-dominant-800 border border-dominant-700 text-white text-right rounded-lg px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-slate-400">sq ft</span>
                </div>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={sqft}
                onChange={e => setSqft(Number(e.target.value))}
                className="w-full h-2 bg-dominant-700 rounded-full appearance-none cursor-pointer accent-amber-500"
                aria-label="Home square footage"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>500 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Stories */}
        {step === 4 && !result && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-2">How many stories?</h2>
            <p className="text-slate-400 mb-6">Multi-story homes place more load on the foundation, affecting repair scope and cost.</p>
            <div className="grid grid-cols-3 gap-4">
              {STORIES_OPTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStories(s.id)}
                  className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-200 ${
                    stories === s.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-dominant-700 bg-dominant-700/50 hover:border-slate-500'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl ${stories === s.id ? 'text-amber-500' : 'text-slate-400'}`}>
                    {s.id === '1' ? 'home' : s.id === '2' ? 'home_work' : 'location_city'}
                  </span>
                  <span className={`text-lg font-semibold ${stories === s.id ? 'text-white' : 'text-slate-300'}`}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && step === totalSteps && (
          <div className="space-y-6">
            {/* Main estimate */}
            <div className="text-center bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-500/20 rounded-2xl p-8">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Estimated Cost Range</p>
              <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-1">
                {fmt(result.lowEstimate)} &ndash; {fmt(result.highEstimate)}
              </p>
              <p className="text-slate-400 mt-2">
                for {result.severity.toLowerCase()} repair in <span className="text-amber-400 font-semibold">{result.stateName}</span>
              </p>
            </div>

            {/* Cost breakdown */}
            <div className="bg-dominant-700/50 border border-dominant-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">payments</span>
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Labor', value: result.labor, pct: 45, icon: 'engineering' },
                  { label: 'Materials', value: result.materials, pct: 30, icon: 'construction' },
                  { label: 'Engineering & Inspection', value: result.engineering, pct: 15, icon: 'architecture' },
                  { label: 'Permits & Fees', value: result.permits, pct: 10, icon: 'gavel' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-base text-slate-500">{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{fmt(item.value)} <span className="text-slate-500 font-normal">({item.pct}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-dominant-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional multiplier */}
            <div className="bg-dominant-700/50 border border-dominant-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">map</span>
                Regional Cost Factor: {result.stateMultiplier}x
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                {result.stateMultiplier > 1.1
                  ? `${result.stateName} has above-average foundation repair costs due to higher labor rates, stricter permit requirements, and regional soil conditions.`
                  : result.stateMultiplier < 0.95
                  ? `${result.stateName} has below-average foundation repair costs compared to the national average, though soil conditions can still drive costs up.`
                  : `${result.stateName} has average foundation repair costs in line with national pricing.`
                }
              </p>
              <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">terrain</span>
                <p className="text-sm text-slate-300"><strong className="text-amber-400">Soil factor:</strong> {result.soil}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-dominant-700/50 border border-dominant-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">schedule</span>
                Estimated Timeline
              </h3>
              <p className="text-2xl font-semibold text-white">{result.timeline}</p>
              <p className="text-sm text-slate-400 mt-1">Actual duration depends on weather, permit processing, and contractor availability in {result.stateName}.</p>
            </div>

            {/* Recommended next steps */}
            <div className="bg-dominant-700/50 border border-dominant-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">fact_check</span>
                Recommended Next Steps
              </h3>
              <ol className="space-y-3">
                {[
                  { icon: 'search', text: 'Get 3+ quotes from licensed contractors in your area to compare pricing' },
                  { icon: 'engineering', text: 'Schedule a professional structural engineering inspection ($300–$800)' },
                  { icon: 'verified', text: 'Verify contractor licenses, insurance, and warranty terms before signing' },
                  { icon: 'gavel', text: 'Check if your homeowner\'s insurance covers any portion of the repair' },
                  { icon: 'calendar_month', text: 'Act soon — foundation damage typically worsens and costs increase 15–20% per year' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-900 text-xs font-bold mt-0.5">{i + 1}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <Link
              href={`/${result.stateSlug}`}
              className="flex items-center justify-center gap-3 w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg py-5 px-8 rounded-2xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
              Find Contractors in {result.stateName}
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>

            {/* Recalculate */}
            <button
              onClick={handleReset}
              className="w-full text-center text-sm text-slate-400 hover:text-amber-400 transition-colors py-2"
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">refresh</span>
              Recalculate with different inputs
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons (not shown on result) */}
      {!result && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              step === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white hover:bg-dominant-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              canProceed()
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20'
                : 'bg-dominant-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {step === totalSteps - 1 ? 'Calculate Cost' : 'Continue'}
            <span className="material-symbols-outlined text-lg">{step === totalSteps - 1 ? 'calculate' : 'arrow_forward'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
