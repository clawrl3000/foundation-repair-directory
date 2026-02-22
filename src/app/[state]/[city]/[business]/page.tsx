import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateBreadcrumbSchema, jsonLdScript } from '@/lib/structured-data'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import BusinessImage from '@/components/BusinessImage'

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
          { name: 'Free Estimates', slug: 'free-estimates' },
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
        ),
        reviews (
          id,
          reviewer_name,
          rating,
          review_text,
          source,
          review_date,
          created_at
        )
      `)
      .eq('slug', businessSlug)
      .eq('cities.slug', citySlug)
      .eq('cities.states.slug', stateSlug)
      .single()

    if (error || !business) {
      console.error('[BusinessPage] Supabase query failed:', { error, stateSlug, citySlug, businessSlug })
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
    const sortedReviews = business.reviews?.sort((a: any, b: any) => 
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
    description: description || `${name} provides professional foundation repair in ${cityInfo.name}, ${cityInfo.state.abbreviation}. Licensed, insured. Get free estimates and read verified reviews.`,
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

  const { name, description, phone, website_url, address, latitude, longitude, rating, review_count, is_verified, year_established, city: cityInfo, services, features, reviews, images } = businessData
  
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
        {/* Business Header */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Business Image */}
                <div className="w-full lg:w-64 h-48 lg:h-64 rounded-xl overflow-hidden">
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
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{name}</h1>
                      <p className="text-slate-600 mb-3">
                        {address && `${address}, `}{cityInfo.name}, {cityInfo.state.abbreviation}
                      </p>
                      
                      {/* Rating */}
                      {rating && review_count > 0 && (
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`material-symbols-outlined text-lg ${i < Math.round(rating) ? 'fill-1' : ''}`}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-slate-600">
                            {rating} ({review_count} reviews)
                          </span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {is_verified && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full border border-green-200">
                            ✓ Verified Business
                          </span>
                        )}
                        {year_established && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200">
                            Est. {year_established}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {description && (
                    <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
                  )}
                  
                  {/* Contact Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 rounded-lg bg-amber-500 py-4 px-6 text-base font-bold text-white transition-colors hover:bg-amber-600">
                      Get Free Estimate
                    </button>
                    {phone && (
                      <a 
                        href={`tel:${phone}`}
                        className="flex-1 text-center border border-blue-500 text-blue-600 px-6 py-4 rounded-lg text-base font-bold hover:bg-blue-50 transition-colors"
                      >
                        {phone}
                      </a>
                    )}
                    {website_url && (
                      <a 
                        href={website_url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-6 py-4 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
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

        {/* Services & Features */}
        <section className="py-20 lg:py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Services */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.slug} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="material-symbols-outlined text-amber-600">engineering</span>
                      <span className="text-slate-900 font-medium">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Features */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Us</h2>
                <div className="space-y-4">
                  {features.map((feature) => (
                    <div key={feature.slug} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="size-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 text-lg">check</span>
                      </div>
                      <span className="text-slate-900 font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <section className="py-20 lg:py-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Customer Reviews</h2>
                <p className="text-slate-600 text-lg">
                  See what our customers are saying about {name}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((review) => (
                  <div 
                    key={review.id} 
                    className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Rating */}
                    {review.rating && (
                      <div className="flex items-center gap-2 mb-3">
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
                        <span className="text-sm text-slate-600">
                          {review.rating}/5
                        </span>
                      </div>
                    )}
                    
                    {/* Review Text */}
                    <p className="text-slate-700 leading-relaxed mb-4">
                      "{review.review_text}"
                    </p>
                    
                    {/* Reviewer Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        {review.reviewer_name && (
                          <p className="font-medium text-slate-900">
                            {review.reviewer_name}
                          </p>
                        )}
                        {review.review_date && (
                          <p className="text-sm text-slate-500">
                            {new Date(review.review_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      
                      {/* Source Badge */}
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          review.source === 'google' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : review.source === 'website'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {review.source === 'google' ? '📍 Google' : 
                           review.source === 'website' ? '🌐 Website' : 
                           review.source.charAt(0).toUpperCase() + review.source.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {reviews.length > 6 && (
                <div className="text-center mt-8">
                  <p className="text-slate-600">
                    Showing {Math.min(6, reviews.length)} of {reviews.length} reviews
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Contact {name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phone && (
                  <div className="text-center">
                    <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <span className="material-symbols-outlined text-3xl text-amber-600">phone</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
                    <a href={`tel:${phone}`} className="text-amber-600 hover:text-amber-700 text-lg font-medium">
                      {phone}
                    </a>
                  </div>
                )}
                
                {address && (
                  <div className="text-center">
                    <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <span className="material-symbols-outlined text-3xl text-amber-600">location_on</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Address</h3>
                    <p className="text-slate-600">
                      {address}<br />
                      {cityInfo.name}, {cityInfo.state.abbreviation}
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">schedule</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Service Area</h3>
                  <p className="text-slate-600">
                    {cityInfo.name} and surrounding areas in {cityInfo.state.name}
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg">
                  Request Free Foundation Inspection
                </button>
                <p className="mt-4 text-slate-500 text-sm">
                  Professional assessment • No obligation • Licensed & insured
                </p>
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