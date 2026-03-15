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

    if (pathname.startsWith('/admin/settings')) {
      return {
        sectionLabel: t.admin.settings,
        title: t.admin.settingsPageTitle,
        description: t.admin.settingsPageDescription,
      };
    }

    if (pathname.startsWith('/admin/hero')) {
      return {
        sectionLabel: t.admin.hero,
        title: t.admin.heroPageTitle,
        description: t.admin.heroPageDescription,
      };
    }

    if (pathname.startsWith('/admin/projects')) {
      return {
        sectionLabel: t.admin.projects,
        title: t.admin.projectsPageTitle,
        description: t.admin.projectsPageDescription,
      };
    }

    if (pathname.startsWith('/admin/experiences')) {
      return {
        sectionLabel: t.admin.experiences,
        title: t.admin.experiencesPageTitle,
        description: t.admin.experiencesPageDescription,
      };
    }

    if (pathname.startsWith('/admin/approaches')) {
      return {
        sectionLabel: 'Approaches',
        title: 'Work Approaches',
        description: 'Manage your work philosophy and methodologies.',
      };
    }

    if (pathname.startsWith('/admin/skills')) {
      return {
        sectionLabel: t.admin.skills,
        title: t.admin.skillsPageTitle,
        description: t.admin.skillsPageDescription,
      };
    }

    if (pathname.startsWith('/admin/stats')) {
      return {
        sectionLabel: t.admin.stats,
        title: t.admin.statsPageTitle,
        description: t.admin.statsPageDescription,
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
    t.admin.settings,
    t.admin.settingsPageTitle,
    t.admin.settingsPageDescription,
    t.admin.hero,
    t.admin.heroPageTitle,
    t.admin.heroPageDescription,
    t.admin.projects,
    t.admin.projectsPageTitle,
    t.admin.projectsPageDescription,
    t.admin.experiences,
    t.admin.experiencesPageTitle,
    t.admin.experiencesPageDescription,
    t.admin.skills,
    t.admin.skillsPageTitle,
    t.admin.skillsPageDescription,
    t.admin.stats,
    t.admin.statsPageTitle,
    t.admin.statsPageDescription,
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
