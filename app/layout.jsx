import './globals.css';
import { siteConfig } from '../data/siteConfig.js';
import { getSiteUrl } from '../lib/seo.js';
import Providers from './providers.jsx';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.siteTitle}`,
  },
  description: siteConfig.siteDescription,
  keywords: siteConfig.keywords,
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
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
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
