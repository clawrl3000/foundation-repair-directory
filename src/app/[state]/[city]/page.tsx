import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const url = `https://foundationrepairfinder.com/${state}/${city}`

  return {
    title: `${cityName} Foundation Repair Contractors | Foundation Repair Directory`,
    description: `Find top-rated foundation repair contractors in ${cityName}, ${stateName}. Compare local experts, verified reviews, and get free estimates. Licensed professionals for pier & beam, slab, basement repairs.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${cityName} Foundation Repair Contractors | Foundation Repair Directory`,
      description: `Find top-rated foundation repair contractors in ${cityName}, ${stateName}. Compare local experts, verified reviews, and get free estimates. Licensed professionals for pier & beam, slab, basement repairs.`,
      url: url,
      images: [
        {
          url: 'https://foundationrepairfinder.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Foundation Repair in ${cityName}, ${stateName}`,
        },
      ],
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // TODO: Fetch from Supabase
  const mockListings = [1, 2, 3, 4, 5]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href={`/${state}`} className="hover:text-amber-600">{stateName}</Link>
          <span>/</span>
          <span className="text-gray-800">{cityName}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Foundation Repair in {cityName}, {stateName}
        </h1>
        <p className="text-gray-600 mb-8">
          Compare {mockListings.length} licensed foundation repair contractors in {cityName}. 
          Get free estimates and find the right professional for your project.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['All Services', 'Pier & Beam', 'Slab Repair', 'Crack Repair', 'Waterproofing'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:border-amber-500 hover:text-amber-600 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {mockListings.map((i) => (
            <Link
              key={i}
              href={`/${state}/${city}/example-contractor-${i}`}
              className="block bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Example Foundation Repair Co. {i}</h3>
                  <p className="text-gray-500 text-sm mt-1">{cityName}, {stateName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★★★★★</span>
                      <span className="text-gray-500 text-sm">5.0 (0 reviews)</span>
                    </div>
                    <span className="text-green-600 text-sm">✓ Verified</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Free Inspection', 'Lifetime Warranty', 'Licensed'].map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                  Get Estimate
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* City Content (SEO) */}
        <section className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            About Foundation Repair in {cityName}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {cityName}, {stateName} homeowners face unique foundation challenges due to local soil conditions 
            and climate. Whether you're dealing with settling, cracks, or water damage, finding a qualified 
            foundation repair contractor is essential to protecting your investment. Our directory helps you 
            compare local professionals, their services, warranties, and pricing to make an informed decision.
          </p>
          <h3 className="text-lg font-semibold mt-6 mb-3">
            Average Foundation Repair Costs in {cityName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-gray-500">Minor Repair</p>
              <p className="font-bold text-amber-600">$500–$2,000</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-gray-500">Average Repair</p>
              <p className="font-bold text-amber-600">$4,500–$8,000</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-gray-500">Major Repair</p>
              <p className="font-bold text-amber-600">$10,000–$20,000</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-gray-500">Per Pier</p>
              <p className="font-bold text-amber-600">$1,000–$3,000</p>
            </div>
          </div>
        </section>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
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
                  "name": `Foundation Repair in ${stateName}`,
                  "item": `https://foundationrepairfinder.com/${state}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": `Foundation Repair in ${cityName}`,
                  "item": `https://foundationrepairfinder.com/${state}/${city}`
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": `Foundation Repair Contractors in ${cityName}, ${stateName}`,
              "numberOfItems": mockListings.length,
              "itemListElement": mockListings.map((i) => ({
                "@type": "ListItem",
                "position": i,
                "item": {
                  "@type": "LocalBusiness",
                  "name": `Example Foundation Repair Co. ${i}`,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": cityName,
                    "addressRegion": stateName,
                  }
                }
              }))
            }
          ]),
        }}
      />
    </main>
  )
}
