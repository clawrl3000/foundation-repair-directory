'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import AuthButton from '@/components/AuthButton'
import LeadForm from '@/components/LeadForm'
import { trackButtonClick, trackSearch } from '@/components/ConversionTracker'

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
  { name: 'Piering', slug: 'piering', icon: 'architecture', desc: 'Structural stabilization for sinking foundations using deep hydraulic piers driven into load-bearing strata.' },
  { name: 'Slab Repair', slug: 'slab-repair', icon: 'layers', desc: 'Professional leveling and crack filling solutions to restore the integrity of concrete slab-on-grade floors.' },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'water_drop', desc: 'Complete moisture control and sealing systems, including sump pumps and vapor barriers for dry basements.' },
  { name: 'Crawl Space', slug: 'crawl-space', icon: 'grid_guides', desc: 'Encapsulation and support systems designed to eliminate sagging floors, mold, and humidity in crawl spaces.' },
]

export default function HomePageClient() {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<{id: string, name: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const openLeadForm = (businessId?: string, businessName?: string) => {
    if (businessId && businessName) {
      setSelectedBusiness({ id: businessId, name: businessName })
      trackButtonClick('Contact Now', `Business: ${businessName}`)
    } else {
      setSelectedBusiness(null)
      trackButtonClick('Get Free Estimates', 'Homepage')
    }
    setLeadFormOpen(true)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      trackSearch(searchQuery, 'Homepage Hero')
      // TODO: Navigate to search results or open lead form
      openLeadForm()
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
        {/* Navigation - Direct port from Stitch */}
        <header className="sticky top-0 z-50 w-full border-b border-glass-stroke bg-background-dark/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">foundation</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-primary">Dir</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">Find Contractors</Link>
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">For Pros</Link>
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="#">Resources</Link>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {/* Hero Section - Direct port from Stitch */}
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
              
              {/* Search Box - Direct port from Stitch */}
              <div className="mx-auto max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3 rounded-xl bg-slate-900/50 p-2 border border-glass-stroke shadow-2xl">
                  <div className="relative flex flex-1 items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-500">location_on</span>
                    <input 
                      className="w-full rounded-lg border-0 bg-transparent py-4 pl-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary" 
                      placeholder="Enter ZIP code" 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-accent px-8 py-4 text-base font-bold text-slate-900 hover:bg-amber-400 transition-all shadow-lg shadow-amber-accent/10"
                  >
                    <span className="material-symbols-outlined">search</span>
                    Find Contractors
                  </button>
                </div>
              </div>
              
              {/* Trust Indicators - Direct port from Stitch */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-white">10,000+</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Verified Pros</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-glass-stroke">
                  <span className="text-2xl font-bold text-white">50</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">States Covered</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-glass-stroke">
                  <span className="text-2xl font-bold text-white">2M+</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Homes Saved</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-glass-stroke">
                  <span className="text-2xl font-bold text-white">4.9/5</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">User Rating</span>
                </div>
              </div>
            </div>
            
            {/* Background Decoration - Direct port from Stitch */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px]"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-accent/5 blur-[120px]"></div>
          </section>
          
          {/* Featured Contractors - Direct port from Stitch */}
          <section className="py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">Top-Rated Local Specialists</h2>
                  <p className="text-slate-400">Showing the highest-rated foundation experts currently available in your area.</p>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold hover:underline">
                  View All Contractors
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1 - Direct port from Stitch */}
                <div className="glass-card group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-400">foundation</span>
                    </div>
                    <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-black uppercase text-amber-accent border border-amber-accent/30">
                      Premium Partner
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Precision Foundation Pros</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-amber-accent">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400">(124 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Slab Jacking</span>
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Pier & Beam</span>
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Waterproofing</span>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('precision-foundation-pros', 'Precision Foundation Pros')}
                        className="flex-1 rounded-lg bg-amber-accent py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-400"
                      >
                        Contact Now
                      </button>
                      <button className="flex items-center justify-center rounded-lg border border-glass-stroke bg-slate-800/50 px-4 py-3 text-white hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - Direct port from Stitch */}
                <div className="glass-card group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-400">engineering</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Solid Ground Engineering</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-amber-accent">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm">star_half</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400">(98 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Leveling</span>
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Crack Repair</span>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('solid-ground-engineering', 'Solid Ground Engineering')}
                        className="flex-1 rounded-lg bg-amber-accent py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-400"
                      >
                        Contact Now
                      </button>
                      <button className="flex items-center justify-center rounded-lg border border-glass-stroke bg-slate-800/50 px-4 py-3 text-white hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Direct port from Stitch */}
                <div className="glass-card group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-400">home_repair_service</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Atlas Pier Specialists</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-amber-accent">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400">(56 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Basement Repair</span>
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Sealing</span>
                      <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">Helical Piers</span>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('atlas-pier-specialists', 'Atlas Pier Specialists')}
                        className="flex-1 rounded-lg bg-amber-accent py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-400"
                      >
                        Contact Now
                      </button>
                      <button className="flex items-center justify-center rounded-lg border border-glass-stroke bg-slate-800/50 px-4 py-3 text-white hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Location Section Teaser - Direct port from Stitch */}
          <section className="bg-slate-900/30 py-20 border-y border-glass-stroke">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">National Coverage. <br/>Local Expertise.</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">Whether you're dealing with expansive clay soils in Texas or freezing cycles in the Midwest, we connect you with experts who understand your local geography.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {TOP_STATES.slice(0, 4).map((state) => (
                      <Link key={state.slug} className="text-primary hover:text-primary/80 font-medium" href={`/${state.slug}`}>
                        Foundation Repair in {state.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link href="/states" className="text-primary hover:text-primary/80 font-medium">
                      View All States →
                    </Link>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-glass-stroke h-80">
                  <div className="h-full w-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center opacity-50">
                    <span className="material-symbols-outlined text-8xl text-slate-400">map</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <span className="material-symbols-outlined text-primary">pin_drop</span>
                      50 States Served
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* How It Works and Urgency CTA sections - Direct port from Stitch */}
          <section className="py-20 px-6 md:px-20 lg:px-40 bg-white dark:bg-[#161e2d]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">How It Works</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Getting your home back on solid ground is simpler than you think. Follow our four-step process to find the right expert.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">search</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. Search</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Find local foundation experts near you by entering your zip code.</p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">rule</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">2. Compare</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Review ratings, past project photos, and structural specialties.</p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">forum</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">3. Contact</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Get free inspections and competitive quotes from top contractors.</p>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">house_with_shield</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">4. Get Repaired</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Secure your home's long-term value and your family's safety.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Repair Types Section - Direct port from Stitch with our SERVICES data */}
          <section className="py-20 px-6 md:px-20 lg:px-40 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">Common Foundation Repair Types</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Understanding the right solution for your home is the first step toward a permanent fix. Explore our professional repair services.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICES.map((service) => (
                  <div key={service.slug} className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                    <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">{service.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                    <Link className="mt-auto text-primary text-sm font-bold flex items-center gap-1 hover:underline" href={`/services/${service.slug}`}>
                      Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link 
                  href="/services"
                  className="inline-block text-primary hover:text-primary/80 font-bold text-lg"
                >
                  View All Foundation Repair Services →
                </Link>
              </div>
            </div>
          </section>
          
          {/* Urgency CTA Section - Direct port from Stitch */}
          <section className="relative overflow-hidden py-24 px-6 md:px-20 lg:px-40 bg-[#0f172a]">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #1152d4 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
            <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber mb-8">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span className="text-xs font-bold uppercase tracking-wider">Urgent Structural Alert</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl">
                Structural damage <span className="text-accent-amber">doesn&apos;t wait.</span> Neither should you.
              </h2>
              <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                Minor cracks today become major structural failures tomorrow. Average repair costs double every 18 months when left untreated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => openLeadForm()}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-xl transition-all shadow-lg shadow-primary/25 text-lg flex items-center justify-center gap-3"
                >
                  Get Free Estimates
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-5 px-10 rounded-xl transition-all text-lg">
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
        
        {/* Footer - Direct port from Stitch */}
        <footer className="border-t border-glass-stroke py-12 bg-background-dark">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-white">
                  <span className="material-symbols-outlined text-lg">foundation</span>
                </div>
                <span className="font-bold tracking-tight text-white">Foundation Directory</span>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
                <Link className="hover:text-white transition-colors" href="#">Contact Us</Link>
              </div>
              <div className="text-sm text-slate-500">
                © 2024 Foundation Directory. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
        
        {/* Lead Form Modal */}
        <LeadForm
          isOpen={leadFormOpen}
          onClose={() => setLeadFormOpen(false)}
          businessId={selectedBusiness?.id}
          businessName={selectedBusiness?.name}
        />
      </div>
  )
}