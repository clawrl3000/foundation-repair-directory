'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import HomeNavigation from '@/components/HomeNavigation'
import HomeHeroSection from '@/components/HomeHeroSection'
import HomePageContent from '@/components/HomePageContent'
import HomeFooter from '@/components/HomeFooter'
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator'

// Lazy load components that are not immediately needed
const LeadForm = dynamic(() => import('@/components/LeadForm'), { ssr: false })
const ConversionTracker = dynamic(() => import('@/components/ConversionTracker'), { ssr: false })

interface FeaturedBusiness {
  id: string
  name: string
  slug: string
  rating: number
  reviewCount: number
  description: string | null
  city: string
  citySlug: string
  stateAbbr: string
  stateSlug: string
  services: { name: string; slug: string }[]
}

interface FAQItem {
  question: string
  answer: string
}

interface HomePageProps {
  featuredBusinesses: FeaturedBusiness[]
  faqs?: FAQItem[]
}

export default function HomePage({ featuredBusinesses = [], faqs = [] }: HomePageProps) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<{id: string, name: string} | null>(null)

  const openLeadForm = (businessId?: string, businessName?: string) => {
    if (businessId && businessName) {
      setSelectedBusiness({ id: businessId, name: businessName })
    } else {
      setSelectedBusiness(null)
    }
    setLeadFormOpen(true)
  }

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          element.classList.add('animate-fade-up')
          observer.unobserve(element)
        }
      })
    }, observerOptions)

    // Observe all elements with the animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll')
    animateElements.forEach((element) => observer.observe(element))

    return () => {
      animateElements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-slate-900 antialiased overflow-x-hidden">
      <ScrollProgressIndicator />
      
      <HomeNavigation />
      <HomeHeroSection onOpenLeadForm={openLeadForm} />
      <HomePageContent featuredBusinesses={featuredBusinesses} onOpenLeadForm={openLeadForm} faqs={faqs} />
      <HomeFooter />

      {/* Lead Form Modal - only loads when opened */}
      {leadFormOpen && (
        <LeadForm
          isOpen={leadFormOpen}
          onClose={() => setLeadFormOpen(false)}
          businessId={selectedBusiness?.id}
          businessName={selectedBusiness?.name}
        />
      )}

      {/* Conversion Tracker - loads lazily */}
      <ConversionTracker gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </div>
  )
}