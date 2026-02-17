'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: object
    ) => void
  }
}

interface ConversionTrackerProps {
  gaId?: string
}

// Component that uses useSearchParams - wrapped in Suspense
function PageViewTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gaId || !window.gtag) return

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    // Track page view
    window.gtag('config', gaId, {
      page_path: url,
    })
  }, [pathname, searchParams, gaId])

  return null
}

export default function ConversionTracker({ gaId }: ConversionTrackerProps) {
  // Don't render if no GA ID
  if (!gaId) return null

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      {/* Page view tracking with Suspense boundary */}
      <Suspense fallback={null}>
        <PageViewTracker gaId={gaId} />
      </Suspense>
    </>
  )
}

// Event tracking functions
export const trackEvent = (eventName: string, parameters?: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const trackLeadSubmission = (leadData: {
  service_needed?: string
  urgency?: string
  business_id?: string
  source_page?: string
}) => {
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: leadData.service_needed,
    value: 1,
    custom_parameters: {
      service_type: leadData.service_needed,
      urgency_level: leadData.urgency,
      business_contacted: leadData.business_id ? 'true' : 'false',
      source_page: leadData.source_page,
    },
  })
}

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    event_category: 'User Interaction',
    event_label: buttonName,
    button_name: buttonName,
    button_location: location,
  })
}

export const trackSearch = (searchQuery: string, location: string) => {
  trackEvent('search', {
    search_term: searchQuery,
    event_category: 'Search',
    event_label: location,
  })
}

export const trackContactAttempt = (businessName: string, contactMethod: string) => {
  trackEvent('contact_business', {
    event_category: 'Business Contact',
    event_label: businessName,
    contact_method: contactMethod,
    value: 1,
  })
}