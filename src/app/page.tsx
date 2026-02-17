import { Metadata } from 'next'
import HomePageClient from './home-client'

export const metadata: Metadata = {
  title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
  alternates: {
    canonical: 'https://foundationrepairfinder.com',
  },
  openGraph: {
    title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
    url: 'https://foundationrepairfinder.com',
    images: [
      {
        url: 'https://foundationrepairfinder.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair Directory',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      <HomePageClient />
    </div>
  )
}