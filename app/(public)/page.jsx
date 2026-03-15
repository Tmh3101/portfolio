import PortfolioPage from '../../features/public/pages/PortfolioPage.jsx';
import { publicService } from '../../lib/services/public.service.js';

export const revalidate = 3600; // Revalidate every hour

export default async function PublicPage() {
  const data = await publicService.getPortfolioData();

  console.log(data);

  return <PortfolioPage cmsData={data} />;
}
