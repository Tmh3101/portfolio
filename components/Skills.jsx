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
            ? 'Xây dựng, huấn luyện và đánh giá mô hình ML/DL; tinh chỉnh mô hình ngôn ngữ (Fine-tuning). Thiết kế RAG pipeline, tích hợp mô hình ngôn ngữ lớn (LLM) vào ứng dụng thực tế.'
            : 'Building, training, and evaluating ML/DL models; fine-tuning LLMs. Architecting RAG pipelines and integrating large language models into production.',
        Software:
          lang === 'vi'
            ? 'Phát triển Full-stack toàn trình: xây dựng giao diện tối ưu (React/Next.js), thiết kế kiến trúc Backend phân tầng, API Type-safe, xác thực bảo mật và xử lý nghiệp vụ.'
            : 'End-to-end Full-stack engineering: responsive modern UIs (React/Next.js), layered backend architectures, type-safe APIs, and robust security.',
        Backend:
          lang === 'vi'
            ? 'Phát triển Full-stack toàn trình: xây dựng giao diện tối ưu (React/Next.js), thiết kế kiến trúc Backend phân tầng, API Type-safe, xác thực bảo mật và xử lý nghiệp vụ.'
            : 'End-to-end Full-stack engineering: responsive modern UIs (React/Next.js), layered backend architectures, type-safe APIs, and robust security.',
        Data:
          lang === 'vi'
            ? 'Thiết kế schema chuẩn hóa (SQL/NoSQL), tối ưu hóa chỉ mục và câu truy vấn; trích xuất, tiền xử lý và lưu trữ dữ liệu phân tích quy mô lớn.'
            : 'Designing normalized SQL/NoSQL schemas, optimizing complex queries and indexing; extracting, preprocessing, and managing analytical data at scale.',
        Delivery:
          lang === 'vi'
            ? 'Đóng gói ứng dụng (Containerization), tích hợp nền tảng Backend-as-a-Service (BaaS), dịch vụ lưu trữ dữ liệu (Storage) và quản lý phiên bản mã nguồn.'
            : 'Application containerization, Backend-as-a-Service (BaaS) integration, cloud storage management, and clean version-controlled release workflows.',
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
            ? 'Xây dựng, huấn luyện và đánh giá mô hình ML/DL; tinh chỉnh mô hình ngôn ngữ (Fine-tuning). Thiết kế RAG pipeline, tích hợp mô hình ngôn ngữ lớn (LLM) vào ứng dụng thực tế.'
            : 'Building, training, and evaluating ML/DL models; fine-tuning LLMs. Architecting RAG pipelines and integrating large language models into production.',
        skills: [
          { name: 'PyTorch' },
          { name: 'LangChain' },
          { name: 'Hugging Face' },
          { name: 'RAG Pipelines' },
          { name: 'Notebook' },
        ],
      },
      {
        title: 'Software',
        description:
          lang === 'vi'
            ? 'Phát triển Full-stack toàn trình: xây dựng giao diện tối ưu (React/Next.js), thiết kế kiến trúc Backend phân tầng, API Type-safe, xác thực bảo mật và xử lý nghiệp vụ.'
            : 'End-to-end Full-stack engineering: responsive modern UIs (React/Next.js), layered backend architectures, type-safe APIs, and robust security.',
        skills: [
          { name: 'Python' },
          { name: 'Java' },
          { name: 'TypeScript' },
          { name: 'JavaScript' },
          { name: 'Next.js' },
          { name: 'React' },
          { name: 'Node.js' },
          { name: 'NestJS' },
          { name: 'Django' },
          { name: 'Spring Boot 3' },
        ],
      },
      {
        title: 'Data',
        description:
          lang === 'vi'
            ? 'Thiết kế schema chuẩn hóa (SQL/NoSQL), tối ưu hóa chỉ mục và câu truy vấn; trích xuất, tiền xử lý và lưu trữ dữ liệu phân tích quy mô lớn.'
            : 'Designing normalized SQL/NoSQL schemas, optimizing complex queries and indexing; extracting, preprocessing, and managing analytical data at scale.',
        skills: [
          { name: 'PostgreSQL' },
          { name: 'MySQL' },
          { name: 'MongoDB' },
          { name: 'Redis' },
          { name: 'BigQuery' },
        ],
      },
      {
        title: 'Delivery',
        description:
          lang === 'vi'
            ? 'Đóng gói ứng dụng (Containerization), tích hợp nền tảng Backend-as-a-Service (BaaS), dịch vụ lưu trữ dữ liệu (Storage) và quản lý phiên bản mã nguồn.'
            : 'Application containerization, Backend-as-a-Service (BaaS) integration, cloud storage management, and clean version-controlled release workflows.',
        skills: [
          { name: 'Docker' },
          { name: 'Supabase' },
          { name: 'Cloud Storage' },
          { name: 'Git' },
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
          'Logical Thinking & Problem Solving',
          'Proactive Technology Research',
          'Teamwork & Cross-functional Collaboration',
          'AI Agents Workflow Proficiency',
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
                    ? 'Kỹ năng chuyên môn'
                    : 'TECHNICAL EXPERTISE')}
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
                          <h3 className="uppercase tracking-wider font-semibold text-foreground text-xs inline m-0">
                            {category.title}
                          </h3>
                        </div>
                        <span>0{index + 1}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground min-h-[3rem]">
                        {category.description}
                      </p>
                    </div>

                    <ul className="mt-6 pt-4 border-t border-border flex flex-wrap gap-1.5 list-none p-0 m-0" role="list">
                      {category.skills.map((skill) => (
                        <li
                          key={skill.name}
                          className="rounded border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-foreground hover:border-foreground/40 transition-colors"
                        >
                          {skill.name}
                        </li>
                      ))}
                    </ul>
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
                    ? 'Kỹ năng mềm'
                    : 'SOFT SKILLS')}
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
