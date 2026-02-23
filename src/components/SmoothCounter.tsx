'use client'

import { useState, useEffect, useRef } from 'react'

interface SmoothCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function SmoothCounter({ 
  end, 
  duration = 2000, 
  suffix = '',
  prefix = '',
  className = '' 
}: SmoothCounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasStarted, setHasStarted] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  function formatFinal(num: number): string {
    return num.toLocaleString()
  }

  useEffect(() => {
    // Fallback: start after 1s even if observer doesn't fire
    const fallbackTimer = setTimeout(() => {
      if (!hasStarted) startAnimation()
    }, 1000)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          startAnimation()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function startAnimation() {
    if (hasStarted) return
    setHasStarted(true)

    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(eased * end)

      setDisplayValue(formatFinal(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(formatFinal(end))
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
