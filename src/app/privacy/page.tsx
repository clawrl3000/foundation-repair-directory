import type { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy | FoundationScout',
  description: 'FoundationScout privacy policy — how we collect, use, and protect your personal information when using our foundation repair contractor directory.',
}

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased">
      <StitchNav />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/" className="text-amber-600 font-bold text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: February 22, 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Who We Are</h2>
              <p>FoundationScout (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a foundation repair contractor directory that helps homeowners find qualified, licensed foundation repair professionals in their area. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
              <p>We may collect the following information when you use our website or submit a form:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>ZIP code or service location</li>
                <li>Description of your foundation repair needs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Connect you with qualified foundation repair contractors in your area</li>
                <li>Respond to your inquiries and service requests</li>
                <li>Improve our website, directory listings, and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Information Sharing</h2>
              <p>We share your information <strong>only</strong> with the foundation repair contractor(s) you choose to contact through our directory, solely for the purpose of fulfilling your service request.</p>
              <p className="mt-3 font-semibold">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Data Security</h2>
              <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Cookies & Analytics</h2>
              <p>We use Plausible Analytics, a privacy-focused analytics tool that does not use cookies and does not collect personal data. No cookie consent is required. We do not use any third-party tracking cookies, advertising pixels, or retargeting tools.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction or deletion of your information</li>
                <li>Opt out of any communications</li>
              </ul>
              <p className="mt-3">California residents have additional rights under the CCPA, including the right to know what personal information is collected and the right to request deletion.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or wish to exercise your rights, contact us:</p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>Email:</strong> privacy@foundationscout.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
            </section>
          </div>
        </div>
      </main>
      <StitchFooter />
    </div>
  )
}
