import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConversionTracker from '@/components/ConversionTracker';

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationscout.com'),
  title: {
    default: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    template: '%s | Foundation Repair Directory',
  },
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
  keywords: [
    'foundation repair',
    'foundation contractors',
    'pier and beam',
    'slab repair',
    'basement waterproofing',
    'house leveling',
    'foundation crack repair',
    'crawl space repair'
  ],
  authors: [{ name: 'Foundation Repair Directory' }],
  creator: 'Foundation Repair Directory',
  publisher: 'Foundation Repair Directory',
  alternates: {
    canonical: 'https://foundationscout.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://foundationscout.com',
    siteName: 'Foundation Repair Directory',
    title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundation Repair Directory - Find Trusted Contractors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Plausible Analytics */}
        <script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'foundationscout.com'}
          src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'}
        />
        
        {/* Light mode - no theme switching needed */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Foundation Repair Directory",
                "url": "https://foundationscout.com",
                "description": "Compare foundation repair contractors nationwide",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://foundationscout.com/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Foundation Repair Directory",
                "url": "https://foundationscout.com",
                "logo": "https://foundationscout.com/logo.png",
                "sameAs": [],
                "description": "The most trusted directory for finding verified foundation repair contractors nationwide. Compare reviews, warranties, and pricing from licensed professionals."
              }
            ]),
          }}
        />
      </head>
      <body className={`${manrope.className} bg-white font-display text-slate-900 antialiased overflow-x-hidden`}>
        <ConversionTracker gaId={process.env.NEXT_PUBLIC_GA_ID} />
        {children}
      </body>
    </html>
  );
}
