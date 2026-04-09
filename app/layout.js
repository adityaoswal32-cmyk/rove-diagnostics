import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Rove Diagnostics — Precision Hormone Tracking for Women',
  description: 'Quantitative, multi-hormone diagnostic testing redesigned for women. Track FSH, LH, E3G, and PDG at home with clinical precision.',
  keywords: 'hormone testing at home India, women health diagnostics, PCOS test, endometriosis tracking, FSH, LH, E3G, PDG, fertility clinic alternative, cycle optimization',
  openGraph: {
    title: 'Rove Diagnostics — Precision Hormone Tracking for Women',
    description: 'At-home clinical-grade hormone diagnostics for PCOS, fertility, and cycle health.',
    type: 'website',
    url: 'https://rovediag.com',
    siteName: 'Rove Diagnostics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rove Diagnostics',
    description: 'Precision Hormone Tracking for Women.',
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Rove Diagnostics',
    url: 'https://rovediag.com',
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
