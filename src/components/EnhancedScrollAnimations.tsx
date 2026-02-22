'use client'

import { useEffect } from 'react'

export default function EnhancedScrollAnimations() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Remove animate-on-scroll class from all elements
      const animateElements = document.querySelectorAll('.animate-on-scroll')
      animateElements.forEach((element) => {
        element.classList.remove('animate-on-scroll')
        element.classList.add('opacity-100', 'transform-none')
      })
      return
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
      threshold: [0.1, 0.3, 0.6] // Multiple thresholds for more granular control
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        const element = entry.target as HTMLElement
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          // Add stagger delay based on element position
          const delay = index * 100 // 100ms stagger between elements
          
          setTimeout(() => {
            // Determine animation type based on classes
            if (element.classList.contains('stats-container')) {
              element.classList.add('animate-fade-up')
              // Trigger counter animations for child elements
              const counters = element.querySelectorAll('.stat-item')
              counters.forEach((counter, counterIndex) => {
                setTimeout(() => {
                  counter.classList.add('animate-scale-in')
                }, counterIndex * 200)
              })
            } else if (element.classList.contains('service-card')) {
              element.classList.add('animate-slide-in')
            } else if (element.classList.contains('city-card')) {
              element.classList.add('animate-fade-up')
            } else {
              // Default fade up animation
              element.classList.add('animate-fade-up')
            }
            
            // Add a subtle glow effect for important elements
            if (element.classList.contains('card-hover') || element.classList.contains('service-card')) {
              element.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.1)'
              setTimeout(() => {
                element.style.boxShadow = ''
              }, 1000)
            }
          }, Math.min(delay, 800)) // Cap delay at 800ms
          
          observer.unobserve(element)
        }
      })
    }, observerOptions)

    // Observe all elements with animation classes
    const animateElements = document.querySelectorAll('.animate-on-scroll')
    animateElements.forEach((element) => observer.observe(element))

    return () => {
      animateElements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  return null // This component doesn't render anything
}