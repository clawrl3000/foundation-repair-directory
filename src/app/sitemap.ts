import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const SERVICES = [
  { slug: 'foundation-repair', lastModified: '2026-02-17' },
  { slug: 'pier-and-beam-repair', lastModified: '2026-02-17' },
  { slug: 'slab-foundation-repair', lastModified: '2026-02-17' },
  { slug: 'wall-anchor-installation', lastModified: '2026-02-17' },
  { slug: 'foundation-crack-repair', lastModified: '2026-02-17' },
  { slug: 'basement-waterproofing', lastModified: '2026-02-17' },
  { slug: 'crawl-space-repair', lastModified: '2026-02-17' },
  { slug: 'house-leveling', lastModified: '2026-02-17' },
  { slug: 'underpinning', lastModified: '2026-02-17' },
  { slug: 'drainage-solutions', lastModified: '2026-02-17' },
  { slug: 'concrete-lifting', lastModified: '2026-02-17' },
  { slug: 'seawall-repair', lastModified: '2026-02-17' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://foundationrepairfinder.com'
  const today = new Date().toISOString().split('T')[0]

  const routes: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(today),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // States index
    {
      url: `${baseUrl}/states`,
      lastModified: new Date(today),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Services index
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(today),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // Get states with business data
    const { data: statesData } = await supabase
      .from('states')
      .select(`
        slug,
        updated_at,
        cities!inner(
          slug,
          updated_at,
          businesses(count)
        )
      `)
      .limit(50)

    if (statesData && statesData.length > 0) {
      // State pages
      statesData.forEach((state) => {
        routes.push({
          url: `${baseUrl}/${state.slug}`,
          lastModified: new Date(state.updated_at || today),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })

      // City pages
      const { data: citiesData } = await supabase
        .from('cities')
        .select(`
          slug,
          updated_at,
          states!inner(slug),
          businesses(count)
        `)
        .not('businesses', 'is', null)
        .limit(500)

      if (citiesData) {
        citiesData.forEach((city: any) => {
          routes.push({
            url: `${baseUrl}/${city.states.slug}/${city.slug}`,
            lastModified: new Date(city.updated_at || today),
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        })
      }

      // Business pages
      const { data: businessesData } = await supabase
        .from('businesses')
        .select(`
          slug,
          updated_at,
          states!inner(slug),
          cities!inner(slug)
        `)
        .eq('is_active', true)
        .limit(2000)

      if (businessesData) {
        businessesData.forEach((business: any) => {
          routes.push({
            url: `${baseUrl}/${business.states.slug}/${business.cities.slug}/${business.slug}`,
            lastModified: new Date(business.updated_at || today),
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        })
      }

      // Cost pages for states with businesses
      statesData.forEach((state) => {
        routes.push({
          url: `${baseUrl}/cost/${state.slug}/foundation-repair-cost`,
          lastModified: new Date(today),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }
  } catch (error) {
    console.error('Error generating sitemap from database:', error)
    // Fallback to basic structure if database is not ready
  }

  // Service pages
  SERVICES.forEach((service) => {
    routes.push({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.lastModified),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return routes
}