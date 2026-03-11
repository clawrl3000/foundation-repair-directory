'use client'

import { useState, useRef, useEffect } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface AnimatedFAQProps {
  items: FAQItem[]
  className?: string
  title?: string
}

export default function AnimatedFAQ({ 
  items, 
  className = "", 
  title = "Frequently Asked Questions"
}: AnimatedFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, items.length)
  }, [items.length])

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    contentRefs.current.forEach((ref, index) => {
      if (!ref) return
      
      const isOpen = openItems.has(index)
      if (isOpen) {
        const scrollHeight = ref.scrollHeight
        ref.style.maxHeight = `${scrollHeight}px`
        ref.style.opacity = '1'
      } else {
        ref.style.maxHeight = '0px'
        ref.style.opacity = '0'
      }
    })
  }, [openItems])

  return (
    <div className={className}>
      {title && (
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8 leading-[1.15]">{title}</h2>
      )}
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openItems.has(index)
          
          return (
            <div
              key={index}
              className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                isOpen ? 'shadow-md border-amber-300' : 'hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className={`w-full px-6 py-4 text-left flex items-center justify-between group transition-all duration-300 ${
                  isOpen ? 'bg-amber-50' : 'hover:bg-slate-50'
                }`}
              >
                <h3 className={`text-base font-semibold transition-colors duration-300 ${
                  isOpen ? 'text-amber-700' : 'text-slate-900 group-hover:text-amber-600'
                }`}>
                  {item.question}
                </h3>
                
                <div className={`flex-shrink-0 ml-4 transition-all duration-300 ${
                  isOpen ? 'transform rotate-180 text-amber-600' : 'text-slate-400 group-hover:text-amber-500'
                }`}>
                  <span className="material-symbols-outlined text-2xl">expand_more</span>
                </div>
              </button>
              
              <div
                ref={(el) => { contentRefs.current[index] = el }}
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                className="transition-all duration-300 ease-out overflow-hidden"
                style={{
                  maxHeight: isOpen ? 'fit-content' : '0px',
                  opacity: isOpen ? 1 : 0
                }}
              >
                <div className="px-6 pb-6 pt-2">
                  <div className={`text-slate-600 text-[15px] leading-relaxed max-w-prose transform transition-all duration-300 ${
                    isOpen ? 'translate-y-0' : '-translate-y-2'
                  }`}>
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-slate-600 text-sm">
          Still have questions? 
          <button className="text-amber-600 hover:text-amber-700 font-medium ml-1 underline">
            Contact our experts
          </button>
        </p>
      </div>
    </div>
  )
}