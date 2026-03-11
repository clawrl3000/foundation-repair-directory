import Link from 'next/link'

export default function HomeFooter() {
  return (
    <footer className="bg-white pt-16 pb-8 px-6 md:px-20 lg:px-40 border-t border-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="animate-on-scroll">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
                <span className="material-symbols-outlined text-xl">foundation</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Foundation<span className="text-amber-600">Scout</span></span>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              America's most comprehensive directory of foundation repair contractors. Find qualified, licensed professionals for all your foundation needs.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-amber-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-amber-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-amber-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="animate-on-scroll animate-delay-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">For Homeowners</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link className="hover:text-amber-600 transition-colors" href="/states">Find Contractors</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/cost/texas/foundation-repair-cost">Repair Costs</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/services">Foundation Services</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/services">Foundation Inspection</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/services">Emergency Repairs</Link></li>
            </ul>
          </div>
          <div className="animate-on-scroll animate-delay-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">For Contractors</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Join Our Network</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/auth/login">Contractor Login</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Lead Management</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Premium Listings</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/auth/signup">Marketing Tools</Link></li>
            </ul>
          </div>
          <div className="animate-on-scroll animate-delay-300">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-slate-600">
              <li><Link className="hover:text-amber-600 transition-colors" href="/about">About FoundationScout</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/about">Contact Us</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="hover:text-amber-600 transition-colors" href="/about">Help Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FoundationScout. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-amber-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-amber-600 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}