import Link from 'next/link'
import SmoothCounter from '@/components/SmoothCounter'

const TOP_STATES = [
  { name: 'Texas', slug: 'texas', abbr: 'TX', count: 847 },
  { name: 'California', slug: 'california', abbr: 'CA', count: 623 },
  { name: 'Florida', slug: 'florida', abbr: 'FL', count: 534 },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', count: 312 },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', count: 287 },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', count: 264 },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', count: 241 },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', count: 228 },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', count: 215 },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', count: 198 },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', count: 187 },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', count: 164 },
]

const SERVICES = [
  { name: 'Piering', slug: 'piering', icon: 'architecture', desc: 'Steel piers to stop your foundation from sinking. Permanent fix.' },
  { name: 'Slab Repair', slug: 'slab-repair', icon: 'layers', desc: 'Level and seal cracked concrete slabs. Restore your floors.' },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'water_drop', desc: 'Complete moisture control — sump pumps, vapor barriers, drainage.' },
  { name: 'Crawl Space', slug: 'crawl-space', icon: 'grid_guides', desc: 'Encapsulation and support to eliminate sagging floors and mold.' },
]

const COST_ITEMS = [
  { title: 'Minor Crack Repair', range: '$500–$2,500', desc: 'Sealing hairline and non-structural cracks.' },
  { title: 'Foundation Piering', range: '$4,000–$15,000+', desc: 'Steel or concrete piers to stabilize settling foundations.' },
  { title: 'Basement Wall Repair', range: '$2,000–$10,000', desc: 'Carbon fiber straps or wall anchors for bowing walls.' },
  { title: 'Slab Foundation Repair', range: '$3,000–$20,000+', desc: 'Polyurethane injection and slab leveling.' },
  { title: 'Crawl Space Repair', range: '$1,500–$8,000', desc: 'Encapsulation, waterproofing, and structural support.' },
  { title: 'Major Replacement', range: '$20,000–$75,000+', desc: 'Partial or full foundation replacement for severe damage.' },
]

interface FeaturedBusiness {
  id: string
  name: string
  slug: string
  rating: number
  reviewCount: number
  description: string | null
  city: string
  citySlug: string
  stateAbbr: string
  stateSlug: string
  services: { name: string; slug: string }[]
}

interface HomePageContentProps {
  featuredBusinesses: FeaturedBusiness[]
  onOpenLeadForm: (businessId?: string, businessName?: string) => void
}

export default function HomePageContent({ featuredBusinesses, onOpenLeadForm }: HomePageContentProps) {
  return (
    <>
      {/* ===== SECTION 1: HOW IT WORKS (white bg) ===== */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-white animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Get Quotes in 3 Steps <span className="text-primary">(Takes 2 Minutes)</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">
              No phone calls, no runaround. Enter your ZIP and let qualified contractors come to you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { number: '01', title: 'Enter Your ZIP', desc: 'Find licensed pros in your area instantly.', icon: 'location_on' },
              { number: '02', title: 'Compare Quotes', desc: 'Get up to 3 free estimates. No obligation.', icon: 'compare' },
              { number: '03', title: 'Hire & Fix', desc: 'Choose your contractor. Get it done right.', icon: 'construction' },
            ].map((step, i) => (
              <div key={i} className={`text-center group animate-on-scroll`}>
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-blue-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <span className="material-symbols-outlined text-3xl text-white">{step.icon}</span>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Get Your Free Quotes Now
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: COST GUIDE (light gray bg) ===== */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-slate-50 animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              What Does Foundation Repair <span className="text-primary">Cost?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">
              Know what to expect before you call. Costs vary by location and severity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COST_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl group-hover:shadow-xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-on-scroll card-hover">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <div className="text-2xl lg:text-3xl font-black text-amber-500 mb-3">{item.range}</div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6 animate-on-scroll"><em>These are national averages. Get exact local pricing from verified pros.</em></p>
          <div className="text-center mt-8 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              See What Pros in Your Area Charge
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SOCIAL PROOF (white bg) ===== */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-white animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Real Results from <span className="text-primary">Real Homeowners</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">
              See how homeowners like you saved thousands by comparing quotes through FoundationScout.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Found Mike's Foundation Repair through FoundationScout. $8,400 for what another company quoted $18K. Pier & beam, done in 3 days.",
                author: 'Sarah M.',
                location: 'Dallas, TX',
                service: 'Pier & beam foundation repair',
              },
              {
                quote: "Basement wall was bowing in. Got 3 quotes in one afternoon instead of spending a week calling around. Went with the middle quote — $6,200, carbon fiber straps. Wall's straight now.",
                author: 'John P.',
                location: 'Atlanta, GA',
                service: 'Basement wall stabilization',
              },
              {
                quote: "Crawl space was a mess — standing water, sagging floors. The contractor I found here quoted $4,800 and finished in 2 days. Other company wanted $11K for the same work.",
                author: 'Emily R.',
                location: 'Raleigh, NC',
                service: 'Crawl space encapsulation',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-on-scroll card-hover">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined fill-1 text-lg">star</span>
                  ))}
                </div>
                <blockquote className="text-slate-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="border-t border-slate-100 pt-4">
                  <div className="font-bold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                  <div className="text-xs text-slate-400 mt-1">{testimonial.service}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Find Your Local Pros Today
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: BROWSE BY STATE (light gray bg) ===== */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-slate-50 border-y border-slate-200 animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Browse Contractors <span className="text-primary">by State</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">
              Find licensed foundation repair professionals in your area.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-on-scroll">
            {TOP_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{state.name}</div>
                    <div className="text-sm text-slate-500">{state.count} contractors</div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 animate-on-scroll">
            <Link href="/states" className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-blue-800 transition-colors group">
              View All 50 States
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: SERVICES (dark navy bg) ===== */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a] animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
              Foundation Repair <span className="text-amber-400">Services</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto">
              Expert solutions for every foundation problem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="block group animate-on-scroll">
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl group-hover:border-amber-500/50 group-hover:shadow-xl group-hover:shadow-amber-500/10 transition-all duration-500">
                  <span className="material-symbols-outlined text-5xl text-amber-400 mb-6 block group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{service.name}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: URGENCY CTA (dark navy + red accents) ===== */}
      <section className="relative overflow-hidden py-24 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a] border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
        <div className="relative mx-auto max-w-5xl animate-on-scroll">
          <div className="text-center mb-12">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 animate-pulse">warning</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
              Every Month You Wait <span className="text-red-400">Costs You Thousands</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Foundation problems don&apos;t fix themselves. The average repair cost doubles every 18 months when left untreated.
            </p>
          </div>

          {/* Cost escalation timeline */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto animate-on-scroll">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-emerald-400 mb-2">$800</div>
              <div className="text-sm font-semibold text-slate-300">Month 0</div>
              <div className="text-xs text-slate-500 mt-1">Small crack</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-amber-400 mb-2">$8,500</div>
              <div className="text-sm font-semibold text-slate-300">Month 12</div>
              <div className="text-xs text-slate-500 mt-1">Structural settling</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-red-400 mb-2">$22,000+</div>
              <div className="text-sm font-semibold text-slate-300">Month 24</div>
              <div className="text-xs text-red-400/70 mt-1">Major structural damage</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Get Emergency Estimates Now
            </button>
            <Link href="/cost/texas/foundation-repair-cost" className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold py-5 px-10 rounded-xl transition-all text-lg">
              See Repair Costs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
