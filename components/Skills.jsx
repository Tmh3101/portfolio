'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Compass,
  Users,
  Bot,
  Cpu,
  Terminal,
  Database,
  Boxes,
} from 'lucide-react';
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

  const categoryIcons = {
    AI: Cpu,
    Software: Terminal,
    Backend: Terminal,
    Data: Database,
    Delivery: Boxes,
  };

  const softSkillIcons = [Brain, Compass, Users, Bot];

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
        AI:
          lang === 'vi'
            ? 'Thiết kế RAG pipeline, tích hợp mô hình ngôn ngữ và hệ thống AI end-to-end.'
            : 'RAG pipeline design, LLM integration, and end-to-end AI systems.',
        Software:
          lang === 'vi'
            ? 'Kiến trúc phân tầng, API Type-safe, xác thực bảo mật và logic nghiệp vụ.'
            : 'Layered architecture, type-safe APIs, auth, and business logic.',
        Backend:
          lang === 'vi'
            ? 'Kiến trúc phân tầng, API Type-safe, xác thực bảo mật và logic nghiệp vụ.'
            : 'Layered architecture, type-safe APIs, auth, and business logic.',
        Data:
          lang === 'vi'
            ? 'Thiết kế schema, tối ưu truy vấn và dữ liệu.'
            : 'Schema design, query optimization, and data.',
        Delivery:
          lang === 'vi'
            ? 'Containerization và quy trình triển khai.'
            : 'Containerization and deployment workflows.',
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
        title: 'AI',
        description:
          lang === 'vi'
            ? 'Thiết kế RAG pipeline, tích hợp mô hình ngôn ngữ và hệ thống AI end-to-end.'
            : 'RAG pipeline design, LLM integration, and end-to-end AI systems.',
        skills: [
          { name: 'LangChain' },
          { name: 'Hugging Face' },
          { name: 'RAG Pipelines' },
        ],
      },
      {
        title: 'Software',
        description:
          lang === 'vi'
            ? 'Kiến trúc phân tầng, API Type-safe, xác thực bảo mật và logic nghiệp vụ.'
            : 'Layered architecture, type-safe APIs, auth, and business logic.',
        skills: [
          { name: 'Python' },
          { name: 'FastAPI' },
          { name: 'Node.js' },
          { name: 'NestJS' },
          { name: 'Spring Boot 3' },
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
          { name: 'MongoDB' },
          { name: 'Redis' },
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
          { name: 'AWS' },
          { name: 'BullMQ' },
          { name: 'Supabase' },
        ],
      },
    ];
  }, [data, lang, categoriesData]);

  const softSkillList =
    t.skills.softSkills ||
    (lang === 'vi'
      ? [
          'Tư duy logic & giải quyết vấn đề',
          'Chủ động nghiên cứu công nghệ',
          'Làm việc nhóm & phối hợp',
          'Sử dụng AI Agents hiệu quả',
        ]
      : [
          'Logical thinking & problem-solving',
          'Proactive technology research',
          'Teamwork',
          'Proficiency with AI Agents',
        ]);

  const softSkills = softSkillList.map((name, index) => ({
    name,
    code: `0${index + 1}`,
    icon: softSkillIcons[index % softSkillIcons.length],
  }));

  return (
    <section id="skills" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        {/* Header & Description */}
        <div className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {section.eyebrow}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance"
          >
            {section.title1 && <span className="block">{section.title1}</span>}
            <span>{section.title2}</span>
          </motion.h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {section.description}
          </p>
        </div>

        <div className="space-y-12">
          {/* Part 1: Technical Skills */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
              <span className="font-semibold text-foreground font-mono">// 01</span>
              <span>
                {t.skills.techHeading ||
                  (lang === 'vi'
                    ? 'Kỹ năng Kỹ thuật & Nền tảng Công nghệ'
                    : 'Technical Capabilities & Technology Stack')}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => {
                const IconComponent = categoryIcons[category.title] || Terminal;
                return (
                  <motion.article
                    key={category.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="rounded-md border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground pb-3 mb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <IconComponent size={14} className="text-muted-foreground" />
                          <span className="uppercase tracking-wider font-semibold text-foreground">
                            {category.title}
                          </span>
                        </div>
                        <span>0{index + 1}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground min-h-[3rem]">
                        {category.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-foreground hover:border-foreground/40 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* Part 2: Professional & Soft Skills (Tinh gọn, đơn giản) */}
          <div className="pt-8 border-t border-border/60">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
              <span className="font-semibold text-foreground font-mono">// 02</span>
              <span>
                {t.skills.softHeading ||
                  (lang === 'vi'
                    ? 'Kỹ năng Mềm'
                    : 'Soft Skills')}
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {softSkills.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className="rounded-md border border-border bg-card p-4 flex items-center gap-3.5 hover:border-foreground/30 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border bg-background text-foreground">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-muted-foreground block mb-0.5">
                        {item.code}
                      </span>
                      <p className="text-xs md:text-sm font-semibold text-foreground leading-snug">
                        {item.name}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
