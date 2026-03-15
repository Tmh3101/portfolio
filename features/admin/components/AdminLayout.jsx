'use client';

import React, { useMemo } from 'react';
import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import AdminShell from './AdminShell.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { signOut } = useAdminAuth();

  const pageMeta = useMemo(() => {
    if (pathname.startsWith('/admin/profile')) {
      return {
        sectionLabel: t.admin.profile,
        title: t.admin.profilePageTitle,
        description: t.admin.profilePageDescription,
      };
    }

    if (pathname.startsWith('/admin/password')) {
      return {
        sectionLabel: t.admin.passwordSettings,
        title: t.admin.passwordPageTitle,
        description: t.admin.passwordPageDescription,
      };
    }

    if (pathname.startsWith('/admin/contacts')) {
      return {
        sectionLabel: t.admin.contacts,
        title: t.admin.contactsPageTitle,
        description: t.admin.contactsPageDescription,
      };
    }

    if (pathname.startsWith('/admin/visits')) {
      return {
        sectionLabel: t.admin.visits,
        title: t.admin.visitsPageTitle,
        description: t.admin.visitsPageDescription,
      };
    }

    return {
      sectionLabel: t.admin.overview,
      title: t.admin.title,
      description: t.admin.description,
    };
  }, [
    t.admin.contacts,
    pathname,
    t.admin.contactsPageDescription,
    t.admin.contactsPageTitle,
    t.admin.description,
    t.admin.overview,
    t.admin.passwordPageDescription,
    t.admin.passwordPageTitle,
    t.admin.passwordSettings,
    t.admin.profile,
    t.admin.profilePageDescription,
    t.admin.profilePageTitle,
    t.admin.title,
    t.admin.visits,
    t.admin.visitsPageDescription,
    t.admin.visitsPageTitle,
  ]);

  const handleSignOut = async () => {
    await signOut();
    showToast(t.toasts.logoutSuccess, 'success');
    router.replace('/login');
  };

  const actions = (
    <button
      type="button"
      onClick={handleSignOut}
      className="admin-toolbar-button admin-toolbar-button--danger"
    >
      <LogOut size={15} />
      <span>{t.admin.signOut}</span>
    </button>
  );

  return (
    <AdminShell
      sectionLabel={pageMeta.sectionLabel}
      title={pageMeta.title}
      description={pageMeta.description}
      actions={actions}
    >
      {children}
    </AdminShell>
  );
}
