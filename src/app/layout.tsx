import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
