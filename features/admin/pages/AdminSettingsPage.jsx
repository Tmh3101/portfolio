'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCcw } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { TextInput, TextArea, ImageUploader, AITranslateButton } from '../../../components/admin';

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      site_title_vi: '',
      site_title_en: '',
      site_description_vi: '',
      site_description_en: '',
      seo_keywords_vi: '',
      seo_keywords_en: '',
      og_image_url: '',
      twitter_handle: '',
      github_url: '',
      linkedin_url: '',
      email: '',
      phone: '',
      resume_url: '',
    },
  });

  const ogImageUrl = watch('og_image_url');
  const watchedSiteTitleVi = watch('site_title_vi');
  const watchedSiteDescVi = watch('site_description_vi');
  const watchedKeywordsVi = watch('seo_keywords_vi');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        reset({
          ...data,
          seo_keywords_vi: data.seo_keywords_vi ? data.seo_keywords_vi.join(', ') : '',
          seo_keywords_en: data.seo_keywords_en ? data.seo_keywords_en.join(', ') : '',
        });
      } else {
        // If not exists, try to create default row
        const { error: insertError } = await supabase.from('site_settings').insert([{ id: 1 }]);

        if (insertError) console.error('Error creating initial settings:', insertError);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, reset, showToast, t.admin.error]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        id: 1,
        seo_keywords_vi: data.seo_keywords_vi
          ? data.seo_keywords_vi
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
        seo_keywords_en: data.seo_keywords_en
          ? data.seo_keywords_en
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };

      const { error } = await supabase.from('site_settings').upsert(payload);

      if (error) throw error;

      // Trigger on-demand revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(t.admin.updateSuccess, 'success');
      reset(data); // Mark as not dirty
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-500">{t.admin.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">{t.admin.settingsPageTitle}</h2>
          <button
            type="button"
            onClick={fetchSettings}
            className="admin-card__ghost-button"
            disabled={submitting}
          >
            <RefreshCcw size={16} />
            <span>{t.admin.refresh}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                SEO & Meta
              </h3>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Site Title
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSiteTitleVi}
                    onTranslate={(val) => setValue('site_title_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextInput
                    label="Title (VN)"
                    placeholder="Portfolio Name"
                    {...register('site_title_vi', {
                      required: 'Vietnamese site title is required',
                    })}
                    error={errors.site_title_vi?.message}
                  />
                  <TextInput
                    label="Title (EN)"
                    placeholder="Portfolio Name"
                    {...register('site_title_en')}
                    error={errors.site_title_en?.message}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Site Description
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSiteDescVi}
                    onTranslate={(val) =>
                      setValue('site_description_en', val, { shouldDirty: true })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <TextArea
                    label="Description (VN)"
                    placeholder="Brief description for SEO"
                    {...register('site_description_vi')}
                    error={errors.site_description_vi?.message}
                  />
                  <TextArea
                    label="Description (EN)"
                    placeholder="Brief description for SEO"
                    {...register('site_description_en')}
                    error={errors.site_description_en?.message}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    SEO Keywords
                  </h4>
                  <AITranslateButton
                    sourceText={watchedKeywordsVi}
                    onTranslate={(val) => setValue('seo_keywords_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextInput
                    label="Keywords (VN)"
                    placeholder="react, backend, engineering"
                    {...register('seo_keywords_vi')}
                    error={errors.seo_keywords_vi?.message}
                  />
                  <TextInput
                    label="Keywords (EN)"
                    placeholder="react, backend, engineering"
                    {...register('seo_keywords_en')}
                    error={errors.seo_keywords_en?.message}
                  />
                </div>
              </div>

              <ImageUploader
                label="OG Image (Open Graph)"
                value={ogImageUrl}
                onChange={(url) => setValue('og_image_url', url, { shouldDirty: true })}
                folder="seo"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                Contact & Social
              </h3>

              <TextInput
                label="Contact Email"
                placeholder="hello@example.com"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />

              <TextInput
                label="Phone Number"
                placeholder="+84 ..."
                {...register('phone')}
                error={errors.phone?.message}
              />

              <TextInput
                label="GitHub URL"
                placeholder="https://github.com/..."
                {...register('github_url')}
                error={errors.github_url?.message}
              />

              <TextInput
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                {...register('linkedin_url')}
                error={errors.linkedin_url?.message}
              />

              <TextInput
                label="Twitter/X Handle"
                placeholder="@username"
                {...register('twitter_handle')}
                error={errors.twitter_handle?.message}
              />

              <TextInput
                label="Resume/CV URL"
                placeholder="https://.../resume.pdf"
                {...register('resume_url')}
                error={errors.resume_url?.message}
              />
            </div>
          </div>

          <div className="admin-form-actions mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={!isDirty || submitting}
            >
              <Save size={16} />
              <span>{submitting ? t.admin.saving : t.admin.saveChanges}</span>
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="admin-card__ghost-button"
              disabled={!isDirty || submitting}
            >
              {t.admin.resetForm}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
