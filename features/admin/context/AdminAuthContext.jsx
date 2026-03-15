'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../../../lib/api.js';

const AdminAuthContext = createContext(null);

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }

  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState({ user: null, isReady: false });

  const setUser = useCallback((user) => {
    setSession({ user, isReady: true });
  }, []);

  const clearSession = useCallback(() => {
    setSession({ user: null, isReady: true });
  }, []);

  const signIn = useCallback(
    async ({ email, password }) => {
      console.log('Attempting to sign in with:', { email, password });

      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await readJson(response);

      console.log('API response:', response.status, data);

      if (!response.ok) {
        console.error('Sign-in failed:', data);
        throw new Error(data.message || 'Unable to sign in.');
      }

      setUser(data.user);

      return data.user;
    },
    [setUser]
  );

  const refreshSession = useCallback(async () => {
    const response = await fetch(apiUrl('/api/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
    });

    const data = await readJson(response);

    if (!response.ok) {
      clearSession();
      throw new Error(data.message || 'Session refresh failed.');
    }

    return data;
  }, [clearSession]);

  const authorizedFetch = useCallback(
    async (path, init = {}) => {
      const request = () =>
        fetch(apiUrl(path), {
          ...init,
          credentials: 'include',
          headers: {
            ...(init.headers || {}),
          },
        });

      let response = await request();

      if (response.status !== 401) {
        return response;
      }

      try {
        await refreshSession();
      } catch {
        return response;
      }

      response = await request();

      if (response.status === 401) {
        clearSession();
      }

      return response;
    },
    [clearSession, refreshSession]
  );

  const fetchCurrentUser = useCallback(async () => {
    const response = await authorizedFetch('/api/auth/me');
    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load current user.');
    }

    setUser(data.user);

    return data.user;
  }, [authorizedFetch, setUser]);

  const updateProfile = useCallback(
    async ({ email, fullName }) => {
      const response = await authorizedFetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName }),
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update profile.');
      }

      setUser(data.user);

      return data.user;
    },
    [authorizedFetch, setUser]
  );

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      const response = await authorizedFetch('/api/auth/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || 'Unable to change password.');
      }

      if (data.requiresLogin) {
        clearSession();
      }

      return data;
    },
    [authorizedFetch, clearSession]
  );

  const signOut = useCallback(async () => {
    try {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!cancelled) {
          setUser(user);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [clearSession, fetchCurrentUser, setUser]);

  const value = useMemo(
    () => ({
      session,
      user: session.user,
      isAuthenticated: Boolean(session.user),
      isReady: session.isReady,
      signIn,
      signOut,
      refreshSession,
      fetchCurrentUser,
      updateProfile,
      changePassword,
      authorizedFetch,
      clearSession,
    }),
    [
      session,
      signIn,
      signOut,
      refreshSession,
      fetchCurrentUser,
      updateProfile,
      changePassword,
      authorizedFetch,
      clearSession,
    ]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
