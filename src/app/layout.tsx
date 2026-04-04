import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import ConversionTracker from '@/components/ConversionTracker';
import EnhancedScrollAnimations from '@/components/EnhancedScrollAnimations';

const dmSerifDisplay = DM_Serif_Display({ 
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-display',
  preload: true,
});
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationscout.com'),
  title: {
    default: 'Foundation Repair Contractors Near You | Compare Estimates',
    template: '%s | FoundationScout',
  },
  description: 'Compare foundation repair contractors nationwide. Get your Scout Report with cost estimates, read reviews, and connect with licensed pros. Average rating: 4.9/5 stars.',
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
        
        {/* Google Fonts - Material Symbols */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=architecture,arrow_back,arrow_forward,balance,build,business,calculate,calendar_month,call,check,check_circle,close,compare,compare_arrows,concrete,construction,contact_support,description,drain,edit_note,emergency,engineering,error,expand_more,fact_check,forum,foundation,gavel,gpp_good,grid_guides,groups,handshake,handyman,healing,health_and_safety,help,home,home_repair_service,home_work,house_with_shield,info,layers,lightbulb,location_city,location_on,login,mail,manage_search,map,mark_email_read,match,menu,open_in_new,paid,payments,phone,pin_drop,priority_high,progress_activity,refresh,rate_review,request_quote,reviews,rocket_launch,rule,schedule,school,search,search_off,security,send,shield,star,star_half,terrain,trending_up,update,verified,verified_user,visibility,warning,water_damage,water_drop,workspace_premium&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=architecture,arrow_back,arrow_forward,balance,build,business,calculate,calendar_month,call,check,check_circle,close,compare,compare_arrows,concrete,construction,contact_support,description,drain,edit_note,emergency,engineering,error,expand_more,fact_check,forum,foundation,gavel,gpp_good,grid_guides,groups,handshake,handyman,healing,health_and_safety,help,home,home_repair_service,home_work,house_with_shield,info,layers,lightbulb,location_city,location_on,login,mail,manage_search,map,mark_email_read,match,menu,open_in_new,paid,payments,phone,pin_drop,priority_high,progress_activity,refresh,rate_review,request_quote,reviews,rocket_launch,rule,schedule,school,search,search_off,security,send,shield,star,star_half,terrain,trending_up,update,verified,verified_user,visibility,warning,water_damage,water_drop,workspace_premium&display=swap"
          rel="stylesheet"
        />
        {/* Plausible Analytics */}
        <script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'foundationscout.com'}
          src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","w3nxfa4kl2");`
          }}
        />
        {/* Ahrefs Web Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="rkZmPrjzngODZaX5r3Oefg"
          async
        />
        
        {/* Light mode - no theme switching needed */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "FoundationScout",
                "url": "https://foundationscout.com",
                "description": "Compare foundation repair contractors nationwide"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "FoundationScout",
                "url": "https://foundationscout.com",
                "logo": "https://foundationscout.com/logo.png",
                "sameAs": [],
                "description": "The most trusted directory for finding foundation repair contractors nationwide. Compare reviews, warranties, and pricing from licensed professionals."
              }
            ]),
          }}
        />
      </head>
      <body className={`${inter.variable} ${dmSerifDisplay.variable} bg-white font-sans text-slate-900 antialiased overflow-x-hidden`}>
        <ConversionTracker gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <EnhancedScrollAnimations />
        <main>{children}</main>
      </body>
    </html>
  );
}
