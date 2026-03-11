'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthButton from '@/components/AuthButton'

export default function StitchNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#101622] border-b border-slate-700/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">foundation</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-amber-400">Scout</span></span>
            </Link>
          </div>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/states">Find Contractors</Link>
            <Link className="text-sm font-semibold text-white border border-white/30 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-lg transition-colors" href="/auth/signup">For Pros</Link>
            <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/services">Services</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <AuthButton />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div id="mobile-menu" className={`md:hidden fixed left-0 right-0 z-50 transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="bg-[#101622]/98 backdrop-blur-xl border-b border-slate-700/50 py-6 shadow-2xl">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-6 flex flex-col gap-4">
            <Link
              className="text-base font-semibold text-slate-300 hover:text-amber-400 transition-colors py-3 px-4 rounded-lg hover:bg-white/10"
              href="/states"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Contractors
            </Link>
            <Link
              className="text-base font-semibold text-slate-300 hover:text-amber-400 transition-colors py-3 px-4 rounded-lg hover:bg-white/10"
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Pros
            </Link>
            <Link
              className="text-base font-semibold text-slate-300 hover:text-amber-400 transition-colors py-3 px-4 rounded-lg hover:bg-white/10"
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <div className="border-t border-slate-700/50 pt-4 flex items-center gap-4 px-4">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-5 py-2.5 text-sm font-bold rounded-lg text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join as Pro
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
