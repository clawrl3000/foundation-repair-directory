import { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

export const metadata: Metadata = {
  title: 'Foundation Repair by State | Find Local Contractors',
  description: 'Find foundation repair contractors in all 50 states. Browse by state to compare local professionals, read reviews, and get free estimates.',
  alternates: {
    canonical: 'https://foundationscout.com/states',
  },
  openGraph: {
    title: 'Foundation Repair by State | Find Local Contractors',
    description: 'Find foundation repair contractors in all 50 states. Browse by state to compare local professionals, read reviews, and get free estimates.',
    url: 'https://foundationscout.com/states',
    images: [
      {
        url: 'https://foundationscout.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair by State',
      },
    ],
  },
}

const STATES = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', contractors: 34 },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', contractors: 8 },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', contractors: 156 },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', contractors: 67 },
  { name: 'California', slug: 'california', abbr: 'CA', contractors: 623 },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', contractors: 198 },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', contractors: 89 },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', contractors: 23 },
  { name: 'Florida', slug: 'florida', abbr: 'FL', contractors: 534 },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', contractors: 312 },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', contractors: 19 },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', contractors: 45 },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', contractors: 215 },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', contractors: 167 },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', contractors: 78 },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', contractors: 89 },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', contractors: 123 },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', contractors: 156 },
  { name: 'Maine', slug: 'maine', abbr: 'ME', contractors: 34 },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', contractors: 145 },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', contractors: 178 },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', contractors: 241 },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', contractors: 134 },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', contractors: 89 },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', contractors: 164 },
  { name: 'Montana', slug: 'montana', abbr: 'MT', contractors: 29 },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', contractors: 56 },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', contractors: 87 },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', contractors: 42 },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', contractors: 189 },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', contractors: 67 },
  { name: 'New York', slug: 'new-york', abbr: 'NY', contractors: 298 },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', contractors: 287 },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', contractors: 21 },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', contractors: 264 },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', contractors: 134 },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', contractors: 123 },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', contractors: 228 },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', contractors: 18 },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', contractors: 156 },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', contractors: 23 },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', contractors: 187 },
  { name: 'Texas', slug: 'texas', abbr: 'TX', contractors: 847 },
  { name: 'Utah', slug: 'utah', abbr: 'UT', contractors: 89 },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', contractors: 15 },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', contractors: 198 },
  { name: 'Washington', slug: 'washington', abbr: 'WA', contractors: 167 },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', contractors: 45 },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', contractors: 123 },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', contractors: 12 },
]

// Group states by region for better organization
const REGIONS = {
  'Southeast': ['alabama', 'arkansas', 'florida', 'georgia', 'kentucky', 'louisiana', 'mississippi', 'north-carolina', 'south-carolina', 'tennessee', 'virginia', 'west-virginia'],
  'Northeast': ['connecticut', 'delaware', 'maine', 'maryland', 'massachusetts', 'new-hampshire', 'new-jersey', 'new-york', 'pennsylvania', 'rhode-island', 'vermont'],
  'Midwest': ['illinois', 'indiana', 'iowa', 'kansas', 'michigan', 'minnesota', 'missouri', 'nebraska', 'north-dakota', 'ohio', 'south-dakota', 'wisconsin'],
  'Southwest': ['arizona', 'colorado', 'nevada', 'new-mexico', 'texas', 'utah'],
  'West': ['alaska', 'california', 'hawaii', 'idaho', 'montana', 'oregon', 'washington', 'wyoming'],
}

export default function StatesPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">States</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              Foundation Repair by State
            </h1>
            <p className="text-slate-600 text-lg mb-12 max-w-3xl leading-relaxed">
              Find foundation repair contractors in all 50 states. Browse by state to compare 
              local professionals, read reviews, and get free estimates.
            </p>
          </div>
        </section>

        {/* Top States */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Most Active States</h2>
              <p className="text-slate-600">States with the highest number of foundation repair contractors.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {STATES
                .sort((a, b) => b.contractors - a.contractors)
                .slice(0, 8)
                .map((state) => (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-amber-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <span className="material-symbols-outlined text-xl">location_on</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{state.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">{state.abbr}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">engineering</span>
                      <span className="text-slate-600 text-sm">
                        {state.contractors} contractor{state.contractors !== 1 ? 's' : ''}
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

        {/* All States by Region */}
        <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Browse All States</h2>
              <p className="text-slate-600">Find foundation repair contractors organized by region.</p>
            </div>
            
            <div className="space-y-12">
              {Object.entries(REGIONS).map(([region, stateSlugs]) => (
                <div key={region} className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">{region}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {STATES
                      .filter(state => stateSlugs.includes(state.slug))
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((state) => (
                      <Link
                        key={state.slug}
                        href={`/${state.slug}`}
                        className="bg-slate-50 hover:bg-white rounded-lg p-4 transition-all hover:border hover:border-amber-300 hover:shadow-sm group border border-transparent"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{state.name}</h4>
                            <p className="text-xs text-slate-500">
                              {state.contractors} contractors
                            </p>
                          </div>
                          <span className="text-xs text-slate-600 font-mono bg-slate-200 px-2 py-1 rounded">
                            {state.abbr}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Can't Find Your State?</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                We're constantly expanding our network. If your state isn't listed or you'd like to join our directory as a contractor, let us know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg">
                  Request New State
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all">
                  Join as Contractor
                </button>
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
          __html: JSON.stringify({
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
                "name": "States",
                "item": "https://foundationscout.com/states"
              }
            ]
          }),
        }}
      />
    </div>
  )
}