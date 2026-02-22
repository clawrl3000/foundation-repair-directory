'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AnimatedSearchFormProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export default function AnimatedSearchForm({ 
  onSearch, 
  placeholder = "Enter your ZIP code",
  className = "" 
}: AnimatedSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Helper function to map ZIP codes to states
  const getStateFromZip = (zip: string) => {
    const zipCode = zip.substring(0, 5)
    const firstDigit = zipCode.charAt(0)
    
    const zipToStateMap: { [key: string]: { stateSlug: string, stateName: string } } = {
      '0': { stateSlug: 'massachusetts', stateName: 'Massachusetts' },
      '1': { stateSlug: 'new-york', stateName: 'New York' },
      '2': { stateSlug: 'virginia', stateName: 'Virginia' },
      '3': { stateSlug: 'florida', stateName: 'Florida' },
      '4': { stateSlug: 'georgia', stateName: 'Georgia' },
      '5': { stateSlug: 'ohio', stateName: 'Ohio' },
      '6': { stateSlug: 'texas', stateName: 'Texas' },
      '7': { stateSlug: 'texas', stateName: 'Texas' },
      '8': { stateSlug: 'california', stateName: 'California' },
      '9': { stateSlug: 'california', stateName: 'California' },
    }
    
    return zipToStateMap[firstDigit] || null
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setFeedback('')
    setFeedbackType('')

    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const query = searchQuery.trim()
    
    // Check if it's a ZIP code (5 digits)
    const zipRegex = /^\d{5}(-\d{4})?$/
    
    if (zipRegex.test(query)) {
      const zipToStateMapping = getStateFromZip(query)
      if (zipToStateMapping) {
        setFeedback(`Found contractors in ${zipToStateMapping.stateName}!`)
        setFeedbackType('success')
        
        setTimeout(() => {
          router.push(`/${zipToStateMapping.stateSlug}?zip=${encodeURIComponent(query)}`)
        }, 800)
      } else {
        setFeedback('ZIP code not recognized. Showing all states.')
        setFeedbackType('error')
        setTimeout(() => {
          router.push(`/states?q=${encodeURIComponent(query)}`)
        }, 1500)
      }
    } else {
      // City/State search  
      setFeedback('Searching by city/state...')
      setFeedbackType('success')
      
      setTimeout(() => {
        router.push(`/states?q=${encodeURIComponent(query)}`)
      }, 800)
    }

    if (onSearch) {
      onSearch(query)
    }

    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className={`max-w-xl space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 ${
            isFocused ? 'text-amber-500' : 'text-slate-400'
          }`} aria-hidden="true">
            location_on
          </span>
          <input
            ref={inputRef}
            className={`w-full rounded-xl border py-4 pl-12 pr-4 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
              isFocused 
                ? 'border-amber-500 bg-slate-800/90 ring-amber-500/50 ring-2' 
                : 'border-slate-600 bg-slate-800/80'
            } ${
              feedbackType === 'success' 
                ? 'ring-green-500/50 border-green-500' 
                : feedbackType === 'error' 
                ? 'ring-red-500/50 border-red-500' 
                : ''
            }`}
            placeholder={placeholder}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (feedback) {
                setFeedback('')
                setFeedbackType('')
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          
          {/* Focus ring animation */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
            isFocused ? 'ring-2 ring-amber-500/20 ring-offset-2 ring-offset-slate-900' : ''
          }`} />
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className={`relative overflow-hidden bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px] ${
            isLoading || !searchQuery.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">search</span>
              <span>Find Contractors</span>
            </>
          )}
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
      
      {/* Feedback message */}
      {feedback && (
        <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 transform ${
          feedbackType === 'success' 
            ? 'text-green-400' 
            : feedbackType === 'error' 
            ? 'text-red-400' 
            : 'text-slate-300'
        }`}>
          <span className={`material-symbols-outlined text-base ${
            feedbackType === 'success' 
              ? 'text-green-400' 
              : feedbackType === 'error' 
              ? 'text-red-400' 
              : 'text-amber-400'
          }`}>
            {feedbackType === 'success' ? 'check_circle' : feedbackType === 'error' ? 'error' : 'info'}
          </span>
          {feedback}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> 
          Compare pros
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> 
          Browse freely
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-amber-500 text-base">check_circle</span> 
          Takes 2 minutes
        </span>
      </div>
      
      <p className="text-xs text-amber-400/70 flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">schedule</span>
        Don't wait — cracks spread fastest in cold weather
      </p>
    </div>
  )
}