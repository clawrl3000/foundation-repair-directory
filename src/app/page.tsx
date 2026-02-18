import { Metadata } from 'next'
import HomePageClient from './home-client'

export const metadata: Metadata = {
  title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
  alternates: {
    canonical: 'https://foundationscout.com',
  },
  openGraph: {
    title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
    url: 'https://foundationscout.com',
    images: [
      {
        url: 'https://foundationscout.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair Directory',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="bg-white font-display text-slate-900 antialiased overflow-x-hidden">
      <HomePageClient />
    </div>
  )
}