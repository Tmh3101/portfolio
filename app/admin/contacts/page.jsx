import AdminContactsPage from '../../../features/admin/pages/AdminContactsPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Contacts',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminContacts() {
  return <AdminContactsPage />;
}
