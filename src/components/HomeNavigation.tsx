'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from '@/components/AuthButton'

export default function HomeNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Navigation - Dark nav with fixed links */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
              <span className="material-symbols-outlined text-xl" aria-hidden="true">foundation</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-amber-400">Scout</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/states">Find Contractors</Link>
            <Link className="text-sm font-semibold text-white border border-white/30 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-lg transition-colors" href="/auth/signup">For Pros</Link>
            <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/services">Resources</Link>
          </nav>
          <div className="flex items-center gap-4">
            <AuthButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 relative overflow-hidden group"
            >
              <span className={`material-symbols-outlined text-xl transition-all duration-300 ${mobileMenuOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}`} role="img" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
              <div className={`absolute inset-0 bg-primary/20 rounded-lg transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Enhanced Mobile Menu with iOS-style animation */}
      <div className={`mobile-menu-backdrop fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`md:hidden fixed left-0 right-0 z-50 mobile-menu transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-[#101622]/98 backdrop-blur-xl border-b border-slate-700/50 py-8 shadow-2xl">
          <div className="mx-auto max-w-7xl px-6 flex flex-col gap-6">
            <Link 
              className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
              href="/states"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">search</span>
                Find Contractors
              </span>
            </Link>
            <Link 
              className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">business</span>
                For Contractors
              </span>
            </Link>
            <Link 
              className="text-base font-semibold text-slate-300 hover:text-primary transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/10 transform hover:translate-x-2 hover:scale-105 mobile-touch-target" 
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">info</span>
                Resources
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}