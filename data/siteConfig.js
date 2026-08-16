export const siteConfig = {
  name: 'Trần Minh Hiếu',
  nameEn: 'Tran Minh Hieu',
  brand: 'Trần Minh Hiếu',
  role: 'AI Backend Engineer',
  email: 'hieutm.site@gmail.com',
  phone: '+84 399750368',
  emailHref: 'mailto:hieutm.site@gmail.com',
  phoneHref: 'tel:+84399750368',
  github: 'https://github.com/Tmh3101',
  linkedin: 'https://linkedin.com/in/tmh3101',
  portfolioRepo: 'https://github.com/Tmh3101/portfolio',
  facebook: 'https://www.facebook.com/Tmh3101/',
  sameAs: [
    'https://github.com/Tmh3101',
    'https://www.facebook.com/Tmh3101/',
    'https://linkedin.com/in/tmh3101',
  ],
  siteTitle: 'Trần Minh Hiếu | AI Backend Engineer',
  siteDescription:
    'AI Backend Engineer with hands-on experience in building scalable backend architectures, multi-tenant SaaS platforms, and end-to-end AI applications. Proficient in designing advanced RAG pipelines and high-throughput asynchronous processing systems. Computer Science background with strong expertise in API security, data pipeline automation, and Web3 cross-chain integrations.',
  keywords: [
    'Trần Minh Hiếu',
    'Tran Minh Hieu',
    'MINHHIEU',
    'AI Backend Engineer',
    'Backend Developer',
    'Python',
    'FastAPI',
    'API Design',
    'Portfolio',
    'RAG',
    'LangChain',
    'Multi-tenant SaaS',
  ],
  locale: 'en_US',
  ogImagePath: '/og-preview.jpg',
};

export const getLocalizedName = (lang = 'en') =>
  lang === 'vi' ? siteConfig.name : siteConfig.nameEn;

