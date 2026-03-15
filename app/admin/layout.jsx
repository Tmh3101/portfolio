import AdminLayout from '../../features/admin/components/AdminLayout.jsx';

export const metadata = {
  title: 'Admin',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminLayoutWrapper({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
