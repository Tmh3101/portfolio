'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Stats = ({ data }) => {
  const { lang, t } = useLanguage();

  const statsData =
    data && data.length > 0
      ? data.map((item, idx) => ({
          count: item.value,
          suffix: item.suffix || '',
          title: lang === 'en' && item.label_en ? item.label_en : item.label_vi,
          copy:
            (lang === 'en' && item.copy_en ? item.copy_en : item.copy_vi) ||
            t.stats?.items?.[idx]?.copy ||
            '',
        }))
      : lang === 'vi'
        ? [
            {
              count: 3.64,
              suffix: '/4.0',
              title: 'GPA Kỹ sư CNTT',
              copy: 'Đại học Cần Thơ — Tốt nghiệp loại Giỏi (Honors)',
            },
            {
              count: 9.8,
              suffix: '/10',
              title: 'Khóa luận tốt nghiệp',
              copy: 'Graph Neural Networks & Web3 Sybil Detection',
            },
            {
              count: 6,
              suffix: '+',
              title: 'Dự án thực tế',
              copy: 'SaaS multi-tenant, Web3 Token Bridge, AI & Distributed Systems',
            },
            {
              count: 100,
              suffix: '%',
              title: 'Code Integrity',
              copy: 'Hàng đợi bất đồng bộ, token bridge bảo đảm zero-data-loss',
            },
          ]
        : [
            {
              count: 3.64,
              suffix: '/4.0',
              title: 'CS Engineering GPA',
              copy: 'Can Tho University — Honors degree',
            },
            {
              count: 9.8,
              suffix: '/10',
              title: 'Graduation Thesis',
              copy: 'Graph Neural Networks & Web3 Sybil Detection',
            },
            {
              count: 6,
              suffix: '+',
              title: 'Production & R&D Projects',
              copy: 'Multi-tenant SaaS, Web3 Token Bridge, AI & Distributed Systems',
            },
            {
              count: 100,
              suffix: '%',
              title: 'Code Integrity',
              copy: 'Async task queues, token bridge ensuring zero data loss',
            },
          ];

  return (
    <section className="px-6 pb-16 md:px-10 lg:px-20 xl:px-24">
      <div className="container mx-auto">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="rounded-md border border-border bg-card p-6"
            >
              <p className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {stat.count}
                {stat.suffix}
              </p>
              <h3 className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {stat.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
