'use client'

import { useState, useEffect, useRef } from 'react'

interface CounterAnimationProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export default function CounterAnimation({ 
  end, 
  duration = 2000, 
  suffix = '', 
  className = '' 
}: CounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
          
          const startTime = Date.now()
          const endTime = startTime + duration
          
          const updateCount = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = Math.floor(easeOutQuart * end)
            
            setCount(currentCount)
            
            if (progress < 1) {
              requestAnimationFrame(updateCount)
            } else {
              setCount(end)
            }
          }
          
          requestAnimationFrame(updateCount)
        }
      },
      { threshold: 0.5 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasStarted])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k'
    }
    return num.toString()
  }

  return (
    <div ref={counterRef} className={className}>
      {end >= 1000 ? (
        <>
          {formatNumber(count)}
          {suffix && count === end && suffix}
        </>
      ) : (
        <>
          {count.toLocaleString()}
          {suffix && count === end && suffix}
        </>
      )}
    </div>
  )
}