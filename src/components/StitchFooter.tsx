import Link from 'next/link'

export default function StitchFooter() {
  return (
    <footer className="border-t border-slate-200 py-12 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <span className="material-symbols-outlined text-xl" aria-hidden="true">foundation</span>
            </div>
            <span className="font-bold tracking-tight text-slate-900">Foundation Directory</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="#">Contact Us</Link>
          </div>
          <div className="text-sm text-slate-600">
            © 2025 Foundation Directory. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}