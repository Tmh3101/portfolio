'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppWindow, Boxes, Database, ServerCog, Package, Layout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  ServerCog,
  Database,
  Boxes,
  AppWindow,
  Package,
  Layout,
  server: ServerCog,
  database: Database,
  package: Package,
  layout: Layout,
  boxes: Boxes,
  window: AppWindow,
};

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

  const handleSkillPointerMove = (event) => {
    if (event.pointerType === 'touch') {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty('--skill-spotlight-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--skill-spotlight-y', `${event.clientY - rect.top}px`);
  };

  const handleSkillPointerLeave = (event) => {
    const card = event.currentTarget;

    card.style.removeProperty('--skill-spotlight-x');
    card.style.removeProperty('--skill-spotlight-y');
  };

  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return categoriesData.map((cat) => {
        // Find skills that belong to this category
        const catSkills = data
          ? data
              .filter((s) => s.category_id === cat.id)
              .map((s) => ({
                name: s.name,
                color: s.color,
              }))
          : [];

        return {
          title: lang === 'en' && cat.name_en ? cat.name_en : cat.name_vi,
          icon: iconMap[cat.icon] || ServerCog,
          description:
            lang === 'en' && cat.description_en ? cat.description_en : cat.description_vi,
          skills: catSkills,
        };
      });
    }

    if (data && data.length > 0) {
      // Group skills by category from CMS (legacy fallback)
      const grouped = data.reduce((acc, skill) => {
        const cat =
          lang === 'en' && skill.category_en ? skill.category_en : skill.category_vi || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          name: skill.name,
          color: skill.color,
        });
        return acc;
      }, {});

      const legacyIconMap = {
        Backend: ServerCog,
        Data: Database,
        Delivery: Boxes,
        Support: AppWindow,
        Frontend: AppWindow,
        Languages: ServerCog,
        Tools: Boxes,
      };

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
        icon: legacyIconMap[catName] || ServerCog,
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
        icon: ServerCog,
        description:
          lang === 'vi'
            ? 'API design, service layers, auth, business logic và các tích hợp backend.'
            : 'API design, service layers, auth, business logic, and backend integrations.',
        skills: [
          { name: 'Python', color: null },
          { name: 'FastAPI', color: null },
          { name: 'Laravel', color: null },
          { name: 'PHP', color: null },
        ],
      },
      {
        title: 'Data',
        icon: Database,
        description:
          lang === 'vi'
            ? 'Thiết kế schema, tối ưu truy vấn và giữ dữ liệu nhất quán cho sản phẩm.'
            : 'Schema design, query optimization, and data consistency for product workloads.',
        skills: [
          { name: 'PostgreSQL', color: null },
          { name: 'MySQL', color: null },
          { name: 'SQL Server', color: null },
          { name: 'ETL', color: null },
        ],
      },
      {
        title: 'Delivery',
        icon: Boxes,
        description:
          lang === 'vi'
            ? 'Containerization, môi trường triển khai và quy trình release ổn định.'
            : 'Containerization, deployment environments, and reliable release workflows.',
        skills: [
          { name: 'Docker', color: null },
          { name: 'Nginx', color: null },
          { name: 'CI/CD', color: null },
          { name: 'AWS', color: null },
        ],
      },
      {
        title: 'Support',
        icon: AppWindow,
        description:
          lang === 'vi'
            ? 'Đủ để phối hợp với frontend, debug flow end-to-end và hỗ trợ khi cần chạm vào bề mặt sản phẩm.'
            : 'Enough to collaborate with frontend, debug end-to-end flows, and support product delivery when needed.',
        skills: [
          { name: 'React', color: null },
          { name: 'JavaScript', color: null },
          { name: 'Debugging', color: null },
          { name: 'Vite', color: null },
        ],
      },
    ];
  }, [data, lang, categoriesData]);

  return (
    <section id="skills" className="section-padding">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
          <p className="section-kicker mb-4">{section.eyebrow}</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {section.title1} <span className="text-gradient">{section.title2}</span>
          </motion.h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{section.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onPointerMove={handleSkillPointerMove}
                onPointerLeave={handleSkillPointerLeave}
                className="skill-card content-plane rounded-[30px] p-7"
              >
                <span aria-hidden="true" className="skill-spotlight" />
                <span aria-hidden="true" className="skill-sheen" />
                <span aria-hidden="true" className="skill-outline" />

                <div className="relative z-[1]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="skill-card__icon flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/82">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-8 text-[1.85rem] font-black tracking-[-0.05em]">
                    {category.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="skill-card__rule mt-7" aria-hidden="true" />

                  <div className="mt-6 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="skill-chip rounded-full border border-primary/16 bg-primary/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-foreground/82 dark:bg-primary/10 dark:text-foreground/84"
                        style={
                          skill.color
                            ? {
                                borderColor: `${skill.color}33`,
                                backgroundColor: `${skill.color}14`,
                                color: skill.color,
                              }
                            : {}
                        }
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
