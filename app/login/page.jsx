import AdminLoginPage from '../../features/admin/pages/AdminLoginPage.jsx';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'Admin Login',
  robots: 'noindex, nofollow, noarchive',
};

export default function LoginPage() {
  return <AdminLoginPage />;
}
