import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `Foundation Repair in ${stateName} — Find Local Contractors`,
    description: `Find and compare foundation repair contractors across ${stateName}. Browse by city, read reviews, and get free estimates from licensed professionals.`,
  }
}

export default async function StatePage({ params }: Props) {
  const { state } = await params
  const stateName = state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // TODO: Fetch cities from Supabase
  const mockCities = [
    'Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth',
    'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock',
    'Garland', 'Irving', 'Amarillo', 'Grand Prairie', 'McKinney',
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <span className="text-gray-800">{stateName}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Foundation Repair in {stateName}
        </h1>
        <p className="text-gray-600 mb-8">
          Browse foundation repair contractors by city in {stateName}. 
          Find licensed professionals near you.
        </p>

        {/* City Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockCities.map((city) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            return (
              <Link
                key={city}
                href={`/${state}/${citySlug}`}
                className="p-4 bg-white rounded-lg border hover:border-amber-500 hover:shadow-md transition-all"
              >
                <h2 className="font-medium text-gray-800">{city}</h2>
                <p className="text-sm text-gray-500 mt-1">0 contractors</p>
              </Link>
            )
          })}
        </div>

        {/* State Content */}
        <section className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            About Foundation Repair in {stateName}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {stateName} homeowners understand the importance of a solid foundation. Local soil conditions, 
            climate patterns, and building codes all affect foundation health. Our directory connects you 
            with verified foundation repair professionals across {stateName} who specialize in pier & beam, 
            slab, and basement repair services.
          </p>
        </section>
      </div>
    </main>
  )
}
