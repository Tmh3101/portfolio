'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedName, siteConfig as defaultSiteConfig } from '../data/siteConfig';

const IconMap = {
  Github,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Phone,
};

const Hero = ({ data, settings, socialLinks }) => {
  const { t, lang } = useLanguage();
  const localizedName = getLocalizedName(lang);

  const getLoc = (field) =>
    lang === 'en' && data?.[`${field}_en`] ? data[`${field}_en`] : data?.[`${field}_vi`];

  // Dynamic values from CMS or fallbacks
  const greeting = getLoc('greeting') || t.hero.badge;
  const heroName = data?.name || localizedName;
  const headline = getLoc('headline') || '';
  const title1 = headline ? headline.split(' ')[0] : t.hero.title1;
  const title2 = headline ? headline.split(' ').slice(1).join(' ') : t.hero.title2;
  const title3 = getLoc('subtitle') || t.hero.title3;
  const description = getLoc('subheadline') || t.hero.description;

  const linkedinUrl = settings?.linkedin_url || defaultSiteConfig.profileUrl;
  const contactEmail = settings?.email || defaultSiteConfig.email;
  const resumeUrl = settings?.resume_url || defaultSiteConfig.resumeUrl;

  const quickLinks =
    socialLinks && socialLinks.length > 0
      ? [
          {
            href: `mailto:${contactEmail}`,
            label: 'Email',
            icon: Mail,
          },
          ...socialLinks.slice(0, 3).map((link) => ({
            href: link.url,
            label: link.name,
            icon: IconMap[link.icon] || Globe,
            external: true,
          })),
        ]
      : [
          {
            href: `mailto:${contactEmail}`,
            label: 'Email',
            icon: Mail,
          },
          {
            href: settings?.github_url || defaultSiteConfig.github,
            label: 'GitHub',
            icon: Github,
            external: true,
          },
        ];

  const roles =
    lang === 'en' && data?.roles_en?.length > 0
      ? data.roles_en
      : data?.roles_vi || [t.hero.focusValue, t.hero.opportunityValue, t.hero.noteValue];

  const detailCards = [
    {
      label: getLoc('role1_label') || t.hero.focusLabel,
      value: roles[0] || t.hero.focusValue,
    },
    {
      label: getLoc('role2_label') || t.hero.opportunityLabel,
      value: roles[1] || t.hero.opportunityValue,
    },
    {
      label: getLoc('role3_label') || t.hero.noteLabel,
      value: roles[2] || t.hero.noteValue,
    },
  ];

  const specList = [
    { label: lang === 'vi' ? 'Vai trò' : 'Role', value: defaultSiteConfig.role },
    { label: lang === 'vi' ? 'Địa điểm' : 'Based', value: defaultSiteConfig.location },
    { label: lang === 'vi' ? 'Tổ chức' : 'Company', value: defaultSiteConfig.company },
    ...detailCards.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex items-center pt-28 pb-16 px-6 md:px-10 lg:px-20 xl:px-24"
    >
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Heading, description, CTA buttons, social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {greeting && (
              <div className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-foreground" />
                <span>{greeting}</span>
              </div>
            )}

            <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-[1.1] tracking-tight text-foreground">
              <span>
                {title1} {title2}
              </span>
              {title3 && (
                <span className="block mt-2 text-[0.55em] font-normal tracking-normal text-muted-foreground">
                  {title3}
                </span>
              )}
            </h1>

            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={data?.cta_primary_href || resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {getLoc('cta_primary_label') || t.hero.btnContact}
                <ArrowRight size={16} />
              </a>
              <a
                href={data?.cta_secondary_href || resumeUrl}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {getLoc('cta_secondary_label') || t.hero.btnResume}
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-border">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Monospace Spec List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="lg:col-span-5"
          >
            <div className="rounded-lg border border-border bg-card p-6 md:p-7">
              {data?.avatar_url && (
                <div className="mb-5 flex items-center gap-4">
                  <img
                    src={data.avatar_url}
                    alt={heroName}
                    className="h-28 w-28 shrink-0 rounded-xl border border-border object-cover grayscale"
                  />
                  <div className="font-mono">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t.nav.profile}
                    </div>
                    <div className="text-sm font-medium text-foreground">{heroName}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{defaultSiteConfig.role}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  SPEC // PROFILE
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  v2.0
                </span>
              </div>

              <div className="divide-y divide-border font-mono text-xs">
                {specList.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 gap-1"
                  >
                    <span className="text-muted-foreground uppercase tracking-wider shrink-0 sm:w-28">
                      {item.label}
                    </span>
                    <span className="text-foreground sm:text-right break-words font-normal">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>{defaultSiteConfig.brand}</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-foreground hover:underline"
                >
                  {t.nav.profile}
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
