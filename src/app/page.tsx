import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
}

// Top states for foundation repair (by volume)
const TOP_STATES = [
  { name: 'Texas', slug: 'texas', abbr: 'TX' },
  { name: 'California', slug: 'california', abbr: 'CA' },
  { name: 'Florida', slug: 'florida', abbr: 'FL' },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA' },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC' },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH' },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI' },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA' },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL' },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA' },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN' },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO' },
]

const SERVICES = [
  { name: 'Pier & Beam Repair', slug: 'pier-and-beam-repair', icon: '🏗️' },
  { name: 'Slab Foundation Repair', slug: 'slab-foundation-repair', icon: '🧱' },
  { name: 'Basement Waterproofing', slug: 'basement-waterproofing', icon: '💧' },
  { name: 'Foundation Crack Repair', slug: 'foundation-crack-repair', icon: '🔨' },
  { name: 'House Leveling', slug: 'house-leveling', icon: '📐' },
  { name: 'Crawl Space Repair', slug: 'crawl-space-repair', icon: '🏠' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Trusted Foundation Repair Contractors
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Compare licensed professionals, get free estimates, and protect your home's foundation. 
            Serving all 50 states.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
              <input
                type="text"
                placeholder="Enter your city or ZIP code..."
                className="flex-1 px-6 py-4 text-gray-800 text-lg focus:outline-none"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 font-semibold transition-colors">
                Search
              </button>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Verified Contractors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span>Free Estimates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span>Licensed & Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Foundation Repair Services</h2>
          <p className="text-gray-600 text-center mb-10">Find specialists for your specific foundation issue</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link 
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group p-6 rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="text-lg font-semibold mt-3 group-hover:text-amber-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Find contractors →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Browse by State</h2>
          <p className="text-gray-600 text-center mb-10">Find foundation repair contractors in your area</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOP_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all"
              >
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  {state.abbr}
                </span>
                <span className="font-medium text-gray-800">{state.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/states" className="text-amber-600 hover:text-amber-700 font-medium">
              View all 50 states →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Search Your Area</h3>
              <p className="text-gray-600">Enter your city or ZIP code to find foundation repair contractors near you.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Compare Options</h3>
              <p className="text-gray-600">Review services, warranties, ratings, and pricing from multiple contractors.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Get Free Estimates</h3>
              <p className="text-gray-600">Contact contractors directly or request free quotes through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section (SEO content) */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Foundation Repair Costs in 2026</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Cost</p>
                <p className="text-3xl font-bold text-amber-600">$4,500 – $12,000</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600">Minor Repairs</p>
                <p className="text-3xl font-bold text-amber-600">$500 – $3,000</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-3">What affects the cost?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>Type of repair</strong> — Pier installation costs more than crack sealing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>Severity of damage</strong> — Minor cracks vs. major structural shifting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>Foundation type</strong> — Slab, pier & beam, or basement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>Your location</strong> — Soil conditions and labor costs vary by region</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>Accessibility</strong> — Easy access vs. confined spaces</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Foundation Repair Directory</h3>
              <p className="text-sm">Find and compare trusted foundation repair contractors across all 50 states.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Popular Services</h3>
              <ul className="space-y-1 text-sm">
                {SERVICES.slice(0, 4).map(s => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="hover:text-white transition-colors">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Top States</h3>
              <ul className="space-y-1 text-sm">
                {TOP_STATES.slice(0, 4).map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} className="hover:text-white transition-colors">
                      Foundation Repair in {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 Foundation Repair Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
