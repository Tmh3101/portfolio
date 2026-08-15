'use client';

import React, { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import Hero from '../../../components/Hero';
import Projects from '../../../components/Projects';
import Skills from '../../../components/Skills';
import Contact from '../../../components/Contact';
import Approach from '../../../components/Approach.jsx';
import Stats from '../../../components/Stats.jsx';
import TechMarquee from '../../../components/TechMarquee.jsx';
import Experience from '../../../components/Experience.jsx';
import Resume from '../../../components/Resume.jsx';
import { apiUrl } from '../../../lib/api.js';

export default function PortfolioPage({ cmsData }) {
  const [theme, setTheme] = useState('dark');

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

  useEffect(() => {
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
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-hidden bg-background">
        <div className="relative z-10">
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <main className="pb-6">
            <Hero data={cmsData.hero} settings={cmsData.settings} socialLinks={cmsData.socialLinks} />
            <TechMarquee data={cmsData.techMarquee} />
            <Stats data={cmsData.stats} />
            <Approach data={cmsData.approaches} sectionData={cmsData.approachSection} />
            <Skills
              data={cmsData.skills}
              sectionData={cmsData.skillSection}
              categoriesData={cmsData.skillCategories}
            />
            <Projects data={cmsData.projects} />
            <Experience data={cmsData.experiences} sectionData={cmsData.experienceSection} />
            <Resume experiences={cmsData.experiences} skills={cmsData.skills} />
            <Contact socialLinks={cmsData.socialLinks} settings={cmsData.settings} />
          </main>
          <Footer settings={cmsData.settings} />
        </div>
      </div>
    </MotionConfig>
  );
}
