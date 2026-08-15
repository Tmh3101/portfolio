import Link from 'next/link';
import { publicService } from '../../lib/services/public.service.js';
import { siteConfig } from '../../data/siteConfig.js';
import PrintButton from './PrintButton.jsx';

export async function generateMetadata() {
  return {
    title: `${siteConfig.name} | CV`,
    description: siteConfig.siteDescription,
  };
}

export default async function CVPage() {
  const data = await publicService.getPortfolioData();
  const experiences = data?.experiences || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];

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
            company: item.company || '',
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
            title: 'AI Backend Engineer',
            company: 'TITOPS VIETNAM CO., LTD.',
            scope:
              'Vielora - AI Chatbot SaaS Platform: RAG pipeline (Gemini + pgvector), multi-tenant architecture, async queues (Redis/BullMQ), payment integration.',
          },
          {
            date: '11/2025 — 12/2026',
            title: 'Backend Engineer Intern',
            company: 'TITOPS (Client: HVA Group)',
            scope:
              'Slice SocialFi - Web3 Social Network: cross-chain token bridge (BNB/LensChain), async transaction queues, Docker/AWS EC2 deployment.',
          },
          {
            date: '09/2025 — 11/2025',
            title: 'Full-stack Developer',
            company: 'TITOPS VIETNAM CO., LTD.',
            scope:
              'Giftcards - Corporate Gift Solution: DNPAY payment integration, order flow optimization.',
          },
          {
            date: '01/2026 — 04/2026',
            title: 'AI Engineer',
            company: 'Graduation Thesis',
            scope:
              'SybilSignal - Graph-based Sybil Detection: GNN (GATv2) + Web dashboard, 4-class risk categorization, score 9.8/10.',
          },
          {
            date: '02/2025 — 12/2025',
            title: 'Full-stack Developer & AI Engineer',
            company: 'Xpervia',
            scope:
              'Learning Management System & AI Chatbot: RAG (LangChain), hybrid recommendation, RBAC LMS (Django + DRF, Next.js).',
          },
          {
            date: '08/2024 — 09/2024',
            title: 'Backend Engineer',
            company: 'Identity Service',
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
    <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 md:px-8">
      {/* Top action bar */}
      <div className="max-w-[800px] mx-auto mb-8 flex items-center justify-between cv-print-btn">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          ← Back to Portfolio
        </Link>
        <PrintButton />
      </div>

      {/* CV Document */}
      <article className="cv-document max-w-[800px] mx-auto bg-card border border-border rounded-lg p-8 sm:p-12 md:p-16 space-y-10">
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </h1>
          <p className="mt-1 font-display text-lg sm:text-xl text-muted-foreground font-medium">
            {siteConfig.role}
          </p>
          <div className="mt-4 font-mono text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <a href={siteConfig.emailHref} className="hover:text-foreground transition-colors">
              {siteConfig.email}
            </a>
            <span>·</span>
            <a href={siteConfig.phoneHref} className="hover:text-foreground transition-colors">
              {siteConfig.phone}
            </a>
            <span>·</span>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {siteConfig.github.replace(/^https?:\/\//, '')}
            </a>
            {siteConfig.linkedin && (
              <>
                <span>·</span>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </>
            )}
          </div>
        </header>

        {/* Summary */}
        {siteConfig.siteDescription && (
          <section>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Summary
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-foreground">
              {siteConfig.siteDescription}
            </p>
          </section>
        )}

        {/* Experience Section */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Experience
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {expRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 py-4 items-baseline"
              >
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {row.date}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-display font-medium text-foreground text-sm sm:text-base">
                      {row.title}
                    </h3>
                    {row.company && (
                      <span className="font-display text-xs sm:text-sm text-muted-foreground">
                        at {row.company}
                      </span>
                    )}
                  </div>
                  {row.scope && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {row.scope}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h3 className="font-display font-medium text-foreground text-sm sm:text-base">
                Engineer in Computer Science · Can Tho University
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">GPA: 3.64 / 4.00</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
              2022 — 2026
            </span>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Skills
          </h2>
          <div className="font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground p-4 bg-muted/30 border border-border rounded-md">
            {skillLine}
          </div>
        </section>

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Projects
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="py-3">
                  <h3 className="font-display font-medium text-foreground text-sm sm:text-base">
                    {proj.title || proj.name}
                  </h3>
                  {(proj.description || proj.summary) && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {proj.description || proj.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
