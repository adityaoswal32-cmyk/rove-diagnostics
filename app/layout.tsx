import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gynx.in'),
  title: 'Rove Diagnostics — Precision Hormone Tracking for Women',
  description: 'Quantitative, multi-hormone diagnostic testing redesigned for women. Track FSH, LH, E3G, and PDG at home with clinical precision.',
  keywords: 'hormone testing at home India, women health diagnostics, PCOS test, endometriosis tracking, FSH, LH, E3G, PDG, fertility clinic alternative, cycle optimization, rove diagnostics, gynx',
  alternates: {
    canonical: 'https://www.gynx.in',
  },
  openGraph: {
    title: 'Rove Diagnostics — Precision Hormone Tracking for Women',
    description: 'At-home clinical-grade hormone diagnostics for PCOS, fertility, and cycle health.',
    type: 'website',
    url: 'https://www.gynx.in',
    siteName: 'Rove Diagnostics',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rove Diagnostics',
    description: 'Precision Hormone Tracking for Women.',
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
    // You'll add your Google Search Console verification code here
    // google: 'YOUR_VERIFICATION_CODE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Rove Diagnostics',
    url: 'https://www.gynx.in',
    medicalSpecialty: [
      'Endocrinology',
      'Gynecologic'
    ],
    description: 'Precision diagnostics for tracking female reproductive hormones at home.'
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
