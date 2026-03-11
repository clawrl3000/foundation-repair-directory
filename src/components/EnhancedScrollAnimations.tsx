'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function EnhancedScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function revealImmediately(element: Element) {
      element.classList.remove('animate-on-scroll')
      element.classList.add('opacity-100', 'transform-none')
    }

    if (prefersReducedMotion) {
      document.querySelectorAll('.animate-on-scroll').forEach(revealImmediately)
      return
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: [0.1, 0.3, 0.6]
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        const element = entry.target as HTMLElement

        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const delay = index * 100

          setTimeout(() => {
            if (element.classList.contains('stats-container')) {
              element.classList.add('animate-fade-up')
              const counters = element.querySelectorAll('.stat-item')
              counters.forEach((counter, counterIndex) => {
                setTimeout(() => {
                  counter.classList.add('animate-scale-in')
                }, counterIndex * 200)
              })
            } else if (element.classList.contains('service-card')) {
              element.classList.add('animate-slide-in')
            } else {
              element.classList.add('animate-fade-up')
            }

            if (element.classList.contains('card-hover') || element.classList.contains('service-card')) {
              element.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.1)'
              setTimeout(() => {
                element.style.boxShadow = ''
              }, 1000)
            }
          }, Math.min(delay, 800))

          observer.unobserve(element)
        }
      })
    }, observerOptions)

    function observeElement(el: Element) {
      if (el.classList.contains('animate-on-scroll') && !el.classList.contains('animate-fade-up') && !el.classList.contains('animate-slide-in')) {
        observer.observe(el)
      }
    }

    document.querySelectorAll('.animate-on-scroll').forEach(observeElement)

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('animate-on-scroll')) {
              if (prefersReducedMotion) {
                revealImmediately(node)
              } else {
                observeElement(node)
              }
            }
            node.querySelectorAll('.animate-on-scroll').forEach((child) => {
              if (prefersReducedMotion) {
                revealImmediately(child)
              } else {
                observeElement(child)
              }
            })
          }
        }
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return null
}
