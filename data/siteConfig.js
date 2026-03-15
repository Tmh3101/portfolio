export const siteConfig = {
  name: "Trần Minh Hiểu",
  nameEn: "Tran Minh Hieu",
  brand: "portfolio",
  role: "Backend Developer",
  email: "hieutm.site@gmail.com",
  phone: "+84 399750368",
  emailHref: "mailto:hieutm.site@gmail.com",
  phoneHref: "tel:+84399750368",
  github: "https://github.com/Tmh3101",
  portfolioRepo: "https://github.com/Tmh3101/portfolio",
  facebook: "https://www.facebook.com/Tmh3101/",
  sameAs: ["https://github.com/Tmh3101", "https://www.facebook.com/Tmh3101/"],
  siteTitle: "Trần Minh Hiểu | Backend Developer",
  siteDescription:
    "Trần Minh Hiểu is a Backend Developer focused on API design, system reliability, and maintainable services.",
  keywords: [
    "Trần Minh Hiểu",
    "Tran Minh Hieu",
    "MINHHIEU",
    "Backend Developer",
    "Python",
    "FastAPI",
    "API Design",
    "Portfolio",
  ],
  locale: "en_US",
  ogImagePath: "/og-preview.jpg",
};

export const getLocalizedName = (lang = "en") =>
  lang === "vi" ? siteConfig.name : siteConfig.nameEn;
