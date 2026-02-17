import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const url = `https://foundationrepairfinder.com/cost/${state}/foundation-repair-cost`

  return {
    title: `Foundation Repair Cost in ${stateName} 2024 | Pricing Guide`,
    description: `Complete foundation repair cost guide for ${stateName}. Average prices for pier installation, slab repair, and waterproofing. Get free local estimates.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `Foundation Repair Cost in ${stateName} 2024 | Pricing Guide`,
      description: `Complete foundation repair cost guide for ${stateName}. Average prices for pier installation, slab repair, and waterproofing. Get free local estimates.`,
      url: url,
      images: [
        {
          url: 'https://foundationrepairfinder.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Foundation Repair Costs in ${stateName}`,
        },
      ],
    },
  }
}

export default async function FoundationRepairCostPage({ params }: Props) {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const costData = {
    'Minor Repairs': { min: 500, max: 2000, description: 'Small cracks, minor settling' },
    'Moderate Repairs': { min: 2000, max: 8000, description: 'Multiple cracks, some settlement' },
    'Major Repairs': { min: 8000, max: 25000, description: 'Significant settlement, extensive piering' },
    'Pier Installation': { min: 1000, max: 3000, description: 'Per pier (8-15 typically needed)' },
    'Slab Jacking': { min: 500, max: 1500, description: 'Per affected area' },
    'Waterproofing': { min: 1500, max: 10000, description: 'Basement or crawl space' },
    'Crack Injection': { min: 300, max: 800, description: 'Per linear foot' }
  }

  const faqs = [
    {
      question: `How much does foundation repair cost in ${stateName}?`,
      answer: `Foundation repair costs in ${stateName} typically range from $500 for minor crack repairs to $25,000+ for major structural issues requiring extensive piering. The average homeowner spends $4,500-$8,000 on foundation repairs.`
    },
    {
      question: `What factors affect foundation repair costs in ${stateName}?`,
      answer: `Foundation repair costs in ${stateName} depend on the extent of damage, soil conditions, foundation type, accessibility, and local labor costs. Clay soil areas may require more extensive solutions.`
    },
    {
      question: `Is foundation repair covered by homeowners insurance in ${stateName}?`,
      answer: `Homeowners insurance typically doesn't cover foundation repair in ${stateName} if caused by settling, poor maintenance, or construction defects. Coverage may apply if damage results from a covered peril like a burst pipe.`
    },
    {
      question: `How can I get accurate foundation repair quotes in ${stateName}?`,
      answer: `Get 3-5 quotes from licensed foundation repair contractors in ${stateName}. Most offer free inspections and estimates. Compare their proposed solutions, warranties, and timeline for completion.`
    },
    {
      question: `What's the best time of year for foundation repair in ${stateName}?`,
      answer: `Foundation repair can be done year-round in ${stateName}, but spring and fall often provide the best conditions. Avoid extreme weather periods when possible, and address issues promptly to prevent further damage.`
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/cost" className="hover:text-amber-600">Pricing</Link>
          <span>/</span>
          <Link href={`/cost/${state}`} className="hover:text-amber-600">{stateName}</Link>
          <span>/</span>
          <span className="text-gray-800">Foundation Repair Cost</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Foundation Repair Cost in {stateName} (2024)
        </h1>
        <p className="text-gray-600 mb-8">
          Complete pricing guide for foundation repair services in {stateName}. 
          Compare costs, get free estimates, and understand what affects pricing.
        </p>

        {/* Cost Overview */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">Average Foundation Repair Costs in {stateName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(costData).map(([service, data]) => (
              <div key={service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{service}</h3>
                  <span className="text-green-600 font-bold">
                    ${data.min.toLocaleString()} - ${data.max.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Factors */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">What Affects Foundation Repair Costs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Foundation Issues</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Extent of settling or movement</li>
                <li>• Number and size of cracks</li>
                <li>• Foundation type (slab, pier & beam, basement)</li>
                <li>• Age and condition of existing foundation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Site Conditions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Soil type and stability</li>
                <li>• Accessibility around foundation</li>
                <li>• Depth to stable bearing strata</li>
                <li>• Local building codes and permits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">Foundation Repair Cost FAQs</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-amber-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Free Foundation Repair Quotes in {stateName}</h2>
          <p className="text-gray-600 mb-6">
            Connect with certified foundation contractors in your area. 
            Compare quotes and find the best value for your foundation repair project.
          </p>
          <Link 
            href={`/${state}`}
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Find Contractors in {stateName}
          </Link>
        </div>
      </div>

      {/* JSON-LD Schema */}
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
                  "name": "Pricing",
                  "item": "https://foundationrepairfinder.com/cost"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": stateName,
                  "item": `https://foundationrepairfinder.com/cost/${state}`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Foundation Repair Cost",
                  "item": `https://foundationrepairfinder.com/cost/${state}/foundation-repair-cost`
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          ]),
        }}
      />
    </main>
  )
}