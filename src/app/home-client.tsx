'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
// ThemeToggle removed - using light mode only
import AuthButton from '@/components/AuthButton'
import LeadForm from '@/components/LeadForm'
import ExpertBio from '@/components/ExpertBio'
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
  const [showTrustPopup, setShowTrustPopup] = useState(false)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  
  const heroImages = [
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Foundation repair contractor inspecting a home' },
    { src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', alt: 'Professional foundation repair team at work' },
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', alt: 'Foundation crack repair with professional equipment' },
    { src: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=80', alt: 'Basement waterproofing and drainage installation' },
  ]

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
      const query = searchQuery.trim()
      
      // Check if it's a ZIP code (5 digits)
      const zipRegex = /^\d{5}(-\d{4})?$/
      
      if (zipRegex.test(query)) {
        // ZIP code search - implement actual ZIP to location mapping
        const zipToStateMapping = getStateFromZip(query)
        if (zipToStateMapping) {
          router.push(`/${zipToStateMapping.stateSlug}?zip=${encodeURIComponent(query)}`)
        } else {
          // Fallback if ZIP not found
          router.push(`/states?q=${encodeURIComponent(query)}`)
        }
      } else {
        // City/State search
        const cityState = query.toLowerCase()
        // Try to match against our states
        const matchedState = TOP_STATES.find(state => 
          cityState.includes(state.name.toLowerCase()) || 
          cityState.includes(state.abbr.toLowerCase())
        )
        
        if (matchedState) {
          router.push(`/${matchedState.slug}?q=${encodeURIComponent(query)}`)
        } else {
          // General search
          router.push(`/states?q=${encodeURIComponent(query)}`)
        }
      }
    } else {
      // If no search term entered, show all available states
      router.push('/states')
    }
  }

  // Helper function to map ZIP codes to states (sample implementation)
  const getStateFromZip = (zip: string) => {
    const zipCode = zip.substring(0, 5)
    const firstDigit = zipCode.charAt(0)
    
    // Basic ZIP to state mapping based on first digit
    const zipToStateMap: { [key: string]: { stateSlug: string, stateName: string } } = {
      '0': { stateSlug: 'massachusetts', stateName: 'Massachusetts' }, // 00-09 Northeast
      '1': { stateSlug: 'new-york', stateName: 'New York' }, // 10-19 NY, PA, DE
      '2': { stateSlug: 'virginia', stateName: 'Virginia' }, // 20-29 DC, MD, VA, WV
      '3': { stateSlug: 'florida', stateName: 'Florida' }, // 30-39 Southeast
      '4': { stateSlug: 'georgia', stateName: 'Georgia' }, // 40-49 Southeast
      '5': { stateSlug: 'ohio', stateName: 'Ohio' }, // 50-59 Midwest
      '6': { stateSlug: 'texas', stateName: 'Texas' }, // 60-69 Great Lakes/Plains
      '7': { stateSlug: 'texas', stateName: 'Texas' }, // 70-79 South Central
      '8': { stateSlug: 'california', stateName: 'California' }, // 80-89 Western
      '9': { stateSlug: 'california', stateName: 'California' }, // 90-99 West Coast
    }
    
    // Find matching state in our TOP_STATES
    const stateMapping = zipToStateMap[firstDigit]
    if (stateMapping) {
      const fullStateInfo = TOP_STATES.find(state => 
        state.slug === stateMapping.stateSlug || 
        state.name.toLowerCase().includes(stateMapping.stateName.toLowerCase())
      )
      return fullStateInfo ? { stateSlug: fullStateInfo.slug, stateName: fullStateInfo.name } : stateMapping
    }
    
    return null
  }

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          element.classList.add('animate-fade-up')
          observer.unobserve(element)
        }
      })
    }, observerOptions)

    // Observe all elements with the animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll')
    animateElements.forEach((element) => observer.observe(element))

    return () => {
      animateElements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  // Dynamic trust popup after 5 seconds of browsing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTrustPopup(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
        {/* Navigation - Dark nav with fixed links */}
        <header className="absolute top-0 left-0 right-0 z-50 w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
                <span className="material-symbols-outlined text-2xl">foundation</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-amber-400">Scout</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/states">Find Contractors</Link>
              <Link className="text-sm font-semibold text-white border border-white/30 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-lg transition-colors" href="/auth/signup">For Pros</Link>
              <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/services">Resources</Link>
            </nav>
            <div className="flex items-center gap-4">
              <AuthButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 relative overflow-hidden group"
              >
                <span className={`material-symbols-outlined transition-all duration-300 ${mobileMenuOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}`}>
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
                <div className={`absolute inset-0 bg-primary/20 rounded-lg transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Enhanced Mobile Menu with iOS-style animation */}
        <div className={`mobile-menu-backdrop fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`md:hidden fixed left-0 right-0 z-50 mobile-menu transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="bg-[#101622]/98 backdrop-blur-xl border-b border-slate-700/50 py-8 shadow-2xl">
            <div className="mx-auto max-w-7xl px-6 flex flex-col gap-6">
              <Link 
                className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
                href="/states"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">search</span>
                  Find Contractors
                </span>
              </Link>
              <Link 
                className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">business</span>
                  For Contractors
                </span>
              </Link>
              <Link 
                className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">info</span>
                  Resources
                </span>
              </Link>
              
              {/* Mobile CTA with enhanced styling */}
              <div className="pt-6 border-t border-slate-700">
                <button 
                  onClick={() => {
                    openLeadForm()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full btn-primary py-5 px-8 mobile-touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">verified</span>
                    Get Free Estimates
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1">

          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
                
                {/* Left side - Text */}
                <div className="space-y-6 lg:space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-sm text-amber-400 font-medium">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    Licensed &bull; Insured &bull; Verified
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                    Don&apos;t let foundation cracks{' '}
                    <span className="text-amber-400">destroy your home&apos;s value.</span>
                  </h1>

                  <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl">
                    Foundation damage spreads <strong className="text-amber-400">40% faster in winter</strong>. Get matched with certified contractors in your area in 24 hours — before small cracks become major repairs.
                  </p>

                  {/* Search */}
                  <div className="max-w-xl space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                        <input
                          className="w-full rounded-xl border border-slate-600 bg-slate-800/80 py-4 pl-12 pr-4 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter your ZIP code"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <button
                        onClick={handleSearch}
                        className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-xl">search</span>
                        Get my contractor matches
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> Free quotes</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> No obligation</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> Takes 2 minutes</span>
                    </div>
                    <p className="text-xs text-amber-400/70 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Don&apos;t wait — cracks spread fastest in cold weather
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 pt-4 border-t border-slate-700/50">
                    <div>
                      <div className="text-2xl font-bold text-white">12,847+</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Licensed Contractors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">50</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">States</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">4.9&#9733;</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Avg Rating</div>
                    </div>
                  </div>
                </div>

                {/* Right side - Rotating Images */}
                <div className="hidden lg:block relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[380px]">
                    {heroImages.map((img, i) => (
                      <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl px-5 py-4 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">verified</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Pre-screened pros</div>
                        <div className="text-xs text-slate-500">Licensed &amp; insured only</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover-lift animate-on-scroll">
                  <div className="relative h-48 w-full overflow-hidden image-zoom">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Professional foundation repair team installing hydraulic piers under house foundation" src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"/>
                    <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-black uppercase text-amber-accent border border-amber-accent/30">
                      Premium Partner
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {/* Enhanced availability indicators */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <div className="availability-dot"></div>
                        <span className="font-medium text-green-700">Available today</span>
                      </div>
                      <div className="response-time-indicator">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>Responds in 2hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">handyman</span>
                        <span className="font-medium">8 jobs this week</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href="/texas/houston/precision-foundation-pros" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Precision Foundation Pros
                        </Link>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                          <span className="text-sm text-slate-600 font-medium">Houston, TX</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">(124 reviews)</span>
                        </div>
                        <p className="text-sm text-slate-600">Specializing in residential slab repairs since 2008</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          Licensed & Insured
                        </div>
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
                        className="flex-1 btn-primary"
                      >
                        <span className="material-symbols-outlined">contact_support</span>
                        Contact Now
                      </button>
                      <Link href="/texas/houston/precision-foundation-pros" className="btn-outline">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - Light mode card */}
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover-lift animate-on-scroll animate-delay-200">
                  <div className="relative h-48 w-full overflow-hidden image-zoom">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Foundation crack repair with professional epoxy injection equipment" src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {/* Enhanced availability indicators */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="font-medium text-amber-700">Next available: Tomorrow</span>
                      </div>
                      <div className="response-time-indicator">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>Responds in 4hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">handyman</span>
                        <span className="font-medium">5 jobs this week</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href="/texas/houston/solid-ground-engineering" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Solid Ground Engineering
                        </Link>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                          <span className="text-sm text-slate-600 font-medium">Houston, TX</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm">star_half</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">(98 reviews)</span>
                        </div>
                        <p className="text-sm text-slate-600">Expert foundation leveling and crack repair solutions</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          Licensed & Insured
                        </div>
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
                        className="flex-1 btn-primary"
                      >
                        <span className="material-symbols-outlined">contact_support</span>
                        Contact Now
                      </button>
                      <Link href="/texas/houston/solid-ground-engineering" className="btn-outline">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Light mode card */}
                <div className="bg-white border border-slate-200 group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover-lift animate-on-scroll animate-delay-400">
                  <div className="relative h-48 w-full overflow-hidden image-zoom">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Professional basement waterproofing and drainage system installation with modern equipment" src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=80"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {/* Enhanced availability indicators */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <div className="availability-dot"></div>
                        <span className="font-medium text-green-700">Available today</span>
                      </div>
                      <div className="response-time-indicator">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>Responds in 1hr</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">handyman</span>
                        <span className="font-medium">12 jobs this week</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href="/texas/houston/atlas-pier-specialists" className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          Atlas Pier Specialists
                        </Link>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                          <span className="text-sm text-slate-600 font-medium">Houston, TX</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-[#f59e0b]">
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">(56 reviews)</span>
                        </div>
                        <p className="text-sm text-slate-600">Professional basement waterproofing and pier systems</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          Licensed & Insured
                        </div>
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
                        className="flex-1 btn-primary"
                      >
                        <span className="material-symbols-outlined">contact_support</span>
                        Contact Now
                      </button>
                      <Link href="/texas/houston/atlas-pier-specialists" className="btn-outline">
                        <span className="material-symbols-outlined">info</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Location Section Teaser - Enhanced with animations */}
          <section className="bg-slate-50 py-20 lg:py-28 border-y border-slate-200 animate-on-scroll">
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
                  <img className="h-full w-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" alt="Foundation repair coverage across United States" src="https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80"/>
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
          <section className="py-24 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a] animate-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">How It Works</h2>
                <p className="text-slate-300 max-w-2xl mx-auto">Getting your home back on solid ground is simpler than you think. Follow our four-step process to find the right expert.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group animate-on-scroll animate-delay-100">
                  <div className="size-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border-2 border-white/30 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 relative">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">search</span>
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">Search</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Find certified foundation experts in your area by entering your ZIP code.</p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group animate-on-scroll animate-delay-200">
                  <div className="size-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border-2 border-white/30 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 relative">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">rule</span>
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">Compare</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Review ratings, past project photos, and structural specialties to find your match.</p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group animate-on-scroll animate-delay-300">
                  <div className="size-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border-2 border-white/30 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 relative">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">forum</span>
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">Contact</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Get free inspections and competitive quotes from verified professionals.</p>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col items-center text-center group animate-on-scroll animate-delay-400">
                  <div className="size-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border-2 border-white/30 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 relative">
                    <span className="material-symbols-outlined text-3xl text-white group-hover:text-white">house_with_shield</span>
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">Get Protected</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Secure your home's foundation and protect your family's most valuable asset.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Repair Types Section - Enhanced with dopamine animations */}
          <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-white animate-on-scroll">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 animate-on-scroll">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-sm">construction</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Expert Solutions</span>
                </div>
                <h2 className="text-slate-900 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">Common Foundation Repair Types</h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Understanding the right solution for your home is the first step toward a permanent fix. Explore our professional repair services.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {SERVICES.map((service, index) => (
                  <div key={service.slug} className={`group flex flex-col bg-slate-50 border-2 border-slate-200 rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-105 animate-on-scroll animate-delay-${(index + 1) * 100}`}>
                    <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-slate-900 text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{service.desc}</p>
                    <Link className="mt-auto text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 hover:text-amber-600 transition-all duration-200 group/link" href={`/services/${service.slug}`}>
                      Learn More 
                      <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
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
          
          {/* Testimonials Section - Enhanced with dopamine-triggering animations */}
          <section className="py-20 lg:py-28 px-6 bg-slate-50 animate-on-scroll">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-on-scroll">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-50 px-4 py-2 mb-6">
                  <span className="material-symbols-outlined text-green-600 text-sm">reviews</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-700">Success Stories</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Real Stories from Real Homeowners</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  Thousands of homeowners have trusted FoundationScout to connect them with expert contractors who deliver exceptional results.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover-lift animate-on-scroll animate-delay-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" 
                        alt="Sarah Martinez, Dallas homeowner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex text-amber-500 mb-2">
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                      </div>
                      <div className="text-slate-900 font-bold">Sarah Martinez</div>
                      <div className="text-slate-500 text-sm">Dallas, TX • Slab Repair</div>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed italic">
                    "After noticing cracks in our living room walls, we found our contractor through FoundationScout. The whole process took less than a week from estimate to completion. Three bids, fair pricing, and now our foundation is solid for decades."
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-green-600">✓ Project completed • Warranty active</span>
                  </div>
                </div>
                
                {/* Testimonial 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover-lift animate-on-scroll animate-delay-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" 
                        alt="James Rodriguez, Atlanta homeowner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex text-amber-500 mb-2">
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                      </div>
                      <div className="text-slate-900 font-bold">James Rodriguez</div>
                      <div className="text-slate-500 text-sm">Atlanta, GA • Piering & Leveling</div>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed italic">
                    "We got three quotes within 48 hours. The contractor we chose saved us over $3,000 compared to the first estimate we got on our own. The transparency in pricing and reviews made all the difference."
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-green-600">✓ $3,000 saved • 5-year warranty</span>
                  </div>
                </div>
                
                {/* Testimonial 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover-lift animate-on-scroll animate-delay-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" 
                        alt="Maria Lopez, Phoenix homeowner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex text-amber-500 mb-2">
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                        <span className="material-symbols-outlined text-lg fill-1">star</span>
                      </div>
                      <div className="text-slate-900 font-bold">Maria Lopez</div>
                      <div className="text-slate-500 text-sm">Phoenix, AZ • Basement Waterproofing</div>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed italic">
                    "I was terrified about the cost, but the free inspection put my mind at ease. Professional, honest, and the repair came with a 25-year warranty. Our basement has been bone dry for two years running."
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-green-600">✓ 25-year warranty • Dry basement</span>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center mt-16">
                <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full mb-4">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-sm font-bold text-primary">Join 15,000+ satisfied homeowners</span>
                </div>
                <div>
                  <button 
                    onClick={() => openLeadForm()}
                    className="bg-amber-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 btn-primary relative overflow-hidden"
                  >
                    <span className="relative z-10">Get Your Free Inspection Today</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Expert Bio Section */}
          <section className="py-20 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <ExpertBio />
            </div>
          </section>

          {/* Internal Links Section - All States & Services */}
          <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              {/* All 50 States Grid */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Foundation Repair by State</h2>
                <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
                  Find licensed foundation repair contractors in every state. Click your state to browse local experts.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 text-sm">
                  {[
                    { name: 'Alabama', slug: 'alabama' }, { name: 'Alaska', slug: 'alaska' }, { name: 'Arizona', slug: 'arizona' },
                    { name: 'Arkansas', slug: 'arkansas' }, { name: 'California', slug: 'california' }, { name: 'Colorado', slug: 'colorado' },
                    { name: 'Connecticut', slug: 'connecticut' }, { name: 'Delaware', slug: 'delaware' }, { name: 'Florida', slug: 'florida' },
                    { name: 'Georgia', slug: 'georgia' }, { name: 'Hawaii', slug: 'hawaii' }, { name: 'Idaho', slug: 'idaho' },
                    { name: 'Illinois', slug: 'illinois' }, { name: 'Indiana', slug: 'indiana' }, { name: 'Iowa', slug: 'iowa' },
                    { name: 'Kansas', slug: 'kansas' }, { name: 'Kentucky', slug: 'kentucky' }, { name: 'Louisiana', slug: 'louisiana' },
                    { name: 'Maine', slug: 'maine' }, { name: 'Maryland', slug: 'maryland' }, { name: 'Massachusetts', slug: 'massachusetts' },
                    { name: 'Michigan', slug: 'michigan' }, { name: 'Minnesota', slug: 'minnesota' }, { name: 'Mississippi', slug: 'mississippi' },
                    { name: 'Missouri', slug: 'missouri' }, { name: 'Montana', slug: 'montana' }, { name: 'Nebraska', slug: 'nebraska' },
                    { name: 'Nevada', slug: 'nevada' }, { name: 'New Hampshire', slug: 'new-hampshire' }, { name: 'New Jersey', slug: 'new-jersey' },
                    { name: 'New Mexico', slug: 'new-mexico' }, { name: 'New York', slug: 'new-york' }, { name: 'North Carolina', slug: 'north-carolina' },
                    { name: 'North Dakota', slug: 'north-dakota' }, { name: 'Ohio', slug: 'ohio' }, { name: 'Oklahoma', slug: 'oklahoma' },
                    { name: 'Oregon', slug: 'oregon' }, { name: 'Pennsylvania', slug: 'pennsylvania' }, { name: 'Rhode Island', slug: 'rhode-island' },
                    { name: 'South Carolina', slug: 'south-carolina' }, { name: 'South Dakota', slug: 'south-dakota' }, { name: 'Tennessee', slug: 'tennessee' },
                    { name: 'Texas', slug: 'texas' }, { name: 'Utah', slug: 'utah' }, { name: 'Vermont', slug: 'vermont' },
                    { name: 'Virginia', slug: 'virginia' }, { name: 'Washington', slug: 'washington' }, { name: 'West Virginia', slug: 'west-virginia' },
                    { name: 'Wisconsin', slug: 'wisconsin' }, { name: 'Wyoming', slug: 'wyoming' }
                  ].map((state) => (
                    <Link
                      key={state.slug}
                      href={`/${state.slug}`}
                      className="text-center p-3 bg-white border border-slate-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-200 font-medium"
                    >
                      {state.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Major Services Grid */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Foundation Repair Services</h2>
                <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
                  Comprehensive foundation repair solutions from certified professionals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Foundation Piering', slug: 'piering', icon: 'architecture', desc: 'Steel piers and helical piers' },
                    { name: 'Slab Repair', slug: 'slab-repair', icon: 'layers', desc: 'Concrete lifting and leveling' },
                    { name: 'Basement Waterproofing', slug: 'waterproofing', icon: 'water_drop', desc: 'Moisture control systems' },
                    { name: 'Crawl Space Repair', slug: 'crawl-space', icon: 'grid_guides', desc: 'Encapsulation and support' },
                    { name: 'Crack Repair', slug: 'crack-repair', icon: 'build', desc: 'Professional crack sealing' },
                    { name: 'House Leveling', slug: 'house-leveling', icon: 'balance', desc: 'Complete home releveling' },
                    { name: 'Foundation Inspection', slug: 'inspection', icon: 'visibility', desc: 'Professional evaluations' },
                    { name: 'Soil Stabilization', slug: 'soil-stabilization', icon: 'terrain', desc: 'Ground improvement' }
                  ].map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:bg-amber-50 hover:border-amber-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-4 text-amber-600">
                        <span className="material-symbols-outlined text-xl">{service.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                      <p className="text-sm text-slate-600">{service.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Urgency CTA Section - Dark Blue */}
          <section className="relative overflow-hidden py-24 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a]">
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
          
          {/* Trust Badges Row - Enhanced with dopamine-triggering animations */}
          <section className="py-20 lg:py-28 px-6 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200 animate-on-scroll">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-50 px-4 py-2 mb-6">
                <span className="material-symbols-outlined text-green-600 text-sm">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700">Industry-Verified Standards</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Backed by the Best in the Industry</h3>
              <p className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">Every contractor in our network meets rigorous professional standards and carries comprehensive insurance coverage.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <div className="group animate-on-scroll">
                  <div className="h-32 bg-white border-2 border-slate-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 hover:shadow-blue-100/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-blue-600 text-2xl animate-pulse-gentle">verified_user</span>
                      <span className="text-lg font-black text-slate-900">BBB</span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">Accredited Business</span>
                    <div className="flex text-yellow-400 text-sm mt-2">
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                    </div>
                  </div>
                </div>
                
                <div className="group animate-on-scroll animate-delay-200">
                  <div className="h-32 bg-white border-2 border-slate-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-xl hover:-translate-y-2 hover:border-green-300 hover:shadow-green-100/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-green-600 text-2xl">engineering</span>
                      <span className="text-lg font-black text-slate-900">ICC-ES</span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">Code Certified</span>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                      <span className="text-xs text-green-600 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
                
                <div className="group animate-on-scroll animate-delay-300">
                  <div className="h-32 bg-white border-2 border-slate-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 hover:shadow-blue-100/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-blue-600 text-2xl">security</span>
                      <span className="text-lg font-black text-slate-900">INSURED</span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">$2M+ Coverage</span>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-blue-600 text-sm">shield</span>
                      <span className="text-xs text-blue-600 font-bold">BONDED</span>
                    </div>
                  </div>
                </div>
                
                <div className="group animate-on-scroll animate-delay-400">
                  <div className="h-32 bg-white border-2 border-slate-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-xl hover:-translate-y-2 hover:border-amber-300 hover:shadow-amber-100/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-amber-600 text-2xl">workspace_premium</span>
                      <span className="text-lg font-black text-slate-900">WARRANTY</span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">5-Year Guarantee</span>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-amber-600 text-sm">verified</span>
                      <span className="text-xs text-amber-600 font-bold">BACKED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Urgency Message */}
              <div className="mt-16 p-8 bg-red-50 border border-red-200 rounded-2xl max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                  <h4 className="text-xl font-bold text-red-800">Don't Wait - Foundation Damage Gets Worse</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-4">
                    <div className="text-2xl font-bold text-red-600 mb-2">40%</div>
                    <p className="text-sm text-red-700 font-medium">Cracks spread faster in winter months</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-red-600 mb-2">2X</div>
                    <p className="text-sm text-red-700 font-medium">Average repair costs double every 18 months untreated</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-red-600 mb-2">15%</div>
                    <p className="text-sm text-red-700 font-medium">Home value drops with visible foundation issues</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => openLeadForm()}
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-600/25 btn-primary relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="material-symbols-outlined">schedule</span>
                      Get Emergency Inspection Today
                    </span>
                  </button>
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
                <div>
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <div className="size-8">
                      <span className="material-symbols-outlined text-2xl">foundation</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900">Foundation<span className="text-primary">Scout</span></span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Scout the best foundation repair pros near you</p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The nation&apos;s most trusted network of foundation repair specialists. We connect homeowners with certified pros to protect what matters most.
                </p>
              </div>
              
              {/* Services Column */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Services</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services/slab-repair">Slab Foundation Repair</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services/piering">Pier and Beam Repair</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services/waterproofing">Basement Waterproofing</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services/crawl-space">Crawl Space Encapsulation</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services">Structural Inspections</Link></li>
                </ul>
              </div>
              
              {/* Quick Links Column */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">Quick Links</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-600">
                  <li><Link className="hover:text-amber-600 transition-colors" href="/">About FoundationScout</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Contractor Portal</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/services">Industry Resources</Link></li>
                  <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Partner Program</Link></li>
                  <li><button onClick={() => openLeadForm()} className="hover:text-amber-600 transition-colors text-left">Contact Support</button></li>
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
              <p>© 2025 FoundationScout. All rights reserved.</p>
              <div className="flex gap-6">
                <Link className="hover:text-amber-600" href="#">Privacy Policy</Link>
                <Link className="hover:text-amber-600" href="#">Terms of Service</Link>
                <Link className="hover:text-amber-600" href="#">Cookie Settings</Link>
                <Link className="hover:text-amber-600" href="#">Accessibility</Link>
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
        
        {/* Dynamic Trust Popup */}
        {showTrustPopup && (
          <div className={`trust-popup ${showTrustPopup ? 'show' : ''}`}>
            <div className="bg-green-600 text-white p-6 rounded-xl shadow-2xl border border-green-500/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold mb-1">All contractors verified</div>
                  <div className="text-sm opacity-90 mb-3">Licensed, insured & background checked</div>
                  <button
                    onClick={() => setShowTrustPopup(false)}
                    className="text-xs text-green-200 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}