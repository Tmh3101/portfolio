'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCcw } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { TextInput, TextArea, ImageUploader, AITranslateButton } from '../../../components/admin';

export default function AdminHeroPage() {
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
      greeting_vi: '',
      greeting_en: '',
      name: '',
      headline_vi: '',
      headline_en: '',
      subheadline_vi: '',
      subheadline_en: '',
      roles_vi: '',
      roles_en: '',
      avatar_url: '',
      cta_primary_label_vi: '',
      cta_primary_label_en: '',
      cta_primary_href: '',
      cta_secondary_label_vi: '',
      cta_secondary_label_en: '',
      cta_secondary_href: '',
    },
  });

  const avatarUrl = watch('avatar_url');
  const watchedGreetingVi = watch('greeting_vi');
  const watchedHeadlineVi = watch('headline_vi');
  const watchedSubheadlineVi = watch('subheadline_vi');
  const watchedRolesVi = watch('roles_vi');
  const watchedCtaPrimaryLabelVi = watch('cta_primary_label_vi');
  const watchedCtaSecondaryLabelVi = watch('cta_secondary_label_vi');

  const fetchHero = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('hero_section').select('*').eq('id', 1).single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        reset({
          ...data,
          roles_vi: data.roles_vi ? data.roles_vi.join(', ') : '',
          roles_en: data.roles_en ? data.roles_en.join(', ') : '',
        });
      } else {
        const { error: insertError } = await supabase.from('hero_section').insert([{ id: 1 }]);

        if (insertError) console.error('Error creating initial hero section:', insertError);
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, reset, showToast, t.admin.error]);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        id: 1,
        roles_vi: data.roles_vi
          ? data.roles_vi
              .split(',')
              .map((r) => r.trim())
              .filter(Boolean)
          : [],
        roles_en: data.roles_en
          ? data.roles_en
              .split(',')
              .map((r) => r.trim())
              .filter(Boolean)
          : [],
      };

      const { error } = await supabase.from('hero_section').upsert(payload);

      if (error) throw error;

      showToast(t.admin.updateSuccess, 'success');
      reset(data);
    } catch (error) {
      console.error('Error updating hero section:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-8 flex items-center justify-center">
        <RefreshCcw className="w-8 h-8 animate-spin text-blue-500 mr-2" />
        <p className="text-gray-500">{t.admin.loading}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">{t.admin.heroPageTitle}</h2>
          <button
            type="button"
            onClick={fetchHero}
            className="admin-card__ghost-button"
            disabled={submitting}
          >
            <RefreshCcw size={16} />
            <span>{t.admin.refresh}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                Copy & Content
              </h3>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Greeting
                  </h4>
                  <AITranslateButton
                    sourceText={watchedGreetingVi}
                    onTranslate={(val) => setValue('greeting_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Greeting (VN)"
                    placeholder="Xin chào..."
                    {...register('greeting_vi')}
                  />
                  <TextInput
                    label="Greeting (EN)"
                    placeholder="Hi, I am..."
                    {...register('greeting_en')}
                  />
                </div>
              </div>

              <TextInput
                label="Name"
                placeholder="Your Name"
                {...register('name')}
                error={errors.name?.message}
              />

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Headline
                  </h4>
                  <AITranslateButton
                    sourceText={watchedHeadlineVi}
                    onTranslate={(val) => setValue('headline_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextInput
                    label="Headline (VN)"
                    placeholder="Frontend Developer"
                    {...register('headline_vi')}
                  />
                  <TextInput
                    label="Headline (EN)"
                    placeholder="Frontend Developer"
                    {...register('headline_en')}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Subheadline / Bio
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSubheadlineVi}
                    onTranslate={(val) => setValue('subheadline_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextArea
                    label="Bio (VN)"
                    placeholder="Mô tả ngắn"
                    {...register('subheadline_vi')}
                  />
                  <TextArea
                    label="Bio (EN)"
                    placeholder="Short introductory text"
                    {...register('subheadline_en')}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Roles
                  </h4>
                  <AITranslateButton
                    sourceText={watchedRolesVi}
                    onTranslate={(val) => setValue('roles_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextInput
                    label="Roles (VN)"
                    placeholder="Backend, Frontend"
                    {...register('roles_vi')}
                  />
                  <TextInput
                    label="Roles (EN)"
                    placeholder="Backend Developer"
                    {...register('roles_en')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                Visuals & Actions
              </h3>

              <ImageUploader
                label="Avatar / Profile Image"
                value={avatarUrl}
                onChange={(url) => setValue('avatar_url', url, { shouldDirty: true })}
                folder="hero"
              />

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Primary CTA
                  </h4>
                  <AITranslateButton
                    sourceText={watchedCtaPrimaryLabelVi}
                    onTranslate={(val) =>
                      setValue('cta_primary_label_en', val, { shouldDirty: true })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Label (VN)"
                    placeholder="Liên hệ"
                    {...register('cta_primary_label_vi')}
                  />
                  <TextInput
                    label="Label (EN)"
                    placeholder="Contact Me"
                    {...register('cta_primary_label_en')}
                  />
                </div>
                <div className="mt-4">
                  <TextInput
                    label="Href"
                    placeholder="#contact"
                    {...register('cta_primary_href')}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Secondary CTA
                  </h4>
                  <AITranslateButton
                    sourceText={watchedCtaSecondaryLabelVi}
                    onTranslate={(val) =>
                      setValue('cta_secondary_label_en', val, { shouldDirty: true })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Label (VN)"
                    placeholder="Dự án"
                    {...register('cta_secondary_label_vi')}
                  />
                  <TextInput
                    label="Label (EN)"
                    placeholder="View Projects"
                    {...register('cta_secondary_label_en')}
                  />
                </div>
                <div className="mt-4">
                  <TextInput
                    label="Href"
                    placeholder="/projects"
                    {...register('cta_secondary_href')}
                  />
                </div>
              </div>
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
