import AdminStatsPage from '../../../features/admin/pages/AdminStatsPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Numerical Stats',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminStats() {
  return <AdminStatsPage />;
}
