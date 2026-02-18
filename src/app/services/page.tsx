import { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

export const metadata: Metadata = {
  title: 'Foundation Repair Services | Foundation Repair Directory',
  description: 'Explore professional foundation repair services including piering, slab repair, waterproofing, and crawl space repair. Find certified contractors nationwide.',
  alternates: {
    canonical: 'https://foundationscout.com/services',
  },
  openGraph: {
    title: 'Foundation Repair Services | Foundation Repair Directory',
    description: 'Explore professional foundation repair services including piering, slab repair, waterproofing, and crawl space repair. Find certified contractors nationwide.',
    url: 'https://foundationscout.com/services',
    images: [
      {
        url: 'https://foundationscout.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair Services',
      },
    ],
  },
}

const SERVICES = [
  {
    slug: 'piering',
    name: 'Foundation Piering',
    description: 'Steel push piers and helical piers for permanent foundation stabilization and lifting.',
    icon: 'architecture',
    priceRange: '$8,000 - $45,000',
    features: ['Permanent solution', 'Minimal excavation', 'Lifetime warranty']
  },
  {
    slug: 'slab-repair', 
    name: 'Slab Foundation Repair',
    description: 'Slab jacking, crack repair, and concrete lifting for damaged concrete foundations.',
    icon: 'layers',
    priceRange: '$500 - $15,000',
    features: ['Quick completion', 'Cost effective', 'Minimally invasive']
  },
  {
    slug: 'waterproofing',
    name: 'Foundation Waterproofing', 
    description: 'Drainage systems, sump pumps, and moisture barriers to keep basements dry.',
    icon: 'water_drop',
    priceRange: '$1,500 - $10,000',
    features: ['Moisture control', 'Mold prevention', 'Interior & exterior']
  },
  {
    slug: 'crawl-space',
    name: 'Crawl Space Repair',
    description: 'Encapsulation, support beam repair, and moisture control for healthier homes.',
    icon: 'grid_guides',
    priceRange: '$1,500 - $8,000',
    features: ['Air quality improvement', 'Energy efficiency', 'Structural support']
  },
  {
    slug: 'crack-repair',
    name: 'Foundation Crack Repair',
    description: 'Professional crack injection and sealing to prevent water intrusion.',
    icon: 'build',
    priceRange: '$300 - $2,000',
    features: ['Water damage prevention', 'Structural integrity', 'Quick repair']
  },
  {
    slug: 'house-leveling',
    name: 'House Leveling',
    description: 'Complete home releveling using hydraulic jacks and permanent support systems.',
    icon: 'balance',
    priceRange: '$5,000 - $25,000',
    features: ['Complete solution', 'Restore property value', 'Expert installation']
  }
]

export default function ServicesPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Services</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Foundation Repair Services
            </h1>
            <p className="text-slate-600 text-lg mb-12 max-w-3xl leading-relaxed">
              Professional foundation repair services available nationwide. Compare contractors, 
              services, and pricing for all types of foundation issues.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Complete Foundation Solutions</h2>
              <p className="text-slate-600">From minor crack repairs to complete foundation replacement, find the right service for your needs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-amber-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-14 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{service.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1">{service.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-amber-600 font-bold text-lg">{service.priceRange}</div>
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <span className="text-sm">Learn More</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How Our Service Matching Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">search</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">1. Describe Your Issue</h3>
                  <p className="text-slate-600">Tell us about your foundation problems, from minor cracks to major structural issues.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">engineering</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">2. Get Matched</h3>
                  <p className="text-slate-600">We connect you with certified contractors who specialize in your specific repair needs.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">handshake</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">3. Compare & Choose</h3>
                  <p className="text-slate-600">Review quotes, warranties, and timelines to select the best contractor for your project.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Fix Your Foundation?</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                Connect with certified foundation repair contractors in your area. 
                Get free estimates and compare services from top-rated professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg"
                >
                  Find Contractors Near You
                </Link>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all">
                  Get Free Estimate
                </button>
              </div>
              <p className="mt-6 text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base">verified_user</span>
                Free inspections available from certified local pros
              </p>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://foundationscout.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://foundationscout.com/services"
              }
            ]
          }),
        }}
      />
    </div>
  )
}