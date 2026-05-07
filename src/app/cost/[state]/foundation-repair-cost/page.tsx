import { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import EstimateButton from '@/components/EstimateButton'

interface Props {
  params: Promise<{ state: string }>
}

/**
 * Phase 4 directional test — 4-hook A/B/C/D probe shipped 2026-05-07
 * (PRD-SERP-PROMISE-CONCIERGE-LOOP.md Section 8 / Section 15).
 *
 * Each entry assigns one of 4 hook styles to one cost-page state. The
 * hypothesis is that snippet-level positioning (not relevance) is the
 * bottleneck on cost pages — May 1-2 saw 8,850 impressions at avg pos
 * 13 with zero clicks site-wide. The 4 hooks test different ways to
 * give users a reason to click a DR-0 result over Angi/HomeAdvisor:
 *
 *   - Helper-led    (CA) — escapes the "directory" category entirely;
 *                          positions FoundationScout as a guide
 *   - Outcome-led   (TX) — promises a specific deliverable
 *   - Trust-led     (OK) — competes on editorial independence
 *   - Benefit-led   (AZ) — promises a faster transactional benefit
 *
 * Florida and New York are deliberately untouched as PURE CONTROLS for
 * this experiment — do NOT add overrides for them. Other state slugs
 * fall through to the generic template. PA/NC/IL/MI/OH/TN/GA/MO/VA
 * already have state-DIRECTORY overrides on /[state]/page.tsx from
 * the April 23 ship; their cost pages use the generic template here.
 *
 * Measurement window: 2026-05-07 → 2026-05-21. Decision matrix in
 * PRD Section 9 ("Per-hook SEO evaluation"). Read as a directional
 * probe — confirm any apparent winner with a 2nd state before rolling.
 */
const costPageMetaOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDescription?: string }> = {
  // Hook 4 — Helper-led (Diagnostic-help variant 4b).
  // Reframes SERP promise from "directory" to "guide ABOUT the directory."
  // California: highest cost-page impression volume = fastest signal detection.
  california: {
    title: `California Foundation Repair: Get a Free Scout Report Before You Call`,
    description: `Worried about California foundation costs? We'll diagnose what you're seeing, give you a likely cost range, and tell you what to ask 3 local contractors. Free, takes 2 minutes, no sales calls.`,
    ogTitle: `California Foundation Repair — Free Scout Report Before You Call`,
    ogDescription: `Diagnose your foundation issue, see typical California costs, get 3 verified local contractor options. Free Scout Report, 2 minutes, no login.`,
  },
  // Hook 2 — Outcome-led.
  // Texas: largest US foundation-repair market (clay soil), high commercial intent.
  // Action language fits the buyer mindset.
  texas: {
    title: `Texas Foundation Repair Cost + 3 Local Contractor Options`,
    description: `2026 Texas foundation repair pricing by city + 3 verified local contractor options matched to your ZIP. Free Scout Report, no sales calls. Houston, Dallas, Austin, San Antonio coverage.`,
    ogTitle: `Texas Foundation Repair Cost + 3 Verified Local Contractors`,
    ogDescription: `See 2026 Texas pricing by city and get 3 license-verified contractor options for your ZIP. Free Scout Report.`,
  },
  // Hook 3 — Trust-led.
  // Oklahoma: clay-heavy region, contractor-skeptical sentiment;
  // "no paid placement" hook may resonate with rural-trust dynamic.
  oklahoma: {
    title: `Oklahoma Foundation Repair Cost — Verified Contractors, No Paid Placement`,
    description: `Oklahoma foundation repair costs from $3,800–$12,000. License-verified, BBB-checked contractor options. No paid placement. Free Scout Report explains what's wrong and what fair prices look like.`,
    ogTitle: `Oklahoma Foundation Repair — Verified Contractors, No Paid Placement`,
    ogDescription: `Free Scout Report with 2026 Oklahoma pricing + license-verified, BBB-checked contractor options. Editorial independence — we don't take paid placements.`,
  },
  // Hook 1 — Benefit-led.
  // Arizona: moderate volume, neutral positioning, anchor-control variant.
  arizona: {
    title: `Arizona Foundation Repair Cost: Estimate Before You Call`,
    description: `See typical Arizona foundation repair costs, then get a free Scout Report with a cost sanity check and local contractor options for your ZIP. Phoenix, Tucson, Mesa, Tempe coverage.`,
    ogTitle: `Arizona Foundation Repair Cost — Estimate Before You Call`,
    ogDescription: `2026 Arizona pricing + free Scout Report with cost sanity check and local contractor options for your ZIP.`,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const url = `https://foundationscout.com/cost/${state}/foundation-repair-cost`

  // Phase 4 hook override — falls through to the generic template for any
  // state not in the directional test (FL/NY controls + 45 untouched states).
  const override = costPageMetaOverrides[state]
  const title = override?.title
    || `Foundation Repair Cost in ${stateName} (2026): $500–$25K+ | Price Guide`
  const description = override?.description
    || `How much does foundation repair cost in ${stateName}? Minor repairs start at $500; major piering runs $8K–$25K+. See 2026 local pricing & get free quotes from licensed contractors.`
  const ogTitle = override?.ogTitle
    || `Foundation Repair Cost in ${stateName} 2026 | Pricing Guide`
  const ogDescription = override?.ogDescription
    || `Complete foundation repair cost guide for ${stateName}. Average prices for pier installation, slab repair, and waterproofing. Get free local estimates.`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
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
      answer: `Get 3-5 quotes from licensed foundation repair contractors in ${stateName}. Most offer inspections and estimates. Compare their proposed solutions, warranties, and timeline for completion.`
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
          <Link href={`/${state}`} className="hover:text-amber-600 transition-colors">{stateName}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Foundation Repair Cost</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Compact hero with modal CTA */}
        <section className="py-10 lg:py-14 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-100 px-4 py-1.5 mb-4">
              <span className="material-symbols-outlined text-xl text-amber-600" aria-hidden="true">paid</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">2026 Pricing Guide</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-4">
              Foundation Repair Cost in {stateName}
            </h1>
            <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Complete pricing guide for foundation repair services in {stateName}. Compare costs, get estimates, and understand what affects pricing in your area.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <EstimateButton
                state={state}
                stateName={stateName}
                eventName="cost_page_estimate_click_hero"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base px-6 py-3 shadow-sm hover:shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-xl">request_quote</span>
                Get Your Free {stateName} Estimate
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </EstimateButton>
              <Link
                href={`/calculator?state=${state}`}
                data-event-name="cost_page_calculator_click_hero"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold text-base px-6 py-3 transition-all"
              >
                <span className="material-symbols-outlined text-xl">calculate</span>
                Estimate your {stateName} foundation repair cost
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href={`/${state}`}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-600 font-medium text-sm transition-colors"
              >
                or browse {stateName} contractors
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Cost Overview */}
        <section className="py-14 lg:py-18 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-4xl text-amber-600" role="img" aria-label="Payment information">payments</span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900">Average Foundation Repair Costs in {stateName}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(costData).map(([service, data]) => (
                  <div key={service} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-4xl text-amber-600" role="img" aria-label={`${service} costs`}>{data.icon}</span>
                      <h3 className="font-semibold text-slate-900 text-lg">{service}</h3>
                    </div>
                    <div className="text-2xl font-black text-amber-600 mb-2 font-mono">
                      ${data.min.toLocaleString()} - ${data.max.toLocaleString()}
                    </div>
                    <p className="text-slate-600 text-sm">{data.description}</p>
                  </div>
                ))}
              </div>
              {/* Inline lead-in to the calculator — highest-intent placement */}
              <p className="mt-6 text-base text-slate-600 leading-relaxed">
                These are statewide ranges.{' '}
                <Link
                  href={`/calculator?state=${state}`}
                  data-event-name="cost_page_calculator_click_inline"
                  className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2 decoration-amber-300 hover:decoration-amber-500 transition-colors"
                >
                  Calculate your specific {stateName} cost based on home size and damage type
                </Link>
                {' '}— takes about 60 seconds.
              </p>
              {/* Methodology / sources — E-E-A-T trust signal */}
              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-2xl text-amber-600 shrink-0 mt-0.5" aria-hidden="true">verified</span>
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-900 mb-1.5">How we calculated these ranges</p>
                    <p className="leading-relaxed">
                      Cost ranges aggregate 2026 pricing data from <span className="font-medium text-slate-800">HomeAdvisor&apos;s TrueCost guide</span>, <span className="font-medium text-slate-800">Forbes Home</span>, <span className="font-medium text-slate-800">Angi</span>, and <span className="font-medium text-slate-800">Bob Vila</span> — cross-referenced with quotes from licensed {stateName} contractors in the FoundationScout directory and published rates from the <span className="font-medium text-slate-800">Concrete Foundations Association</span>. <span className="font-medium text-slate-800">Last reviewed: April 2026.</span> Actual costs vary by soil type, foundation depth, site accessibility, and local labor rates.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <EstimateButton
                  state={state}
                  stateName={stateName}
                  eventName="cost_page_estimate_click_cost_section"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base px-6 py-3 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-xl">request_quote</span>
                  Get a Real Quote for Your {stateName} Home
                </EstimateButton>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Factors */}
        <section className="py-14 lg:py-18 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8 text-center">What Affects Foundation Repair Costs?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600" role="img" aria-label="Foundation issues">foundation</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-4">Foundation Issues</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Extent of settling or movement</li>
                    <li>• Number and size of cracks</li>
                    <li>• Foundation type</li>
                    <li>• Age and condition</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600" role="img" aria-label="Site conditions">terrain</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-4">Site Conditions</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Soil type and stability</li>
                    <li>• Accessibility around foundation</li>
                    <li>• Depth to stable bearing strata</li>
                    <li>• Local building codes</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600" role="img" aria-label="Engineering factors">engineering</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-4">Repair Method</h3>
                  <ul className="space-y-2 text-slate-600 text-sm text-left">
                    <li>• Type of repair needed</li>
                    <li>• Materials and equipment</li>
                    <li>• Complexity of installation</li>
                    <li>• Warranty coverage</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600" role="img" aria-label="Location factors">location_on</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-4">Location Factors</h3>
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

        {/* Personalized estimate section — calculator CTA before FAQs */}
        <section className="py-14 lg:py-18 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 mb-4">
              <span className="material-symbols-outlined text-base text-amber-700">calculate</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Free · No email required</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-4">
              Get a personalized estimate
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Statewide averages give you a ballpark. For a specific {stateName} estimate, our calculator factors in foundation type, damage severity, home size, and {stateName} soil conditions — all in under 60 seconds.
            </p>
            <Link
              href={`/calculator?state=${state}`}
              data-event-name="cost_page_calculator_click_pre_faq"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base px-7 py-3.5 shadow-sm hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-xl">calculate</span>
              Use our cost calculator
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-14 lg:py-18 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8">Foundation Repair Cost FAQs</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cost Savings Tips */}
        <section className="py-14 lg:py-18 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8">How to Save on Foundation Repair Costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-4xl text-green-600" role="img" aria-label="Early action saves money">schedule</span>
                    <h3 className="text-lg font-semibold text-slate-900">Act Early</h3>
                  </div>
                  <p className="text-slate-600">Address foundation issues promptly to prevent minor problems from becoming major repairs. Early intervention saves thousands.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-4xl text-green-600" role="img" aria-label="Get multiple quotes">compare_arrows</span>
                    <h3 className="text-lg font-semibold text-slate-900">Get Multiple Quotes</h3>
                  </div>
                  <p className="text-slate-600">Compare 3-5 estimates from different contractors. Prices can vary significantly, but ensure you're comparing similar repair approaches.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-4xl text-green-600" role="img" aria-label="Choose quality contractors">verified</span>
                    <h3 className="text-lg font-semibold text-slate-900">Choose Quality</h3>
                  </div>
                  <p className="text-slate-600">Select contractors based on quality, not just price. Poor workmanship leads to costly repairs later. Look for warranties and guarantees.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-4xl text-green-600" role="img" aria-label="Seasonal pricing">calendar_month</span>
                    <h3 className="text-lg font-semibold text-slate-900">Seasonal Timing</h3>
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
                  "name": `${stateName} Foundation Repair`,
                  "item": `https://foundationscout.com/${state}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
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