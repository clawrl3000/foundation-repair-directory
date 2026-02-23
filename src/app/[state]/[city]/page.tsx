import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateBreadcrumbSchema, jsonLdScript } from '@/lib/structured-data'
import { notFound } from 'next/navigation'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import BusinessImage from '@/components/BusinessImage'

// Force dynamic rendering to avoid cookies issue during static generation
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ state: string; city: string }>
}

interface BusinessListing {
  id: string
  name: string
  slug: string
  phone?: string
  website_url?: string
  address?: string
  latitude?: number
  longitude?: number
  description?: string
  rating?: number
  review_count: number
  is_verified: boolean
  year_established?: number
  services: { name: string; slug: string }[]
  features: { name: string; slug: string; value: string }[]
  images?: { url: string; alt_text?: string; source?: string }[]
}

interface CityPageData {
  city: {
    id: number
    name: string
    slug: string
  }
  state: {
    id: number
    name: string
    abbreviation: string
    slug: string
  }
  businesses: BusinessListing[]
  cityContent?: {
    intro_text: string
    meta_title: string
    meta_description: string
    faq_json: string
    avg_price_min: number
    avg_price_max: number
    listing_count: number
    // Legacy fields (if columns exist)
    soil_type?: string
    climate_zone?: string
    common_issues?: string[]
    avg_repair_cost_min?: number
    avg_repair_cost_max?: number
    content_body?: string
    tips?: string[]
  }
}

// Fallback data for demo/testing purposes
const FALLBACK_CITY_DATA: Record<string, Record<string, CityPageData>> = {
  'texas': {
    'houston': {
      city: { id: 1, name: 'Houston', slug: 'houston' },
      state: { id: 1, name: 'Texas', abbreviation: 'TX', slug: 'texas' },
      businesses: [
        {
          id: '1',
          name: 'Houston Foundation Experts',
          slug: 'houston-foundation-experts',
          phone: '(713) 555-0123',
          address: '1234 Main St',
          description: 'Leading foundation repair specialists in Houston with over 20 years of experience serving residential and commercial properties.',
          rating: 4.8,
          review_count: 127,
          is_verified: true,
          year_established: 2003,
          services: [
            { name: 'Pier & Beam Repair', slug: 'pier-beam-repair' },
            { name: 'Slab Foundation Repair', slug: 'slab-repair' }
          ],
          features: [
            { name: 'Licensed & Insured', slug: 'licensed-insured', value: 'Yes' },
            { name: 'Estimates Available', slug: 'estimates-available', value: 'Yes' }
          ]
        },
        {
          id: '2',
          name: 'Texas Foundation Solutions',
          slug: 'texas-foundation-solutions',
          phone: '(713) 555-0456',
          address: '5678 Oak Ave',
          description: 'Comprehensive foundation repair and waterproofing services throughout Houston and surrounding areas.',
          rating: 4.6,
          review_count: 89,
          is_verified: true,
          year_established: 2010,
          services: [
            { name: 'Foundation Leveling', slug: 'foundation-leveling' },
            { name: 'Waterproofing', slug: 'waterproofing' }
          ],
          features: [
            { name: 'Lifetime Warranty', slug: 'lifetime-warranty', value: 'Yes' },
            { name: '24/7 Emergency Service', slug: 'emergency-service', value: 'Yes' }
          ]
        }
      ]
    },
    'dallas': {
      city: { id: 2, name: 'Dallas', slug: 'dallas' },
      state: { id: 1, name: 'Texas', abbreviation: 'TX', slug: 'texas' },
      businesses: [
        {
          id: '3',
          name: 'Dallas Foundation Pros',
          slug: 'dallas-foundation-pros',
          phone: '(214) 555-0789',
          address: '9012 Elm St',
          description: 'Trusted foundation repair contractors serving the Dallas metroplex for over 15 years.',
          rating: 4.9,
          review_count: 156,
          is_verified: true,
          year_established: 2008,
          services: [
            { name: 'Concrete Lifting', slug: 'concrete-lifting' },
            { name: 'Crack Repair', slug: 'crack-repair' }
          ],
          features: [
            { name: 'Same Day Service', slug: 'same-day-service', value: 'Yes' },
            { name: 'Money Back Guarantee', slug: 'money-back-guarantee', value: 'Yes' }
          ]
        }
      ]
    }
  }
}

async function getCityData(stateSlug: string, citySlug: string): Promise<CityPageData | null> {
  try {
    const supabase = supabaseAdmin
    
    // First get city and state info
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        slug,
        states!inner (
          id,
          name,
          abbreviation,
          slug
        )
      `)
      .eq('slug', citySlug)
      .eq('states.slug', stateSlug)
      .single()

    if (cityError || !cityData) {
      // Fallback to hardcoded city data
      const fallbackData = FALLBACK_CITY_DATA[stateSlug]?.[citySlug]
      return fallbackData || null
    }

    // Get city-specific content if available
    const { data: cityContent } = await supabase
      .from('city_content')
      .select('*')
      .eq('city_id', cityData.id)
      .single()

    // Get businesses for this city
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        slug,
        phone,
        website_url,
        address,
        latitude,
        longitude,
        description,
        rating,
        review_count,
        is_verified,
        year_established,
        business_services (
          services (
            name,
            slug
          )
        ),
        business_features (
          features (
            name,
            slug
          ),
          value
        ),
        business_images (
          url,
          alt_text,
          source,
          is_primary,
          sort_order
        )
      `)
      .eq('city_id', cityData.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .limit(20)

    const formattedBusinesses = businesses?.map((biz: any) => {
      // Sort images by sort_order, with primary images first
      const sortedImages = biz.business_images?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.sort_order || 0) - (b.sort_order || 0)
      }) || []

      return {
        ...biz,
        services: biz.business_services?.map((bs: any) => bs.services) || [],
        features: biz.business_features?.map((bf: any) => ({ ...bf.features, value: bf.value })) || [],
        images: sortedImages
      }
    }) || []

    return {
      city: cityData,
      state: cityData.states as any,
      businesses: formattedBusinesses,
      cityContent: cityContent || undefined
    }
  } catch (error) {
    console.error('Database error, using fallback data:', error)
    // Fallback to hardcoded city data
    const fallbackData = FALLBACK_CITY_DATA[stateSlug]?.[citySlug]
    return fallbackData || null
  }
}

// Generate static params for common city combinations
export async function generateStaticParams() {
  // Return common state/city combinations to pre-generate
  return [
    { state: 'texas', city: 'houston' },
    { state: 'texas', city: 'dallas' },
    { state: 'texas', city: 'austin' },
    { state: 'texas', city: 'san-antonio' },
    { state: 'california', city: 'los-angeles' },
    { state: 'california', city: 'san-francisco' },
    { state: 'california', city: 'san-diego' },
    { state: 'florida', city: 'miami' },
    { state: 'florida', city: 'orlando' },
    { state: 'florida', city: 'tampa' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params
  
  const pageData = await getCityData(state, city)
  if (!pageData) {
    return {
      title: 'City Not Found',
      description: 'The requested city page could not be found.',
    }
  }

  const { city: cityInfo, state: stateInfo } = pageData
  const url = `https://foundationscout.com/${state}/${city}`

  const metaTitle = pageData.cityContent?.meta_title || `${cityInfo.name}, ${stateInfo.abbreviation} Foundation Repair — Compare Top-Rated Contractors`
  const metaDesc = pageData.cityContent?.meta_description || `Find foundation repair contractors in ${cityInfo.name}, ${stateInfo.abbreviation}. Compare ratings, read reviews, get quotes. Licensed professionals for pier & beam, slab, basement repairs.`

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${cityInfo.name} Foundation Repair Contractors | Foundation Repair Directory`,
      description: `Find top-rated foundation repair contractors in ${cityInfo.name}, ${stateInfo.abbreviation}. Compare local experts, verified reviews, and get estimates.`,
      url: url,
      images: [
        {
          url: 'https://foundationscout.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Foundation Repair in ${cityInfo.name}, ${stateInfo.name}`,
        },
      ],
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params
  
  const pageData = await getCityData(state, city)
  if (!pageData) {
    notFound()
  }

  const { city: cityInfo, state: stateInfo, businesses, cityContent } = pageData
  
  // Generate structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://foundationscout.com' },
    { name: `Foundation Repair in ${stateInfo.name}`, url: `https://foundationscout.com/${state}` },
    { name: `Foundation Repair in ${cityInfo.name}`, url: `https://foundationscout.com/${state}/${city}` }
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />

      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${state}`} className="hover:text-amber-600 transition-colors">{stateInfo.name}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{cityInfo.name}</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Foundation Repair in {cityInfo.name}, {stateInfo.abbreviation}
            </h1>
            <p className="text-slate-600 text-lg mb-12 max-w-3xl leading-relaxed">
              {businesses.length > 1 ? (
                <>Compare {businesses.length} licensed foundation repair contractors in {cityInfo.name}. 
                Get estimates and find the right professional for your project.</>
              ) : businesses.length === 1 ? (
                <>Featured foundation repair contractor in {cityInfo.name}. 
                Get estimates and more contractors coming soon.</>
              ) : (
                <>Foundation repair contractors in {cityInfo.name}, {stateInfo.abbreviation}. 
                Get estimates from qualified professionals in your area.</>
              )}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap gap-3">
              {['All Services', 'Pier & Beam', 'Slab Repair', 'Crack Repair', 'Waterproofing'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm hover:border-amber-500 hover:text-amber-600 text-slate-700 transition-colors bg-slate-50"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Business Listings */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {businesses.length > 0 ? (
              <div className="space-y-6">
                {businesses.map((business) => (
                  <Link
                    key={business.id}
                    href={`/${state}/${city}/${business.slug}`}
                    className="bg-white border border-slate-200 rounded-xl shadow-sm group flex flex-col lg:flex-row overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-amber-300"
                  >
                    {/* Business Image */}
                    <div className="relative h-48 lg:h-auto lg:w-64 overflow-hidden">
                      <BusinessImage
                        businessId={business.id}
                        businessName={business.name}
                        latitude={business.latitude}
                        longitude={business.longitude}
                        photoReference={business.images?.[0]?.source === 'google_places' ? business.images[0].url : undefined}
                        alt={business.images?.[0]?.alt_text || `${business.name} photo`}
                        className="h-full w-full"
                        size="medium"
                      />
                      {business.is_verified && (
                        <div className="absolute top-4 right-4 rounded-full bg-green-100 backdrop-blur px-3 py-1 text-[10px] font-black uppercase text-green-700 border border-green-300">
                          Verified Pro
                        </div>
                      )}
                    </div>

                    {/* Business Details */}
                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                            {business.name}
                          </h3>
                          <p className="text-slate-500 text-sm mb-2">
                            {business.address ? `${business.address}, ` : ''}{cityInfo.name}, {stateInfo.abbreviation}
                          </p>
                          
                          {/* Rating */}
                          {business.rating && business.review_count > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`material-symbols-outlined text-sm ${i < Math.round(business.rating!) ? 'fill-1' : ''}`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                              <span className="text-slate-600 text-sm">
                                {business.rating} ({business.review_count} reviews)
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-500 text-xs ml-4">
                          {business.year_established && (
                            <span>Est. {business.year_established}</span>
                          )}
                        </div>
                      </div>
                      
                      {business.description && (
                        <p className="text-slate-600 mb-4 leading-relaxed">{business.description}</p>
                      )}
                      
                      {/* Services & Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {business.services.slice(0, 2).map((service) => (
                          <span key={service.slug} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">
                            {service.name}
                          </span>
                        ))}
                        {business.features.slice(0, 3).map((feature) => (
                          <span key={feature.slug} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                            {feature.name}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 rounded-lg bg-amber-500 py-3 px-6 text-base font-bold text-white transition-colors hover:bg-amber-600">
                          Get Estimate
                        </button>
                        {business.phone && (
                          <a 
                            href={`tel:${business.phone}`}
                            className="flex-1 text-center border border-blue-500 text-blue-600 px-6 py-3 rounded-lg text-base font-bold hover:bg-blue-50 transition-colors"
                          >
                            {business.phone}
                          </a>
                        )}
                        {business.website_url && (
                          <a 
                            href={business.website_url}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Visit website"
                          >
                            <span className="material-symbols-outlined">open_in_new</span>
                          </a>
                        )}
                        <button className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors">
                          <span className="material-symbols-outlined">info</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* More contractors coming soon message for single contractor */}
                {businesses.length === 1 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mt-8">
                    <span className="material-symbols-outlined text-3xl text-slate-400 mb-3 block">schedule</span>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">More Contractors Coming Soon</h3>
                    <p className="text-slate-600 text-sm">
                      We're actively adding more foundation repair professionals to {cityInfo.name}. 
                      Check back soon for additional options or expand your search to nearby cities.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-center py-16">
                <div className="max-w-md mx-auto">
                  <span className="material-symbols-outlined text-6xl text-slate-400 mb-4 block">search_off</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">No Foundation Repair Contractors Found</h3>
                  <p className="text-slate-600 mb-6">
                    We don't have any foundation repair contractors listed in {cityInfo.name} yet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                      href={`/${state}`}
                      className="rounded-lg bg-blue-600 py-3 px-6 text-white font-bold hover:bg-blue-700 transition-colors"
                    >
                      Browse {stateInfo.name} Cities
                    </Link>
                    <button className="rounded-lg border border-slate-300 py-3 px-6 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                      List Your Business
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* City Information */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                About Foundation Repair in {cityInfo.name}
              </h2>
              
              {cityContent?.intro_text ? (
                (() => {
                  // Parse structured intro_text into sections
                  const text = cityContent.intro_text
                  const soilMatch = text.match(/\*\*Soil Conditions:\*\*\s*(.+)/)
                  const climateMatch = text.match(/\*\*Climate Zone:\*\*\s*(.+)/)
                  const issuesSection = text.match(/\*\*Common Foundation Issues:\*\*\n([\s\S]*?)(?=\n\n\*\*|$)/)
                  const tipsSection = text.match(/\*\*Local Maintenance Tips:\*\*\n([\s\S]*?)$/)
                  const bodyText = text.split('\n\n')[0] // First paragraph is the main content
                  
                  const issues = issuesSection?.[1]?.split('\n').filter(l => l.startsWith('•')).map(l => l.replace('• ', '')) || []
                  const tips = tipsSection?.[1]?.split('\n').filter(l => l.startsWith('•')).map(l => l.replace('• ', '')) || []
                  
                  return (
                    <>
                      {/* City-specific geological and climate info */}
                      {(soilMatch || climateMatch) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {soilMatch && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <h4 className="font-bold text-slate-900 mb-2">Soil Type</h4>
                              <p className="text-slate-700 text-sm">{soilMatch[1]}</p>
                            </div>
                          )}
                          {climateMatch && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-bold text-slate-900 mb-2">Climate Zone</h4>
                              <p className="text-slate-700 text-sm">{climateMatch[1]}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* City-specific content body */}
                      <div className="prose prose-slate max-w-none mb-8">
                        <p className="text-slate-600 leading-relaxed mb-4">{bodyText}</p>
                      </div>
                      
                      {/* Common Issues */}
                      {issues.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Common Foundation Issues in {cityInfo.name}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {issues.map((issue, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                                <span className="text-slate-700 text-sm">{issue}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tips */}
                      {tips.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Foundation Maintenance Tips for {cityInfo.name}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tips.map((tip, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <span className="material-symbols-outlined text-green-600 text-sm mt-0.5">lightbulb</span>
                                <span className="text-slate-700 text-sm">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FAQ Section */}
                      {cityContent.faq_json && (() => {
                        try {
                          const faqs = JSON.parse(cityContent.faq_json)
                          return faqs.length > 0 ? (
                            <div className="mb-8">
                              <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Frequently Asked Questions
                              </h3>
                              <div className="space-y-4">
                                {faqs.map((faq: {q: string, a: string}, index: number) => (
                                  <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                                    <p className="text-slate-600 text-sm">{faq.a}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null
                        } catch { return null }
                      })()}
                    </>
                  )
                })()
              ) : (
                <p className="text-slate-600 leading-relaxed mb-8">
                  {cityInfo.name}, {stateInfo.name} homeowners face unique foundation challenges due to local soil conditions 
                  and climate. Whether you're dealing with settling, cracks, or water damage, finding a qualified 
                  foundation repair contractor is essential to protecting your investment. Our directory helps you 
                  compare local professionals, their services, warranties, and pricing to make an informed decision.
                </p>
              )}
              
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {cityContent?.avg_price_min ? `Foundation Repair Costs in ${cityInfo.name}` : `Average Foundation Repair Costs in ${cityInfo.name}`}
              </h3>
              
              {cityContent?.avg_price_min ? (
                /* Use city-specific cost ranges */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Minor Repair</p>
                    <p className="text-xl font-bold text-amber-600">$500–$2,000</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Average Repair</p>
                    <p className="text-xl font-bold text-amber-600">
                      ${(cityContent.avg_price_min / 1000).toFixed(0)}k–${(cityContent.avg_price_max / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Major Repair</p>
                    <p className="text-xl font-bold text-amber-600">
                      ${Math.round(cityContent.avg_price_max * 1.2 / 1000)}k–${Math.round(cityContent.avg_price_max * 1.8 / 1000)}k
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Per Pier</p>
                    <p className="text-xl font-bold text-amber-600">$1,000–$3,000</p>
                  </div>
                </div>
              ) : (
                /* Use generic cost ranges */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Minor Repair</p>
                    <p className="text-xl font-bold text-amber-600">$500–$2,000</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Average Repair</p>
                    <p className="text-xl font-bold text-amber-600">$4,500–$8,000</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Major Repair</p>
                    <p className="text-xl font-bold text-amber-600">$10,000–$20,000</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Per Pier</p>
                    <p className="text-xl font-bold text-amber-600">$1,000–$3,000</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema)}
      />
      {businesses.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Foundation Repair Contractors in ${cityInfo.name}, ${stateInfo.name}`,
            "numberOfItems": businesses.length,
            "itemListElement": businesses.map((business, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "LocalBusiness",
                "name": business.name,
                "url": `https://foundationscout.com/${state}/${city}/${business.slug}`,
                "telephone": business.phone,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": business.address,
                  "addressLocality": cityInfo.name,
                  "addressRegion": stateInfo.abbreviation,
                  "addressCountry": "US"
                },
                "aggregateRating": business.rating && business.review_count > 0 ? {
                  "@type": "AggregateRating",
                  "ratingValue": business.rating,
                  "reviewCount": business.review_count
                } : undefined
              }
            }))
          })}
        />
      )}
    </div>
  )
}