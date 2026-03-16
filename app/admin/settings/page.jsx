import AdminSettingsPage from '../../../features/admin/pages/AdminSettingsPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Site Settings',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminSettings() {
  return <AdminSettingsPage />;
}
