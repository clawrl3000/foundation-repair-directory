import Link from 'next/link'
import ExpertBio from '@/components/ExpertBio'
import CounterAnimation from '@/components/CounterAnimation'

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
      {/* Featured Contractors - Real data from database */}
      {featuredBusinesses.length > 0 && (
      <section className="py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 animate-on-scroll">
              Top-Rated <span className="text-amber-600">Foundation Pros</span> Near You
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto animate-on-scroll">
              These contractors earned their reputation through exceptional work and stellar customer reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz, i) => {
              const gradients = ['from-amber-400 to-orange-500', 'from-blue-400 to-cyan-500', 'from-emerald-400 to-teal-500']
              const icons = ['foundation', 'home_repair_service', 'construction']
              const iconColors = ['text-amber-400/80', 'text-blue-300/80', 'text-emerald-300/80']
              const delays = ['', 'animate-delay-200', 'animate-delay-400']
              const fullStars = Math.floor(biz.rating)
              const hasHalf = biz.rating - fullStars >= 0.25
              
              return (
                <div key={biz.id} className={`bg-white border border-slate-200 shadow-md group flex flex-col rounded-xl overflow-hidden card-hover animate-on-scroll ${delays[i]}`}>
                  <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${gradients[i]} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-6xl ${iconColors[i]} group-hover:scale-110 transition-transform duration-500`}>{icons[i]}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{biz.name}</h3>
                      <p className="text-sm text-slate-600">{biz.city}, {biz.stateAbbr}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(fullStars)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined fill-1 text-amber-400 text-lg">star</span>
                        ))}
                        {hasHalf && (
                          <span className="material-symbols-outlined fill-1 text-amber-400 text-lg">star_half</span>
                        )}
                        {[...Array(5 - fullStars - (hasHalf ? 1 : 0))].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-slate-300 text-lg">star</span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{biz.rating}</span>
                      <span className="text-sm text-slate-500">({biz.reviewCount} reviews)</span>
                    </div>

                    {biz.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{biz.description}</p>
                    )}

                    {biz.services.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {biz.services.map((service, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => onOpenLeadForm(biz.id, biz.name)}
                        className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                      >
                        Contact Now
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* Location Section Teaser - Enhanced with animations */}
      <section className="bg-slate-50 py-20 lg:py-28 border-y border-slate-200 animate-on-scroll">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-8">Find Foundation Pros in Your Area</h2>
              <div className="grid grid-cols-2 gap-4">
                {TOP_STATES.slice(0, 8).map((state, index) => (
                  <Link 
                    key={state.slug}
                    href={`/${state.slug}`}
                    className={`block p-4 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-300 group animate-on-scroll animate-delay-${index * 100}`}
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
              <div className="mt-8">
                <Link href="/states" className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-blue-800 transition-colors group">
                  View All 50 States
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="relative animate-on-scroll animate-delay-300">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="text-center mb-6">
                  <span className="material-symbols-outlined text-5xl text-primary mb-4">location_on</span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Find Your Perfect Match</h3>
                  <p className="text-slate-600">Local contractors. Real reviews. Verified results.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    Licensed & insured professionals
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    Real customer reviews & ratings
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    Free estimates & consultations
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl blur-3xl -z-10 scale-105"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works section - Dark Blue */}
      <section className="py-24 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a] animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">How It Works</h2>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto">Get matched with the right foundation contractor in minutes, not hours.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { number: '01', title: 'Tell Us About Your Problem', desc: 'Describe your foundation issues, timeline, and location in 2 minutes.', icon: 'edit_note' },
              { number: '02', title: 'Get Matched Instantly', desc: 'Our system finds qualified contractors in your area based on your specific needs.', icon: 'handshake' },
              { number: '03', title: 'Compare & Choose', desc: 'Review profiles, ratings, and get free estimates from multiple contractors.', icon: 'compare' },
              { number: '04', title: 'Get It Fixed Right', desc: 'Work with your chosen contractor to restore your foundation permanently.', icon: 'construction' }
            ].map((step, i) => (
              <div key={i} className={`text-center group animate-on-scroll animate-delay-${i * 150}`}>
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-blue-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl text-white">{step.icon}</span>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Types Section - Enhanced with dopamine animations */}
      <section className="py-20 lg:py-28 px-6 md:px-20 lg:px-40 bg-white animate-on-scroll">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              Foundation Repair <span className="text-primary">Services</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">From minor cracks to major structural issues, find specialists for every foundation problem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, i) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className={`block group animate-on-scroll animate-delay-${i * 100}`}>
                <div className="bg-white border border-slate-200 p-8 rounded-2xl group-hover:shadow-xl group-hover:border-primary transition-all duration-500 card-hover">
                  <span className={`material-symbols-outlined text-5xl text-primary mb-6 block group-hover:scale-110 transition-transform duration-500`}>
                    {service.icon}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{service.name}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Bio Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ExpertBio />
        </div>
      </section>

      {/* Homeowners Community Section */}
      <section className="py-20 lg:py-28 px-6 bg-slate-50 animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              Join <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-lg">Thousands</span> of Smart Homeowners
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">Real results from real people who chose FoundationScout to solve their foundation problems.</p>
          </div>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center animate-on-scroll">
              <div className="text-6xl lg:text-7xl font-black text-primary mb-4">
                <CounterAnimation end={15000} duration={2500} />+
              </div>
              <div className="text-xl font-semibold text-slate-900 mb-2">Jobs Completed</div>
              <div className="text-slate-600">Since 2019, with 98% customer satisfaction</div>
            </div>
            <div className="text-center animate-on-scroll animate-delay-200">
              <div className="text-6xl lg:text-7xl font-black text-primary mb-4">
4.9★
              </div>
              <div className="text-xl font-semibold text-slate-900 mb-2">Average Rating</div>
              <div className="text-slate-600">From verified customer reviews</div>
            </div>
            <div className="text-center animate-on-scroll animate-delay-400">
              <div className="text-6xl lg:text-7xl font-black text-primary mb-4">
                $<CounterAnimation end={12000} duration={3000} />
              </div>
              <div className="text-xl font-semibold text-slate-900 mb-2">Average Saved</div>
              <div className="text-slate-600">By comparing quotes through our platform</div>
            </div>
          </div>
          
          {/* Success Stories */}
          <div className="mb-16 animate-on-scroll">
            <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 card-hover animate-on-scroll">
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined fill-1">star</span>
                    ))}
                  </div>
                  <blockquote className="text-lg text-slate-700 italic mb-4">
                    "After getting three wildly different quotes, FoundationScout helped me find the right contractor who fixed our settling foundation for $8,400 instead of the $18,000 another company wanted."
                  </blockquote>
                  <div className="text-slate-900 font-semibold">Sarah M., Dallas, TX</div>
                  <div className="text-sm text-slate-500">Pier & beam foundation repair</div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 card-hover animate-on-scroll animate-delay-200">
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined fill-1">star</span>
                    ))}
                  </div>
                  <blockquote className="text-lg text-slate-700 italic mb-4">
                    "The cracks in our basement walls were getting worse every month. Through FoundationScout, I found a local contractor who waterproofed and stabilized everything. No more leaks!"
                  </blockquote>
                  <div className="text-slate-900 font-semibold">Mike Chen, Atlanta, GA</div>
                  <div className="text-sm text-slate-500">Basement waterproofing & crack repair</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-primary hover:bg-blue-800 text-white font-bold py-5 px-10 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Get Your Free Estimates Today
            </button>
            <p className="text-sm text-slate-500 mt-4">No commitment • Always free • Takes 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Internal Links Section - All States & Services */}
      <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* All 50 States Grid */}
          <div className="mb-16 animate-on-scroll">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Foundation Repair in All 50 States</h2>
              <p className="text-lg text-slate-600">Find qualified contractors no matter where you live.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 text-sm">
              {[
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
                'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
                'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
                'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
                'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
                'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
                'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
                'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
              ].map((state) => {
                const slug = state.toLowerCase().replace(' ', '-')
                return (
                  <Link 
                    key={state}
                    href={`/${slug}`}
                    className="p-2 text-slate-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200 text-center"
                  >
                    {state}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Major Services Grid */}
          <div className="animate-on-scroll">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Complete Foundation Services</h2>
              <p className="text-lg text-slate-600">Expert solutions for every foundation problem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Slab Repair', slug: 'slab-repair', icon: 'layers', desc: 'Concrete slab leveling & repair' },
                { name: 'Pier Installation', slug: 'piering', icon: 'architecture', desc: 'Steel & concrete pier systems' },
                { name: 'Basement Waterproofing', slug: 'waterproofing', icon: 'water_drop', desc: 'Complete moisture solutions' },
                { name: 'Crawl Space Repair', slug: 'crawl-space', icon: 'grid_guides', desc: 'Encapsulation and support' },
                { name: 'Foundation Inspection', slug: 'inspection', icon: 'search', desc: 'Professional assessment' },
                { name: 'Crack Repair', slug: 'crack-repair', icon: 'build', desc: 'Minor to major crack sealing' },
                { name: 'French Drains', slug: 'drainage', icon: 'drain', desc: 'Exterior drainage systems' },
                { name: 'Mudjacking', slug: 'mudjacking', icon: 'construction', desc: 'Slab lifting & stabilization' }
              ].map((service) => (
                <Link 
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 group"
                >
                  <span className={`material-symbols-outlined text-2xl text-primary mb-3 block group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </span>
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                  <p className="text-sm text-slate-600">{service.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgency CTA Section - Dark Blue */}
      <section className="relative overflow-hidden py-24 lg:py-28 px-6 md:px-20 lg:px-40 bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
        <div className="relative mx-auto max-w-4xl text-center animate-on-scroll">
          <div className="mb-8">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 animate-pulse">warning</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-8">
            Don't Wait Until It's <span className="text-red-400">Too Late</span>
          </h2>
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed">
            Minor cracks today become major structural failures tomorrow. Average repair costs double every 18 months when left untreated.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

      {/* About Section */}
      <section className="py-20 lg:py-28 px-6 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200 animate-on-scroll">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              About <span className="text-primary">FoundationScout</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">The most comprehensive directory of foundation repair contractors in America. We help homeowners make informed decisions.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { number: '15,000+', label: 'Jobs Completed', desc: 'Since 2019' },
              { number: '98%', label: 'Success Rate', desc: 'Customer satisfaction' },
              { number: '24/7', label: 'Support', desc: 'Always here to help' },
              { number: '$0', label: 'Cost to You', desc: 'Completely free service' }
            ].map((stat, i) => (
              <div key={i} className={`text-center animate-on-scroll animate-delay-${i * 100}`}>
                <div className="text-4xl lg:text-5xl font-black text-primary mb-3">{stat.number}</div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-600">{stat.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm animate-on-scroll">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Why Foundation Problems Can't Wait</h3>
                <div className="space-y-4 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-2xl text-red-600 mt-1 flex-shrink-0">trending_up</span>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Exponential Cost Growth</div>
                      <div className="text-sm">A $2,000 crack repair becomes a $15,000+ structural rebuild if ignored</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-2xl text-red-600 mt-1 flex-shrink-0">home</span>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Property Value Impact</div>
                      <div className="text-sm">Foundation issues can reduce home value by 10-25% until properly addressed</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-2xl text-red-600 mt-1 flex-shrink-0">health_and_safety</span>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Safety Concerns</div>
                      <div className="text-sm">Structural instability, water damage, and mold growth threaten your family's health</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <span className="material-symbols-outlined text-4xl text-red-600" role="img" aria-label="Warning about foundation damage">warning</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">Act Now, Save Thousands</h4>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">Month 0</div>
                    <div className="text-sm text-slate-600">Small crack</div>
                    <div className="text-lg font-semibold text-slate-900">$800</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">Month 12</div>
                    <div className="text-sm text-slate-600">Structural settling</div>
                    <div className="text-lg font-semibold text-slate-900">$8,500</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">Month 24</div>
                    <div className="text-sm text-red-700 font-medium">Major structural damage</div>
                    <div className="text-lg font-semibold text-slate-900">$22,000+</div>
                  </div>
                </div>
                <p className="text-sm text-red-700 font-medium">Average repair costs double every 18 months untreated</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center animate-on-scroll">
            <button
              onClick={() => onOpenLeadForm()}
              className="bg-primary hover:bg-blue-800 text-white font-bold py-5 px-10 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Start Your Free Foundation Assessment
            </button>
            <p className="text-sm text-slate-500 mt-4">No upfront cost • Local experts only • 2-minute setup</p>
          </div>
        </div>
      </section>
    </>
  )
}