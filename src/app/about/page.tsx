import { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

export const metadata: Metadata = {
  title: 'About FoundationScout | Foundation Repair Directory',
  description: 'Learn about FoundationScout, the leading foundation repair contractor directory connecting homeowners with licensed professionals nationwide.',
  alternates: {
    canonical: 'https://foundationscout.com/about',
  },
  openGraph: {
    title: 'About FoundationScout | Foundation Repair Directory',
    description: 'Learn about FoundationScout, the leading foundation repair contractor directory connecting homeowners with licensed professionals nationwide.',
    url: 'https://foundationscout.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <StitchNav />
      
      {/* Breadcrumbs */}
      <nav className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">About</span>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                About FoundationScout
              </h1>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We're the nation's most trusted network connecting homeowners with licensed foundation repair professionals. 
                Our mission is simple: help you protect your home's foundation with qualified, vetted contractors.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Foundation problems can be overwhelming and expensive. Many homeowners don't know where to start or who to trust. 
                  That's why we created FoundationScout — to simplify the process of finding qualified foundation repair professionals.
                </p>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Every contractor in our network is pre-screened for proper licensing, insurance, and professional credentials. 
                  We believe in transparency, which is why we provide detailed profiles, customer reviews, and direct contact information.
                </p>
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">verified</span>
                  Protecting your home's foundation, one connection at a time.
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80" 
                  alt="Professional foundation repair team working" 
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Standards */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Contractor Standards</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Not every contractor makes it into our network. Here's what we require:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-blue-600" role="img" aria-label="Licensed and insured contractors">verified_user</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Licensed & Insured</h3>
                <p className="text-slate-600 text-sm">Valid state contractor licenses and comprehensive liability insurance coverage.</p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-green-600" role="img" aria-label="Industry experience">engineering</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Industry Experience</h3>
                <p className="text-slate-600 text-sm">Minimum 5 years of foundation repair experience with proven track record.</p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-amber-600" role="img" aria-label="Quality reviews">star</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Quality Reviews</h3>
                <p className="text-slate-600 text-sm">Consistently high customer satisfaction ratings and positive project outcomes.</p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-purple-600" role="img" aria-label="Warranty coverage">workspace_premium</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Warranty Coverage</h3>
                <p className="text-slate-600 text-sm">Comprehensive warranties on all foundation repair work performed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* By the Numbers */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">FoundationScout by the Numbers</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
                <div className="text-slate-600 font-medium">Licensed Contractors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">50</div>
                <div className="text-slate-600 font-medium">States Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">Nationwide</div>
                <div className="text-slate-600 font-medium">Contractor Network</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">4.7+★</div>
                <div className="text-slate-600 font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 lg:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 lg:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Questions About Our Service?</h2>
              <p className="text-slate-600 text-lg mb-8">
                We're here to help homeowners and contractors alike. Reach out with any questions about our directory, 
                contractor requirements, or how to get the most from our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link 
                  href="/"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all"
                >
                  Find Contractors Near You
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-lg transition-all"
                >
                  Join as a Contractor
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl text-amber-600" aria-hidden="true">call</span>
                  <div>
                    <div className="font-bold text-slate-900">Phone Support</div>
                    <div className="text-slate-600">1-800-FOUND-DIR</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl text-amber-600" aria-hidden="true">mail</span>
                  <div>
                    <div className="font-bold text-slate-900">Email Support</div>
                    <div className="text-slate-600">support@foundationscout.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  )
}
