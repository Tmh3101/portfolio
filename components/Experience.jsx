'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const formatPeriod = (start, end, isCurrent, lang) => {
  if (!start) return '';
  const startDate = new Date(start);
  const startStr = `${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`;

  if (isCurrent) {
    return `${startStr} - ${lang === 'vi' ? 'Hiện tại' : 'Present'}`;
  }

  if (!end) return startStr;

  const endDate = new Date(end);
  const endStr = `${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`;
  return `${startStr} - ${endStr}`;
};

const Experience = ({ data }) => {
  const { t, lang } = useLanguage();
  const highlightsLabel = lang === 'vi' ? 'Điểm chính' : 'Highlights';
  const currentRoleLabel = lang === 'vi' ? 'Vai trò hiện tại' : 'Current role';
  const previousRolesLabel = lang === 'vi' ? 'Các chặng trước' : 'Earlier roles';
  const previousRolesCopy =
    lang === 'vi'
      ? 'Những vai trò trước đó tạo nền cho cách tôi xây backend systems hôm nay.'
      : 'The earlier roles that shaped how I approach backend systems today.';
  const educationLabel = lang === 'vi' ? 'Học vấn' : 'Education';

  const experiences = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((exp) => ({
        company: exp.company,
        role: lang === 'en' && exp.role_en ? exp.role_en : exp.role_vi,
        period: formatPeriod(exp.start_date, exp.end_date, exp.is_current, lang),
        description: lang === 'en' && exp.description_en ? exp.description_en : exp.description_vi,
        highlights:
          lang === 'en' && exp.highlights_en?.length > 0
            ? exp.highlights_en
            : exp.highlights_vi || [],
        isEducation:
          exp.company.toLowerCase().includes('university') ||
          exp.company.toLowerCase().includes('đại học'),
      }));
    }

    // Static Fallback
    return [
      {
        company: 'TMA Solutions',
        role: 'Backend Developer',
        period: lang === 'vi' ? '08/2025 - Hiện tại' : '08/2025 - Present',
        description:
          lang === 'vi'
            ? 'Phát triển backend services bằng Python và FastAPI.'
            : 'Building backend services with Python and FastAPI.',
        highlights:
          lang === 'vi'
            ? ['Xây dựng API layers.', 'Tối ưu dữ liệu.']
            : ['Built API layers.', 'Data optimization.'],
        isEducation: false,
      },
      {
        company: 'VKU University',
        role: lang === 'vi' ? 'Sinh viên Kỹ thuật Phần mềm' : 'Software Engineering Student',
        period: '2020 - 2025',
        description: '...',
        highlights: [],
        isEducation: true,
      },
    ];
  }, [data, lang]);

  const educationExperience =
    experiences.find((e) => e.isEducation) || experiences[experiences.length - 1];
  const workExperiences = experiences.filter((e) => !e.isEducation);
  const currentExperience = workExperiences[0] || experiences[0];
  const previousExperiences = workExperiences.slice(1);

  return (
    <section id="experience" className="section-padding">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker mb-4">{t.experience.eyebrow}</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.experience.title1} <span className="text-gradient">{t.experience.title2}</span>
          </motion.h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{t.experience.description}</p>
        </div>

        <div className="grid gap-5">
          {currentExperience && (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="experience-featured content-plane-strong overflow-hidden rounded-[34px] border-primary/22 shadow-[0_34px_110px_-68px_rgba(99,208,190,0.24)]"
            >
              <span aria-hidden="true" className="experience-featured__glow" />
              <span aria-hidden="true" className="experience-featured__sheen" />

              <div className="grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
                <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(21,91,102,0.08),transparent)] p-6 md:p-8 lg:border-r lg:border-b-0 lg:p-9">
                  <p className="section-kicker">{currentRoleLabel}</p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                    <Calendar size={14} />
                    {currentExperience.period}
                  </div>

                  <p className="mt-7 text-sm font-bold uppercase tracking-[0.22em] text-primary/88">
                    {currentExperience.company}
                  </p>
                  <h3 className="mt-3 text-[clamp(2.4rem,4vw,3.7rem)] font-black leading-[0.94] tracking-[-0.06em]">
                    {currentExperience.role}
                  </h3>
                </div>

                <div className="p-6 md:p-8 lg:p-9">
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-[1.03rem]">
                    {currentExperience.description}
                  </p>

                  <div className="mt-8">
                    <p className="section-kicker">{highlightsLabel}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {currentExperience.highlights.map((item) => (
                        <div
                          key={item}
                          className="content-plane rounded-[22px] px-5 py-4 text-sm leading-7 text-muted-foreground"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.06 }}
              className="content-plane-strong rounded-[32px] p-6 md:p-7"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="section-kicker">{previousRolesLabel}</p>
                  <p className="mt-3 text-base leading-8 text-muted-foreground">
                    {previousRolesCopy}
                  </p>
                </div>
              </div>

              <div className="experience-timeline mt-8">
                <span aria-hidden="true" className="experience-timeline__line" />
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="experience-timeline__progress"
                />

                <div className="grid gap-5">
                  {previousExperiences.map((exp, index) => (
                    <motion.article
                      key={`${exp.company}-${exp.role}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ delay: 0.08 + index * 0.05 }}
                      className="experience-timeline__item relative pl-6 sm:pl-8"
                    >
                      <motion.span
                        aria-hidden="true"
                        initial={{ scale: 0.9, opacity: 0.72 }}
                        whileInView={{ scale: [0.9, 1.18, 0.98], opacity: [0.72, 1, 0.9] }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.75, delay: 0.14 + index * 0.08 }}
                        className="experience-timeline__dot"
                        style={{ animationDelay: `${index * 0.55}s` }}
                      />

                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">
                            {exp.company}
                          </p>
                          <h3 className="mt-2 text-2xl font-black tracking-[-0.05em]">
                            {exp.role}
                          </h3>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/8 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                          <Calendar size={13} />
                          {exp.period}
                        </div>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                        {exp.description}
                      </p>

                      <div className="mt-4 grid gap-2">
                        {exp.highlights.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 text-sm leading-7 text-muted-foreground"
                          >
                            <span className="mt-[0.7rem] h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.div>

            {educationExperience && (
              <motion.aside
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.14 }}
                className="content-plane-strong rounded-[32px] p-6 md:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/8 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                    <Calendar size={13} />
                    {educationExperience.period}
                  </div>
                </div>

                <p className="section-kicker mt-8">{educationLabel}</p>
                <h3 className="mt-3 text-[2rem] font-black leading-[1] tracking-[-0.05em]">
                  {educationExperience.role}
                </h3>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  {educationExperience.company}
                </p>

                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {educationExperience.description}
                </p>

                <div className="mt-6 grid gap-3">
                  {educationExperience.highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-border/80 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-card/76"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.aside>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
