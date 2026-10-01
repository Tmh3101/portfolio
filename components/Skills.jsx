'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Cpu,
  FlaskConical,
  MessageSquareCode,
  Layers,
  Terminal,
  Database,
  Boxes,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Skills = ({ data, sectionData, categoriesData }) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

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
    Backend: Terminal,
    Data: Database,
    Delivery: Boxes,
  };

  const softSkillIcons = [CheckCircle2, FlaskConical, Layers, MessageSquareCode];

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
        title: 'Backend',
        description:
          lang === 'vi'
            ? 'API design, service layers, auth, business logic và các tích hợp backend.'
            : 'API design, service layers, auth, business logic, and backend integrations.',
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

  const softSkills = useMemo(() => {
    return (
      t.skills.softSkills || [
        {
          code: '01',
          title:
            lang === 'vi'
              ? 'Làm chủ Toàn trình & Tự chủ (Ownership)'
              : 'End-to-End Ownership & Autonomy',
          tag: 'END-TO-END DELIVERY',
          description:
            lang === 'vi'
              ? 'Chủ động làm chủ toàn trình từ khâu đào sâu nghiệp vụ, đề xuất kiến trúc, hiện thực hóa mã nguồn cho tới triển khai production và giám sát vận hành; cam kết về chất lượng và tiến độ sản phẩm.'
              : 'Taking full ownership from business requirement analysis and system architecture design to production deployment and monitoring; committed to shipping reliable, high-quality software.',
        },
        {
          code: '02',
          title:
            lang === 'vi'
              ? 'Nghiên cứu Ứng dụng & Tư duy Thực nghiệm'
              : 'Applied Research & Empirical Mindset',
          tag: 'EMPIRICAL RESEARCH',
          description:
            lang === 'vi'
              ? 'Năng lực đọc hiểu và thẩm định các nghiên cứu mới (AI/ML papers), thực nghiệm đối sánh (empirical benchmarking) khách quan, và biến các giải pháp lý thuyết thành hệ thống phần mềm chạy thực tế.'
              : 'Proven capability to read, critique, and synthesize research papers (AI/ML), conduct rigorous empirical benchmarking, and translate theoretical models into production-ready software systems.',
        },
        {
          code: '03',
          title:
            lang === 'vi'
              ? 'Tư duy Hệ thống & Kỹ nghệ Chuẩn mực'
              : 'Systems Thinking & Code Craftsmanship',
          tag: 'SYSTEMS THINKING',
          description:
            lang === 'vi'
              ? 'Tiếp cận bài toán với tư duy kiến trúc phân tầng rõ ràng, coi trọng tính type-safe, idempotency, bảo mật đa lớp (RBAC, Rate Limiting), khả năng mở rộng và tính dễ bảo trì lâu dài của codebase.'
              : 'Approaching engineering challenges through clean layered architectures, emphasizing type-safety, idempotency, multi-tier security (RBAC, Rate Limiting), maintainability, and horizontal scalability.',
        },
        {
          code: '04',
          title:
            lang === 'vi'
              ? 'Giao tiếp Kỹ thuật & Phối hợp Đa chức năng'
              : 'Technical Communication & Cross-functional Sync',
          tag: 'CROSS-FUNCTIONAL SYNC',
          description:
            lang === 'vi'
              ? 'Diễn đạt vấn đề kỹ thuật súc tích, viết tài liệu kiến trúc/API chuẩn mực, trao đổi minh bạch về các trade-offs kỹ thuật và phối hợp hiệu quả với Product & Business stakeholders.'
              : 'Communicating complex technical concepts concisely, writing comprehensive API and architecture documentation, articulating architectural trade-offs, and collaborating seamlessly across disciplines.',
        },
      ]
    );
  }, [t.skills.softSkills, lang]);

  const filterTabs = [
    { id: 'all', label: t.skills.filterAll || (lang === 'vi' ? 'Tất cả' : 'All') },
    {
      id: 'technical',
      label: t.skills.filterTech || (lang === 'vi' ? 'Kỹ năng Kỹ thuật' : 'Technical Stack'),
    },
    {
      id: 'soft',
      label: t.skills.filterSoft || (lang === 'vi' ? 'Kỹ năng Mềm & Tư duy' : 'Soft Skills & Mindset'),
    },
  ];

  const showTechnical = activeTab === 'all' || activeTab === 'technical';
  const showSoft = activeTab === 'all' || activeTab === 'soft';

  return (
    <section id="skills" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        {/* Header & Description */}
        <div className="mb-10 max-w-3xl">
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

          {/* Interactive Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-md font-mono text-xs transition-colors duration-150 ${
                    isActive
                      ? 'bg-foreground text-background font-semibold shadow-sm'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Container */}
        <AnimatePresence mode="wait">
          <div className="space-y-12">
            {/* Part 1: Technical Skills */}
            {showTechnical && (
              <motion.div
                key="technical-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            )}

            {/* Part 2: Professional & Soft Skills */}
            {showSoft && (
              <motion.div
                key="soft-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className={showTechnical ? 'pt-8 border-t border-border/60' : ''}
              >
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
                  <span className="font-semibold text-foreground font-mono">// 02</span>
                  <span>
                    {t.skills.softHeading ||
                      (lang === 'vi'
                        ? 'Kỹ năng Mềm & Văn hóa Kỹ nghệ'
                        : 'Professional Skills & Engineering Culture')}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {softSkills.map((item, index) => {
                    const IconComponent = softSkillIcons[index % softSkillIcons.length];
                    return (
                      <motion.article
                        key={item.code}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="rounded-md border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/30 transition-colors group"
                      >
                        <div>
                          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground pb-3 mb-3 border-b border-border">
                            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-muted text-foreground border border-border/80">
                              {item.tag}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.code}
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5 mt-2">
                            <IconComponent
                              size={18}
                              className="text-foreground shrink-0 mt-0.5"
                            />
                            <h3 className="font-display font-bold text-base text-foreground leading-snug">
                              {item.title}
                            </h3>
                          </div>

                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Skills;
