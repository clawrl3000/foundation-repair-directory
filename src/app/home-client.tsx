'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
// ThemeToggle removed - using light mode only
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
  const router = useRouter()
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<{id: string, name: string} | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      // Navigate to states page with zip code parameter
      router.push(`/states?zip=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      // If no zip entered, just go to states page
      router.push('/states')
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
        {/* Navigation - Dark nav with fixed links */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#101622]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">foundation</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-primary">Dir</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="/states">Find Contractors</Link>
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="/auth/signup">For Pros</Link>
              <Link className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors" href="/services">Resources</Link>
            </nav>
            <div className="flex items-center gap-4">
              <AuthButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#101622] border-b border-slate-700 py-4">
            <div className="mx-auto max-w-7xl px-6 flex flex-col gap-4">
              <Link 
                className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors py-2" 
                href="/states"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Contractors
              </Link>
              <Link 
                className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors py-2" 
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Pros
              </Link>
              <Link 
                className="text-sm font-semibold text-slate-300 hover:text-primary transition-colors py-2" 
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
            </div>
          </div>
        )}
        
        <main className="flex-1">
          {/* Hero Section - With background image */}
          <section className="relative overflow-hidden border-b border-slate-200 py-20 lg:py-32">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80" alt="Foundation construction work" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-white/85"></div>
            </div>
            <div className="relative mx-auto max-w-5xl px-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Certified & Licensed Networks Only</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6">
                Find Trusted Foundation <br className="hidden lg:block"/> Repair Experts Near You
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
                Compare the top-rated local specialists in minutes. Verified reviews. <br className="hidden sm:block"/> Expert analysis. Guaranteed structural integrity.
              </p>
              
              {/* Search Box - Direct port from Stitch */}
              <div className="mx-auto max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3 rounded-xl bg-white p-2 border border-slate-300 shadow-lg">
                  <div className="relative flex flex-1 items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-500">location_on</span>
                    <input 
                      className="w-full rounded-lg border-0 bg-transparent py-4 pl-12 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary" 
                      placeholder="Enter ZIP code" 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-8 py-4 text-base font-bold text-slate-900 hover:bg-amber-400 transition-all shadow-lg shadow-amber-400/10"
                  >
                    <span className="material-symbols-outlined">search</span>
                    Find Contractors
                  </button>
                </div>
              </div>
              
              {/* Trust Indicators - Direct port from Stitch */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-slate-900">10,000+</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Verified Pros</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-slate-200">
                  <span className="text-2xl font-bold text-slate-900">50</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">States Covered</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-slate-200">
                  <span className="text-2xl font-bold text-slate-900">2M+</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Homes Saved</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-slate-200">
                  <span className="text-2xl font-bold text-slate-900">4.9/5</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">User Rating</span>
                </div>
              </div>
            </div>
            
            {/* Background Decoration - Direct port from Stitch */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px]"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-accent/5 blur-[120px]"></div>
          </section>
          
          {/* Featured Contractors - Light mode */}
          <section className="py-20 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Top-Rated Local Specialists</h2>
                  <p className="text-slate-600">Showing the highest-rated foundation experts currently available in your area.</p>
                </div>
                <Link href="/states" className="flex items-center gap-2 text-primary font-bold hover:underline">
                  View All Contractors
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1 - Light mode card */}
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Modern construction site foundation work" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBH_fspDAoEzNGfNbydMgnylSNAHFKnDyTVuAB5lh2QmGxflAy349PaJPLRAasu66OXuAY6hxNGA3IX66f-vF42gGsKYsbeDlQxfDagtTq93ds9TV7chIu82KpV5k1Y2Jc7ZNB28YAETx2cDK2Uv1WiFdESsw_0ZOIEVZzbSplLRjFVXoCTI0mxIGOirdKPj8kAJstjayMmSXyyK3wsm8BuciG-G9rnKBZNhpKl0HfUZxO_wqkU69yqKaeK7ZD8m-LmCiH-o1XHfaM"/>
                    <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-black uppercase text-amber-accent border border-amber-accent/30">
                      Premium Partner
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link href="/texas/houston/precision-foundation-pros" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Precision Foundation Pros
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">(124 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Link href="/services/slab-repair" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Slab Jacking
                      </Link>
                      <Link href="/services/piering" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Pier & Beam
                      </Link>
                      <Link href="/services/waterproofing" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Waterproofing
                      </Link>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('precision-foundation-pros', 'Precision Foundation Pros')}
                        className="flex-1 rounded-lg bg-amber-500 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                      >
                        Contact Now
                      </button>
                      <Link href="/texas/houston/precision-foundation-pros" className="flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - Light mode card */}
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Close up of structural reinforcement bars" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWZaxP1hx8ZfZ03NtrDQnaj-pZzvZbOmivWjAAh990chBfcawpoY7XRAFhmDrhXAijXfmuo3ReTdPWCBIlCtBqWcVm_ng1wzW1zVcy_gFk8gst1CAf3KgsL0onffRhy6iRVU-qJWIdTIuq6t8jAPL7N0Qn_E6HuCsiBqrDqkaHku5zBMRTMASGZT7pACgMU9VQnqM2vZ6iJsqb-r0P3Ff8sLHTSLkIyy1F4n6s0kt4gasmdBJWzV1b6st81f_NET3TUufUx8wFglg5"/>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link href="/texas/houston/solid-ground-engineering" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Solid Ground Engineering
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm">star_half</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">(98 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Link href="/services/slab-repair" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Leveling
                      </Link>
                      <Link href="/services/slab-repair" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Crack Repair
                      </Link>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('solid-ground-engineering', 'Solid Ground Engineering')}
                        className="flex-1 rounded-lg bg-amber-500 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                      >
                        Contact Now
                      </button>
                      <Link href="/texas/houston/solid-ground-engineering" className="flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Light mode card */}
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Worker inspecting a concrete foundation wall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgm7o06LmtKQc1KkeQ9BbFY1edrRS-mbqnm3cCv5o_QHUyj6NaAHTbNXgqC4h_cjZ-l4Is3juBHSUh05EhxKO2IdsbUDxZ-NWF8aYQNrDrtqlr_hPZJcnUSQmM6IjEnjbWIY-kG5mMDPzwQqaPAMnZixsi-hDMjaVq7L1d5wLH8lEUJGLmsRYX9zN9Jd0sGGQ2XCwe1nJ6PMoPlWMYI9DnhqcLORbSZZYvVYtO5un5L7lkczJlXWYIEmrS5pmW_0tnuwjW-l6dNVHN"/>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link href="/texas/houston/atlas-pier-specialists" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Atlas Pier Specialists
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">(56 reviews)</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Link href="/services/waterproofing" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Basement Repair
                      </Link>
                      <Link href="/services/waterproofing" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Sealing
                      </Link>
                      <Link href="/services/piering" className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 hover:bg-primary hover:text-white transition-colors">
                        Helical Piers
                      </Link>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => openLeadForm('atlas-pier-specialists', 'Atlas Pier Specialists')}
                        className="flex-1 rounded-lg bg-amber-500 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                      >
                        Contact Now
                      </button>
                      <Link href="/texas/houston/atlas-pier-specialists" className="flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Location Section Teaser - Light mode */}
          <section className="bg-slate-50 py-20 border-y border-slate-200">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">National Coverage. <br/>Local Expertise.</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">Whether you're dealing with expansive clay soils in Texas or freezing cycles in the Midwest, we connect you with experts who understand your local geography.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Link className="text-primary hover:text-primary/80 font-medium" href="/texas/dallas">
                      Foundation Repair in Dallas, TX
                    </Link>
                    <Link className="text-primary hover:text-primary/80 font-medium" href="/illinois/chicago">
                      Foundation Repair in Chicago, IL
                    </Link>
                    <Link className="text-primary hover:text-primary/80 font-medium" href="/georgia/atlanta">
                      Foundation Repair in Atlanta, GA
                    </Link>
                    <Link className="text-primary hover:text-primary/80 font-medium" href="/arizona/phoenix">
                      Foundation Repair in Phoenix, AZ
                    </Link>
                  </div>
                  <div className="mt-6">
                    <Link href="/states" className="text-primary hover:text-primary/80 font-medium">
                      View All States →
                    </Link>
                  </div>
                </div>
                <Link href="/states" className="relative rounded-xl overflow-hidden border border-slate-200 h-80 block group cursor-pointer">
                  <img className="h-full w-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" alt="Abstract map of the United States" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTi4oDtSbrPO6N8Nmi9XjDI3W55qU3Aj0toyGQtvdkcIjOa-kSsPQkox-7FvHqNSDeenISXDI5mGBGFL-HAXAYMb-giPmVnWjpFnzgBKOhE5YoxgKe2c9Mzqq7w6sUR2F_IXzCf16YNLwsogle2cJlk_AE61bcFW44ObzALfhFLg_BABKFEkOlj-S-72NT3napjYyY_FZdQAgodPbr-IahFq_5tPFKSvOmBX9WbyzvkubrWlo-lPDFdUcS1MAKmPNTrFGdmIzPuds6"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <span className="material-symbols-outlined text-primary">pin_drop</span>
                      50 States Served
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
          
          {/* How It Works section - Dark Blue */}
          <section className="py-20 px-6 md:px-20 lg:px-40 bg-[#0f172a]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">How It Works</h2>
                <p className="text-slate-300 max-w-2xl mx-auto">Getting your home back on solid ground is simpler than you think. Follow our four-step process to find the right expert.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">search</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">1. Search</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Find local foundation experts near you by entering your zip code.</p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">rule</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">2. Compare</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Review ratings, past project photos, and structural specialties.</p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">forum</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">3. Contact</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Get free inspections and competitive quotes from top contractors.</p>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">house_with_shield</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">4. Get Repaired</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Secure your home's long-term value and your family's safety.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Repair Types Section */}
          <section className="py-20 px-6 md:px-20 lg:px-40 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-slate-900 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">Common Foundation Repair Types</h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Understanding the right solution for your home is the first step toward a permanent fix. Explore our professional repair services.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICES.map((service) => (
                  <div key={service.slug} className="group flex flex-col bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                    <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-slate-900 text-xl font-bold mb-3">{service.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.desc}</p>
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
          
          {/* Urgency CTA Section - Dark Blue */}
          <section className="relative overflow-hidden py-24 px-6 md:px-20 lg:px-40 bg-[#0f172a]">
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
            <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-accent/20 border border-amber-accent/40 text-amber-400 mb-8">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span className="text-xs font-bold uppercase tracking-wider">Urgent Structural Alert</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl">
                Structural damage <span className="text-amber-accent">doesn&apos;t wait.</span> Neither should you.
              </h2>
              <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                Minor cracks today become major structural failures tomorrow. Average repair costs double every 18 months when left untreated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/states" className="bg-primary hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-lg flex items-center justify-center gap-3">
                  Find a Pro Now
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/cost/texas/foundation-repair-cost" className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold py-5 px-10 rounded-xl transition-all text-lg">
                  View Pricing Guide
                </Link>
              </div>
              <p className="mt-8 text-slate-300 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-accent text-base">verified_user</span>
                Free inspections available from certified local pros
              </p>
            </div>
          </section>
          
          {/* Trust Badges Row */}
          <section className="py-16 px-6 md:px-20 lg:px-40 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-blue-600 text-lg mb-1">verified_user</span>
                  <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase">BBB ACCREDITED</span>
                </div>
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-green-600 text-lg mb-1">engineering</span>
                  <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase">SEA MEMBER</span>
                </div>
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-orange-600 text-lg mb-1">star</span>
                  <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase">HOMEADVISOR TOP</span>
                </div>
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-purple-600 text-lg mb-1">grade</span>
                  <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase">ANGI SUPER SVC</span>
                </div>
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-lg shadow-sm flex-col items-center justify-center hover:shadow-md transition-all duration-300 hidden lg:flex">
                  <span className="material-symbols-outlined text-blue-700 text-lg mb-1">certificate</span>
                  <span className="text-[9px] font-bold tracking-tighter text-slate-700 uppercase">NARI CERTIFIED</span>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer - Full 4-column layout */}
        <footer className="bg-white pt-16 pb-8 px-6 md:px-20 lg:px-40 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            {/* Footer Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand Column */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8">
                    <span className="material-symbols-outlined text-2xl">foundation</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">FoundationDir</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The nation&apos;s most trusted network of foundation repair specialists. We connect homeowners with certified pros to protect what matters most.
                </p>
                <div className="flex gap-4">
                  <Link className="size-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" href="#" aria-label="Facebook">
                    <span className="text-xs font-bold">FB</span>
                  </Link>
                  <Link className="size-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors" href="#" aria-label="Twitter">
                    <span className="text-xs font-bold">TW</span>
                  </Link>
                  <Link className="size-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors" href="#" aria-label="LinkedIn">
                    <span className="text-xs font-bold">LI</span>
                  </Link>
                </div>
              </div>
              
              {/* Services Column */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Services</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li><Link className="hover:text-primary transition-colors" href="/services/slab-repair">Slab Foundation Repair</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/services/piering">Pier and Beam Repair</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/services/waterproofing">Basement Waterproofing</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/services/crawl-space">Crawl Space Encapsulation</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/services">Structural Inspections</Link></li>
                </ul>
              </div>
              
              {/* Quick Links Column */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Quick Links</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li><Link className="hover:text-primary transition-colors" href="/">About FoundationDir</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/auth/signup">Contractor Portal</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/services">Industry Resources</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href="/auth/signup">Partner Program</Link></li>
                  <li><button onClick={() => openLeadForm()} className="hover:text-primary transition-colors text-left">Contact Support</button></li>
                </ul>
              </div>
              
              {/* Contact Column */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Contact Us</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary">call</span>
                    1-800-FOUND-DIR
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    support@foundationdir.com
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    1200 Structural Way, Suite 400<br/>Denver, CO 80202
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Footer Bottom */}
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>© 2025 Foundation Directory. All rights reserved.</p>
              <div className="flex gap-6">
                <Link className="hover:text-primary" href="#">Privacy Policy</Link>
                <Link className="hover:text-primary" href="#">Terms of Service</Link>
                <Link className="hover:text-primary" href="#">Cookie Settings</Link>
                <Link className="hover:text-primary" href="#">Accessibility</Link>
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