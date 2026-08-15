'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Skills = ({ data, sectionData, categoriesData }) => {
  const { t, lang } = useLanguage();

  const section = {
    eyebrow:
      lang === 'en' && sectionData?.eyebrow_en
        ? sectionData.eyebrow_en
        : sectionData?.eyebrow_vi || t.skills.eyebrow,
    title1:
      lang === 'en' && sectionData?.title1_en
        ? sectionData.title1_en
        : sectionData?.title1_vi || t.skills.title1,
    title2:
      lang === 'en' && sectionData?.title2_en
        ? sectionData.title2_en
        : sectionData?.title2_vi || t.skills.title2,
    description:
      lang === 'en' && sectionData?.description_en
        ? sectionData.description_en
        : sectionData?.description_vi || t.skills.description,
  };

  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return categoriesData.map((cat) => {
        const catSkills = data
          ? data
              .filter((s) => s.category_id === cat.id)
              .map((s) => ({
                name: s.name,
              }))
          : [];

        return {
          title: lang === 'en' && cat.name_en ? cat.name_en : cat.name_vi,
          description:
            lang === 'en' && cat.description_en ? cat.description_en : cat.description_vi,
          skills: catSkills,
        };
      });
    }

    if (data && data.length > 0) {
      const grouped = data.reduce((acc, skill) => {
        const cat =
          lang === 'en' && skill.category_en ? skill.category_en : skill.category_vi || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          name: skill.name,
        });
        return acc;
      }, {});

      const descMap = {
        Backend:
          lang === 'vi'
            ? 'API design, service layers, auth và business logic.'
            : 'API design, service layers, auth, and business logic.',
        Data:
          lang === 'vi'
            ? 'Thiết kế schema, tối ưu truy vấn và dữ liệu.'
            : 'Schema design, query optimization, and data.',
        Delivery:
          lang === 'vi'
            ? 'Containerization và quy trình triển khai.'
            : 'Containerization and deployment workflows.',
        Support:
          lang === 'vi'
            ? 'Phối hợp frontend và debug end-to-end.'
            : 'Frontend collaboration and end-to-end debugging.',
      };

      return Object.keys(grouped).map((catName) => ({
        title: catName,
        description:
          descMap[catName] ||
          (lang === 'vi' ? `Kỹ năng về ${catName}` : `${catName} related skills`),
        skills: grouped[catName],
      }));
    }

    // Fallback to static
    return [
      {
        title: 'Backend',
        description:
          lang === 'vi'
            ? 'API design, service layers, auth, business logic và các tích hợp backend.'
            : 'API design, service layers, auth, business logic, and backend integrations.',
        skills: [
          { name: 'Python' },
          { name: 'FastAPI' },
          { name: 'Laravel' },
          { name: 'PHP' },
        ],
      },
      {
        title: 'Data',
        description:
          lang === 'vi'
            ? 'Thiết kế schema, tối ưu truy vấn và giữ dữ liệu nhất quán cho sản phẩm.'
            : 'Schema design, query optimization, and data consistency for product workloads.',
        skills: [
          { name: 'PostgreSQL' },
          { name: 'MySQL' },
          { name: 'SQL Server' },
          { name: 'ETL' },
        ],
      },
      {
        title: 'Delivery',
        description:
          lang === 'vi'
            ? 'Containerization, môi trường triển khai và quy trình release ổn định.'
            : 'Containerization, deployment environments, and reliable release workflows.',
        skills: [
          { name: 'Docker' },
          { name: 'Nginx' },
          { name: 'CI/CD' },
          { name: 'AWS' },
        ],
      },
      {
        title: 'Support',
        description:
          lang === 'vi'
            ? 'Đủ để phối hợp với frontend, debug flow end-to-end và hỗ trợ khi cần chạm vào bề mặt sản phẩm.'
            : 'Enough to collaborate with frontend, debug end-to-end flows, and support product delivery when needed.',
        skills: [
          { name: 'React' },
          { name: 'JavaScript' },
          { name: 'Debugging' },
          { name: 'Vite' },
        ],
      },
    ];
  }, [data, lang, categoriesData]);

  return (
    <section id="skills" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="rounded-md border border-border bg-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground pb-3 mb-3 border-b border-border">
                  <span className="uppercase tracking-wider font-semibold text-foreground">
                    {category.title}
                  </span>
                  <span>0{index + 1}</span>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
