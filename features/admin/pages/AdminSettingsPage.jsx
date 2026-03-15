'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCcw } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { TextInput, TextArea, ImageUploader } from '../../../components/admin';

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
      site_title: '',
      site_description: '',
      seo_keywords: '',
      og_image_url: '',
      twitter_handle: '',
      github_url: '',
      linkedin_url: '',
      email: '',
    },
  });

  const ogImageUrl = watch('og_image_url');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        reset({
          ...data,
          seo_keywords: data.seo_keywords ? data.seo_keywords.join(', ') : '',
        });
      } else {
        // If not exists, try to create default row
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert([{ id: 1 }]);

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
        seo_keywords: data.seo_keywords
          ? data.seo_keywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };

      const { error } = await supabase.from('site_settings').upsert(payload);

      if (error) throw error;

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

              <TextInput
                label="Site Title"
                placeholder="Portfolio Name"
                {...register('site_title', { required: 'Site title is required' })}
                error={errors.site_title?.message}
              />

              <TextArea
                label="Site Description"
                placeholder="Brief description for SEO"
                {...register('site_description')}
                error={errors.site_description?.message}
              />

              <TextInput
                label="SEO Keywords (comma separated)"
                placeholder="react, backend, engineering"
                {...register('seo_keywords')}
                error={errors.seo_keywords?.message}
              />

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
