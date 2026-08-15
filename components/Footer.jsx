'use client';

import React, { useEffect, useState } from 'react';
import { Eye, MoveUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedName } from '../data/siteConfig';
import { apiUrl } from '../lib/api';

const Footer = () => {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState(null);
  const localizedName = getLocalizedName(lang);

  const footerStatus =
    lang === 'vi'
      ? 'Open cho backend role phù hợp và selected freelance work.'
      : 'Open to the right backend roles and selected freelance work.';
  const visitorLabel = lang === 'vi' ? 'Lượt truy cập' : 'Visitors';

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        const response = await fetch(apiUrl('/api/visits/summary'), {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const nextCount =
          data?.uniqueVisitors > 0 ? data.uniqueVisitors : (data?.totalVisits ?? null);
        setVisitorCount(nextCount);
      } catch {
        // Ignore non-critical footer metrics errors.
      }
    };

    const handleVisitRecorded = () => {
      fetchSummary();
    };

    fetchSummary();
    window.addEventListener('visit-recorded', handleVisitRecorded);

    return () => {
      controller.abort();
      window.removeEventListener('visit-recorded', handleVisitRecorded);
    };
  }, []);

  return (
    <footer className="px-6 py-10 md:px-10 lg:px-20 xl:px-24 border-t border-border mt-16 font-mono text-xs text-muted-foreground">
      <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>{`© ${year} ${localizedName}. All rights reserved.`}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/80">{footerStatus}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <span className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-[11px]">
            <Eye size={12} className="text-muted-foreground" />
            <span>
              {visitorLabel}: {visitorCount ?? '--'}
            </span>
          </span>

          <a
            href="#hero"
            className="inline-flex items-center gap-1 text-foreground transition-colors hover:underline"
          >
            <span>{lang === 'vi' ? 'Lên đầu trang' : 'Back to top'}</span>
            <MoveUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
