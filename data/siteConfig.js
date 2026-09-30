export const siteConfig = {
  name: 'Trần Minh Hiểu',
  nameEn: 'Tran Minh Hieu',
  brand: 'Trần Minh Hiểu',
  role: 'AI Software Engineer',
  email: 'hieutm.site@gmail.com',
  phone: '',
  emailHref: 'mailto:hieutm.site@gmail.com',
  phoneHref: '',
  github: 'https://github.com/Tmh3101',
  linkedin: 'https://linkedin.com/in/tmh3101',
  portfolioRepo: 'https://github.com/Tmh3101/portfolio',
  facebook: 'https://www.facebook.com/Tmh3101/',
  sameAs: [
    'https://github.com/Tmh3101',
    'https://www.facebook.com/Tmh3101/',
    'https://linkedin.com/in/tmh3101',
  ],
  siteTitle: 'Trần Minh Hiểu | AI Software Engineer',
  siteDescription:
    'AI Software Engineer specializing in Applied AI Research & Engineering. Bridging theoretical machine learning (Graph Neural Networks, Advanced RAG, Representation Learning) with production-grade software architectures.',
  keywords: [
    'Trần Minh Hiểu',
    'Tran Minh Hieu',
    'MINHHIEU',
    'AI Software Engineer',
    'Applied AI Researcher',
    'Graph Neural Networks',
    'Representation Learning',
    'Advanced RAG',
    'Hybrid Search',
    'FastAPI',
    'PyTorch Geometric',
    'Python',
    'Portfolio',
  ],
  locale: 'en_US',
  ogImagePath: '/og-preview.jpg',
  location: 'Cần Thơ, Việt Nam',
  company: 'TITOPS Vietnam Co., Ltd.',
  resumeUrl: 'https://uhhmsyhsbcvfvilphwdk.supabase.co/storage/v1/object/public/portfolio-assets/cv/CV_TranMinhHieu.pdf',
};

export const getLocalizedName = (lang = 'en') =>
  lang === 'vi' ? siteConfig.name : siteConfig.nameEn;

