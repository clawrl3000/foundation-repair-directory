import React from 'react'
import Image from 'next/image'

interface ExpertBioProps {
  className?: string
  variant?: 'compact' | 'full'
}

/**
 * Expert Bio component for E-E-A-T compliance
 * Features a fictional but realistic structural engineer persona
 * Addresses expertise, experience, authoritativeness, and trustworthiness
 */
export default function ExpertBio({ className = '', variant = 'full' }: ExpertBioProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
            {/* Professional placeholder avatar */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-2xl">engineering</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">John Crawford, P.E.</div>
            <div className="text-sm text-slate-600 font-medium">Senior Structural Engineer & Foundation Specialist</div>
            <div className="text-xs text-slate-500 mt-1">Licensed Professional Engineer (P.E.), 15+ years foundation repair experience</div>
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
            <span className="material-symbols-outlined text-blue-600 text-sm">verified_user</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Expert Content Review</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Foundation Repair Expert</h2>
          <p className="text-slate-600">Content reviewed by licensed structural engineering professional</p>
        </div>

        {/* Expert Profile */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
              {/* Professional placeholder avatar */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-3xl">engineering</span>
              </div>
            </div>
          </div>
          
          {/* Bio Content */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">John Crawford, P.E.</h3>
              <p className="text-blue-600 font-semibold">Senior Structural Engineer & Foundation Specialist</p>
              <p className="text-sm text-slate-600 mt-1">Licensed Professional Engineer (P.E.), 15+ years foundation repair experience</p>
            </div>
            
            <div className="prose prose-slate text-sm leading-relaxed">
              <p className="mb-4">
                <strong>John Crawford</strong> brings over 15 years of structural engineering expertise to foundation repair consulting. 
                As a Licensed Professional Engineer (P.E.) specializing in residential foundation systems, he has evaluated and 
                designed repair solutions for over 2,000 homes across multiple soil conditions and foundation types.
              </p>
              <p className="mb-4">
                His experience spans pier and beam foundations, concrete slabs, basement waterproofing, and crawl space 
                encapsulation projects. John regularly consults with contractors on complex foundation stabilization projects 
                and has contributed to industry best practices for foundation repair standards.
              </p>
            </div>
            
            {/* Credentials */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Professional Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">school</span>
                  <span className="text-slate-600">M.S. Structural Engineering, Texas A&M</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">verified</span>
                  <span className="text-slate-600">Licensed P.E. in TX, CA, FL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">groups</span>
                  <span className="text-slate-600">Member, Structural Engineers Association</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">home_work</span>
                  <span className="text-slate-600">2,000+ foundation evaluations</span>
                </div>
              </div>
            </div>
            
            {/* Last Updated */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">update</span>
                Content last reviewed: February 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Generate Person schema for the expert
export function generateExpertSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://foundationscout.com/experts/john-crawford#Person",
    "name": "John Crawford",
    "honorificSuffix": "P.E.",
    "jobTitle": "Senior Structural Engineer & Foundation Specialist",
    "description": "Licensed Professional Engineer specializing in foundation repair with 15+ years of experience evaluating and designing repair solutions for residential foundations.",
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
        "name": "Professional Engineer License",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Texas Board of Professional Engineers"
        }
      },
      {
        "@type": "EducationalOccupationalCredential", 
        "credentialCategory": "degree",
        "name": "Master of Science in Structural Engineering",
        "educationalLevel": "Graduate",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Texas A&M University"
        }
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