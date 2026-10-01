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
              title: 'GPA Kỹ sư CNTT (Loại Giỏi)',
              copy: 'Đại học Cần Thơ',
            },
            {
              count: 9.8,
              suffix: '/10',
              title: 'Điểm Khóa luận Tốt nghiệp',
              copy: 'Graph Neural Networks',
            },
            {
              count: 5,
              suffix: '+',
              title: 'Dự án Production & R&D',
              copy: 'SaaS, Distributed, AI',
            },
          ]
        : [
            {
              count: 3.64,
              suffix: '/4.0',
              title: 'Honors CS Degree',
              copy: 'Can Tho University',
            },
            {
              count: 9.8,
              suffix: '/10',
              title: 'Graduation Thesis Score',
              copy: 'Graph Neural Networks',
            },
            {
              count: 5,
              suffix: '+',
              title: 'Production & R&D Projects',
              copy: 'SaaS, Distributed, AI',
            },
          ];

  return (
    <section className="px-6 pb-16 md:px-10 lg:px-20 xl:px-24">
      <div className="container mx-auto">
        <div
          className={`grid gap-4 md:grid-cols-2 ${
            statsData.length === 3 ? 'lg:grid-cols-3' : 'xl:grid-cols-4'
          }`}
        >
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
