'use client'

import { useState, useEffect } from 'react'
import AnimatedSearchForm from '@/components/AnimatedSearchForm'
import CounterAnimation from '@/components/CounterAnimation'

interface HomeHeroSectionProps {
  onOpenLeadForm: () => void
}

export default function HomeHeroSection({ onOpenLeadForm }: HomeHeroSectionProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  
  const heroImages = [
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Construction crew working on concrete foundation with rebar reinforcement' },
    { src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800', alt: 'Workers pouring and leveling concrete for a foundation slab' },
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', alt: 'Foundation slab construction with post-tension cables and rebar grid' },
    { src: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&q=80', alt: 'Structural shoring and foundation stabilization work in progress' },
  ]

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // AnimatedSearchForm handles its own search logic

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="text-white animate-on-scroll">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
              Don&apos;t Let Foundation Cracks <span className="text-gradient bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Destroy Your Home&apos;s Value</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Compare quotes from licensed contractors. Free estimates in minutes, not days.
            </p>
            <AnimatedSearchForm />
            <div className="stats-container grid grid-cols-3 gap-4 sm:gap-8 pt-4 border-t border-slate-700/50">
              <div className="stat-item text-center animate-on-scroll animate-delay-200">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-1 font-mono">
                  <CounterAnimation end={15000} duration={2500} />+
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Jobs Completed</div>
              </div>
              <div className="stat-item text-center animate-on-scroll animate-delay-400">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-1 font-mono">
                  4.9★
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Avg Rating</div>
              </div>
              <div className="stat-item text-center animate-on-scroll animate-delay-600">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-1 font-mono">
                  <CounterAnimation end={2847} duration={3000} />
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Active Contractors</div>
              </div>
            </div>
          </div>
          <div className="relative animate-on-scroll animate-delay-300">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-slate-800 border border-slate-700 aspect-[4/3]">
              <div className="absolute inset-0">
                {heroImages.map((img, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-lg font-bold mb-1">Professional Foundation Work</div>
                <div className="text-sm text-slate-300">Trusted contractors in your area</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500 rounded-2xl blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
    </section>
  )
}