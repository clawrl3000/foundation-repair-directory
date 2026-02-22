import React from 'react'

interface ExpertBioProps {
  className?: string
  variant?: 'compact' | 'full'
}

/**
 * Directory trust signal — honest about what we are
 */
export default function ExpertBio({ className = '', variant = 'full' }: ExpertBioProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl text-amber-600" aria-hidden="true">search</span>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">About Our Directory</div>
            <div className="text-sm text-slate-600">We research and compile contractor data from public records, licensing databases, and verified reviews to help you find qualified pros.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className={`bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-4 py-2 mb-4">
            <span className="material-symbols-outlined text-xl text-amber-600" aria-hidden="true">manage_search</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">How We Build Our Directory</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Research-Backed Contractor Data</h2>
          <p className="text-slate-600">We do the homework so you don&apos;t have to</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl text-amber-600" aria-hidden="true">fact_check</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Public Records</h3>
            <p className="text-sm text-slate-600">Contractor listings sourced from state licensing boards, business registrations, and public databases.</p>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl text-amber-600" aria-hidden="true">reviews</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Verified Reviews</h3>
            <p className="text-sm text-slate-600">Ratings pulled from Google, BBB, and other trusted review platforms — not generated or fabricated.</p>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl text-amber-600" aria-hidden="true">update</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Regularly Updated</h3>
            <p className="text-sm text-slate-600">Directory data is refreshed regularly to keep listings accurate and up to date.</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            FoundationScout is a directory service — we help you find contractors, but we recommend always verifying credentials and getting multiple quotes before hiring.
          </p>
        </div>
      </div>
    </section>
  )
}

// Honest schema — we're a directory, not an engineering firm
export function generateExpertSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FoundationScout",
    "url": "https://foundationscout.com",
    "description": "Foundation repair contractor directory helping homeowners find qualified professionals through public records, licensing data, and verified reviews.",
    "publisher": {
      "@type": "Organization",
      "name": "FoundationScout"
    }
  }
}
