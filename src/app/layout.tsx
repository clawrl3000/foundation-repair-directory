import type { Metadata } from "next";
import { Manrope, DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import ConversionTracker from '@/components/ConversionTracker';

// Performance optimization: Load critical fonts with font-display: swap
const manrope = Manrope({ subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ 
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  preload: true, // Preload for hero headline LCP
});
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationscout.com'),
  title: {
    default: 'Find Trusted Foundation Repair Contractors Near You | Compare Local Quotes',
    template: '%s | FoundationScout',
  },
  description: 'Compare Thousands of foundation repair contractors nationwide. Get estimates, read reviews, and connect with licensed professionals. Average rating: 4.9/5 stars.',
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
    description: 'Compare foundation repair contractors nationwide. Get estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
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
    description: 'Compare foundation repair contractors nationwide. Get estimates, read reviews, and find licensed professionals.',
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
        
        {/* Google Fonts - Material Symbols (icon_names MUST be alphabetically sorted or API returns 400) */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=architecture,arrow_back,arrow_forward,balance,build,business,calculate,calendar_month,call,check,check_circle,close,compare,compare_arrows,concrete,construction,contact_support,drain,edit_note,engineering,error,expand_more,fact_check,forum,foundation,gavel,gpp_good,grid_guides,groups,handshake,handyman,healing,health_and_safety,home,home_repair_service,home_work,house_with_shield,info,layers,lightbulb,location_city,location_on,login,mail,manage_search,map,mark_email_read,match,menu,open_in_new,paid,payments,phone,pin_drop,progress_activity,refresh,reviews,rocket_launch,rule,schedule,school,search,search_off,security,shield,star,star_half,terrain,trending_up,update,verified,verified_user,visibility,warning,water_damage,water_drop,workspace_premium&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=architecture,arrow_back,arrow_forward,balance,build,business,calculate,calendar_month,call,check,check_circle,close,compare,compare_arrows,concrete,construction,contact_support,drain,edit_note,engineering,error,expand_more,fact_check,forum,foundation,gavel,gpp_good,grid_guides,groups,handshake,handyman,healing,health_and_safety,home,home_repair_service,home_work,house_with_shield,info,layers,lightbulb,location_city,location_on,login,mail,manage_search,map,mark_email_read,match,menu,open_in_new,paid,payments,phone,pin_drop,progress_activity,refresh,reviews,rocket_launch,rule,schedule,school,search,search_off,security,shield,star,star_half,terrain,trending_up,update,verified,verified_user,visibility,warning,water_damage,water_drop,workspace_premium&display=swap"
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
                "description": "The most trusted directory for finding foundation repair contractors nationwide. Compare reviews, warranties, and pricing from licensed professionals."
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
