import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage.jsx';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'Admin Overview',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminHomePage() {
  return <AdminDashboardPage />;
}
