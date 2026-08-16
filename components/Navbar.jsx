'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { siteConfig } from '../data/siteConfig';

const Navbar = ({ theme, toggleTheme }) => {
  const { lang, t, toggleLang } = useLanguage();
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionLinks = ['#focus', '#skills', '#projects', '#experience', '#contact'];
    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const marker = Math.max(112, window.innerHeight * 0.24);
      let nextActive = '';

      for (const href of sectionLinks) {
        const section = document.getElementById(href.slice(1));
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= marker) {
          nextActive = href;
        }
        if (rect.top <= marker && rect.bottom >= marker) {
          nextActive = href;
          break;
        }
      }

      setActiveHref((current) => (current === nextActive ? current : nextActive));
    };

    const requestActiveUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', requestActiveUpdate, { passive: true });
    window.addEventListener('resize', requestActiveUpdate);
    window.addEventListener('hashchange', requestActiveUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestActiveUpdate);
      window.removeEventListener('resize', requestActiveUpdate);
      window.removeEventListener('hashchange', requestActiveUpdate);
    };
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#focus' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const handleThemeToggle = () => {
    toggleTheme();
    showToast(t.toasts.themeChanged, 'info');
  };

  const handleLangToggle = () => {
    toggleLang();
    showToast(lang === 'vi' ? 'English activated' : 'Đã kích hoạt Tiếng Việt', 'info');
  };

  const handleNavClick = (href) => {
    setActiveHref(href);
    setIsOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6">
      <div
        className={`mx-auto max-w-6xl rounded-md border transition-colors duration-200 px-4 py-2.5 ${
          scrolled
            ? 'border-border bg-background shadow-sm'
            : 'border-border/60 bg-background/80'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <a
            href="#hero"
            onClick={() => setActiveHref('')}
            className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-foreground"
          >
            <span className="inline-block rounded bg-foreground px-1.5 py-0.5 text-xs text-background font-mono">
              MH
            </span>
            <span>{siteConfig.brand}</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded transition-colors uppercase tracking-wider ${
                    isActive
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <span>{t.nav.resume}</span>
              <ArrowUpRight size={13} />
            </a>

            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            <button
              type="button"
              onClick={handleLangToggle}
              aria-label="Toggle language"
              className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-xs font-semibold text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="mx-auto mt-2 max-w-6xl lg:hidden"
          >
            <div className="rounded-md border border-border bg-card p-4 font-mono text-xs">
              <div className="grid gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    aria-current={activeHref === link.href ? 'page' : undefined}
                    className={`block px-3 py-2 rounded uppercase tracking-wider ${
                      activeHref === link.href
                        ? 'bg-foreground text-background font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 rounded border border-border px-3 py-1.5 text-foreground"
                >
                  <span>{t.nav.resume}</span>
                  <ArrowUpRight size={12} />
                </a>

                <button
                  type="button"
                  onClick={handleLangToggle}
                  className="rounded border border-border px-3 py-1.5 font-mono text-xs font-semibold text-foreground"
                >
                  {lang === 'vi' ? 'English' : 'Tiếng Việt'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
