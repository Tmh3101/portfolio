import AdminProfilePage from '../../../features/admin/pages/AdminProfilePage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Profile',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminProfile() {
  return <AdminProfilePage />;
}
