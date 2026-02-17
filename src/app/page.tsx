import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
}

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
  { name: 'Pier & Beam Repair', slug: 'pier-and-beam-repair', icon: 'architecture', desc: 'Stabilize settling pier & beam foundations with steel or concrete piers' },
  { name: 'Slab Foundation Repair', slug: 'slab-foundation-repair', icon: 'layers', desc: 'Fix cracking and shifting concrete slab foundations' },
  { name: 'Basement Waterproofing', slug: 'basement-waterproofing', icon: 'water_drop', desc: 'Prevent water damage with interior and exterior drainage systems' },
  { name: 'Foundation Crack Repair', slug: 'foundation-crack-repair', icon: 'build', desc: 'Seal and repair structural and non-structural foundation cracks' },
  { name: 'House Leveling', slug: 'house-leveling', icon: 'straighten', desc: 'Level uneven floors caused by foundation settlement' },
  { name: 'Crawl Space Repair', slug: 'crawl-space-repair', icon: 'grid_guides', desc: 'Encapsulation, support jacks, and moisture control' },
]

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Navigation - Sticky Header with Blur */}
      <header className="sticky top-0 z-50 w-full sticky-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-2xl">foundation</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Foundation<span className="text-primary">Dir</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">Find Contractors</a>
            <a className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">For Pros</a>
            <a className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">Resources</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="text-sm font-bold text-white hover:text-primary transition-colors">Login</button>
            <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Join as Pro
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative hero-gradient overflow-hidden border-b border-glass-stroke py-20 lg:py-32">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
              <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Certified & Licensed Networks Only</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
              Find Trusted Foundation <br className="hidden lg:block"/> Repair Experts Near You
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
              Compare the top-rated local specialists in minutes. Verified reviews. <br className="hidden sm:block"/> Expert analysis. Guaranteed structural integrity.
            </p>

            {/* Search Box */}
            <div className="mx-auto max-w-xl">
              <div className="search-bar flex flex-col sm:flex-row gap-3 p-2 shadow-2xl">
                <div className="relative flex flex-1 items-center">
                  <span className="material-symbols-outlined absolute left-4 text-slate-500">location_on</span>
                  <input 
                    className="w-full rounded-lg border-0 bg-transparent py-4 pl-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="Enter ZIP code" 
                    type="text"
                  />
                </div>
                <button className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base font-bold shadow-lg shadow-amber-accent/10">
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 trust-stats">
              <div className="trust-stat">
                <span className="text-2xl font-bold text-white">10,000+</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Verified Pros</span>
              </div>
              <div className="trust-stat">
                <span className="text-2xl font-bold text-white">50</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">States Covered</span>
              </div>
              <div className="trust-stat">
                <span className="text-2xl font-bold text-white">2M+</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Homes Saved</span>
              </div>
              <div className="trust-stat">
                <span className="text-2xl font-bold text-white">4.9/5</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">User Rating</span>
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px]"></div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-accent/5 blur-[120px]"></div>
        </section>

        {/* Featured Contractors */}
        <section className="py-20 lg:py-24" style={{ background: 'var(--bg-primary)' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="section-header">Top-Rated Local Specialists</h2>
                <p className="section-subtext">Showing the highest-rated foundation experts currently available in your area.</p>
              </div>
              <button className="flex items-center gap-2 text-primary font-bold hover:underline">
                View All Contractors
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="contractor-card group">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">foundation</span>
                  </div>
                  <div className="absolute top-4 right-4 premium-badge">
                    Premium Partner
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Precision Foundation Pros</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-accent">
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">(124 reviews)</span>
                      </div>
                    </div>
                    <div className="verified-badge">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="service-tag">Slab Jacking</span>
                    <span className="service-tag">Pier & Beam</span>
                    <span className="service-tag">Waterproofing</span>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button className="btn-primary flex-1 py-3 text-sm font-bold transition-colors">
                      Contact Now
                    </button>
                    <button className="btn-secondary flex items-center justify-center px-4 py-3 transition-colors">
                      <span className="material-symbols-outlined">info</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="contractor-card group">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">engineering</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Solid Ground Engineering</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-accent">
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm text-slate-500">star</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">(98 reviews)</span>
                      </div>
                    </div>
                    <div className="verified-badge">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="service-tag">Leveling</span>
                    <span className="service-tag">Crack Repair</span>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button className="btn-primary flex-1 py-3 text-sm font-bold transition-colors">
                      Contact Now
                    </button>
                    <button className="btn-secondary flex items-center justify-center px-4 py-3 transition-colors">
                      <span className="material-symbols-outlined">info</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="contractor-card group">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">home_repair_service</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Atlas Pier Specialists</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-accent">
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                          <span className="material-symbols-outlined text-sm star-filled">star</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">(56 reviews)</span>
                      </div>
                    </div>
                    <div className="verified-badge">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="service-tag">Basement Repair</span>
                    <span className="service-tag">Sealing</span>
                    <span className="service-tag">Helical Piers</span>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button className="btn-primary flex-1 py-3 text-sm font-bold transition-colors">
                      Contact Now
                    </button>
                    <button className="btn-secondary flex items-center justify-center px-4 py-3 transition-colors">
                      <span className="material-symbols-outlined">info</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repair Types Section */}
        <section className="py-20 lg:py-24" style={{ background: 'var(--bg-secondary)' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <h2 className="section-header">Common Foundation Repair Types</h2>
              <p className="section-subtext max-w-2xl mx-auto">
                Understanding the right solution for your home is the first step toward a permanent fix.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.slice(0, 4).map((service) => (
                <Link 
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="step-card group cursor-pointer"
                >
                  <div className="step-icon">
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{service.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                  <span className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Guide Section */}
        <section className="py-20 lg:py-24" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-accent/10 border border-amber-accent/20 text-amber-accent text-xs font-bold uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-sm">payments</span> Pricing Intelligence
              </div>
              <h2 className="section-header">Foundation Repair Cost Guide</h2>
              <p className="section-subtext max-w-2xl mx-auto">
                Estimated market averages for common foundation services. Actual costs vary based on location and severity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="cost-card hover:border-amber-accent/30 transition-colors">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Minor Repair</span>
                <h4 className="text-white text-lg font-bold mt-1">Crack Injection</h4>
                <div className="text-2xl font-black text-amber-accent mt-3 mb-1">$400 – $800</div>
                <p className="text-slate-500 text-xs">Per injection site</p>
              </div>
              <div className="cost-card hover:border-amber-accent/30 transition-colors">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Moderate Repair</span>
                <h4 className="text-white text-lg font-bold mt-1">Slab Jacking</h4>
                <div className="text-2xl font-black text-amber-accent mt-3 mb-1">$500 – $1,500</div>
                <p className="text-slate-500 text-xs">Per 100 sq. ft. area</p>
              </div>
              <div className="cost-card hover:border-amber-accent/30 transition-colors">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Major Structural</span>
                <h4 className="text-white text-lg font-bold mt-1">Piering</h4>
                <div className="text-2xl font-black text-amber-accent mt-3 mb-1">$1,000 – $3,000</div>
                <p className="text-slate-500 text-xs">Per pier installed</p>
              </div>
              <div className="cost-card hover:border-amber-accent/30 transition-colors">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Preventative</span>
                <h4 className="text-white text-lg font-bold mt-1">Basement Sealing</h4>
                <div className="text-2xl font-black text-amber-accent mt-3 mb-1">$2,000 – $6,000</div>
                <p className="text-slate-500 text-xs">Full perimeter system</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-24" style={{ background: 'var(--bg-secondary)' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="section-header">How It Works</h2>
              <p className="section-subtext max-w-2xl mx-auto">Getting your home back on solid ground is simpler than you think. Follow our four-step process to find the right expert.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                { step: '1', icon: 'search', title: 'Search', desc: 'Find local foundation experts near you by entering your zip code.' },
                { step: '2', icon: 'rule', title: 'Compare', desc: 'Review ratings, past project photos, and structural specialties.' },
                { step: '3', icon: 'forum', title: 'Contact', desc: 'Get free inspections and competitive quotes from top contractors.' },
                { step: '4', icon: 'house_with_shield', title: 'Get Repaired', desc: 'Secure your home\'s long-term value and your family\'s safety.' },
              ].map((item) => (
                <div key={item.step} className="step-card">
                  <div className="step-icon">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.step}. {item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by State */}
        <section className="py-20 lg:py-24" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <h2 className="section-header">National Coverage. Local Expertise.</h2>
              <p className="section-subtext">Whether you're dealing with expansive clay soils in Texas or freezing cycles in the Midwest, we connect you with experts who understand your local geography.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {TOP_STATES.slice(0, 8).map((state) => (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  className="glass-card flex items-center gap-3 p-4 group"
                >
                  <span className="text-xs font-bold text-amber-accent bg-amber-accent/10 px-2.5 py-1.5 rounded-lg border border-amber-accent/30 group-hover:bg-amber-accent group-hover:text-slate-900 transition-colors">
                    {state.abbr}
                  </span>
                  <div>
                    <span className="font-medium text-sm text-white">{state.name}</span>
                    <span className="block text-xs text-slate-400">{state.count} contractors</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Urgency CTA Section */}
        <section className="relative overflow-hidden py-24 px-6 md:px-20 lg:px-40" style={{ background: '#0f172a' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1152d4 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-accent/10 border border-amber-accent/30 text-amber-accent mb-8">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span className="text-xs font-bold uppercase tracking-wider">Urgent Structural Alert</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl">
              Structural damage <span className="text-amber-accent">doesn't wait.</span> Neither should you.
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Minor cracks today become major structural failures tomorrow. Average repair costs double every 18 months when left untreated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-xl transition-all shadow-lg shadow-primary/25 text-lg flex items-center justify-center gap-3">
                Find a Pro Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="btn-secondary py-5 px-10 text-lg">
                View Pricing Guide
              </button>
            </div>
            <p className="mt-8 text-slate-500 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">verified_user</span>
              Free inspections available from certified local pros
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-6 lg:px-10" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-white">
                <span className="material-symbols-outlined text-lg">foundation</span>
              </div>
              <span className="font-bold tracking-tight text-white">Foundation Directory</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="#">Contact Us</a>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 Foundation Directory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}