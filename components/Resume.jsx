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
            title: item.role || item.title || item.position || 'AI Backend Engineer',
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
            date: '01/2026 — Present',
            title: 'AI Backend Engineer · TITOPS VIETNAM CO., LTD.',
            scope:
              'Vielora - AI Chatbot SaaS Platform: RAG pipeline (Gemini + pgvector), multi-tenant architecture, async queues (Redis/BullMQ), payment integration.',
          },
          {
            date: '11/2025 — 12/2026',
            title: 'Backend Engineer Intern · TITOPS (Client: HVA Group)',
            scope:
              'Slice SocialFi - Web3 Social Network: cross-chain token bridge (BNB/LensChain), async transaction queues, Docker/AWS EC2 deployment.',
          },
          {
            date: '09/2025 — 11/2025',
            title: 'Full-stack Developer · TITOPS VIETNAM CO., LTD.',
            scope:
              'Giftcards - Corporate Gift Solution: DNPAY payment integration, order flow optimization.',
          },
          {
            date: '01/2026 — 04/2026',
            title: 'AI Engineer · Graduation Thesis',
            scope:
              'SybilSignal - Graph-based Sybil Detection: GNN (GATv2) + Web dashboard, 4-class risk categorization, score 9.8/10.',
          },
          {
            date: '02/2025 — 12/2025',
            title: 'Full-stack Developer & AI Engineer · Xpervia',
            scope:
              'Learning Management System & AI Chatbot: RAG (LangChain), hybrid recommendation, RBAC LMS (Django + DRF, Next.js).',
          },
          {
            date: '08/2024 — 09/2024',
            title: 'Backend Engineer · Identity Service',
            scope:
              'Auth RESTful API: JWT + OAuth2, RBAC, password hashing, refresh token rotation.',
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
      'Python · Java · TypeScript · JavaScript · Next.js · React · Node.js · NestJS · Django · Spring Boot 3 · PostgreSQL · MySQL · MongoDB · Redis · Supabase · Docker · AWS · BullMQ · LangChain · Hugging Face · RAG Pipelines';
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
