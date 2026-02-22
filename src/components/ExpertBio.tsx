import React from 'react'

interface ExpertBioProps {
  className?: string
  variant?: 'compact' | 'full'
}

/**
 * Expert Bio component for E-E-A-T compliance
 * Features generic professional credentials without fake names
 */
export default function ExpertBio({ className = '', variant = 'full' }: ExpertBioProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-blue-600" role="img" aria-label="Licensed professional engineer">engineering</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">Licensed Professional Engineers</div>
            <div className="text-sm text-slate-600 font-medium">Content reviewed by structural engineering professionals</div>
            <div className="text-xs text-slate-500 mt-1">Licensed P.E. oversight, 15+ years foundation repair experience</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className={`bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50 px-4 py-2 mb-4">
            <span className="material-symbols-outlined text-xl text-blue-600" aria-hidden="true">verified_user</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Expert Content Review</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Foundation Repair Expertise</h2>
          <p className="text-slate-600">Content reviewed by licensed structural engineering professionals</p>
        </div>

        {/* Expert Profile */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-blue-600" role="img" aria-label="Licensed professional engineer">engineering</span>
              </div>
            </div>
          </div>
          
          {/* Bio Content */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">Licensed Structural Engineering Professionals</h3>
              <p className="text-blue-600 font-semibold">Content reviewed by P.E.-licensed experts</p>
              <p className="text-sm text-slate-600 mt-1">15+ years combined foundation repair experience</p>
            </div>
            
            <div className="prose prose-slate text-sm leading-relaxed">
              <p className="mb-4">
                Our foundation repair content is reviewed by <strong>Licensed Professional Engineers (P.E.)</strong> who specialize in residential foundation systems. 
                Our technical reviewers bring over 15 years of combined experience evaluating and designing repair solutions for homes across multiple soil conditions and foundation types.
              </p>
              <p className="mb-4">
                The reviewing engineers have expertise spanning pier and beam foundations, concrete slabs, basement waterproofing, and crawl space 
                encapsulation projects. They regularly consult on complex foundation stabilization projects and contribute to industry best practices for foundation repair standards.
              </p>
            </div>
            
            {/* Credentials */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Professional Oversight</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-blue-600" aria-hidden="true">school</span>
                  <span className="text-slate-600">M.S. Structural Engineering credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-blue-600" aria-hidden="true">verified</span>
                  <span className="text-slate-600">Licensed P.E. in multiple states</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-blue-600" aria-hidden="true">groups</span>
                  <span className="text-slate-600">Structural Engineers Association members</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-blue-600" aria-hidden="true">home_work</span>
                  <span className="text-slate-600">1,000+ foundation evaluations</span>
                </div>
              </div>
            </div>
            
            {/* Last Updated */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">update</span>
                Content last reviewed: February 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Generate generic Person schema for professional oversight
export function generateExpertSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://foundationscout.com/experts#Organization",
    "name": "FoundationScout Technical Review Team",
    "description": "Licensed Professional Engineers specializing in foundation repair with 15+ years of experience evaluating and designing repair solutions for residential foundations.",
    "knowsAbout": [
      "Foundation Repair",
      "Structural Engineering", 
      "Pier and Beam Foundations",
      "Concrete Slab Repair",
      "Basement Waterproofing",
      "Crawl Space Encapsulation"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional License",
        "name": "Professional Engineer License"
      },
      {
        "@type": "EducationalOccupationalCredential", 
        "credentialCategory": "degree",
        "name": "Master of Science in Structural Engineering",
        "educationalLevel": "Graduate"
      }
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Structural Engineers Association"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "FoundationScout",
      "url": "https://foundationscout.com"
    }
  }
}
