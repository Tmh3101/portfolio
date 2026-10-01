import './globals.css';
import { siteConfig } from '../data/siteConfig.js';
import { getSiteUrl, createStructuredData } from '../lib/seo.js';
import Providers from './providers.jsx';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.siteDescription,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: '/',
    languages: {
      vi: '/?lang=vi',
      en: '/?lang=en',
      'x-default': '/',
    },
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: ['en_US'],
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    url: '/',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImagePath,
        width: 1200,
        height: 630,
        alt: siteConfig.siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    images: [siteConfig.ogImagePath],
  },
};

export default function RootLayout({ children }) {
  const structuredData = createStructuredData(getSiteUrl());

  return (
    <html lang="vi" data-theme="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
