import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'
import { generateServiceSchema, jsonLdScript } from '@/lib/structured-data'
import ExpertBio from '@/components/ExpertBio'

interface Props {
  params: Promise<{ service: string }>
}

const SERVICES_DATA = {
  'piering': {
    name: 'Foundation Piering',
    description: 'Professional foundation piering services using steel push piers and helical piers to stabilize and lift settling foundations.',
    icon: 'architecture',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    heroAlt: 'Professional foundation piering contractor installing steel piers for foundation stabilization',
    longDescription: 'Foundation piering is a permanent solution for foundation settlement and instability. Our local contractors use advanced steel push piers and helical piers to transfer the weight of your home to stable soil or bedrock below.',
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
    heroImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    heroAlt: 'Slab foundation repair specialist using concrete lifting equipment for slab leveling',
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
    heroImage: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=1200&q=80',
    heroAlt: 'Basement waterproofing professional installing drainage system and moisture barrier',
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
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
    heroAlt: 'Crawl space encapsulation specialist installing vapor barrier and support beams',
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
  },
  'crack-repair': {
    name: 'Foundation Crack Repair',
    description: 'Professional crack injection and sealing to prevent water intrusion.',
    icon: 'build',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    heroAlt: 'Foundation crack repair professional using epoxy injection to seal cracks',
    longDescription: 'Foundation cracks can allow water intrusion and indicate structural problems. Our contractors use professional crack injection techniques to permanently seal foundation cracks.',
    benefits: [
      'Prevents water damage',
      'Stops crack expansion',
      'Quick repair process',
      'Cost-effective solution',
      'Permanent results'
    ],
    faqs: [
      {
        question: 'When should I be concerned about foundation cracks?',
        answer: 'Horizontal cracks, cracks wider than 1/4 inch, or cracks that are growing should be evaluated by a professional immediately as they may indicate serious structural issues.'
      },
      {
        question: 'How much does crack repair cost?',
        answer: 'Foundation crack repair typically costs $300-$2,000 depending on the size, location, and number of cracks being repaired.'
      },
      {
        question: 'What causes foundation cracks?',
        answer: 'Foundation cracks are commonly caused by soil settlement, hydrostatic pressure, freeze-thaw cycles, or structural overloading.'
      }
    ]
  },
  'house-leveling': {
    name: 'House Leveling',
    description: 'Complete home releveling using hydraulic jacks and permanent support systems.',
    icon: 'balance',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',
    heroAlt: 'House leveling contractor using hydraulic jacks for complete home releveling',
    longDescription: 'House leveling restores your home to its proper position and prevents further structural damage. Our contractors use hydraulic jacks and permanent support systems for long-lasting results.',
    benefits: [
      'Restores structural integrity',
      'Fixes doors and windows',
      'Prevents further damage',
      'Increases home value',
      'Expert installation'
    ],
    faqs: [
      {
        question: 'How do I know if my house needs leveling?',
        answer: 'Signs include doors and windows that stick, visible cracks in walls, uneven floors, and gaps between walls and ceilings or floors.'
      },
      {
        question: 'How much does house leveling cost?',
        answer: 'House leveling costs $5,000-$25,000 depending on the size of the home, extent of settlement, and repair method used.'
      },
      {
        question: 'How long does house leveling take?',
        answer: 'Most house leveling projects take 1-3 days to complete, though extensive repairs may take up to a week.'
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

  const url = `https://foundationscout.com/services/${service}`

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
          url: 'https://foundationscout.com/og-image.jpg',
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
    notFound()
  }

  // Generate service schema
  const serviceSchema = generateServiceSchema({
    name: serviceData.name,
    slug: service,
    description: serviceData.longDescription
  })

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />

      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-amber-600 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{serviceData.name}</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative py-20 lg:py-24 bg-slate-900">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={serviceData.heroImage}
              alt={serviceData.heroAlt}
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>
          </div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-6 mb-6">
                <div className="size-16 rounded-lg bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                  <span className="material-symbols-outlined text-4xl text-amber-400">{serviceData.icon}</span>
                </div>
                <div>
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">{serviceData.name}</h1>
                  <p className="text-amber-400 mt-2 text-lg font-semibold">Professional repair services nationwide</p>
                </div>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-8 max-w-3xl">
                {serviceData.longDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold shadow-lg transition-all">
                  Find Local Experts
                </Link>
                <Link href="/?openLead=true" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all">
                  Get Estimate
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="material-symbols-outlined text-amber-400">verified</span>
                  Licensed & Insured
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="material-symbols-outlined text-amber-400">schedule</span>
                  Request Inspections
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="material-symbols-outlined text-amber-400">workspace_premium</span>
                  Warranty Backed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8">Benefits of {serviceData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex-shrink-0">
                      <div className="size-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                        <span className="material-symbols-outlined text-green-600 text-lg">check</span>
                      </div>
                    </div>
                    <span className="text-slate-900 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8 text-center">How {serviceData.name} Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">search</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Inspection</h3>
                  <p className="text-slate-600">Professional assessment of your foundation issues and repair requirements.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">engineering</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Installation</h3>
                  <p className="text-slate-600">Expert installation using professional-grade equipment and materials.</p>
                </div>
                <div className="text-center">
                  <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <span className="material-symbols-outlined text-3xl text-amber-600">verified</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Warranty</h3>
                  <p className="text-slate-600">Comprehensive warranties and ongoing support for your peace of mind.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {serviceData.faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 text-center animate-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900 mb-6">Ready to Get Started?</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                Local contractors are standing by. Compare quotes and choose with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all shadow-lg">
                  Find Local Experts
                </Link>
                <Link href="/?openLead=true" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold py-4 px-8 rounded-xl transition-all">
                  Get Quotes
                </Link>
              </div>
              <p className="mt-6 text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base">verified_user</span>
                Inspections available from local professionals
              </p>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
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
                "name": "Services",
                "item": "https://foundationscout.com/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": serviceData.name,
                "item": `https://foundationscout.com/services/${service}`
              }
            ]
          },
          serviceSchema,
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
        ])}
      />
    </div>
  )
}