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
              count: 1,
              suffix: '+',
              title: 'Năm kinh nghiệm',
              copy: 'Từ giai đoạn intern đến backend product work trong môi trường thực tế.',
            },
            {
              count: 1,
              suffix: '+',
              title: 'Freelance work',
              copy: 'Các project nhận ngoài công việc chính, tập trung vào backend và workflow thực tế.',
            },
            {
              count: 3,
              suffix: '',
              title: 'Ưu tiên chính',
              copy: 'APIs, data flow và integrations cho các workflow nghiệp vụ.',
            },
            {
              count: 4,
              suffix: '',
              title: 'Trụ cột kỹ năng',
              copy: 'Backend, data, delivery và support cho end-to-end flow.',
            },
          ]
        : [
            {
              count: 1,
              suffix: '+',
              title: 'Years experience',
              copy: 'From internship work into backend product delivery in real environments.',
            },
            {
              count: 1,
              suffix: '+',
              title: 'Freelance work',
              copy: 'Selected work outside full-time roles, focused on backend delivery and practical workflows.',
            },
            {
              count: 3,
              suffix: '',
              title: 'Current priorities',
              copy: 'APIs, data flow, and integrations for real business workflows.',
            },
            {
              count: 4,
              suffix: '',
              title: 'Core pillars',
              copy: 'Backend, data, delivery, and support across the full product flow.',
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
