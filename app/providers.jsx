'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { AdminAuthProvider } from '../features/admin/context/AdminAuthContext.jsx';
import DevToolsTrap from '../components/DevToolsTrap.jsx';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AdminAuthProvider>
          {children}
          <DevToolsTrap />
          <Analytics />
          <SpeedInsights />
        </AdminAuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
