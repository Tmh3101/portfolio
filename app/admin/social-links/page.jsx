import AdminSocialLinksPage from '../../../features/admin/pages/AdminSocialLinksPage.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Social Links',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminSocialLinks() {
  return <AdminSocialLinksPage />;
}
