'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CircleAlert,
  Clock3,
  Database,
  Mail,
  MapPinned,
  RefreshCcw,
  Settings,
  Home,
  Layers,
  Briefcase,
  Code2,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { formatAdminDateTime } from '../utils/formatAdminDate.js';

export default function AdminDashboardPage() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const { fetchCurrentUser, authorizedFetch } = useAdminAuth();
  const { dashboard, loading, error, refreshDashboard } = useAdminDashboard({
    fetchCurrentUser,
    authorizedFetch,
    showToast,
    loadErrorMessage: t.toasts.adminLoadError,
    fallbackErrorMessage: t.admin.error,
  });

  const latestContact = dashboard.contacts.items[0] || null;
  const latestVisit = dashboard.visits.items[0] || null;

  const cmsModules = [
    { label: t.admin.settings, icon: Settings, to: '/admin/settings', color: 'text-gray-600' },
    { label: t.admin.hero, icon: Home, to: '/admin/hero', color: 'text-blue-600' },
    { label: t.admin.projects, icon: Layers, to: '/admin/projects', color: 'text-indigo-600' },
    {
      label: t.admin.experiences,
      icon: Briefcase,
      to: '/admin/experiences',
      color: 'text-emerald-600',
    },
    { label: 'Approaches', icon: Lightbulb, to: '/admin/approaches', color: 'text-amber-600' },
    { label: t.admin.skills, icon: Code2, to: '/admin/skills', color: 'text-violet-600' },
    { label: t.admin.stats, icon: BarChart3, to: '/admin/stats', color: 'text-rose-600' },
  ];

  return (
    <div className="admin-dashboard">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-overview-card"
      >
        <div className="admin-overview-card__copy">
          <div className="admin-overview-card__eyebrow">
            <Database size={16} />
            <span>{t.admin.protected}</span>
          </div>
          <h2>{dashboard.profile?.fullName || t.admin.sessionOwner}</h2>
          <p>
            {t.admin.signedInAs}: {dashboard.profile?.email || 'admin@example.com'}
          </p>
        </div>

        <div className="admin-overview-card__actions">
          <div className="admin-overview-meta">
            <Clock3 size={15} />
            <span>{t.admin.timezone}: UTC+7</span>
          </div>
          <div className="admin-overview-meta">
            <CircleAlert size={15} />
            <span>{dashboard.profile?.role || 'admin'}</span>
          </div>
          <button type="button" onClick={refreshDashboard} className="admin-primary-button">
            <RefreshCcw size={16} />
            <span>{t.admin.refresh}</span>
          </button>
        </div>
      </motion.section>

      {/* CMS Quick Links */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {cmsModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.to}
              href={module.to}
              className="admin-card p-4 flex flex-col items-center justify-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
            >
              <div
                className={`p-2 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:scale-110 transition-transform ${module.color}`}
              >
                <Icon size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700 text-center">{module.label}</span>
            </Link>
          );
        })}
      </section>

      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-card__icon">
            <Mail size={18} />
          </span>
          <div>
            <p className="admin-stat-card__label">{t.admin.contacts}</p>
            <p className="admin-stat-card__value">{dashboard.contacts.total}</p>
            <p className="admin-stat-card__meta">
              {latestContact
                ? formatAdminDateTime(latestContact.createdAt, lang)
                : t.admin.emptyContacts}
            </p>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-card__icon">
            <Activity size={18} />
          </span>
          <div>
            <p className="admin-stat-card__label">{t.admin.visits}</p>
            <p className="admin-stat-card__value">{dashboard.visits.total}</p>
            <p className="admin-stat-card__meta">
              {latestVisit ? formatAdminDateTime(latestVisit.visitedAt, lang) : t.admin.emptyVisits}
            </p>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-card__icon">
            <MapPinned size={18} />
          </span>
          <div>
            <p className="admin-stat-card__label">{t.admin.session}</p>
            <p className="admin-stat-card__value">{dashboard.profile?.role || 'admin'}</p>
            <p className="admin-stat-card__meta">
              {dashboard.profile?.email || 'admin@example.com'}
            </p>
          </div>
        </article>
      </div>

      <div className="admin-data-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <p className="admin-card__eyebrow">{t.admin.latestContacts}</p>
              <h2 className="admin-card__title">{t.admin.contacts}</h2>
            </div>
            <span className="admin-card__count">{dashboard.contacts.total}</span>
          </div>

          {loading ? (
            <p className="admin-card__empty">{t.admin.loading}</p>
          ) : error ? (
            <p className="admin-card__empty admin-card__empty--error">{error}</p>
          ) : dashboard.contacts.items.length ? (
            <div className="admin-list">
              {dashboard.contacts.items.map((item) => (
                <article key={item.id} className="admin-list-row">
                  <div className="admin-list-row__main">
                    <div className="admin-list-row__topline">
                      <p className="admin-list-row__title">{item.name || item.email}</p>
                      <span className="admin-list-row__badge">{item.country || 'Unknown'}</span>
                    </div>
                    <p className="admin-list-row__sub">{item.email}</p>
                    <p className="admin-list-row__body">{item.message || t.admin.noMessage}</p>
                  </div>
                  <div className="admin-list-row__meta">
                    <span>{item.city || item.region || t.admin.unknownLocation}</span>
                    <span>{formatAdminDateTime(item.createdAt, lang)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-card__empty">{t.admin.emptyContacts}</p>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <p className="admin-card__eyebrow">{t.admin.latestVisits}</p>
              <h2 className="admin-card__title">{t.admin.visits}</h2>
            </div>
            <span className="admin-card__count">{dashboard.visits.total}</span>
          </div>

          {loading ? (
            <p className="admin-card__empty">{t.admin.loading}</p>
          ) : error ? (
            <p className="admin-card__empty admin-card__empty--error">{error}</p>
          ) : dashboard.visits.items.length ? (
            <div className="admin-list">
              {dashboard.visits.items.map((item) => (
                <article key={item.id} className="admin-list-row">
                  <div className="admin-list-row__main">
                    <div className="admin-list-row__topline">
                      <p className="admin-list-row__title">{item.ip || t.admin.ipUnavailable}</p>
                      <span className="admin-list-row__badge">{item.country || 'Unknown'}</span>
                    </div>
                    <p className="admin-list-row__sub">{item.userAgent || t.admin.noUserAgent}</p>
                    <p className="admin-list-row__body">
                      {item.browser || t.admin.unknownBrowser} • {item.os || t.admin.unknownOs}
                    </p>
                  </div>
                  <div className="admin-list-row__meta">
                    <span>{item.deviceType || t.admin.unknownDevice}</span>
                    <span>{formatAdminDateTime(item.visitedAt, lang)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-card__empty">{t.admin.emptyVisits}</p>
          )}
        </section>
      </div>
    </div>
  );
}
