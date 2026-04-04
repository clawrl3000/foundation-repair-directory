import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateBreadcrumbSchema, jsonLdScript } from '@/lib/structured-data'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import BusinessImage from '@/components/BusinessImage'
import QuoteWizard from '@/components/QuoteWizard'

interface Props {
  params: Promise<{
    state: string
    city: string
    business: string
  }>
}

interface Review {
  id: string
  reviewer_name: string | null
  rating: number | null
  review_text: string
  source: string
  review_date: string | null
  created_at: string
}

interface BBBData {
  rating?: string // A+, A, B+, etc.
  is_accredited?: boolean
  years_accredited?: number
  complaint_count?: number
  profile_url?: string
  scraped_at?: string
  found?: boolean
}

interface BusinessData {
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
  email?: string
  zip?: string
  bbb_data?: BBBData
  city: {
    name: string
    slug: string
    state: {
      name: string
      abbreviation: string
      slug: string
    }
  }
  services: { name: string; slug: string }[]
  features: { name: string; slug: string }[]
  reviews: Review[]
  images?: { url: string; alt_text?: string; source?: string }[]
}

// Fallback business data for demo purposes
const FALLBACK_BUSINESS_DATA: Record<string, Record<string, Record<string, BusinessData>>> = {
  'texas': {
    'houston': {
      'houston-foundation-experts': {
        id: '1',
        name: 'Houston Foundation Experts',
        slug: 'houston-foundation-experts',
        phone: '(713) 555-0123',
        address: '1234 Main St',
        description: 'Leading foundation repair specialists in Houston with over 20 years of experience serving residential and commercial properties. We specialize in pier installation, slab repair, and waterproofing solutions.',
        rating: 4.8,
        review_count: 127,
        is_verified: true,
        year_established: 2003,
        website_url: 'https://houstonFoundationExperts.com',
        latitude: 29.7604,
        longitude: -95.3698,
        email: 'info@houstonfoundationexperts.com',
        city: {
          name: 'Houston',
          slug: 'houston',
          state: {
            name: 'Texas',
            abbreviation: 'TX',
            slug: 'texas'
          }
        },
        services: [
          { name: 'Pier & Beam Repair', slug: 'pier-beam-repair' },
          { name: 'Slab Foundation Repair', slug: 'slab-repair' },
          { name: 'Foundation Waterproofing', slug: 'waterproofing' },
          { name: 'Crack Repair', slug: 'crack-repair' }
        ],
        features: [
          { name: 'Licensed & Insured', slug: 'licensed-insured' },
          { name: 'Estimates Available', slug: 'estimates-available' },
          { name: 'Lifetime Warranty', slug: 'lifetime-warranty' },
          { name: '24/7 Emergency Service', slug: 'emergency-service' }
        ],
        reviews: [
          {
            id: '1',
            reviewer_name: 'Sarah Johnson',
            rating: 5,
            review_text: 'Excellent service! The team was professional, on time, and did outstanding work on our foundation. Highly recommend.',
            source: 'google',
            review_date: '2024-01-15',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            reviewer_name: 'Mike Thompson',
            rating: 5,
            review_text: 'Very satisfied with their foundation repair work. The warranty gives us peace of mind.',
            source: 'website',
            review_date: '2024-01-10',
            created_at: '2024-01-10T14:30:00Z'
          }
        ],
        images: []
      }
    }
  }
}

async function getBusinessData(stateSlug: string, citySlug: string, businessSlug: string): Promise<BusinessData | null> {
  try {
    const supabase = supabaseAdmin
    // Debug logging removed
    
    const { data: business, error } = await supabase
      .from('businesses')
      .select(`
        *,
        cities!inner (
          name,
          slug,
          states!inner (
            name,
            abbreviation,
            slug
          )
        ),
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
          )
        ),
        business_images (
          url,
          alt_text,
          source,
          is_primary,
          sort_order
        )
      `)
      .eq('slug', businessSlug)
      .eq('cities.slug', citySlug)
      .eq('cities.states.slug', stateSlug)
      .single()

    if (error || !business) {
      console.error('[BusinessPage] Query failed:', error?.message || 'no data')
      // Fallback to hardcoded data
      return FALLBACK_BUSINESS_DATA[stateSlug]?.[citySlug]?.[businessSlug] || null
    }

    // Sort images by sort_order, with primary images first
    const sortedImages = business.business_images?.sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return (a.sort_order || 0) - (b.sort_order || 0)
    }) || []

    const citiesData = business.cities as any
    // Sort reviews by date, most recent first
    const sortedReviews = (business as any).reviews?.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) || []

    return {
      ...business,
      city: {
        ...citiesData,
        state: citiesData.states,
      },
      services: business.business_services?.map((bs: any) => bs.services) || [],
      features: business.business_features?.map((bf: any) => bf.features) || [],
      reviews: sortedReviews,
      images: sortedImages
    }
  } catch (error) {
    console.error('Database error, using fallback data:', error)
    return FALLBACK_BUSINESS_DATA[stateSlug]?.[citySlug]?.[businessSlug] || null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, business } = await params
  
  const businessData = await getBusinessData(state, city, business)
  if (!businessData) {
    return {
      title: 'Business Not Found',
      description: 'The requested business could not be found.',
    }
  }

  const { name, description, city: cityInfo } = businessData
  const url = `https://foundationscout.com/${state}/${city}/${business}`

  return {
    title: `${name} — Foundation Repair in ${cityInfo.name}, ${cityInfo.state.abbreviation} | Reviews & Quotes`,
    description: description || `${name} provides professional foundation repair in ${cityInfo.name}, ${cityInfo.state.abbreviation}. Licensed, insured. Get estimates and read verified reviews.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${name} - Foundation Repair in ${cityInfo.name}, ${cityInfo.state.abbreviation}`,
      description: description || `Professional foundation repair services by ${name} in ${cityInfo.name}, ${cityInfo.state.name}.`,
      url: url,
      images: [
        {
          url: 'https://foundationscout.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${name} Foundation Repair Services`,
        },
      ],
    },
  }
}

export default async function BusinessPage({ params }: Props) {
  const { state, city, business } = await params
  
  const businessData = await getBusinessData(state, city, business)
  if (!businessData) {
    notFound()
  }

  const { name, description, phone, website_url, address, latitude, longitude, rating, review_count, is_verified, year_established, city: cityInfo, services, features, reviews, images, zip: businessZip } = businessData
  
  // Generate structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://foundationscout.com' },
    { name: `Foundation Repair in ${cityInfo.state.name}`, url: `https://foundationscout.com/${state}` },
    { name: `Foundation Repair in ${cityInfo.name}`, url: `https://foundationscout.com/${state}/${city}` },
    { name: name, url: `https://foundationscout.com/${state}/${city}/${business}` }
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
          <Link href={`/${state}`} className="hover:text-amber-600 transition-colors">{cityInfo.state.name}</Link>
          <span>/</span>
          <Link href={`/${state}/${city}`} className="hover:text-amber-600 transition-colors">{cityInfo.name}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{name}</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Business Hero */}
        <section className="py-12 lg:py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Business Image */}
                <div className="w-full lg:w-80 h-64 lg:h-auto flex-shrink-0">
                  <BusinessImage
                    businessId={businessData.id}
                    businessName={name}
                    latitude={latitude}
                    longitude={longitude}
                    photoReference={images?.[0]?.source === 'google_places' ? images[0].url : undefined}
                    alt={images?.[0]?.alt_text || `${name} photo`}
                    className="h-full w-full"
                    size="large"
                  />
                </div>

                {/* Business Info */}
                <div className="flex-1 p-8 lg:p-10">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-3">{name}</h1>

                  <p className="text-slate-500 mb-4 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {address && `${address}, `}{cityInfo.name}, {cityInfo.state.abbreviation}
                  </p>

                  {/* Rating */}
                  {rating && review_count > 0 && (
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-xl ${i < Math.round(rating) ? 'fill-1' : ''}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-slate-600">
                        {rating} ({review_count} reviews)
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {is_verified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
                        <span className="material-symbols-outlined text-sm fill-1">verified</span>
                        Verified
                      </span>
                    )}
                    {year_established && (
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200">
                        Est. {year_established}
                      </span>
                    )}
                    {businessData.bbb_data?.rating && (
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                        BBB {businessData.bbb_data.rating}
                      </span>
                    )}
                    {businessData.bbb_data?.is_accredited && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200">
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        BBB Accredited{businessData.bbb_data.years_accredited ? ` ${businessData.bbb_data.years_accredited}yr` : ''}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="text-slate-600 leading-relaxed mb-8">{description}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3" id="get-estimate">
                    <a href="#contact" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3.5 px-6 text-base font-bold text-white transition-colors hover:bg-amber-600 shadow-sm">
                      <span className="material-symbols-outlined text-lg">request_quote</span>
                      Get Estimate
                    </a>
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-800 hover:border-amber-400 hover:text-amber-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">phone</span>
                        {phone}
                      </a>
                    )}
                    {website_url && (
                      <a
                        href={website_url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-800 hover:border-amber-400 hover:text-amber-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services, Features & BBB */}
        <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {/* Services - full width, 2-column grid */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600">construction</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Our Services</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <div key={service.slug} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="material-symbols-outlined text-amber-500 text-lg">engineering</span>
                      <span className="text-slate-800 font-medium text-sm">{service.name}</span>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <p className="text-slate-500 text-sm">Services information coming soon.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Features & BBB - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Features */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600">verified</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Why Choose Us</h2>
                </div>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature.slug} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      <span className="text-slate-800 font-medium text-sm">{feature.name}</span>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-slate-500 text-sm">Features information coming soon.</p>
                  )}
                </div>
              </div>

              {/* BBB Information */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">BBB</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900">BBB Profile</h2>
                </div>
                {businessData.bbb_data && (businessData.bbb_data.rating || businessData.bbb_data.is_accredited) ? (
                  <div className="space-y-3">
                    {businessData.bbb_data.rating && (
                      <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {businessData.bbb_data.rating}
                        </div>
                        <span className="text-slate-800 font-medium text-sm">BBB Rating: {businessData.bbb_data.rating}</span>
                      </div>
                    )}
                    {businessData.bbb_data.is_accredited && (
                      <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <span className="material-symbols-outlined text-indigo-500 text-lg">workspace_premium</span>
                        <div>
                          <span className="text-slate-800 font-medium text-sm block">BBB Accredited</span>
                          {businessData.bbb_data.years_accredited && (
                            <span className="text-slate-500 text-xs">Accredited for {businessData.bbb_data.years_accredited} years</span>
                          )}
                        </div>
                      </div>
                    )}
                    {typeof businessData.bbb_data.complaint_count === 'number' && (
                      <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
                        <span className="text-slate-800 font-medium text-sm">
                          {businessData.bbb_data.complaint_count} complaint{businessData.bbb_data.complaint_count !== 1 ? 's' : ''} in last 3 years
                        </span>
                      </div>
                    )}
                    {businessData.bbb_data.profile_url && (
                      <a
                        href={businessData.bbb_data.profile_url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm pt-3 border-t border-slate-100 mt-3"
                      >
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                        View Full BBB Profile
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">BBB information not yet available for this business.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        {reviews && reviews.length > 0 && (
          <section className="py-16 lg:py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">Customer Reviews</h2>
                <p className="text-slate-500 text-lg">
                  What customers are saying about {name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Rating */}
                    {review.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-lg ${
                                i < review.rating! ? 'fill-1' : 'text-slate-300'
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-mono text-slate-500">
                          {review.rating}/5
                        </span>
                      </div>
                    )}

                    {/* Review Text */}
                    <p className="text-slate-700 leading-relaxed mb-5 flex-1">
                      &ldquo;{review.review_text}&rdquo;
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        {review.reviewer_name && (
                          <p className="font-semibold text-slate-900 text-sm">{review.reviewer_name}</p>
                        )}
                        {review.review_date && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(review.review_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        review.source === 'google'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : review.source === 'website'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {review.source === 'google' ? 'Google' :
                         review.source === 'website' ? 'Website' :
                         review.source.charAt(0).toUpperCase() + review.source.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length > 6 && (
                <p className="text-center text-slate-500 text-sm mt-8">
                  Showing 6 of {reviews.length} reviews
                </p>
              )}
            </div>
          </section>
        )}

        {/* Get Estimate Section */}
        <section id="get-estimate" className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="animate-on-scroll">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-6">
                  Request an Estimate from {name}
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Tell us about your foundation issue and we&apos;ll connect you with {name} for a no-obligation assessment.
                </p>
                <div className="space-y-5">
                  {phone && (
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                        <span className="material-symbols-outlined text-2xl text-amber-600">phone</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Call Directly</h3>
                        <a href={`tel:${phone}`} className="text-amber-600 hover:text-amber-700 font-medium">{phone}</a>
                      </div>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                        <span className="material-symbols-outlined text-2xl text-amber-600">location_on</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Location</h3>
                        <p className="text-sm text-slate-600">{address}, {cityInfo.name}, {cityInfo.state.abbreviation}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                      <span className="material-symbols-outlined text-2xl text-amber-600">schedule</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Service Area</h3>
                      <p className="text-sm text-slate-600">{cityInfo.name} and surrounding areas in {cityInfo.state.name}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-on-scroll">
                <QuoteWizard state={state} stateName={cityInfo.state.name} defaultZip={businessZip || undefined} />
              </div>
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
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": name,
          "url": website_url || `https://foundationscout.com/${state}/${city}/${business}`,
          "telephone": phone,
          "email": businessData.email,
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address,
            "addressLocality": cityInfo.name,
            "addressRegion": cityInfo.state.abbreviation,
            "addressCountry": "US"
          },
          "aggregateRating": rating && review_count > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": review_count
          } : undefined,
          "foundingDate": year_established ? `${year_established}-01-01` : undefined
        })}
      />
    </div>
  )
}