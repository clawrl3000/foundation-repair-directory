/**
 * Structured Data utilities for SEO
 * Generates JSON-LD schema markup for different page types
 */

export interface Business {
  id: string
  name: string
  slug: string
  phone?: string
  email?: string
  website_url?: string
  address?: string
  city_id: number
  state_id: number
  zip?: string
  latitude?: number
  longitude?: number
  description?: string
  year_established?: number
  license_number?: string
  rating?: number
  review_count?: number
  is_verified: boolean
}

export interface City {
  name: string
  slug: string
  state: {
    name: string
    abbreviation: string
  }
}

export interface Service {
  name: string
  slug: string
  description?: string
}

/**
 * Generate LocalBusiness JSON-LD schema
 */
export function generateLocalBusinessSchema(business: Business, city: City) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://foundationscout.com/${city.state.name.toLowerCase().replace(/\s+/g, '-')}/${city.slug}/${business.slug}#LocalBusiness`,
    "name": business.name,
    "description": business.description || `Professional foundation repair services in ${city.name}, ${city.state.abbreviation}`,
    "url": `https://foundationscout.com/${city.state.name.toLowerCase().replace(/\s+/g, '-')}/${city.slug}/${business.slug}`,
    "telephone": business.phone,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": city.name,
      "addressRegion": city.state.abbreviation,
      "postalCode": business.zip,
      "addressCountry": "US"
    },
    "geo": business.latitude && business.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    } : undefined,
    "founder": business.year_established ? {
      "@type": "Organization",
      "foundingDate": business.year_established.toString()
    } : undefined,
    "areaServed": {
      "@type": "City",
      "name": city.name,
      "containedInPlace": {
        "@type": "State",
        "name": city.state.name,
        "containedInPlace": {
          "@type": "Country",
          "name": "United States"
        }
      }
    },
    "serviceType": "Foundation Repair",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Foundation Repair Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foundation Repair",
            "serviceType": "Construction",
            "areaServed": city.name
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Basement Waterproofing",
            "serviceType": "Construction",
            "areaServed": city.name
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foundation Crack Repair",
            "serviceType": "Construction",
            "areaServed": city.name
          }
        }
      ]
    }
  }

  // Add aggregateRating if business has reviews
  if (business.rating && business.review_count && business.review_count > 0) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.review_count,
      "bestRating": 5,
      "worstRating": 1
    }
  }

  // Add license info if available
  if (business.license_number) {
    schema["hasCredential"] = {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional License",
      "recognizedBy": {
        "@type": "Organization",
        "name": `${city.state.name} Licensing Board`
      }
    }
  }

  return schema
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  }
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
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
}

/**
 * Generate Service JSON-LD schema for service pages
 */
export function generateServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://foundationscout.com/services/${service.slug}#Service`,
    "name": service.name,
    "description": service.description || `Professional ${service.name.toLowerCase()} services`,
    "url": `https://foundationscout.com/services/${service.slug}`,
    "serviceType": "Construction",
    "category": "Foundation Repair",
    "provider": {
      "@type": "Organization",
      "name": "Foundation Repair Finder",
      "url": "https://foundationscout.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${service.name} Providers`,
      "itemListElement": []
    }
  }
}

/**
 * Generate Organization JSON-LD schema for the main site
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://foundationscout.com#Organization",
    "name": "Foundation Repair Finder",
    "url": "https://foundationscout.com",
    "logo": "https://foundationscout.com/logo.png",
    "description": "Find trusted foundation repair contractors in your area. Compare quotes, read reviews, and connect with licensed professionals.",
    "foundingDate": "2026",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "sameAs": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Foundation Repair Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foundation Repair Directory",
            "serviceType": "Directory Service"
          }
        }
      ]
    }
  }
}

/**
 * Generate WebSite JSON-LD schema with search action
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://foundationscout.com#WebSite",
    "name": "Foundation Repair Finder",
    "url": "https://foundationscout.com",
    "description": "Find and compare foundation repair contractors near you",
    "publisher": {
      "@type": "Organization",
      "name": "Foundation Repair Finder"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://foundationscout.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
}

/**
 * Utility to safely stringify JSON-LD for HTML insertion
 */
export function jsonLdScript(schema: object) {
  return {
    __html: JSON.stringify(schema)
  }
}