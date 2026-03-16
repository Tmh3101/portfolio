import AdminProjectsPage from '../../../features/admin/pages/AdminProjectsPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Management',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminProjects() {
  return <AdminProjectsPage />;
}
