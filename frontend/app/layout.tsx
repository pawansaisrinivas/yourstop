import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YourStop Studio | We Write • We Design • We Build',
  description: 'YourStop Studio is a multidisciplinary creative and technology studio specializing in Web Development, UI/UX Design, Video Editing, Reel Making, Voice Over Services, and Content Writing.',
  keywords: [
    'YourStop Studio',
    'Website Development',
    'UI UX Design',
    'Video Editing',
    'Reel Making',
    'Voice Over Services',
    'Content Writing',
    'Creative Studio',
  ],
  authors: [{ name: 'YourStop Studio Team' }],
  openGraph: {
    title: 'YourStop Studio | Transforming Ideas Into Powerful Digital Experiences',
    description: 'We Write • We Design • We Build. Complete digital execution for startups, creators, events, and businesses.',
    url: 'https://yourstopstudio.com',
    siteName: 'YourStop Studio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'YourStop Studio Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourStop Studio | We Write • We Design • We Build',
    description: 'Transforming Ideas Into Powerful Digital Experiences.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'YourStop Studio',
  image: 'https://yourstopstudio.com/logo.png',
  '@id': 'https://yourstopstudio.com',
  url: 'https://yourstopstudio.com',
  telephone: '+919876543210',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  slogan: 'We Write • We Design • We Build.',
  description: 'Multidisciplinary creative and technology studio helping businesses transform ideas into digital experiences.',
  knowsLanguage: ['English', 'Telugu', 'Hindi', 'Tamil', 'Odia'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-studio-black text-studio-white antialiased">
        {children}
      </body>
    </html>
  );
}
