import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Foundation Repair Services | Foundation Repair Directory',
  description: 'Explore professional foundation repair services including piering, slab repair, waterproofing, and crawl space repair. Find certified contractors nationwide.',
  alternates: {
    canonical: 'https://foundationrepairfinder.com/services',
  },
  openGraph: {
    title: 'Foundation Repair Services | Foundation Repair Directory',
    description: 'Explore professional foundation repair services including piering, slab repair, waterproofing, and crawl space repair. Find certified contractors nationwide.',
    url: 'https://foundationrepairfinder.com/services',
    images: [
      {
        url: 'https://foundationrepairfinder.com/og-image.jpg',
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
    priceRange: '$8,000 - $45,000'
  },
  {
    slug: 'slab-repair', 
    name: 'Slab Foundation Repair',
    description: 'Slab jacking, crack repair, and concrete lifting for damaged concrete foundations.',
    icon: 'layers',
    priceRange: '$500 - $15,000'
  },
  {
    slug: 'waterproofing',
    name: 'Foundation Waterproofing', 
    description: 'Drainage systems, sump pumps, and moisture barriers to keep basements dry.',
    icon: 'water_drop',
    priceRange: '$1,500 - $10,000'
  },
  {
    slug: 'crawl-space',
    name: 'Crawl Space Repair',
    description: 'Encapsulation, support beam repair, and moisture control for healthier homes.',
    icon: 'grid_guides',
    priceRange: '$1,500 - $8,000'
  },
  {
    slug: 'crack-repair',
    name: 'Foundation Crack Repair',
    description: 'Professional crack injection and sealing to prevent water intrusion.',
    icon: 'build',
    priceRange: '$300 - $2,000'
  },
  {
    slug: 'house-leveling',
    name: 'House Leveling',
    description: 'Complete home releveling using hydraulic jacks and permanent support systems.',
    icon: 'balance',
    priceRange: '$5,000 - $25,000' 
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <span className="text-gray-800">Services</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Foundation Repair Services</h1>
        <p className="text-gray-600 mb-8">
          Professional foundation repair services available nationwide. Compare contractors, 
          services, and pricing for all types of foundation issues.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-primary">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">{service.priceRange}</span>
                <span className="text-primary font-medium">Learn More →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Fix Your Foundation?</h2>
          <p className="text-gray-600 mb-6">
            Connect with certified foundation repair contractors in your area. 
            Get free estimates and compare services from top-rated professionals.
          </p>
          <Link 
            href="/"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Find Contractors Near You
          </Link>
        </div>
      </div>

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
                "item": "https://foundationrepairfinder.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://foundationrepairfinder.com/services"
              }
            ]
          }),
        }}
      />
    </main>
  )
}