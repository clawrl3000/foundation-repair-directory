import { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const url = `https://foundationscout.com/cost/${state}/foundation-repair-cost`

  return {
    title: `Foundation Repair Cost in ${stateName} (2026) — Average Prices & Free Quotes`,
    description: `Complete foundation repair cost guide for ${stateName}: pier installation $8K-$25K, slab repair $500-$15K, waterproofing $1.5K-$10K. Get free estimates from licensed contractors.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `Foundation Repair Cost in ${stateName} 2024 | Pricing Guide`,
      description: `Complete foundation repair cost guide for ${stateName}. Average prices for pier installation, slab repair, and waterproofing. Get free local estimates.`,
      url: url,
      images: [
        {
          url: 'https://foundationscout.com/og-image.jpg',
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
    'Minor Repairs': { min: 500, max: 2000, description: 'Small cracks, minor settling', icon: 'build' },
    'Moderate Repairs': { min: 2000, max: 8000, description: 'Multiple cracks, some settlement', icon: 'engineering' },
    'Major Repairs': { min: 8000, max: 25000, description: 'Significant settlement, extensive piering', icon: 'foundation' },
    'Pier Installation': { min: 1000, max: 3000, description: 'Per pier (8-15 typically needed)', icon: 'architecture' },
    'Slab Jacking': { min: 500, max: 1500, description: 'Per affected area', icon: 'layers' },
    'Waterproofing': { min: 1500, max: 10000, description: 'Basement or crawl space', icon: 'water_drop' },
    'Crack Injection': { min: 300, max: 800, description: 'Per linear foot', icon: 'healing' }
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
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cost" className="hover:text-amber-600 transition-colors">Pricing</Link>
          <span>/</span>
          <Link href={`/cost/${state}`} className="hover:text-amber-600 transition-colors">{stateName}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Foundation Repair Cost</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Foundation Repair Cost in {stateName}
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-100 px-4 py-1.5 mb-8">
              <span className="material-symbols-outlined text-amber-600 text-sm">paid</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">2024 Pricing Guide</span>
            </div>
            <p className="text-slate-600 text-lg mb-12 max-w-3xl leading-relaxed">
              Complete pricing guide for foundation repair services in {stateName}. 
              Compare costs, get free estimates, and understand what affects pricing in your area.
            </p>
          </div>
        </section>

        {/* Cost Overview */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-4xl text-amber-600">payments</span>
                <h2 className="text-3xl font-bold text-slate-900">Average Foundation Repair Costs in {stateName}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(costData).map(([service, data]) => (
                  <div key={service} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-2xl text-amber-600">{data.icon}</span>
                      <h3 className="font-bold text-slate-900 text-lg">{service}</h3>
                    </div>
                    <div className="text-2xl font-black text-amber-600 mb-2">
                      ${data.min.toLocaleString()} - ${data.max.toLocaleString()}
                    </div>
                    <p className="text-slate-600 text-sm">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cost Factors */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Affects Foundation Repair Costs?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">foundation</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4">Foundation Issues</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Extent of settling or movement</li>
                    <li>• Number and size of cracks</li>
                    <li>• Foundation type</li>
                    <li>• Age and condition</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">terrain</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4">Site Conditions</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Soil type and stability</li>
                    <li>• Accessibility around foundation</li>
                    <li>• Depth to stable bearing strata</li>
                    <li>• Local building codes</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">engineering</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4">Repair Method</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Type of repair needed</li>
                    <li>• Materials and equipment</li>
                    <li>• Complexity of installation</li>
                    <li>• Warranty coverage</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">location_on</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-4">Location Factors</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Local labor costs</li>
                    <li>• Permit requirements</li>
                    <li>• Material availability</li>
                    <li>• Weather conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Foundation Repair Cost FAQs</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Transparency Section */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Get Transparent Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">search</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">1. Free Inspection</h3>
                  <p className="text-slate-600">Professional assessment of your foundation issues at no cost.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">calculate</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">2. Detailed Quote</h3>
                  <p className="text-slate-600">Itemized estimate with materials, labor, and timeline breakdown.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">compare</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">3. Compare Options</h3>
                  <p className="text-slate-600">Review multiple quotes and repair approaches to find the best value.</p>
                </div>
              </div>
              <div className="text-center">
                <Link 
                  href={`/${state}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg mr-4"
                >
                  Find Contractors in {stateName}
                </Link>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all">
                  Get Free Quote
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Savings Tips */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">How to Save on Foundation Repair Costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-green-600">schedule</span>
                    <h3 className="text-xl font-bold text-slate-900">Act Early</h3>
                  </div>
                  <p className="text-slate-600">Address foundation issues promptly to prevent minor problems from becoming major repairs. Early intervention saves thousands.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-green-600">compare_arrows</span>
                    <h3 className="text-xl font-bold text-slate-900">Get Multiple Quotes</h3>
                  </div>
                  <p className="text-slate-600">Compare 3-5 estimates from different contractors. Prices can vary significantly, but ensure you're comparing similar repair approaches.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-green-600">verified</span>
                    <h3 className="text-xl font-bold text-slate-900">Choose Quality</h3>
                  </div>
                  <p className="text-slate-600">Select contractors based on quality, not just price. Poor workmanship leads to costly repairs later. Look for warranties and guarantees.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-green-600">calendar_month</span>
                    <h3 className="text-xl font-bold text-slate-900">Seasonal Timing</h3>
                  </div>
                  <p className="text-slate-600">Some contractors offer discounts during slower seasons. However, don't delay urgent repairs to wait for better pricing.</p>
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
                  "item": "https://foundationscout.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Pricing",
                  "item": "https://foundationscout.com/cost"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": stateName,
                  "item": `https://foundationscout.com/cost/${state}`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Foundation Repair Cost",
                  "item": `https://foundationscout.com/cost/${state}/foundation-repair-cost`
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
    </div>
  )
}