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
    { label: 'FastAPI', icon: ServerCog },
    { label: 'Laravel', icon: Layers3 },
    { label: 'PostgreSQL', icon: Database },
    { label: 'MySQL', icon: Database },
    { label: 'Docker', icon: Boxes },
    { label: 'Nginx', icon: ServerCog },
    { label: 'AWS', icon: Boxes },
    { label: 'CI/CD', icon: Workflow },
    { label: 'VS Code', icon: AppWindow },
    { label: 'Postman', icon: Workflow },
    { label: 'Git', icon: Braces },
  ];

  const techRow =
    data && data.length > 0
      ? data.map((item) => ({
          label: item.label,
          icon: IconMap[item.icon] || Code2,
        }))
      : defaultTechRow;

  return (
    <section className="relative px-6 py-6 md:px-10 lg:px-20 xl:px-24 border-y border-border">
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
