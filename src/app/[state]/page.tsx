import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { generateBreadcrumbSchema, jsonLdScript } from '@/lib/structured-data'
import { notFound } from 'next/navigation'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

// Force dynamic rendering to avoid cookies issue during static generation
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ state: string }>
}

interface StateData {
  id: number
  name: string
  abbreviation: string
  slug: string
}

interface CityData {
  id: number
  name: string
  slug: string
  business_count: number
}

// Fallback state data for when database is not available
const FALLBACK_STATES: Record<string, StateData> = {
  'texas': { id: 1, name: 'Texas', abbreviation: 'TX', slug: 'texas' },
  'california': { id: 2, name: 'California', abbreviation: 'CA', slug: 'california' },
  'florida': { id: 3, name: 'Florida', abbreviation: 'FL', slug: 'florida' },
  'georgia': { id: 4, name: 'Georgia', abbreviation: 'GA', slug: 'georgia' },
  'north-carolina': { id: 5, name: 'North Carolina', abbreviation: 'NC', slug: 'north-carolina' },
  'ohio': { id: 6, name: 'Ohio', abbreviation: 'OH', slug: 'ohio' },
  'michigan': { id: 7, name: 'Michigan', abbreviation: 'MI', slug: 'michigan' },
  'pennsylvania': { id: 8, name: 'Pennsylvania', abbreviation: 'PA', slug: 'pennsylvania' },
  'illinois': { id: 9, name: 'Illinois', abbreviation: 'IL', slug: 'illinois' },
  'virginia': { id: 10, name: 'Virginia', abbreviation: 'VA', slug: 'virginia' },
  'tennessee': { id: 11, name: 'Tennessee', abbreviation: 'TN', slug: 'tennessee' },
  'missouri': { id: 12, name: 'Missouri', abbreviation: 'MO', slug: 'missouri' },
}

const FALLBACK_CITIES: Record<string, CityData[]> = {
  'texas': [
    { id: 1, name: 'Houston', slug: 'houston', business_count: 25 },
    { id: 2, name: 'Dallas', slug: 'dallas', business_count: 18 },
    { id: 3, name: 'Austin', slug: 'austin', business_count: 12 },
    { id: 4, name: 'San Antonio', slug: 'san-antonio', business_count: 15 },
    { id: 5, name: 'Fort Worth', slug: 'fort-worth', business_count: 9 },
    { id: 6, name: 'El Paso', slug: 'el-paso', business_count: 7 },
  ],
  'california': [
    { id: 5, name: 'Los Angeles', slug: 'los-angeles', business_count: 32 },
    { id: 6, name: 'San Francisco', slug: 'san-francisco', business_count: 14 },
    { id: 7, name: 'San Diego', slug: 'san-diego', business_count: 11 },
    { id: 8, name: 'Sacramento', slug: 'sacramento', business_count: 8 },
  ],
  'florida': [
    { id: 8, name: 'Miami', slug: 'miami', business_count: 19 },
    { id: 9, name: 'Orlando', slug: 'orlando', business_count: 13 },
    { id: 10, name: 'Tampa', slug: 'tampa', business_count: 16 },
    { id: 11, name: 'Jacksonville', slug: 'jacksonville', business_count: 12 },
  ],
  // Add more states as needed
}

async function getStateData(stateSlug: string): Promise<{state: StateData, cities: CityData[]} | null> {
  try {
    const supabase = await createClient()
    
    const { data: state, error: stateError } = await supabase
      .from('states')
      .select('*')
      .eq('slug', stateSlug)
      .single()

    if (stateError || !state) {
      // Fallback to hardcoded state data
      const fallbackState = FALLBACK_STATES[stateSlug]
      if (!fallbackState) return null
      
      const fallbackCities = FALLBACK_CITIES[stateSlug] || []
      return { state: fallbackState, cities: fallbackCities }
    }

    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        slug,
        businesses!inner(count)
      `)
      .eq('state_id', state.id)
      .not('businesses', 'is', null)

    const citiesWithCount = cities?.map((city: any) => ({
      ...city,
      business_count: city.businesses?.length || 0
    })).filter((city: CityData) => city.business_count > 0) || []

    return { state, cities: citiesWithCount }
  } catch (error) {
    console.error('Database error, using fallback data:', error)
    // Fallback to hardcoded state data
    const fallbackState = FALLBACK_STATES[stateSlug]
    if (!fallbackState) return null
    
    const fallbackCities = FALLBACK_CITIES[stateSlug] || []
    return { state: fallbackState, cities: fallbackCities }
  }
}

// State-specific content
const stateContent: Record<string, {
  soilTypes: string,
  commonIssues: string,
  avgCosts: string,
  seasonalFactors: string
}> = {
  'texas': {
    soilTypes: 'Expansive clay soils are common throughout Texas, particularly in the Dallas-Fort Worth area and Houston region.',
    commonIssues: 'Clay soil expansion and contraction, foundation settlement due to drought conditions, and pier & beam issues.',
    avgCosts: 'Foundation repairs in Texas typically range from $3,500 to $15,000, depending on the severity and type of repair needed.',
    seasonalFactors: 'Summer droughts and wet spring seasons cause significant soil movement, making foundation inspections crucial.'
  },
  'california': {
    soilTypes: 'California has diverse soil conditions from sandy coastal soils to clay and volcanic soils inland.',
    commonIssues: 'Seismic activity damage, soil liquefaction in coastal areas, and hillside settlement issues.',
    avgCosts: 'Foundation repairs in California range from $4,000 to $20,000, with higher costs in seismically active areas.',
    seasonalFactors: 'Earthquake season and winter rains can affect foundation stability, requiring specialized repair techniques.'
  },
  'florida': {
    soilTypes: 'Sandy soils predominate, with limestone bedrock and high water tables in many areas.',
    commonIssues: 'Sinkhole formation, high water table issues, and concrete slab settlement in sandy soils.',
    avgCosts: 'Foundation repairs in Florida typically cost $3,000 to $12,000, with sinkhole repairs potentially much higher.',
    seasonalFactors: 'Hurricane season and heavy summer rains can exacerbate foundation problems, especially with drainage issues.'
  }
  // Add more states as needed
}

// Generate static params for common states
export async function generateStaticParams() {
  // Return the most common state routes to pre-generate
  return [
    { state: 'texas' },
    { state: 'california' },
    { state: 'florida' },
    { state: 'georgia' },
    { state: 'north-carolina' },
    { state: 'ohio' },
    { state: 'michigan' },
    { state: 'pennsylvania' },
    { state: 'illinois' },
    { state: 'virginia' },
    { state: 'tennessee' },
    { state: 'missouri' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  
  const stateData = await getStateData(state)
  if (!stateData) {
    return {
      title: 'State Not Found',
      description: 'The requested state page could not be found.',
    }
  }

  const { state: stateInfo } = stateData
  const url = `https://foundationrepairfinder.com/${state}`

  return {
    title: `${stateInfo.name} Foundation Repair Contractors | Foundation Repair Directory`,
    description: `Find trusted foundation repair contractors in ${stateInfo.name}. Compare local experts, read verified reviews, and get free estimates for pier & beam, slab, and basement repairs.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${stateInfo.name} Foundation Repair Contractors | Foundation Repair Directory`,
      description: `Find trusted foundation repair contractors in ${stateInfo.name}. Compare local experts, read verified reviews, and get free estimates for pier & beam, slab, and basement repairs.`,
      url: url,
      images: [
        {
          url: 'https://foundationrepairfinder.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Foundation Repair in ${stateInfo.name}`,
        },
      ],
    },
  }
}

export default async function StatePage({ params }: Props) {
  const { state } = await params
  
  const stateData = await getStateData(state)
  if (!stateData) {
    notFound()
  }

  const { state: stateInfo, cities } = stateData
  const content = stateContent[state] || stateContent['texas'] // Fallback
  
  // Generate structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://foundationrepairfinder.com' },
    { name: `Foundation Repair in ${stateInfo.name}`, url: `https://foundationrepairfinder.com/${state}` }
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
          <span className="text-slate-900 font-medium">{stateInfo.name}</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Foundation Repair in {stateInfo.name}
            </h1>
            <p className="text-slate-600 text-lg mb-12 max-w-3xl leading-relaxed">
              Browse foundation repair contractors by city in {stateInfo.name}. 
              Find licensed professionals near you. Currently serving {cities.length} cities with verified contractors.
            </p>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Cities We Serve in {stateInfo.name}</h2>
              <p className="text-slate-600">Find foundation repair contractors in these cities across {stateInfo.name}.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${state}/${city.slug}`}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-amber-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <span className="material-symbols-outlined text-xl">location_city</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{city.name}</h3>
                      <p className="text-xs text-slate-500">{stateInfo.abbreviation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">engineering</span>
                      <span className="text-slate-600 text-sm">
                        {city.business_count} contractor{city.business_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600">
                      <span className="text-xs font-bold">View</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* State-Specific Content */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                About Foundation Repair in {stateInfo.name}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {stateInfo.name} homeowners understand the importance of a solid foundation. Local soil conditions, 
                climate patterns, and building codes all affect foundation health. Our directory connects you 
                with verified foundation repair professionals across {stateInfo.name} who specialize in pier & beam, 
                slab, and basement repair services.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">terrain</span>
                    <h3 className="text-xl font-bold text-slate-900">Soil Conditions</h3>
                  </div>
                  <p className="text-slate-600">{content.soilTypes}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
                    <h3 className="text-xl font-bold text-slate-900">Common Issues</h3>
                  </div>
                  <p className="text-slate-600">{content.commonIssues}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">payments</span>
                    <h3 className="text-xl font-bold text-slate-900">Average Costs</h3>
                  </div>
                  <p className="text-slate-600">{content.avgCosts}</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">schedule</span>
                    <h3 className="text-xl font-bold text-slate-900">Seasonal Factors</h3>
                  </div>
                  <p className="text-slate-600">{content.seasonalFactors}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Foundation Repair FAQs for {stateInfo.name}
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    How much does foundation repair cost in {stateInfo.name}?
                  </h3>
                  <p className="text-slate-600">
                    {content.avgCosts} Costs vary based on the type of foundation, extent of damage, 
                    and local labor rates. Get multiple quotes for accurate pricing.
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    What are the signs I need foundation repair?
                  </h3>
                  <p className="text-slate-600">
                    Look for cracks in walls or foundation, doors/windows that stick, uneven floors, 
                    or gaps between wall and ceiling. Schedule a professional inspection if you notice these signs.
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    How long does foundation repair take?
                  </h3>
                  <p className="text-slate-600">
                    Most foundation repairs take 1-3 days, though extensive repairs or adverse weather 
                    conditions in {stateInfo.name} may extend the timeline.
                  </p>
                </div>
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
    </div>
  )
}