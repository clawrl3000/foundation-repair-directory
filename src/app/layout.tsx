import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConversionTracker from '@/components/ConversionTracker';

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationrepairfinder.com'),
  title: {
    default: 'Foundation Repair Directory — Find Trusted Contractors Near You',
    template: '%s | Foundation Repair Directory',
  },
  description: 'Compare foundation repair contractors nationwide. Get free estimates, read reviews, and find licensed professionals for pier & beam, slab, and basement repairs.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Foundation Repair Directory',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
        {/* Prevent flash of incorrect theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.className = theme;
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Foundation Repair Directory",
                "url": "https://foundationrepairfinder.com",
                "description": "Compare foundation repair contractors nationwide",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://foundationrepairfinder.com/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Foundation Repair Directory",
                "url": "https://foundationrepairfinder.com",
                "logo": "https://foundationrepairfinder.com/logo.png",
                "sameAs": [],
                "description": "The most trusted directory for finding verified foundation repair contractors nationwide. Compare reviews, warranties, and pricing from licensed professionals."
              }
            ]),
          }}
        />
      </head>
      <body className={`${manrope.className} bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden`}>
        <ConversionTracker gaId={process.env.NEXT_PUBLIC_GA_ID} />
        {children}
      </body>
    </html>
  );
}
