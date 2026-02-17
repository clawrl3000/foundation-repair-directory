import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ service: string }>
}

const SERVICES_DATA = {
  'piering': {
    name: 'Foundation Piering',
    description: 'Professional foundation piering services using steel push piers and helical piers to stabilize and lift settling foundations.',
    icon: 'architecture',
    longDescription: 'Foundation piering is a permanent solution for foundation settlement and instability. Our certified contractors use advanced steel push piers and helical piers to transfer the weight of your home to stable soil or bedrock below.',
    benefits: [
      'Permanent foundation stabilization',
      'Can lift and level settled foundations',
      'Minimal excavation required',
      'Works in all soil conditions',
      'Lifetime warranty available'
    ],
    faqs: [
      {
        question: 'How much does foundation piering cost?',
        answer: 'Foundation piering typically costs $1,000-$3,000 per pier, with most homes requiring 8-15 piers. Total costs range from $8,000-$45,000 depending on the extent of the foundation issues.'
      },
      {
        question: 'How long does foundation piering take?',
        answer: 'Most foundation piering projects take 1-3 days to complete, depending on the number of piers needed and accessibility around the foundation.'
      },
      {
        question: 'What is the difference between push piers and helical piers?',
        answer: 'Push piers are driven deep into the soil using hydraulic pressure, while helical piers are screwed into the ground. Push piers work better in clay soils, while helical piers are ideal for sandy or loose soils.'
      }
    ]
  },
  'slab-repair': {
    name: 'Slab Foundation Repair', 
    description: 'Expert slab foundation repair including slab jacking, polyurethane injection, and concrete crack repair.',
    icon: 'layers',
    longDescription: 'Slab foundation problems can cause uneven floors, cracks in walls, and doors that won\'t close properly. Our contractors specialize in slab lifting, crack repair, and permanent slab stabilization.',
    benefits: [
      'Repairs uneven concrete floors',
      'Stops foundation cracks from growing',
      'Restores proper drainage',
      'Prevents water intrusion',
      'Cost-effective solution'
    ],
    faqs: [
      {
        question: 'What causes slab foundation problems?',
        answer: 'Slab foundations commonly settle due to expansive clay soils, poor drainage, plumbing leaks, or inadequate soil preparation during construction.'
      },
      {
        question: 'Can a cracked slab foundation be repaired?',
        answer: 'Yes, most slab foundation cracks can be effectively repaired using techniques like polyurethane injection, epoxy injection, or slab replacement in severe cases.'
      },
      {
        question: 'How much does slab repair cost?',
        answer: 'Slab repair costs range from $500-$3,000 for minor crack repairs, and $4,000-$15,000 for major slab lifting and stabilization projects.'
      }
    ]
  },
  'waterproofing': {
    name: 'Foundation Waterproofing',
    description: 'Complete waterproofing solutions including drainage systems, sump pumps, and moisture barriers.',
    icon: 'water_drop',
    longDescription: 'Protect your foundation from water damage with professional waterproofing. We install drainage systems, waterproof membranes, and moisture control systems to keep your basement or crawl space dry.',
    benefits: [
      'Prevents basement flooding',
      'Eliminates mold and mildew',
      'Protects foundation integrity', 
      'Improves indoor air quality',
      'Increases home value'
    ],
    faqs: [
      {
        question: 'How much does foundation waterproofing cost?',
        answer: 'Foundation waterproofing costs $3,000-$10,000 for exterior waterproofing and $1,500-$5,000 for interior solutions, depending on the size of your foundation.'
      },
      {
        question: 'What is the best foundation waterproofing method?',
        answer: 'The best method depends on your situation. Exterior waterproofing provides the most comprehensive protection, while interior solutions like sump pumps and drainage systems are less invasive.'
      },
      {
        question: 'How long does waterproofing last?',
        answer: 'Quality foundation waterproofing systems can last 10-25 years with proper maintenance. Many contractors offer 10-15 year warranties on materials and workmanship.'
      }
    ]
  },
  'crawl-space': {
    name: 'Crawl Space Repair',
    description: 'Crawl space encapsulation, support beam repair, and moisture control systems.',
    icon: 'grid_guides', 
    longDescription: 'Crawl space problems can affect your entire home. We provide crawl space encapsulation, support beam reinforcement, and moisture control to create a healthy, stable foundation.',
    benefits: [
      'Eliminates musty odors',
      'Prevents sagging floors',
      'Reduces energy costs',
      'Prevents pest infestations',
      'Improves indoor air quality'
    ],
    faqs: [
      {
        question: 'What is crawl space encapsulation?',
        answer: 'Crawl space encapsulation involves sealing the crawl space with vapor barriers, insulation, and dehumidification systems to create a controlled environment that prevents moisture problems.'
      },
      {
        question: 'How much does crawl space repair cost?',
        answer: 'Crawl space repair costs $1,500-$8,000 for encapsulation and $1,000-$4,000 for support beam repairs, depending on the size and condition of the space.'
      },
      {
        question: 'Do I need crawl space ventilation or encapsulation?',
        answer: 'Modern building science favors encapsulation over ventilation. Encapsulated crawl spaces provide better moisture control and energy efficiency than traditional vented crawl spaces.'
      }
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params
  const serviceData = SERVICES_DATA[service as keyof typeof SERVICES_DATA]
  
  if (!serviceData) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    }
  }

  const url = `https://foundationrepairfinder.com/services/${service}`
  
  return {
    title: `${serviceData.name} Services | Foundation Repair Directory`,
    description: serviceData.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${serviceData.name} Services | Foundation Repair Directory`,
      description: serviceData.description,
      url: url,
      images: [
        {
          url: 'https://foundationrepairfinder.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: serviceData.name,
        },
      ],
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { service } = await params
  const serviceData = SERVICES_DATA[service as keyof typeof SERVICES_DATA]

  if (!serviceData) {
    return <div>Service not found</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-amber-600">Services</Link>
          <span>/</span>
          <span className="text-gray-800">{serviceData.name}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-primary">{serviceData.icon}</span>
            </div>
            <h1 className="text-3xl font-bold">{serviceData.name}</h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {serviceData.longDescription}
          </p>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold">
            Find {serviceData.name} Contractors
          </button>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6">Benefits of {serviceData.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl">✓</span>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {serviceData.faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
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
                  "name": "Services",
                  "item": "https://foundationrepairfinder.com/services"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": serviceData.name,
                  "item": `https://foundationrepairfinder.com/services/${service}`
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": serviceData.faqs.map(faq => ({
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