import type { Metadata } from 'next'
import HomeNavigation from '@/components/HomeNavigation'
import HomeFooter from '@/components/HomeFooter'
import CostCalculator from '@/components/CostCalculator'
import { generateFAQSchema, jsonLdScript } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Foundation Repair Cost Calculator | Repair Estimate Tool',
  description:
    'Use our free foundation repair cost calculator to get an instant estimate. Enter your state, foundation type, and damage severity to see realistic 2026 pricing with labor, materials, and permit breakdowns.',
  keywords: [
    'foundation repair cost calculator',
    'foundation repair estimate',
    'foundation repair cost',
    'how much does foundation repair cost',
    'foundation repair pricing',
    'slab repair cost',
    'pier and beam repair cost',
  ],
  alternates: {
    canonical: 'https://foundationscout.com/calculator',
  },
  openGraph: {
    title: 'Foundation Repair Cost Calculator — Free Instant Estimate',
    description:
      'Get a realistic foundation repair cost estimate in under 60 seconds. Covers all 50 states with regional pricing, soil conditions, and contractor recommendations.',
    url: 'https://foundationscout.com/calculator',
  },
}

const faqs = [
  {
    question: 'How accurate is this foundation repair cost calculator?',
    answer:
      'Our calculator uses 2026 regional pricing data, state-specific labor rates, and soil condition factors to provide a realistic estimate. Actual costs may vary by 10–20% depending on your specific situation, contractor, and local permit fees. We recommend getting 3+ in-person quotes for the most accurate pricing.',
  },
  {
    question: 'What factors affect foundation repair costs the most?',
    answer:
      'The biggest cost factors are damage severity, foundation type, and your geographic location. Emergency structural repairs can cost 10–20x more than minor crack repairs. States like California and New York have 30% higher labor costs, while states with expansive clay soils (Texas, Mississippi, Oklahoma) often need more extensive repairs.',
  },
  {
    question: 'Does homeowners insurance cover foundation repair?',
    answer:
      'Standard homeowners insurance typically does not cover foundation repair caused by settling, earth movement, or normal wear. However, damage from sudden events like plumbing leaks or natural disasters may be partially covered. Check your policy and consider adding foundation coverage if you live in a high-risk area.',
  },
  {
    question: 'How long does foundation repair take?',
    answer:
      'Minor crack repairs take 1–3 days, moderate settling repairs 3–7 days, and major structural work 1–3 weeks. Emergency repairs may take longer but are often fast-tracked. Weather, permit processing, and contractor availability also affect timelines.',
  },
  {
    question: 'Should I get a structural engineer inspection before repair?',
    answer:
      'Yes. A licensed structural engineer inspection ($300–$800) provides an unbiased assessment of your foundation\'s condition and a repair plan. This protects you from unnecessary work and ensures the right repair method is used. Many contractors offer free inspections, but an independent engineer gives you leverage when comparing quotes.',
  },
]

export default function CalculatorPage() {
  return (
    <>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(generateFAQSchema(faqs))}
      />

      {/* Navigation */}
      <HomeNavigation />

      {/* Hero / intro section */}
      <section className="relative bg-gradient-to-b from-[#0f0e0a] via-[#1c1815] to-[#0f0e0a] pt-28 pb-12 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="material-symbols-outlined text-amber-500 text-base">calculate</span>
            <span className="text-sm font-medium text-amber-400">Free Instant Estimate</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl text-white mb-4 leading-tight">
            Foundation Repair Cost Calculator
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Get a realistic cost estimate for your foundation repair in under 60 seconds.
            Our calculator uses <strong className="text-slate-300">2026 regional pricing data</strong> from
            all 50 states, including labor rates, material costs, and soil condition adjustments.
          </p>
        </div>
      </section>

      {/* Calculator section */}
      <section className="bg-[#0f0e0a] px-6 py-12">
        <CostCalculator />
      </section>

      {/* SEO content below calculator */}
      <section className="bg-gradient-to-b from-[#0f0e0a] to-[#1c1815] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-6">
            Understanding Foundation Repair Costs in 2026
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Foundation repair costs in 2026 range from <strong className="text-white">$800 for minor crack sealing</strong> to
              over <strong className="text-white">$30,000+ for major structural piering and underpinning</strong>. The national
              average sits around $4,500–$7,500 for moderate repairs, though your actual cost depends heavily on your
              state, soil conditions, foundation type, and the severity of damage.
            </p>
            <p>
              States with expansive clay soils — like Texas, Mississippi, Oklahoma, and Colorado — typically see
              higher repair frequency because the clay expands when wet and contracts when dry, causing
              foundations to shift and crack over time. Coastal states like Florida face different challenges
              with sandy soils and sinkholes, while northern states deal with frost heave damage from deep freeze cycles.
            </p>
            <p>
              Labor costs also vary dramatically by region. Foundation repair in California or New York
              costs roughly 30% more than the same work in Texas or Alabama, largely due to higher wage
              rates and stricter building codes. Our calculator accounts for these regional differences
              using a state-specific cost multiplier based on current market data.
            </p>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-xl text-white mt-10 mb-4">
            Cost Breakdown: Where Does Your Money Go?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: 'engineering', title: 'Labor (45%)', desc: 'Skilled technicians, equipment operators, and project management' },
              { icon: 'construction', title: 'Materials (30%)', desc: 'Steel piers, concrete, epoxy, helical piles, and drainage systems' },
              { icon: 'architecture', title: 'Engineering (15%)', desc: 'Structural assessments, soil testing, and design plans' },
              { icon: 'gavel', title: 'Permits & Fees (10%)', desc: 'Building permits, inspections, and municipal compliance' },
            ].map(item => (
              <div key={item.title} className="bg-dominant-700/30 border border-dominant-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-amber-500">{item.icon}</span>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                </div>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="bg-[#1c1815] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-dominant-700/30 border border-dominant-700 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-white font-semibold hover:text-amber-400 transition-colors list-none">
                  {faq.question}
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4">expand_more</span>
                </summary>
                <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-dominant-700 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <HomeFooter />
    </>
  )
}
