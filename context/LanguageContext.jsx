'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('vi'); // Start with predictable default for SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, mounted]);

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === 'vi' ? 'en' : 'vi'));
  };

  const t = translations[lang] || translations.vi;

  // Render children immediately to preserve SSR, though language switch to 'en' might cause a minor flicker if saved.
  // This is a standard trade-off for SSG/SSR with client-side language preference, usually acceptable.
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
