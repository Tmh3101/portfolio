'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import {
  AppWindow,
  Boxes,
  Braces,
  Code2,
  Database,
  Layers3,
  ServerCog,
  Workflow,
  Globe,
} from 'lucide-react';

const IconMap = {
  AppWindow,
  Boxes,
  Braces,
  Code2,
  Database,
  Layers3,
  ServerCog,
  Workflow,
  Globe,
  ...Icons,
};

const TechMarquee = ({ data }) => {
  const defaultTechRow = [
    { label: 'Python', icon: Code2 },
    { label: 'PyTorch', icon: Boxes },
    { label: 'LangChain', icon: Workflow },
    { label: 'FastAPI', icon: ServerCog },
    { label: 'Node.js', icon: Braces },
    { label: 'NestJS', icon: Boxes },
    { label: 'Spring Boot', icon: ServerCog },
    { label: 'Next.js', icon: Braces },
    { label: 'TypeScript', icon: Code2 },
    { label: 'PostgreSQL', icon: Database },
    { label: 'Redis', icon: Database },
    { label: 'Docker', icon: Boxes },
    { label: 'BigQuery', icon: Layers3 },
    { label: 'AWS', icon: Boxes },
  ];

  const techRow =
    data && data.length > 0
      ? data.map((item) => ({
          label: item.label,
          icon: IconMap[item.icon] || Code2,
        }))
      : defaultTechRow;

  return (
    <section className="relative px-6 py-6 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        <div className="stack-marquee-shell">
          <div className="stack-marquee-track">
            {[0, 1].map((copyIndex) => (
              <div
                key={`copy-${copyIndex}`}
                className="stack-marquee-sequence"
                aria-hidden={copyIndex === 1}
              >
                {techRow.map((tech) => {
                  const Icon = tech.icon;

                  return (
                    <span
                      key={`${copyIndex}-${tech.label}`}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground whitespace-nowrap"
                    >
                      <Icon size={14} className="text-muted-foreground" />
                      <span>{tech.label}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;
