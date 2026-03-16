import AdminHeroPage from '../../../features/admin/pages/AdminHeroPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hero Section',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminHero() {
  return <AdminHeroPage />;
}
