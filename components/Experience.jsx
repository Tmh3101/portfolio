'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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

const Experience = ({ data, sectionData }) => {
  const { t, lang } = useLanguage();

  const section = {
    eyebrow:
      lang === 'en' && sectionData?.eyebrow_en
        ? sectionData.eyebrow_en
        : sectionData?.eyebrow_vi || t.experience.eyebrow,
    title1:
      lang === 'en' && sectionData?.title1_en
        ? sectionData.title1_en
        : sectionData?.title1_vi || t.experience.title1,
    title2:
      lang === 'en' && sectionData?.title2_en
        ? sectionData.title2_en
        : sectionData?.title2_vi || t.experience.title2,
    description:
      lang === 'en' && sectionData?.description_en
        ? sectionData.description_en
        : sectionData?.description_vi || t.experience.description,
    currentRoleLabel:
      lang === 'en' && sectionData?.current_role_label_en
        ? sectionData.current_role_label_en
        : sectionData?.current_role_label_vi ||
          (lang === 'vi' ? 'Vai trò hiện tại' : 'Current role'),
    earlierRolesLabel:
      lang === 'en' && sectionData?.earlier_roles_label_en
        ? sectionData.earlier_roles_label_en
        : sectionData?.earlier_roles_label_vi ||
          (lang === 'vi' ? 'Các chặng trước' : 'Earlier roles'),
    educationLabel:
      lang === 'en' && sectionData?.education_label_en
        ? sectionData.education_label_en
        : sectionData?.education_label_vi || (lang === 'vi' ? 'Học vấn' : 'Education'),
  };

  const experiences = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((exp) => ({
        ...exp,
        role: lang === 'en' && exp.role_en ? exp.role_en : exp.role_vi,
        period: formatPeriod(exp.start_date, exp.end_date, exp.is_current, lang),
        description: lang === 'en' && exp.description_en ? exp.description_en : exp.description_vi,
        highlights:
          lang === 'en' && exp.highlights_en?.length > 0
            ? exp.highlights_en
            : exp.highlights_vi || [],
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
        type: 'work',
        is_current: true,
      },
      {
        company: 'VKU University',
        role: lang === 'vi' ? 'Sinh viên Kỹ thuật Phần mềm' : 'Software Engineering Student',
        period: '2020 - 2025',
        description:
          lang === 'vi'
            ? 'Tốt nghiệp chuyên ngành Kỹ thuật Phần mềm với nền tảng khoa học máy tính vững chắc.'
            : 'Graduated in Software Engineering with strong foundations in computer science.',
        highlights: [],
        type: 'education',
      },
    ];
  }, [data, lang]);

  return (
    <section id="experience" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
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
        </div>

        <div className="divide-y divide-border border-y border-border">
          {experiences.map((exp, index) => (
            <motion.article
              key={`${exp.company}-${exp.role}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="py-6 md:py-8 grid gap-4 md:grid-cols-12 items-start"
            >
              {/* Date Column */}
              <div className="md:col-span-3 font-mono text-xs text-muted-foreground">
                <span>{exp.period}</span>
                {exp.is_current && (
                  <span className="block mt-1 text-[10px] uppercase tracking-wider text-foreground font-semibold">
                    [{section.currentRoleLabel}]
                  </span>
                )}
                {exp.type === 'education' && (
                  <span className="block mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    [{section.educationLabel}]
                  </span>
                )}
              </div>

              {/* Role & Company */}
              <div className="md:col-span-4">
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {exp.role}
                </h3>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {exp.company}
                </p>
              </div>

              {/* Scope & Highlights */}
              <div className="md:col-span-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1.5 font-mono text-xs text-muted-foreground">
                    {exp.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2">
                        <span className="text-foreground shrink-0 select-none">-</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
