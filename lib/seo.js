import { siteConfig } from '../data/siteConfig.js';

const DEFAULT_SITE_URL = 'http://localhost:3000';

export const normalizeSiteUrl = (value) => {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  const baseValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(baseValue).toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const getRuntimeSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return DEFAULT_SITE_URL;
};

export const getSiteUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  return normalizeSiteUrl(envUrl || DEFAULT_SITE_URL);
};

export const buildAbsoluteUrl = (pathname = '/', siteUrl = getRuntimeSiteUrl()) =>
  new URL(pathname, `${siteUrl}/`).toString();

export const getDefaultSeo = (siteUrl = getRuntimeSiteUrl()) => ({
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
  keywords: siteConfig.keywords.join(', '),
  imageUrl: buildAbsoluteUrl(siteConfig.ogImagePath, siteUrl),
  siteUrl,
});

export const createStructuredData = (siteUrl = getRuntimeSiteUrl()) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteConfig.siteTitle,
      alternateName: siteConfig.nameEn,
      url: siteUrl,
      description: siteConfig.siteDescription,
      inLanguage: ['vi', 'en'],
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: `${siteConfig.name} - Profile & Portfolio`,
      isPartOf: { '@id': `${siteUrl}/#website` },
      mainEntity: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: siteConfig.name,
      alternateName: [siteConfig.nameEn, 'MINHHIEU', 'Tmh3101'],
      jobTitle: siteConfig.role,
      description: siteConfig.siteDescription,
      url: siteUrl,
      image: buildAbsoluteUrl(siteConfig.ogImagePath, siteUrl),
      email: siteConfig.emailHref,
      homeLocation: {
        '@type': 'Place',
        name: siteConfig.location,
      },
      sameAs: siteConfig.sameAs,
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Đại học Cần Thơ (Can Tho University)',
        url: 'https://ctu.edu.vn',
        sameAs: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%E1%BA%A7n_Th%C6%A1',
      },
      worksFor: {
        '@type': 'Organization',
        name: siteConfig.company,
      },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'AI Software Engineer',
        occupationalCategory: 'Software Developers, Quality Assurance Analysts, and Testers',
      },
      knowsAbout: [
        {
          '@type': 'Thing',
          name: 'Graph Neural Networks',
          sameAs: 'https://en.wikipedia.org/wiki/Graph_neural_network',
        },
        {
          '@type': 'Thing',
          name: 'Retrieval-Augmented Generation',
          sameAs: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation',
        },
        {
          '@type': 'Thing',
          name: 'Artificial Intelligence',
          sameAs: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
        },
        {
          '@type': 'Thing',
          name: 'Machine Learning',
          sameAs: 'https://en.wikipedia.org/wiki/Machine_learning',
        },
        {
          '@type': 'Thing',
          name: 'Next.js',
          sameAs: 'https://en.wikipedia.org/wiki/Next.js',
        },
        {
          '@type': 'Thing',
          name: 'FastAPI',
          sameAs: 'https://en.wikipedia.org/wiki/FastAPI',
        },
        {
          '@type': 'Thing',
          name: 'PostgreSQL',
          sameAs: 'https://en.wikipedia.org/wiki/PostgreSQL',
        },
        {
          '@type': 'Thing',
          name: 'Docker',
          sameAs: 'https://en.wikipedia.org/wiki/Docker_(software)',
        },
      ],
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#projects`,
      name: 'Featured AI & Engineering Projects',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Vielora',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Cloud / Web',
            description:
              'Multi-tenant AI Chatbot SaaS platform with production RAG pipeline, hybrid search (pgvector + full-text), Redis/BullMQ background queue, and payOS automated checkout.',
            author: { '@id': `${siteUrl}/#person` },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'SoftwareApplication',
            name: 'SybilSignal',
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'Cloud / Web',
            description:
              'On-chain Social Graph Sybil detection system utilizing Graph Neural Networks (GATv2 + Random Forest) over BigQuery-extracted Lens Protocol datasets (Thesis Score: 9.8/10).',
            author: { '@id': `${siteUrl}/#person` },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Xpervia',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Cloud / Web',
            description:
              'Smart AI LMS & Course Recommender Engine benchmarked between Vanilla RAG and HyDE RAG, integrated with LightGBM and Two-Tower DSSM.',
            author: { '@id': `${siteUrl}/#person` },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Slice SocialFi',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Cloud / Web',
            description:
              'Cross-chain token bridge between BNB Smart Chain and LensChain with Lock/Mint & Burn/Unlock mechanism, Redis transaction queue, and DNPAY fiat-to-crypto integration.',
            author: { '@id': `${siteUrl}/#person` },
          },
        },
        {
          '@type': 'ListItem',
          position: 5,
          item: {
            '@type': 'SoftwareApplication',
            name: 'Giftcards.vn',
            applicationCategory: 'CommerceApplication',
            operatingSystem: 'Cloud / Web',
            description:
              'Corporate gift voucher solution with DNPAY Merchant gateway integration, order flow optimization, and robust payment retry mechanisms.',
            author: { '@id': `${siteUrl}/#person` },
          },
        },
      ],
    },
  ],
});
