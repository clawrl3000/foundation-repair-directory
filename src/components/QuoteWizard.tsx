'use client'

import { useState, useCallback } from 'react'

// ── Issue types ─────────────────────────────────────────────────────────────
const ISSUES = [
  { id: 'cracks', label: 'Foundation Cracks', icon: 'healing', description: 'Visible cracks in walls, floors, or foundation' },
  { id: 'settling', label: 'Settling / Sinking', icon: 'terrain', description: 'Uneven floors, doors that won\'t close properly' },
  { id: 'bowing-walls', label: 'Bowing Walls', icon: 'warning', description: 'Basement or retaining walls leaning inward' },
  { id: 'water-issues', label: 'Water / Moisture', icon: 'water_drop', description: 'Basement leaks, standing water, or dampness' },
  { id: 'crawl-space', label: 'Crawl Space', icon: 'grid_guides', description: 'Sagging floors, musty smell, moisture underneath' },
  { id: 'other', label: 'Other / Not Sure', icon: 'help', description: 'Something else or need a professional opinion' },
]

// ── Urgency levels ──────────────────────────────────────────────────────────
const URGENCY = [
  { id: 'low', label: 'Planning Ahead', icon: 'calendar_month', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', description: 'No rush — researching options' },
  { id: 'medium', label: 'Within a Few Weeks', icon: 'schedule', color: 'text-amber-600 bg-amber-50 border-amber-200', description: 'Noticed issues, want to address soon' },
  { id: 'high', label: 'ASAP', icon: 'priority_high', color: 'text-orange-600 bg-orange-50 border-orange-200', description: 'Problems are getting worse' },
  { id: 'emergency', label: 'Emergency', icon: 'emergency', color: 'text-red-600 bg-red-50 border-red-200', description: 'Active damage or safety concern' },
]

export default function QuoteWizard({ state, stateName, defaultZip }: { state: string; stateName: string; defaultZip?: string }) {
  const [step, setStep] = useState(0)
  const [issues, setIssues] = useState<string[]>([])
  const [urgency, setUrgency] = useState('')
  const [zip, setZip] = useState(defaultZip || '')
  const [zipState, setZipState] = useState<string | null>(defaultZip ? stateName : null)
  const [zipError, setZipError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [animating, setAnimating] = useState(false)

  const totalSteps = 4

  const goTo = useCallback((next: number) => {
    setAnimating(true)
    setTimeout(() => {
      setStep(next)
      setAnimating(false)
    }, 200)
  }, [])

  const toggleIssue = (id: string) => {
    setIssues(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const canProceed = () => {
    switch (step) {
      case 0: return issues.length > 0
      case 1: return urgency !== ''
      case 2: return /^\d{5}$/.test(zip) && !zipError
      case 3: return name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '')
      default: return false
    }
  }

  // Auto-lookup state from ZIP
  const handleZipChange = async (value: string) => {
    setZip(value)
    setZipError('')
    setZipState(null)

    if (/^\d{5}$/.test(value)) {
      try {
        const res = await fetch(`/api/zip-lookup?zip=${value}`)
        if (res.ok) {
          const data = await res.json()
          setZipState(data.stateName || null)
        } else {
          setZipError('ZIP code not recognized')
        }
      } catch {
        // Silent fail — ZIP lookup is nice-to-have
      }
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setLoading(true)
    setError('')

    try {
      const issueLabels = issues.map(id => ISSUES.find(i => i.id === id)?.label || id).join(', ')
      const urgencyLabel = URGENCY.find(u => u.id === urgency)?.label || urgency

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          service_needed: issueLabels,
          zip_code: zip,
          state: state,
          notes: `Issues: ${issueLabels} | Urgency: ${urgencyLabel}${stateName ? ` | From: ${stateName}` : ''}`,
          source: 'quote-wizard',
        }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (!canProceed()) return
    if (step < totalSteps - 1) {
      goTo(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) goTo(step - 1)
  }

  const progressPct = success ? 100 : ((step + 1) / totalSteps) * 100

  // ── Success state ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-emerald-100 mb-4">
          <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">You&apos;re All Set!</h3>
        <p className="text-slate-600 mb-1">
          We&apos;ll connect you with licensed foundation repair contractors{stateName ? ` in ${stateName}` : ' in your area'}.
        </p>
        <p className="text-sm text-slate-500">Expect to hear back within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header + progress */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-amber-600">request_quote</span>
          <h3 className="font-display text-xl font-bold text-slate-900">Get Your Free Quote</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            {step + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className={`px-6 py-6 transition-all duration-200 ${animating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>

        {/* Step 0: What's the issue? */}
        {step === 0 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">What&apos;s going on with your foundation?</h4>
            <p className="text-sm text-slate-500 mb-5">Select all that apply.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ISSUES.map(i => {
                const selected = issues.includes(i.id)
                return (
                  <button
                    key={i.id}
                    onClick={() => toggleIssue(i.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      selected
                        ? 'border-amber-500 bg-amber-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      selected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {selected ? (
                        <span className="material-symbols-outlined text-xl">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-xl">{i.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-sm font-semibold block ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{i.label}</span>
                      <span className="text-xs text-slate-500 leading-tight">{i.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 1: How urgent? */}
        {step === 1 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">How urgent is this?</h4>
            <p className="text-sm text-slate-500 mb-5">This helps contractors prioritize your request.</p>
            <div className="space-y-3">
              {URGENCY.map(u => (
                <button
                  key={u.id}
                  onClick={() => setUrgency(u.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    urgency === u.id
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${u.color} transition-colors`}>
                    <span className="material-symbols-outlined text-xl">{u.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className={`text-sm font-semibold block ${urgency === u.id ? 'text-slate-900' : 'text-slate-700'}`}>{u.label}</span>
                    <span className="text-xs text-slate-500">{u.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: ZIP code */}
        {step === 2 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">Where is the property?</h4>
            <p className="text-sm text-slate-500 mb-5">We&apos;ll match you with contractors near you.</p>
            <div className="max-w-xs">
              <label htmlFor="quote-zip" className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
              <input
                id="quote-zip"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={e => handleZipChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your 5-digit ZIP"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-lg font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                autoComplete="postal-code"
              />
              {zipError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">error</span>
                  {zipError}
                </p>
              )}
              {zipState && (
                <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  {zipState}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact info */}
        {step === 3 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">How can contractors reach you?</h4>
            <p className="text-sm text-slate-500 mb-5">Provide at least an email or phone number.</p>
            <div className="space-y-4 max-w-sm">
              <div>
                <label htmlFor="quote-name" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  id="quote-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="quote-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  id="quote-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="quote-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  id="quote-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  autoComplete="tel"
                />
              </div>
              {!email.trim() && !phone.trim() && (
                <p className="text-xs text-slate-400">* Please provide at least one contact method</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 pb-6 pt-2">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            step === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className={`flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all ${
            canProceed() && !loading
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-amber-600/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
              Submitting...
            </>
          ) : step === totalSteps - 1 ? (
            <>
              Get My Quote
              <span className="material-symbols-outlined text-lg">send</span>
            </>
          ) : (
            <>
              Continue
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
