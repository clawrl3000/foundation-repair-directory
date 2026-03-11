import { Metadata } from 'next'
import HomePage from '@/components/HomePage'
import { generateFAQSchema, jsonLdScript } from '@/lib/structured-data'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Foundation Repair Contractors Near You | Free Quotes',
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and connect with licensed pros. Average rating: 4.9/5 stars.',
  alternates: {
    canonical: 'https://foundationscout.com',
  },
  openGraph: {
    title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    description: 'Compare foundation repair contractors nationwide. Get estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
    url: 'https://foundationscout.com',
    images: [
      {
        url: 'https://foundationscout.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair Directory',
      },
    ],
  },
}

async function getFeaturedBusinesses() {
  try {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select(`
        id, name, slug, rating, review_count, description, address,
        cities!inner (name, slug, states!inner (name, abbreviation, slug)),
        business_services (services (name, slug))
      `)
      .eq('is_active', true)
      .gte('rating', 4.5)
      .gte('review_count', 10)
      .order('review_count', { ascending: false })
      .limit(3)

    if (error || !data) return []
    
    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      rating: b.rating,
      reviewCount: b.review_count,
      description: b.description,
      city: b.cities?.name,
      citySlug: b.cities?.slug,
      stateAbbr: b.cities?.states?.abbreviation,
      stateSlug: b.cities?.states?.slug,
      services: b.business_services?.map((bs: any) => bs.services).filter(Boolean).slice(0, 3) || [],
    }))
  } catch {
    return []
  }
}

export default async function Page() {
  const featuredBusinesses = await getFeaturedBusinesses()
  // FAQ data for schema markup
  const faqs = [
    {
      question: "How much does foundation repair cost?",
      answer: "Foundation repair costs typically range from $3,500 to $15,000 depending on the type and severity of damage. Minor crack repairs may cost $300-$2,000, while major structural repairs like piering can cost $8,000-$45,000. Factors include foundation type, soil conditions, extent of damage, and local labor rates."
    },
    {
      question: "How do I know if my foundation needs repair?",
      answer: "Common signs include: cracks in walls or ceilings, doors and windows that stick, uneven or sagging floors, gaps between walls and ceiling/floor, cracks in the foundation itself, water intrusion in basements, and visible settling or tilting. Schedule a professional inspection if you notice multiple warning signs."
    },
    {
      question: "What are signs of foundation problems?",
      answer: "Key warning signs include: hairline or stair-step cracks in walls, horizontal cracks in foundation walls, doors and windows that don't close properly, sloping or uneven floors, gaps around window frames or exterior doors, water damage or moisture in basements, and nail pops in drywall."
    },
    {
      question: "How long does foundation repair take?",
      answer: "Most foundation repairs take 1-5 days to complete. Minor crack repairs can be finished in a few hours, while major pier installations may take 3-7 days depending on the number of piers needed. Weather conditions, accessibility, and permit requirements can affect timelines."
    },
    {
      question: "Does homeowners insurance cover foundation repair?",
      answer: "Standard homeowners insurance typically does NOT cover foundation repair caused by settling, soil movement, or normal wear. However, sudden damage from covered perils like burst pipes or natural disasters may be covered. Check your specific policy and consider separate foundation coverage if available in your area."
    }
  ]

  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <HomePage featuredBusinesses={featuredBusinesses} faqs={faqs} />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqSchema)}
      />
    </>
  )
}