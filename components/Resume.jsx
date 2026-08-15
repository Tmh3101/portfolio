'use client';

import React from 'react';

export default function Resume({ experiences, skills }) {
  // Experience rows
  const expRows =
    experiences && experiences.length > 0
      ? experiences.map((item) => {
          let dateStr = item.period;
          if (!dateStr) {
            if (item.date_start || item.date_end) {
              dateStr = `${item.date_start || ''} — ${item.is_current ? 'now' : item.date_end || ''}`;
            } else if (item.start_date || item.end_date) {
              const startYear = item.start_date ? new Date(item.start_date).getFullYear() : '';
              const endYear = item.is_current
                ? 'now'
                : item.end_date
                  ? new Date(item.end_date).getFullYear()
                  : '';
              dateStr = `${startYear} — ${endYear}`;
            } else {
              dateStr = '2023 — now';
            }
          }
          return {
            date: dateStr,
            title: item.role || item.title || item.position || 'Backend Engineer',
            scope:
              item.description ||
              item.scope ||
              (item.company
                ? `${item.company} · Backend services & API design`
                : 'Backend services & API design'),
          };
        })
      : [
          {
            date: '2023 — now',
            title: 'Backend Engineer',
            scope: 'Distributed systems, high-throughput API design, and asynchronous task pipelines',
          },
          {
            date: '2021 — 2023',
            title: 'Backend Developer',
            scope: 'Python / FastAPI microservices, PostgreSQL query optimization, and CI/CD pipelines',
          },
          {
            date: '2020 — 2021',
            title: 'Backend Intern',
            scope: 'API endpoint development, internal tooling, and test automation',
          },
        ];

  // Skills tag line
  let skillLine = '';
  if (skills && skills.length > 0) {
    skillLine = skills
      .map((s) => (typeof s === 'string' ? s : s.name))
      .filter(Boolean)
      .join(' · ');
  }
  if (!skillLine) {
    skillLine =
      'Python · FastAPI · Go · PostgreSQL · Redis · Docker · Kubernetes · AWS · GraphQL · Linux';
  }

  return (
    <section id="resume" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            RESUME
          </p>
          <a
            href="/cv"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Download CV
          </a>
        </div>

        {/* Experience Sub-section */}
        <div className="mb-8">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Experience
          </h3>
          <div className="rounded-md border border-border overflow-hidden bg-card divide-y divide-border">
            {expRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-2 sm:gap-6 p-4 sm:p-5 items-baseline"
              >
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {row.date}
                </span>
                <div>
                  <h4 className="font-display font-medium text-foreground text-sm sm:text-base">
                    {row.title}
                  </h4>
                  {row.scope && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                      {row.scope}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Sub-section */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Skills
          </h3>
          <div className="rounded-md border border-border bg-card p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {skillLine}
          </div>
        </div>
      </div>
    </section>
  );
}
