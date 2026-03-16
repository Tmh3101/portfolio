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
      subtitle_vi: '',
      subtitle_en: '',
      subheadline_vi: '',
      subheadline_en: '',
      roles_vi: '',
      roles_en: '',
      role1_label_vi: '',
      role1_label_en: '',
      role1_value_vi: '',
      role1_value_en: '',
      role2_label_vi: '',
      role2_label_en: '',
      role2_value_vi: '',
      role2_value_en: '',
      role3_label_vi: '',
      role3_label_en: '',
      role3_value_vi: '',
      role3_value_en: '',
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
  const watchedSubtitleVi = watch('subtitle_vi');
  const watchedSubheadlineVi = watch('subheadline_vi');
  const watchedRole1LabelVi = watch('role1_label_vi');
  const watchedRole1ValueVi = watch('role1_value_vi');
  const watchedRole2LabelVi = watch('role2_label_vi');
  const watchedRole2ValueVi = watch('role2_value_vi');
  const watchedRole3LabelVi = watch('role3_label_vi');
  const watchedRole3ValueVi = watch('role3_value_vi');
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
          role1_vi: data.roles_vi ? data.roles_vi.join(', ') : '',
          role1_en: data.roles_en ? data.roles_en.join(', ') : '',
          role1_value_vi: data.roles_vi?.[0] || '',
          role1_value_en: data.roles_en?.[0] || '',
          role2_value_vi: data.roles_vi?.[1] || '',
          role2_value_en: data.roles_en?.[1] || '',
          role3_value_vi: data.roles_vi?.[2] || '',
          role3_value_en: data.roles_en?.[2] || '',
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

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      // Create a clean payload from form data
      const payload = { ...formData };

      // 1. Map individual role values back to the arrays the DB expects
      payload.roles_vi = [
        formData.role1_value_vi || '',
        formData.role2_value_vi || '',
        formData.role3_value_vi || '',
      ];
      payload.roles_en = [
        formData.role1_value_en || '',
        formData.role2_value_en || '',
        formData.role3_value_en || '',
      ];

      // 2. Remove temporary fields that ARE NOT columns in the database
      const fieldsToRemove = [
        'role1_vi',
        'role1_en',
        'role1_value_vi',
        'role1_value_en',
        'role2_value_vi',
        'role2_value_en',
        'role3_value_vi',
        'role3_value_en',
      ];

      fieldsToRemove.forEach((field) => delete payload[field]);

      // 3. Ensure ID is present
      payload.id = 1;

      const { error } = await supabase.from('hero_section').upsert(payload);

      if (error) throw error;

      // Trigger on-demand revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(t.admin.updateSuccess, 'success');
      reset(formData);
    } catch (error) {
      console.error('Error updating hero section:', error.message || error);
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
                    Subtitle
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSubtitleVi}
                    onTranslate={(val) => setValue('subtitle_en', val, { shouldDirty: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextInput
                    label="Subtitle (VN)"
                    placeholder="Chuyên gia xây dựng trải nghiệm..."
                    {...register('subtitle_vi')}
                  />
                  <TextInput
                    label="Subtitle (EN)"
                    placeholder="Specializing in building experiences..."
                    {...register('subtitle_en')}
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

              <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
                  Hero Info Box 1
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Label</span>
                        <AITranslateButton
                          sourceText={watchedRole1LabelVi}
                          onTranslate={(val) =>
                            setValue('role1_label_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput placeholder="Stack chính" {...register('role1_label_vi')} />
                      <TextInput placeholder="Core stack" {...register('role1_label_en')} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Value</span>
                        <AITranslateButton
                          sourceText={watchedRole1ValueVi}
                          onTranslate={(val) =>
                            setValue('role1_value_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput placeholder="Python, FastAPI..." {...register('role1_value_vi')} />
                      <TextInput placeholder="Python, FastAPI..." {...register('role1_value_en')} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
                  Hero Info Box 2
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Label</span>
                        <AITranslateButton
                          sourceText={watchedRole2LabelVi}
                          onTranslate={(val) =>
                            setValue('role2_label_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput placeholder="Thường xử lý" {...register('role2_label_vi')} />
                      <TextInput placeholder="Typical scope" {...register('role2_label_en')} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Value</span>
                        <AITranslateButton
                          sourceText={watchedRole2ValueVi}
                          onTranslate={(val) =>
                            setValue('role2_value_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput placeholder="REST APIs..." {...register('role2_value_vi')} />
                      <TextInput placeholder="REST APIs..." {...register('role2_value_en')} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
                  Hero Info Box 3
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Label</span>
                        <AITranslateButton
                          sourceText={watchedRole3LabelVi}
                          onTranslate={(val) =>
                            setValue('role3_label_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput placeholder="Cách tôi làm việc" {...register('role3_label_vi')} />
                      <TextInput placeholder="How I work" {...register('role3_label_en')} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Value</span>
                        <AITranslateButton
                          sourceText={watchedRole3ValueVi}
                          onTranslate={(val) =>
                            setValue('role3_value_en', val, { shouldDirty: true })
                          }
                        />
                      </div>
                      <TextInput
                        placeholder="Ưu tiên maintainability..."
                        {...register('role3_value_vi')}
                      />
                      <TextInput
                        placeholder="Prioritize maintainability..."
                        {...register('role3_value_en')}
                      />
                    </div>
                  </div>
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
