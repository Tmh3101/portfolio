'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ExternalLink, Github, Lock } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { projectData } from '../data/projectData';
import { siteConfig } from '../data/siteConfig';

const Projects = ({ data }) => {
  const { t, lang } = useLanguage();

  const projects = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((p) => ({
        title: lang === 'en' && p.title_en ? p.title_en : p.title_vi,
        summary:
          lang === 'en' && p.short_description_en ? p.short_description_en : p.short_description_vi,
        impact: lang === 'en' && p.description_en ? p.description_en : p.description_vi,
        image: p.thumbnail_url || '/assets/optimized/vielora.webp',
        tech: p.technologies || [],
        features: lang === 'en' && p.features_en ? p.features_en : p.features_vi || [],
        repoUrl: p.repo_url || '#',
        liveUrl: p.live_url,
        status: p.featured ? 'Featured' : 'Stable',
        featured: p.featured,
      }));
    }
    return projectData[lang] || projectData.en;
  }, [data, lang]);

  const [showAll, setShowAll] = useState(false);
  const visibleProjects = useMemo(
    () => (showAll ? projects : projects.slice(0, 4)),
    [projects, showAll]
  );
  const hasMoreProjects = projects.length > 4;

  return (
    <section id="projects" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              {t.projects.eyebrow}
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2 }}
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            >
              {t.projects.title1} {t.projects.title2}
            </motion.h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.projects.description}
            </p>
          </div>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
          >
            {t.projects.viewAll}
            <ArrowUpRight size={16} />
          </a>
        </div>

        {visibleProjects.length ? (
          <div>
            <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted-foreground pb-2 border-b border-border">
              <span className="uppercase tracking-wider">{t.projects.archiveLabel}</span>
              <span>
                {visibleProjects.length}/{projects.length}
              </span>
            </div>

            <div className="divide-y divide-border border-b border-border">
              {visibleProjects.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="py-6 md:py-8 grid gap-6 md:grid-cols-12 items-start"
                >
                  {/* Thumbnail */}
                  <div className="md:col-span-3">
                    <div className="overflow-hidden rounded-md border border-border bg-card">
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        width={640}
                        height={440}
                        className="aspect-[16/10] w-full object-cover grayscale contrast-125 transition-all hover:grayscale-0"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                          {project.title}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                          {project.featured ? t.projects.featuredLabel : project.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {project.summary}
                      </p>

                      {project.impact && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 font-mono">
                          // {project.impact}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] text-muted-foreground bg-card border border-border px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex flex-row md:flex-col md:items-end justify-start gap-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <Github size={14} />
                      {t.projects.viewRepo}
                    </a>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 font-mono text-xs text-background transition-opacity hover:opacity-90"
                      >
                        <ExternalLink size={14} />
                        {t.projects.viewDemo}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        <Lock size={12} />
                        {t.projects.demoPending}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>

            {hasMoreProjects && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 font-mono text-xs text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  {showAll ? t.projects.showLess : t.projects.showMore}
                  <ArrowDown
                    size={14}
                    className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Projects;
