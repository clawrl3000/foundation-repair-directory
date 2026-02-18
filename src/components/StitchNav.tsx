'use client'

import Link from 'next/link'
import AuthButton from '@/components/AuthButton'

export default function StitchNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#101622] border-b border-slate-700/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
              <span className="material-symbols-outlined text-2xl">foundation</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">Foundation<span className="text-amber-400">Scout</span></span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/states">Find Contractors</Link>
          <Link className="text-sm font-semibold text-white border border-white/30 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-lg transition-colors" href="/auth/signup">For Pros</Link>
          <Link className="text-sm font-semibold text-white hover:text-amber-400 transition-colors" href="/services">Resources</Link>
        </nav>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
