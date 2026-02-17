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
  { name: 'Pier & Beam Repair', slug: 'pier-and-beam-repair', icon: '🏗️', desc: 'Stabilize settling pier & beam foundations with steel or concrete piers' },
  { name: 'Slab Foundation Repair', slug: 'slab-foundation-repair', icon: '🧱', desc: 'Fix cracking and shifting concrete slab foundations' },
  { name: 'Basement Waterproofing', slug: 'basement-waterproofing', icon: '💧', desc: 'Prevent water damage with interior and exterior drainage systems' },
  { name: 'Foundation Crack Repair', slug: 'foundation-crack-repair', icon: '🔨', desc: 'Seal and repair structural and non-structural foundation cracks' },
  { name: 'House Leveling', slug: 'house-leveling', icon: '📐', desc: 'Level uneven floors caused by foundation settlement' },
  { name: 'Crawl Space Repair', slug: 'crawl-space-repair', icon: '🏠', desc: 'Encapsulation, support jacks, and moisture control' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header with theme toggle */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Foundation Repair Directory
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section — Multi-layer depth */}
      <section className="hero-gradient hero-pattern relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20">
          {/* Trust bar */}
          <div className="flex justify-center mb-8">
            <div className="hero-trust-bar glass rounded-full px-6 py-2.5 flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-medium hero-trust-highlight">4,200+ Contractors</span>
              </span>
              <span className="w-px h-4 hero-divider"></span>
              <span>All 50 States</span>
              <span className="w-px h-4 hero-divider"></span>
              <span>100% Free</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center leading-tight mb-6 hero-heading">
            Find Trusted Foundation
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
              Repair Contractors
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-center mb-10 max-w-2xl mx-auto leading-relaxed hero-subtext">
            Compare licensed professionals, see real pricing data, and get free estimates. 
            Your home's foundation is too important to trust to just anyone.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="search-bar flex items-center p-2">
              <div className="flex items-center gap-3 flex-1 px-4">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your city or ZIP code..."
                  className="flex-1 py-3 text-gray-800 text-lg focus:outline-none bg-transparent"
                />
              </div>
              <button className="btn-primary px-8 py-3.5 text-lg whitespace-nowrap">
                Find Contractors
              </button>
            </div>
          </div>
          
          {/* Trust Signals — Floating cards */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: '✓', label: 'Verified & Licensed', color: 'green' },
              { icon: '★', label: 'Rated by Homeowners', color: 'amber' },
              { icon: '🛡️', label: 'Warranty Tracked', color: 'blue' },
            ].map((signal) => (
              <div key={signal.label} className="hero-badge glass rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-lg">{signal.icon}</span>
                <span className="text-sm font-medium">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }} className="py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>4,200+</span>
            <span>Contractors Listed</span>
          </div>
          <div className="w-px h-6" style={{ background: 'var(--border-primary)' }}></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>50</span>
            <span>States Covered</span>
          </div>
          <div className="w-px h-6" style={{ background: 'var(--border-primary)' }}></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>12,000+</span>
            <span>Homeowners Helped</span>
          </div>
          <div className="w-px h-6" style={{ background: 'var(--border-primary)' }}></div>
          <div className="flex items-center gap-2">
            <span className="stars text-lg">★★★★★</span>
            <span>4.8 Average Rating</span>
          </div>
        </div>
      </div>

      {/* Services Grid — Cards with depth */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm tracking-wide uppercase">Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              What Type of Repair Do You Need?
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Find contractors who specialize in your specific foundation issue
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link 
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card-elevated p-6 group cursor-pointer"
              >
                <div className="icon-container icon-amber mb-4">
                  <span className="text-xl">{service.icon}</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-amber-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {service.name}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {service.desc}
                </p>
                <div className="mt-4 flex items-center text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Find specialists
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State — Clean grid */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm tracking-wide uppercase">Browse</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Foundation Repair by State
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find contractors in your area</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOP_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="card-elevated flex items-center gap-3 p-4 group"
              >
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  {state.abbr}
                </span>
                <div>
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{state.name}</span>
                  <span className="block text-xs" style={{ color: 'var(--text-tertiary)' }}>{state.count} contractors</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/states" className="btn-secondary inline-block text-sm">
              View All 50 States →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — Step cards */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-wide uppercase">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
              Three Steps to a Solid Foundation
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Search Your Area',
                desc: 'Enter your city or ZIP code to find foundation repair contractors who serve your neighborhood.',
              },
              {
                step: '02', 
                icon: '⚖️',
                title: 'Compare & Evaluate',
                desc: 'Review services, warranties, pricing data, and ratings. Filter by repair type to find the right fit.',
              },
              {
                step: '03',
                icon: '📞',
                title: 'Get Free Estimates',
                desc: 'Contact contractors directly or request free quotes. No obligation, no hidden fees.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="card-elevated p-8 text-center h-full">
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20">
                    Step {item.step}
                  </span>
                  <div className="icon-container icon-amber mx-auto mt-4 mb-5 w-14 h-14 text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Section — Premium data cards */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm tracking-wide uppercase">Pricing Guide</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
              Foundation Repair Costs in 2026
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Real pricing data from contractors nationwide. Know what to expect before you call.
            </p>
          </div>
          
          <div className="card-elevated p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Average Repair', range: '$4,500 – $12,000', sublabel: 'Most common' },
                { label: 'Minor Cracks', range: '$500 – $2,500', sublabel: 'Simple fixes' },
                { label: 'Major Structural', range: '$10,000 – $30,000', sublabel: 'Full restoration' },
                { label: 'Per Pier', range: '$1,000 – $3,000', sublabel: 'Industry standard' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card text-center">
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-600 mt-1">{stat.range}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.sublabel}</p>
                </div>
              ))}
            </div>
            
            <div className="section-divider mb-8"></div>
            
            <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>What Affects Your Cost?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '🔧', factor: 'Type of repair', detail: 'Pier installation costs more than crack sealing' },
                { icon: '📊', factor: 'Severity of damage', detail: 'Minor cracks vs. major structural shifting' },
                { icon: '🏠', factor: 'Foundation type', detail: 'Slab, pier & beam, or basement' },
                { icon: '📍', factor: 'Your location', detail: 'Soil conditions and labor costs vary by region' },
                { icon: '📏', factor: 'Home size', detail: 'Larger homes need more piers and materials' },
                { icon: '🚧', factor: 'Accessibility', detail: 'Easy access vs. confined spaces' },
              ].map((item) => (
                <div key={item.factor} className="factor-item flex items-start gap-3 p-3 rounded-xl transition-colors">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.factor}</span>
                    <span className="block text-xs" style={{ color: 'var(--text-secondary)' }}>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hero-heading">
            Don&#39;t Wait Until It Gets Worse
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto hero-subtext">
            Foundation problems only get more expensive over time. Find a trusted contractor today and get a free inspection.
          </p>
          <div className="search-bar inline-flex items-center p-2 max-w-lg w-full">
            <input
              type="text"
              placeholder="Enter your ZIP code..."
              className="flex-1 px-4 py-3 text-gray-800 focus:outline-none bg-transparent"
            />
            <button className="btn-primary px-6 py-3 whitespace-nowrap">
              Get Free Estimates
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-4" style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Foundation Repair Directory</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                The most comprehensive directory of foundation repair contractors in the United States. 
                Compare, evaluate, and connect with licensed professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Services</h3>
              <ul className="space-y-2 text-sm">
                {SERVICES.map(s => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top States</h3>
              <ul className="space-y-2 text-sm">
                {TOP_STATES.slice(0, 6).map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cost/foundation-repair" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>Cost Guide</Link></li>
                <li><Link href="/services" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>All Services</Link></li>
                <li><Link href="/states" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>All States</Link></li>
                <li><Link href="/about" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>About Us</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="section-divider mb-8"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <p>© 2026 Foundation Repair Directory. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-tertiary)' }}>Privacy Policy</Link>
              <Link href="/terms" className="hover:text-amber-400 transition-colors" style={{ color: 'var(--text-tertiary)' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
