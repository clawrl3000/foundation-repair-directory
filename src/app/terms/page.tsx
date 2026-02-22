import type { Metadata } from 'next'
import Link from 'next/link'
import StitchNav from '@/components/StitchNav'
import StitchFooter from '@/components/StitchFooter'

export const metadata: Metadata = {
  title: 'Terms of Service | FoundationScout',
  description: 'FoundationScout terms of service — rules governing use of our foundation repair contractor directory.',
}

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased">
      <StitchNav />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/" className="text-amber-600 font-bold text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: February 22, 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using FoundationScout (&quot;the Site&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Description of Service</h2>
              <p>FoundationScout is a directory that helps homeowners find foundation repair contractors. We provide listings, ratings, and contact information for contractors across the United States.</p>
              <p className="mt-3 font-semibold">We are a directory service, not a contractor. We do not perform foundation repair work, and we do not employ or subcontract any of the listed contractors.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. No Guarantee or Warranty</h2>
              <p>While we strive to provide accurate and up-to-date information, we make no warranties or guarantees regarding:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>The accuracy, completeness, or reliability of contractor listings</li>
                <li>The quality of work performed by any listed contractor</li>
                <li>The licensing status, insurance coverage, or credentials of any contractor</li>
                <li>The availability or responsiveness of any contractor</li>
              </ul>
              <p className="mt-3">You are solely responsible for verifying a contractor&apos;s credentials, licensing, insurance, and references before hiring them.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, FoundationScout shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your use of or inability to use the Site</li>
                <li>Any work performed by contractors found through the Site</li>
                <li>Any disputes between you and a contractor</li>
                <li>Any errors or omissions in contractor listings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Use the Site for any unlawful purpose</li>
                <li>Submit false or misleading information</li>
                <li>Scrape, crawl, or harvest data from the Site without permission</li>
                <li>Interfere with the proper functioning of the Site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Contractor Listings</h2>
              <p>Contractor information is sourced from public records, online directories, and direct submissions. If you are a contractor and would like to update or remove your listing, please contact us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Intellectual Property</h2>
              <p>All content on FoundationScout, including text, graphics, logos, and software, is the property of FoundationScout and is protected by applicable intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Third-Party Links</h2>
              <p>The Site may contain links to third-party websites, including contractor websites. We are not responsible for the content, privacy practices, or accuracy of any third-party sites.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. Contact Us</h2>
              <p>If you have questions about these Terms of Service, contact us:</p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>Email:</strong> legal@foundationscout.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <StitchFooter />
    </div>
  )
}
