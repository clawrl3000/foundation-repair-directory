import Link from 'next/link'
import SmoothCounter from '@/components/SmoothCounter'
import AnimatedFAQ from '@/components/AnimatedFAQ'

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
  { title: 'Minor Crack Repair', range: '$500–$2,500', desc: 'Sealing hairline and non-structural cracks.', magnitude: 5 },
  { title: 'Foundation Piering', range: '$4,000–$15,000+', desc: 'Steel or concrete piers to stabilize settling foundations.', magnitude: 35 },
  { title: 'Basement Wall Repair', range: '$2,000–$10,000', desc: 'Carbon fiber straps or wall anchors for bowing walls.', magnitude: 25 },
  { title: 'Slab Foundation Repair', range: '$3,000–$20,000+', desc: 'Polyurethane injection and slab leveling.', magnitude: 45 },
  { title: 'Crawl Space Repair', range: '$1,500–$8,000', desc: 'Encapsulation, waterproofing, and structural support.', magnitude: 18 },
  { title: 'Major Replacement', range: '$20,000–$75,000+', desc: 'Partial or full foundation replacement for severe damage.', magnitude: 100 },
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

interface FAQItem {
  question: string
  answer: string
}

interface HomePageContentProps {
  featuredBusinesses: FeaturedBusiness[]
  onOpenLeadForm: (businessId?: string, businessName?: string) => void
  faqs?: FAQItem[]
}

export default function HomePageContent({ featuredBusinesses, onOpenLeadForm, faqs = [] }: HomePageContentProps) {
  return (
    <>
      {/* ===== SECTION 1: HOW IT WORKS (white bg) ===== */}
      <section id="main-content" className="py-20 lg:py-28 px-6 lg:px-8 bg-white section-depth animate-on-scroll">
        {/* Midground: ambient gradient blobs */}
        <div className="section-ambient">
          <div className="absolute -bottom-24 -left-32 w-[500px] h-[400px] rounded-full bg-amber-400/[0.07] blur-3xl" />
          <div className="absolute -top-20 -right-24 w-[400px] h-[350px] rounded-full bg-slate-400/[0.08] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl section-content">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-3 leading-[1.15]">
              Get Quotes in 3 Steps
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200/60 px-3.5 py-1.5 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
              Takes 2 minutes
            </span>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              No phone calls, no runaround. Tell us your issue and let qualified contractors come to you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { number: '01', title: 'Describe Your Issue', desc: 'Tell us what\'s going on — takes 2 minutes.', icon: 'edit_note' },
              { number: '02', title: 'Compare Quotes', desc: 'Get up to 3 estimates. No obligation.', icon: 'compare' },
              { number: '03', title: 'Hire & Fix', desc: 'Choose your contractor. Get it done right.', icon: 'construction' },
            ].map((step, i) => (
              <div key={i} className={`text-center group animate-on-scroll relative`}>
                {/* Connector line between steps (desktop only) */}
                {i < 2 && (
                  <div className="step-connector hidden md:block" />
                )}
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto relative z-10">
                    {/* Animated SVG ring — draws when scrolled into view */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90 step-ring-svg"
                      viewBox="0 0 80 80"
                      aria-hidden="true"
                      style={{ animationDelay: `${i * 0.8}s` }}
                    >
                      <circle cx="40" cy="40" r="38" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                      <circle
                        cx="40" cy="40" r="38"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="step-ring-draw"
                        style={{ animationDelay: `${i * 0.8}s` }}
                      />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/10">
                      <span className="material-symbols-outlined text-4xl text-amber-500 group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                    </div>
                  </div>
                  <span className="block mt-3 text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="group inline-flex flex-col items-center gap-1"
            >
              <span className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">request_quote</span>
                Get Your Scout Report
              </span>
              <span className="text-xs text-slate-400 mt-1">Takes 2 minutes &middot; No obligation</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: COST GUIDE (light gray bg) ===== */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[#f7f6f3] border-t border-slate-200/60 section-depth animate-on-scroll">
        {/* Midground: cooler ambient for contrast with section above */}
        <div className="section-ambient">
          <div className="absolute -top-16 -left-20 w-[350px] h-[300px] rounded-full bg-amber-300/[0.06] blur-3xl" />
          <div className="absolute -bottom-20 -right-28 w-[450px] h-[350px] rounded-full bg-slate-400/[0.07] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl section-content">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.15]">
              What Does Foundation Repair <span className="text-amber-600">Cost?</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Know what to expect before you call. Costs vary by location and severity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COST_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg hover:border-amber-500/30 transition-all duration-300 animate-on-scroll card-hover card-elevated group">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <div className="text-2xl lg:text-3xl font-bold font-mono text-amber-500 mb-2 tracking-tight">{item.range}</div>
                <div className="mb-3">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 transition-all duration-1000 ease-out group-hover:opacity-100 opacity-70"
                      style={{ width: `${item.magnitude}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6 animate-on-scroll"><em>These are national averages. Get exact local pricing from verified pros.</em></p>
          <div className="text-center mt-8 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              See What Pros in Your Area Charge
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SOCIAL PROOF (white bg) ===== */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-white border-t border-slate-200/60 section-depth animate-on-scroll">
        {/* Midground: warm ambient — trust/comfort zone */}
        <div className="section-ambient">
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-amber-300/[0.06] blur-3xl" />
          <div className="absolute -top-24 right-1/4 w-[300px] h-[250px] rounded-full bg-emerald-300/[0.05] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl section-content">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.15]">
              Real Results from <span className="text-amber-600">Real Homeowners</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
                saved: '$9,600',
              },
              {
                quote: "Basement wall was bowing in. Got 3 quotes in one afternoon instead of spending a week calling around. Went with the middle quote — $6,200, carbon fiber straps. Wall's straight now.",
                author: 'John P.',
                location: 'Atlanta, GA',
                service: 'Basement wall stabilization',
                saved: '$4,800',
              },
              {
                quote: "Crawl space was a mess — standing water, sagging floors. The contractor I found here quoted $4,800 and finished in 2 days. Other company wanted $11K for the same work.",
                author: 'Emily R.',
                location: 'Raleigh, NC',
                service: 'Crawl space encapsulation',
                saved: '$6,200',
              },
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-card bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 animate-on-scroll relative overflow-hidden card-elevated group">
                {/* Decorative quote mark */}
                <span className="quote-decoration group-hover:text-amber-500/25 group-hover:scale-110 transition-all duration-500 origin-top-left" aria-hidden="true">&ldquo;</span>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400" role="img" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className="material-symbols-outlined fill-1 text-lg" aria-hidden="true">star</span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      Saved {testimonial.saved}
                    </span>
                  </div>
                  <blockquote className="text-slate-700 mb-6 leading-relaxed text-[15px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-700 font-bold text-sm">{testimonial.author.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{testimonial.author}</div>
                      <div className="text-xs text-slate-500">{testimonial.location} &middot; {testimonial.service}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              Find Your Local Pros Today
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: BROWSE BY STATE (light gray bg) ===== */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[#f7f6f3] border-t border-slate-200/60 section-depth animate-on-scroll">
        {/* Midground: centered ambient halo */}
        <div className="section-ambient">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-slate-300/[0.07] blur-3xl" />
          <div className="absolute -bottom-16 -left-24 w-[350px] h-[300px] rounded-full bg-amber-300/[0.05] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl section-content">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.15]">
              Browse Contractors <span className="text-amber-600">by State</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Find licensed foundation repair professionals in your area.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-on-scroll">
            {TOP_STATES.map((state) => {
              const maxCount = 847
              const barWidth = Math.round((state.count / maxCount) * 100)
              return (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  className="block p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition-all duration-300 group card-elevated"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{state.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{state.count} pros</div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" aria-hidden="true">arrow_forward</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="state-count-bar h-full group-hover:opacity-100 opacity-50 transition-opacity"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8 animate-on-scroll">
            <Link href="/states" className="inline-flex items-center gap-2 text-lg font-semibold text-amber-600 hover:text-amber-700 transition-colors group">
              View All 50 States
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: SERVICES (dark navy bg) ===== */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[#0f172a] border-t border-slate-700 animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
              Foundation Repair <span className="text-amber-400">Services</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Expert solutions for every foundation problem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="block group animate-on-scroll">
                <div className="service-glow-card bg-slate-800/50 border border-slate-700 p-8 rounded-2xl group-hover:border-amber-500/50 group-hover:shadow-xl group-hover:shadow-amber-500/10 transition-all duration-500 relative">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                      <span className="material-symbols-outlined text-3xl text-amber-400 group-hover:scale-110 transition-transform duration-500">
                        {service.icon}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">{service.name}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{service.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400/70 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                      Learn more
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: FAQ (white bg) ===== */}
      {faqs.length > 0 && (
        <section className="py-20 lg:py-28 px-6 lg:px-8 bg-white border-t border-slate-200/60 section-depth animate-on-scroll">
          {/* Midground: minimal ambient — reading section stays clean */}
          <div className="section-ambient">
            <div className="absolute -bottom-20 right-1/4 w-[400px] h-[300px] rounded-full bg-slate-300/[0.06] blur-3xl" />
          </div>
          <div className="mx-auto max-w-4xl section-content">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.15]">
                Common <span className="text-amber-600">Questions</span>
              </h2>
              <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Everything homeowners ask before hiring a foundation repair contractor.
              </p>
            </div>
            <AnimatedFAQ items={faqs} title="" className="animate-on-scroll" />
          </div>
        </section>
      )}

      {/* ===== SECTION 7: URGENCY CTA (dark navy + red accents) ===== */}
      <section className="relative overflow-hidden py-24 lg:py-28 px-6 lg:px-8 bg-[#0f172a] border-t border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
        <div className="relative mx-auto max-w-5xl animate-on-scroll">
          <div className="text-center mb-12">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 animate-pulse">warning</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Every Month You Wait <span className="text-red-400">Costs You Thousands</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Foundation problems don&apos;t fix themselves. The average repair cost doubles every 18 months when left untreated.
            </p>
          </div>

          {/* Cost escalation timeline */}
          <div className="timeline-connector mb-12 max-w-2xl mx-auto animate-on-scroll">
            <div className="grid grid-cols-3 gap-6 relative">
              <div className="timeline-node text-center">
                <div className="w-4 h-4 rounded-full bg-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-400/30 ring-4 ring-emerald-400/20" />
                <div className="text-3xl lg:text-4xl font-bold font-mono text-emerald-400 mb-2">$800</div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Month 0</div>
                <div className="text-[11px] text-slate-500 mt-1">Small crack</div>
              </div>
              <div className="timeline-node text-center">
                <div className="w-4 h-4 rounded-full bg-amber-400 mx-auto mb-4 shadow-lg shadow-amber-400/30 ring-4 ring-amber-400/20" />
                <div className="text-3xl lg:text-4xl font-bold font-mono text-amber-400 mb-2">$8,500</div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Month 12</div>
                <div className="text-[11px] text-slate-500 mt-1">Structural settling</div>
              </div>
              <div className="timeline-node text-center">
                <div className="w-4 h-4 rounded-full bg-red-400 mx-auto mb-4 shadow-lg shadow-red-400/30 ring-4 ring-red-400/20 animate-pulse" />
                <div className="text-3xl lg:text-4xl font-bold font-mono text-red-400 mb-2">$22,000+</div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Month 24</div>
                <div className="text-[11px] text-red-400/70 mt-1">Major structural damage</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-xl text-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] shadow-lg"
            >
              Get Emergency Estimates Now
            </button>
            <Link href="/cost/texas/foundation-repair-cost" className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold py-5 px-10 rounded-xl transition-all text-lg hover:-translate-y-0.5 active:translate-y-0">
              See Repair Costs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
