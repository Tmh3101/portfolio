'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import Hero from '../../../components/Hero';
import Projects from '../../../components/Projects';
import Skills from '../../../components/Skills';
import Contact from '../../../components/Contact';
import Approach from '../../../components/Approach.jsx';
import Preloader from '../../../components/Preloader.jsx';
import Stats from '../../../components/Stats.jsx';
import TechMarquee from '../../../components/TechMarquee.jsx';
import Experience from '../../../components/Experience.jsx';
import AnimatedAuroraBackground from '../../../components/AnimatedAuroraBackground.jsx';
import { apiUrl } from '../../../lib/api.js';

const Terminal = lazy(() => import('../../../components/Terminal.jsx'));

export default function PortfolioPage({ cmsData }) {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }

    try {
      setLoading(sessionStorage.getItem('portfolio-preloaded') !== '1');
    } catch {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.documentElement.style.colorScheme = theme;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handlePreloaderComplete = () => {
    try {
      sessionStorage.setItem('portfolio-preloaded', '1');
    } catch {
      // Ignore storage restrictions.
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    const visitKey = `portfolio-visit:${window.location.pathname}`;

    if (sessionStorage.getItem(visitKey) === '1') {
      return undefined;
    }

    const controller = new AbortController();

    const trackVisit = async () => {
      try {
        const response = await fetch(apiUrl('/api/visits'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: window.location.pathname,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        sessionStorage.setItem(visitKey, '1');
        window.dispatchEvent(new CustomEvent('visit-recorded'));
      } catch {
        // Ignore non-critical tracking errors.
      }
    };

    trackVisit();

    return () => controller.abort();
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={false}
        animate={{
          opacity: loading ? 0.82 : 1,
          y: loading ? 14 : 0,
          scale: loading ? 0.992 : 1,
        }}
        transition={{ duration: loading ? 0.2 : 0.55, delay: loading ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`relative isolate min-h-screen overflow-x-hidden bg-background transition-colors duration-500 ${loading ? 'pointer-events-none' : ''}`}
      >
        <AnimatedAuroraBackground
          variant="vivid"
          speed="slow"
          opacity={theme === 'dark' ? 0.96 : 0.52}
        />
        <div className="relative z-10">
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <main className="pb-6">
            <Hero data={cmsData.hero} settings={cmsData.settings} />
            <TechMarquee />
            <Stats data={cmsData.stats} />
            <Approach data={cmsData.approaches} />
            <Skills data={cmsData.skills} />
            <Projects data={cmsData.projects} />
            <Experience data={cmsData.experiences} />
            <Contact />
          </main>
          <Footer settings={cmsData.settings} />
          <Suspense fallback={null}>
            <Terminal />
          </Suspense>
        </div>
      </motion.div>

      <AnimatePresence>
        {loading ? <Preloader key="preloader" onComplete={handlePreloaderComplete} /> : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
