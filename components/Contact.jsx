'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Facebook,
  Github,
  LoaderCircle,
  Mail,
  Phone,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { siteConfig } from '../data/siteConfig';
import { apiUrl } from '../lib/api';

const IconMap = {
  Github,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Phone,
};

const Contact = ({ socialLinks, settings }) => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = settings?.email || siteConfig.email;
  const phone = settings?.phone || siteConfig.phone;

  const inputClassName =
    'w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-foreground focus:outline-none';

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: Phone,
      label: t.contact.labelPhone,
      value: phone,
      href: `tel:${phone?.replace(/\s+/g, '')}`,
    },
  ];

  const displaySocialLinks =
    socialLinks && socialLinks.length > 0
      ? socialLinks.map((link) => ({
          icon: IconMap[link.icon] || Globe,
          href: link.url,
          label: link.name,
        }))
      : [
          { icon: Github, href: settings?.github_url || siteConfig.github, label: 'GitHub' },
          { icon: Facebook, href: siteConfig.facebook, label: 'Facebook' },
        ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error('submit_failed');
      }

      form.reset();
      if (result?.mailDelivered === false) {
        showToast(t.toasts.successSendStored, 'info');
      } else {
        showToast(t.toasts.successSend, 'success');
      }
    } catch {
      showToast(t.toasts.errorSend, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-20 md:px-10 lg:px-20 xl:px-24 border-t border-border">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {t.contact.eyebrow}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t.contact.title1} {t.contact.title2}
          </motion.h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.contact.description}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left: Info & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t.contact.infoTitle}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {lang === 'vi'
                  ? 'Nếu hợp gu làm việc, bạn có thể gửi email trực tiếp hoặc để lại một lời nhắn ngắn. Tôi ưu tiên các cuộc trò chuyện rõ ràng, thực tế và có định hướng.'
                  : 'If the fit feels right, send an email directly or leave a short note. I prefer conversations that are clear, practical, and intentional.'}
              </p>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="py-3 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-muted-foreground group-hover:text-foreground" />
                      <span className="font-mono text-xs uppercase text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-foreground font-medium">
                      {item.value}
                    </span>
                  </a>
                );
              })}
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {t.contact.socialTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {displaySocialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <Icon size={13} />
                      <span>{social.label}</span>
                      <ArrowUpRight size={11} className="text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="lg:col-span-7 rounded-md border border-border bg-card p-6 md:p-8"
          >
            <div className="pb-4 mb-6 border-b border-border">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t.contact.formTitle}
              </p>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground mt-1">
                {t.contact.formHeading}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t.contact.formDescription}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {t.contact.labelName} *
                  </span>
                  <input
                    required
                    name="name"
                    type="text"
                    className={inputClassName}
                    placeholder="Tran Minh Hieu"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {t.contact.labelEmail} *
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    className={inputClassName}
                    placeholder="name@email.com"
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {t.contact.labelMessage} *
                </span>
                <textarea
                  required
                  name="message"
                  rows="5"
                  className={inputClassName}
                  placeholder={t.contact.placeholderMessage}
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" />
                    <span>{t.contact.sending}</span>
                  </>
                ) : (
                  <>
                    <span>{t.contact.btnSend}</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
