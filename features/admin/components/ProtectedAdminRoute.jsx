'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function ProtectedAdminRoute({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady } = useAdminAuth();

  useEffect(() => {
    if (!isReady || isAuthenticated) {
      return;
    }

    const target = new URL('/login', window.location.origin);
    target.searchParams.set('from', pathname);
    router.replace(target.pathname + target.search);
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return children;
}
