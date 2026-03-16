'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation'; // Assuming Next.js router for navigation
import { Database } from '../../../lib/database.types'; // Adjust path as necessary
import { env } from '../../../lib/config/env.js'; // Assuming env vars are here

const AdminAuthContext = createContext(null);

// --- Supabase Browser Client Setup ---
// It's crucial to ensure env variables are available and to use createBrowserClient
const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

const supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const router = useRouter(); // Hook for navigation

  const [authDetails, setAuthDetails] = useState({
    user: null,
    isReady: false,
  });

  const { user, isReady } = authDetails;

  const updateUserState = useCallback((newUser) => {
    setAuthDetails({ user: newUser, isReady: true });
  }, []);

  const clearUserState = useCallback(() => {
    setAuthDetails({ user: null, isReady: true });
  }, []);

  // --- Sign In ---
  const signIn = useCallback(
    async ({ email, password }) => {
      const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase Sign-in error:', error.message);
        throw new Error(error.message || 'Unable to sign in.');
      }

      updateUserState(data.user);
      // Navigation is handled by onAuthStateChange listener
      return data.user;
    },
    [updateUserState]
  );

  // --- Sign Out ---
  const signOut = useCallback(async () => {
    await supabaseBrowserClient.auth.signOut();
    // The onAuthStateChange listener will handle state update and redirection
  }, []);

  // --- Initial User Fetch & Auth State Listener ---
  useEffect(() => {
    const fetchUserAndListen = async () => {
      // Fetch initial user state
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      updateUserState(user); // Set initial user state

      // Set up the auth state change listener
      const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            updateUserState(session?.user ?? null);
          } else if (event === 'SIGNED_OUT') {
            clearUserState();
            // Redirect to login page when signed out, but only if not already on login/admin login page
            // Check current route to avoid redirect loops if user navigates away from protected areas
            const currentPath = window.location.pathname; // Use window.location.pathname for client-side path
            if (currentPath !== '/login' && currentPath !== '/admin/login') {
              router.push('/login'); // Adjust path if needed based on your app's login route
            }
          }
        }
      );

      // Cleanup function to unsubscribe from auth state changes
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    };

    fetchUserAndListen();
  }, [updateUserState, clearUserState, router]); // Added router to dependency array

  // --- Profile Update (Example of direct Supabase client usage) ---
  const updateProfile = useCallback(
    async ({ email }) => {
      if (!user) throw new Error('User not authenticated.');

      // Supabase's updateUser method allows updating properties of the auth.users table.
      // For 'fullName', this typically means updating a 'name' or 'full_name' column
      // in a related 'profiles' table, not directly on 'auth.users'.
      // This example updates the email. For fullName, you'd typically:
      // 1. Get the user's ID (user.id)
      // 2. Update the 'profiles' table using supabaseBrowserClient.from('profiles').update({ full_name: fullName }).eq('id', user.id)
      // We'll stick to updating email via auth.updateUser for this example.

      const { error } = await supabaseBrowserClient.auth.updateUser({ email });

      if (error) {
        console.error('Supabase Profile Update error:', error.message);
        throw new Error(error.message || 'Unable to update profile.');
      }

      // Re-fetch user to get updated info from Supabase Auth
      const {
        data: { user: updatedUser },
      } = await supabaseBrowserClient.auth.getUser();
      updateUserState(updatedUser);

      return updatedUser;
    },
    [user, updateUserState]
  );

  // --- Change Password (Example of direct Supabase client usage) ---
  const changePassword = useCallback(
    async ({ newPassword }) => {
      if (!user) throw new Error('User not authenticated.');

      // Supabase's updateUser method can change the password.
      // Note: The direct client-side updateUser method for password typically does NOT require the current password.
      // It's usually initiated via a password reset flow or assumes the user is already authenticated.
      // If you need to enforce the 'currentPassword' for security, this logic would ideally be
      // handled on a server-side route or by using Supabase's password reset flow.
      // For this refactor, we'll use the direct updateUser with password, acknowledging this limitation.

      const { error } = await supabaseBrowserClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Supabase Change Password error:', error.message);
        throw new Error(error.message || 'Unable to change password.');
      }

      // Changing password might implicitly require re-authentication or trigger session events.
      // The onAuthStateChange listener should handle any resulting SIGNED_OUT events.
      // A common pattern is to force a re-login after password change.

      return { success: true };
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      // Expose a helper to fetch the current user on demand
      fetchCurrentUser: async () => {
        const {
          data: { user: currentUser },
        } = await supabaseBrowserClient.auth.getUser();
        updateUserState(currentUser ?? null);
        return currentUser ?? null;
      },
      // Authorized fetch helper that automatically includes credentials and handles 401s
      authorizedFetch: async (input, init = {}) => {
        const response = await fetch(input, {
          ...init,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {}),
          },
        });

        if (response.status === 401) {
          // Unauthorized: clear local auth state and redirect to login
          clearUserState();
          router.push('/login');
        }

        return response;
      },
      signIn,
      signOut,
      updateProfile,
      changePassword,
    }),
    [
      user,
      isReady,
      signIn,
      signOut,
      updateProfile,
      changePassword,
      updateUserState,
      clearUserState,
      router,
    ]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
