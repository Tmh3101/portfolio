import PortfolioPage from '../../features/public/pages/PortfolioPage.jsx';
import { publicService } from '../../lib/services/public.service.js';
import { siteConfig } from '../../data/siteConfig.js';
import { getSiteUrl } from '../../lib/seo.js';

export async function generateMetadata() {
  const data = await publicService.getPortfolioData();
  const settings = data?.settings || {};

  const title = settings.site_title_vi || siteConfig.siteTitle;
  const description = settings.site_description_vi || siteConfig.siteDescription;
  const keywords = settings.seo_keywords_vi?.join(', ') || siteConfig.keywords.join(', ');
  const ogImageUrl = settings.og_image_url || siteConfig.ogImagePath;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    keywords: keywords,
    openGraph: {
      type: 'website',
      title: title,
      description: description,
      url: '/',
      siteName: title,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicPage() {
  const data = await publicService.getPortfolioData();

  return <PortfolioPage cmsData={data} />;
}
