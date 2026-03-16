'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useAdminDashboard({
  fetchCurrentUser,
  authorizedFetch,
  showToast,
  loadErrorMessage,
  fallbackErrorMessage,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState({
    profile: null,
    contacts: { total: 0, items: [] },
    visits: { total: 0, items: [] },
  });

  // Guard to avoid duplicate loads in React Strict Mode (dev),
  // where effects may run twice on initial mount.
  const hasLoadedRef = useRef(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [profile, contactsResponse, visitsResponse] = await Promise.all([
        fetchCurrentUser(),
        authorizedFetch('/api/admin/contacts?page=1&pageSize=5'),
        authorizedFetch('/api/admin/visits?page=1&pageSize=6'),
      ]);

      console.log('profile, contactsResponse, visitsResponse:', {
        profile,
        contactsResponse,
        visitsResponse,
      });

      const [contactsData, visitsData] = await Promise.all([
        contactsResponse.json(),
        visitsResponse.json(),
      ]);

      if (!contactsResponse.ok || !visitsResponse.ok) {
        throw new Error(contactsData.message || visitsData.message || loadErrorMessage);
      }

      setDashboard({
        profile,
        contacts: contactsData,
        visits: visitsData,
      });
    } catch (error) {
      const message = error.message || fallbackErrorMessage;
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [authorizedFetch, fetchCurrentUser, fallbackErrorMessage, loadErrorMessage, showToast]);

  useEffect(() => {
    // Only load the dashboard once when there is no profile yet.
    // Also guard against React Strict Mode double-invoking effects in dev
    // by using a ref to ensure we only call `loadDashboard` a single time
    // per component mount.
    if (!hasLoadedRef.current && !dashboard.profile) {
      hasLoadedRef.current = true;
      loadDashboard();
    }
  }, [loadDashboard, dashboard.profile]);

  return {
    dashboard,
    loading,
    error,
    refreshDashboard: loadDashboard,
  };
}
