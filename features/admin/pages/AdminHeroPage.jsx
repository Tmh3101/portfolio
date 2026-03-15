'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCcw } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { TextInput, TextArea, ImageUploader } from '../../../components/admin';

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
      greeting: '',
      name: '',
      headline: '',
      subheadline: '',
      roles: '',
      avatar_url: '',
      cta_primary_label: '',
      cta_primary_href: '',
      cta_secondary_label: '',
      cta_secondary_href: '',
    },
  });

  const avatarUrl = watch('avatar_url');

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
          roles: data.roles ? data.roles.join(', ') : '',
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
        roles: data.roles
          ? data.roles
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

              <TextInput
                label="Greeting"
                placeholder="Hi, I am..."
                {...register('greeting')}
                error={errors.greeting?.message}
              />

              <TextInput
                label="Name"
                placeholder="Your Name"
                {...register('name')}
                error={errors.name?.message}
              />

              <TextInput
                label="Headline"
                placeholder="Main title / Role"
                {...register('headline')}
                error={errors.headline?.message}
              />

              <TextArea
                label="Subheadline / Bio"
                placeholder="Short introductory text"
                {...register('subheadline')}
                error={errors.subheadline?.message}
              />

              <TextInput
                label="Rotating Roles (comma separated)"
                placeholder="Backend Developer, API Architect, DevOps"
                {...register('roles')}
                error={errors.roles?.message}
              />
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

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Primary Button Label"
                  placeholder="Contact Me"
                  {...register('cta_primary_label')}
                  error={errors.cta_primary_label?.message}
                />
                <TextInput
                  label="Primary Button Href"
                  placeholder="#contact"
                  {...register('cta_primary_href')}
                  error={errors.cta_primary_href?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Secondary Button Label"
                  placeholder="View Projects"
                  {...register('cta_secondary_label')}
                  error={errors.cta_secondary_label?.message}
                />
                <TextInput
                  label="Secondary Button Href"
                  placeholder="/projects"
                  {...register('cta_secondary_href')}
                  error={errors.cta_secondary_href?.message}
                />
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
