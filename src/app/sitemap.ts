import { MetadataRoute } from 'next'

// TODO: Replace with actual data from Supabase
const STATES = [
  { slug: 'texas', lastModified: '2024-02-17' },
  { slug: 'california', lastModified: '2024-02-17' },
  { slug: 'florida', lastModified: '2024-02-17' },
  { slug: 'georgia', lastModified: '2024-02-17' },
  { slug: 'north-carolina', lastModified: '2024-02-17' },
  { slug: 'ohio', lastModified: '2024-02-17' },
  { slug: 'michigan', lastModified: '2024-02-17' },
  { slug: 'pennsylvania', lastModified: '2024-02-17' },
  { slug: 'illinois', lastModified: '2024-02-17' },
  { slug: 'virginia', lastModified: '2024-02-17' },
  { slug: 'tennessee', lastModified: '2024-02-17' },
  { slug: 'missouri', lastModified: '2024-02-17' },
]

// TODO: Replace with actual cities data
const SAMPLE_CITIES = [
  { state: 'texas', slug: 'houston', lastModified: '2024-02-17' },
  { state: 'texas', slug: 'dallas', lastModified: '2024-02-17' },
  { state: 'texas', slug: 'san-antonio', lastModified: '2024-02-17' },
  { state: 'texas', slug: 'austin', lastModified: '2024-02-17' },
  { state: 'california', slug: 'los-angeles', lastModified: '2024-02-17' },
  { state: 'california', slug: 'san-francisco', lastModified: '2024-02-17' },
  { state: 'california', slug: 'san-diego', lastModified: '2024-02-17' },
  { state: 'florida', slug: 'miami', lastModified: '2024-02-17' },
  { state: 'florida', slug: 'tampa', lastModified: '2024-02-17' },
  { state: 'florida', slug: 'orlando', lastModified: '2024-02-17' },
]

// TODO: Replace with actual business data
const SAMPLE_BUSINESSES = [
  { state: 'texas', city: 'houston', slug: 'precision-foundation-pros', lastModified: '2024-02-17' },
  { state: 'texas', city: 'houston', slug: 'solid-ground-engineering', lastModified: '2024-02-17' },
  { state: 'texas', city: 'dallas', slug: 'atlas-pier-specialists', lastModified: '2024-02-17' },
  { state: 'california', city: 'los-angeles', slug: 'foundation-masters-ca', lastModified: '2024-02-17' },
]

const SERVICES = [
  { slug: 'piering', lastModified: '2024-02-17' },
  { slug: 'slab-repair', lastModified: '2024-02-17' },
  { slug: 'waterproofing', lastModified: '2024-02-17' },
  { slug: 'crawl-space', lastModified: '2024-02-17' },
  { slug: 'crack-repair', lastModified: '2024-02-17' },
  { slug: 'house-leveling', lastModified: '2024-02-17' },
  { slug: 'basement-repair', lastModified: '2024-02-17' },
]

const COST_PAGES = [
  { state: 'texas', slug: 'foundation-repair-cost', lastModified: '2024-02-17' },
  { state: 'california', slug: 'foundation-repair-cost', lastModified: '2024-02-17' },
  { state: 'florida', slug: 'foundation-repair-cost', lastModified: '2024-02-17' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://foundationrepairfinder.com'

  const routes: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date('2024-02-17'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // States index
    {
      url: `${baseUrl}/states`,
      lastModified: new Date('2024-02-17'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // State pages
  STATES.forEach((state) => {
    routes.push({
      url: `${baseUrl}/${state.slug}`,
      lastModified: new Date(state.lastModified),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // City pages
  SAMPLE_CITIES.forEach((city) => {
    routes.push({
      url: `${baseUrl}/${city.state}/${city.slug}`,
      lastModified: new Date(city.lastModified),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Business pages
  SAMPLE_BUSINESSES.forEach((business) => {
    routes.push({
      url: `${baseUrl}/${business.state}/${business.city}/${business.slug}`,
      lastModified: new Date(business.lastModified),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // Service pages
  SERVICES.forEach((service) => {
    routes.push({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.lastModified),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // Cost pages
  COST_PAGES.forEach((cost) => {
    routes.push({
      url: `${baseUrl}/cost/${cost.state}/${cost.slug}`,
      lastModified: new Date(cost.lastModified),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return routes
}