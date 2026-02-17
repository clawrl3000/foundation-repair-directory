import { Metadata } from 'next'
import Link from 'next/link'

// This is the most important page for SEO — individual listing
// Will be statically generated for every business

interface Props {
  params: Promise<{
    state: string
    city: string
    business: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, business } = await params
  const businessName = business.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `${businessName} — Foundation Repair in ${cityName}, ${stateName}`,
    description: `Get a free estimate from ${businessName} in ${cityName}, ${stateName}. Compare services, warranties, and pricing for foundation repair.`,
  }
}

export default async function BusinessPage({ params }: Props) {
  const { state, city, business } = await params
  const businessName = business.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // TODO: Fetch from Supabase
  // const { data: biz } = await supabase.from('businesses').select('*').eq('slug', business).single()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href={`/${state}`} className="hover:text-amber-600">{stateName}</Link>
          <span>/</span>
          <Link href={`/${state}/${city}`} className="hover:text-amber-600">{cityName}</Link>
          <span>/</span>
          <span className="text-gray-800">{businessName}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{businessName}</h1>
                  <p className="text-gray-600 mt-1">Foundation Repair in {cityName}, {stateName}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★★★★★</span>
                      <span className="text-gray-600 text-sm">5.0 (0 reviews)</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">✓ Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Foundation Repair', 'Pier & Beam', 'Slab Repair', 'Crack Repair', 'House Leveling', 'Waterproofing'].map((service) => (
                  <div key={service} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Why Choose {businessName}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🛡️', label: 'Licensed & Insured' },
                  { icon: '📋', label: 'Free Inspections' },
                  { icon: '⏰', label: 'Lifetime Warranty' },
                  { icon: '💰', label: 'Financing Available' },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Area */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Service Area</h2>
              <p className="text-gray-600">
                {businessName} serves {cityName} and surrounding areas in {stateName}.
              </p>
              {/* Map placeholder */}
              <div className="mt-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">
                Map coming soon
              </div>
            </div>
          </div>

          {/* Sidebar — Lead Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold text-center mb-2">Get a Free Estimate</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                Contact {businessName} for a free foundation inspection
              </p>
              
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-600">
                  <option>What type of repair?</option>
                  <option>Foundation Cracks</option>
                  <option>Sinking/Settling</option>
                  <option>Bowing Walls</option>
                  <option>Water Damage</option>
                  <option>Not Sure</option>
                </select>
                <textarea
                  placeholder="Describe your foundation issue..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Request Free Estimate
                </button>
                <p className="text-xs text-gray-400 text-center">
                  No obligation. Your info is only shared with this contractor.
                </p>
              </form>

              {/* Direct Contact */}
              <div className="mt-6 pt-6 border-t">
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center gap-2 w-full border-2 border-amber-500 text-amber-600 font-semibold py-3 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  📞 Call Now
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 w-full mt-3 text-gray-600 hover:text-amber-600 text-sm"
                >
                  🌐 Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Providers */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Other Foundation Repair Contractors in {cityName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="font-semibold">Contractor {i}</h3>
                <p className="text-gray-500 text-sm mt-1">{cityName}, {stateName}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-amber-500 text-sm">★★★★★</span>
                  <span className="text-gray-400 text-sm">(0)</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": businessName,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressRegion": stateName,
              "addressCountry": "US"
            },
            "@id": `https://foundationrepairfinder.com/${state}/${city}/${business}`,
            "url": `https://foundationrepairfinder.com/${state}/${city}/${business}`,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "0"
            }
          }),
        }}
      />
    </main>
  )
}
