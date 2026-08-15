'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Approach = ({ data, sectionData }) => {
  const { t, lang } = useLanguage();

  const section = {
    eyebrow:
      lang === 'en' && sectionData?.eyebrow_en
        ? sectionData.eyebrow_en
        : sectionData?.eyebrow_vi || t.approach.eyebrow,
    title1:
      lang === 'en' && sectionData?.title1_en
        ? sectionData.title1_en
        : sectionData?.title1_vi || t.approach.title1,
    title2:
      lang === 'en' && sectionData?.title2_en
        ? sectionData.title2_en
        : sectionData?.title2_vi || t.approach.title2,
    description:
      lang === 'en' && sectionData?.description_en
        ? sectionData.description_en
        : sectionData?.description_vi || t.approach.description,
    noteLabel:
      lang === 'en' && sectionData?.note_label_en
        ? sectionData.note_label_en
        : sectionData?.note_label_vi || t.approach.noteLabel,
    note:
      lang === 'en' && sectionData?.note_en
        ? sectionData.note_en
        : sectionData?.note_vi || t.approach.note,
  };

  const approachItems =
    data && data.length > 0
      ? data.map((item) => ({
          title: lang === 'en' && item.title_en ? item.title_en : item.title_vi,
          subtitle: lang === 'en' && item.subtitle_en ? item.subtitle_en : item.subtitle_vi,
          copy: lang === 'en' && item.description_en ? item.description_en : item.description_vi,
        }))
      : t.approach.items.map((item) => ({
          ...item,
        }));

  return (
    <section id="focus" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left info column */}
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              {section.eyebrow}
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2 }}
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            >
              {section.title1} {section.title2}
            </motion.h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {section.description}
            </p>

            {section.note && (
              <div className="mt-8 rounded-md border border-border bg-card p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                  // {section.noteLabel}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.note}
                </p>
              </div>
            )}
          </div>

          {/* Right items column */}
          <div className="lg:col-span-7 divide-y divide-border border-y border-border">
            {approachItems.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="py-6 flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>

                {item.subtitle && (
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
