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
  placeholder = "Enter your ZIP code or city",
  className = "" 
}: AnimatedSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setFeedback('')
    setFeedbackType('')

    const query = searchQuery.trim()
    const zipRegex = /^\d{5}(-\d{4})?$/
    
    if (zipRegex.test(query)) {
      // ZIP code lookup via API
      try {
        const res = await fetch(`/api/zip-lookup?zip=${query.substring(0, 5)}`)
        const data = await res.json()
        
        if (res.ok && data.stateSlug) {
          if (data.citySlug) {
            setFeedback(`Found contractors in ${data.city}, ${data.stateAbbr || data.stateName}!`)
            setFeedbackType('success')
            setTimeout(() => {
              router.push(`/${data.stateSlug}/${data.citySlug}`)
            }, 600)
          } else {
            setFeedback(`Showing contractors in ${data.stateName}`)
            setFeedbackType('success')
            setTimeout(() => {
              router.push(`/${data.stateSlug}`)
            }, 600)
          }
        } else {
          setFeedback('ZIP code not recognized. Browse by state instead.')
          setFeedbackType('error')
          setTimeout(() => {
            router.push('/states')
          }, 1500)
        }
      } catch {
        setFeedback('Search error. Browse by state instead.')
        setFeedbackType('error')
        setTimeout(() => {
          router.push('/states')
        }, 1500)
      }
    } else {
      // City/State text search
      setFeedback('Searching...')
      setFeedbackType('success')
      setTimeout(() => {
        router.push(`/states?q=${encodeURIComponent(query)}`)
      }, 600)
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
      <form role="search" aria-label="Find contractors" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="hero-search" className="sr-only">Enter your ZIP code or city</label>
          <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 ${
            isFocused ? 'text-amber-500' : 'text-slate-400'
          }`} aria-hidden="true">
            location_on
          </span>
          <input
            id="hero-search"
            ref={inputRef}
            className={`w-full rounded-xl border py-4 pl-14 pr-4 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
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
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className={`relative overflow-hidden bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px] ${
            isLoading || !searchQuery.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 cta-pulse-glow'
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
        </button>
      </div>
      </form>
      
      {/* Feedback message */}
      {feedback && (
        <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
          feedbackType === 'success' ? 'text-green-400' : feedbackType === 'error' ? 'text-red-400' : 'text-slate-300'
        }`}>
          <span className={`material-symbols-outlined text-base ${
            feedbackType === 'success' ? 'text-green-400' : feedbackType === 'error' ? 'text-red-400' : 'text-amber-400'
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
    </div>
  )
}
