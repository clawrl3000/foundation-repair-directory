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
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Fallback: if IntersectionObserver doesn't fire within 1s, start anyway
    const fallbackTimer = setTimeout(() => {
      if (!hasStarted) {
        startAnimation()
      }
    }, 1000)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          startAnimation()
        }
      },
      { threshold: 0.1 } // Lower threshold for reliability
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
    
    const startTime = Date.now()
    
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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      const k = num / 1000
      return k % 1 === 0 ? k.toFixed(0) + ',' + String(num % 1000).padStart(3, '0') : num.toLocaleString()
    }
    return num.toLocaleString()
  }

  return (
    <span ref={counterRef} className={className}>
      {formatNumber(count)}{suffix}
    </span>
  )
}
