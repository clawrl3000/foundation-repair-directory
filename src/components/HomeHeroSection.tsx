'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AnimatedSearchForm from '@/components/AnimatedSearchForm'
import SmoothCounter from '@/components/SmoothCounter'

// Phone CTA removed — Scout Report is the primary conversion path

interface HomeHeroSectionProps {
  onOpenLeadForm: (businessId?: string, businessName?: string, urgency?: string) => void
  contractorCount?: number
}

export default function HomeHeroSection({ onOpenLeadForm, contractorCount }: HomeHeroSectionProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  const heroImages = [
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Construction crew working on concrete foundation with rebar reinforcement' },
    { src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800', alt: 'Workers pouring and leveling concrete for a foundation slab' },
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', alt: 'Foundation slab construction with post-tension cables and rebar grid' },
    { src: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=80', alt: 'Structural shoring and foundation stabilization work in progress' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Skip to main content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-amber-500 focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
        Skip to main content
      </a>
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-18 sm:pt-22 lg:pt-28 pb-10 sm:pb-14 lg:pb-20">
          
          <div className="text-white space-y-5">
            
            {/* Badge */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold hover:scale-105 hover:bg-amber-500/15 transition-all duration-300 cursor-default">
                <span className="material-symbols-outlined text-base fill-1 trust-pulse" aria-hidden="true">check_circle</span>
                Compare pros &bull; Browse freely &bull; Takes 2 minutes
              </div>
            </div>

            {/* Headline */}
            <h1 className={`font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Don&apos;t Let Foundation Cracks{' '}
              <span className="text-gradient bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent hover-glow-text">
                Destroy Your Home&apos;s Value
              </span>
            </h1>

            {/* Subheadline */}
            <p className={`text-lg font-medium lg:text-xl text-slate-300 leading-relaxed max-w-xl transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[400ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Compare quotes from licensed contractors. Estimates in minutes, not days.
            </p>

            {/* Search Form + Phone CTA */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[600ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <AnimatedSearchForm />
              
              {/* CTA buttons — quote form + phone */}
              <div className="max-w-xl mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-700/50" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-slate-700/50" />
                </div>
                <button
                  onClick={() => onOpenLeadForm()}
                  className="w-full flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-slate-900 font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 group shadow-lg shadow-amber-500/20"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform" aria-hidden="true">description</span>
                  Get Your Scout Report
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className={`stats-container grid grid-cols-3 gap-4 sm:gap-8 pt-6 mt-6 border-t border-slate-700/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[800ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="stat-item text-center group hover:scale-105 transition-all duration-300 cursor-default">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 mb-1 font-mono whitespace-nowrap group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  <SmoothCounter end={15000} duration={2500} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">Jobs Completed</div>
              </div>
              <div className="stat-item text-center group hover:scale-105 transition-all duration-300 cursor-default">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 mb-1 font-mono group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] hover-star-glow">
                  4.9★
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">Avg Rating</div>
              </div>
              <div className="stat-item text-center group hover:scale-105 transition-all duration-300 cursor-default">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 mb-1 font-mono whitespace-nowrap group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  <SmoothCounter end={contractorCount || 2847} duration={3200} />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">Active Contractors</div>
              </div>
            </div>
          </div>

          {/* Right Column — Image carousel with next/image */}
          <div className={`relative hidden sm:block transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-slate-800 border border-slate-700 aspect-[4/3] group">
              <div className="absolute inset-0">
                {heroImages.map((img, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                      i === heroImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                      priority={i === 0}
                      sizes="(max-width: 1024px) 50vw, 600px"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20 group-hover:from-slate-900/40 transition-all duration-500"></div>
              
              {/* Trust badge */}
              <div className="absolute bottom-6 left-6 transform group-hover:-translate-y-0.5 transition-transform duration-300">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
                  <span className="material-symbols-outlined text-amber-400 text-lg fill-1 trust-pulse" aria-hidden="true">verified</span>
                  <div>
                    <div className="text-sm font-bold leading-tight">Professional Foundation Work</div>
                    <div className="text-xs text-slate-400">Licensed &amp; insured contractors</div>
                  </div>
                </div>
              </div>

              {/* Carousel dots — larger touch targets */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImageIndex(i)}
                    className="w-8 h-8 flex items-center justify-center"
                    aria-label={`View image ${i + 1} of ${heroImages.length}`}
                  >
                    <span className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === heroImageIndex 
                        ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-500/50' 
                        : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500 rounded-2xl blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-600/30 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 animate-subtle-drift"></div>
    </section>
  )
}
