import { getSiteUrl } from '../lib/seo.js';

export default function sitemap() {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          vi: `${baseUrl}/?lang=vi`,
          en: `${baseUrl}/?lang=en`,
        },
      },
    },
  ];
}
