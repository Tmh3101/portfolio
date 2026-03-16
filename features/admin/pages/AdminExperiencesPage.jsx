'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Briefcase, Calendar } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  TextArea,
  MarkdownEditor,
  Switch,
  AITranslateButton,
} from '../../../components/admin';

export default function AdminExperiencesPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: '',
      role_vi: '',
      role_en: '',
      location_vi: '',
      location_en: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description_vi: '',
      description_en: '',
      highlights_vi: '',
      highlights_en: '',
      technologies: '',
      sort_order: 0,
    },
  });

  const isCurrent = watch('is_current');
  const watchedRoleVi = watch('role_vi');
  const watchedLocationVi = watch('location_vi');
  const watchedDescVi = watch('description_vi');
  const watchedHighlightsVi = watch('highlights_vi');

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleOpenModal = (exp = null) => {
    setEditingExperience(exp);
    if (exp) {
      reset({
        ...exp,
        highlights_vi: exp.highlights_vi ? exp.highlights_vi.join('\n') : '',
        highlights_en: exp.highlights_en ? exp.highlights_en.join('\n') : '',
        technologies: exp.technologies ? exp.technologies.join(', ') : '',
      });
    } else {
      reset({
        company: '',
        role_vi: '',
        role_en: '',
        location_vi: '',
        location_en: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description_vi: '',
        description_en: '',
        highlights_vi: '',
        highlights_en: '',
        technologies: '',
        sort_order: experiences.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleDelete = async (exp) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure you want to delete this record?'))
      return;

    try {
      const { error } = await supabase.from('experiences').delete().eq('id', exp.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      showToast(t.admin.error, 'error');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        highlights_vi: data.highlights_vi
          ? data.highlights_vi
              .split('\n')
              .map((h) => h.trim())
              .filter(Boolean)
          : [],
        highlights_en: data.highlights_en
          ? data.highlights_en
              .split('\n')
              .map((h) => h.trim())
              .filter(Boolean)
          : [],
        technologies: data.technologies
          ? data.technologies
              .split(',')
              .map((tech) => tech.trim())
              .filter(Boolean)
          : [],
        sort_order: parseInt(data.sort_order, 10) || 0,
        end_date: data.is_current ? null : data.end_date || null,
      };

      let error;
      if (editingExperience) {
        const { error: updateError } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', editingExperience.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('experiences').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      showToast(editingExperience ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'company',
      label: 'Company',
      render: (val, item) => (
        <div>
          <span className="admin-table__primary">{val}</span>
          <span className="text-xs text-gray-500">{item.location_vi}</span>
        </div>
      ),
    },
    {
      key: 'role_vi',
      label: 'Role',
      render: (val) => <span className="font-bold text-gray-700">{val}</span>,
    },
    {
      key: 'start_date',
      label: 'Duration',
      render: (val, item) => (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {val} — {item.is_current ? 'Present' : item.end_date}
        </div>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (val) => <span className="font-mono text-gray-400">{val}</span>,
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">{t.admin.experiencesPageTitle}</h2>
          <div className="flex gap-2">
            <button
              onClick={fetchExperiences}
              className="admin-card__ghost-button"
              disabled={loading}
            >
              <RefreshCcw size={16} />
            </button>
            <button onClick={() => handleOpenModal()} className="admin-primary-button">
              <Plus size={16} />
              <span>{t.admin.create}</span>
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={experiences}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Experience Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingExperience ? t.admin.edit : t.admin.create} Experience
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                  <TextInput
                    label="Company Name"
                    placeholder="Tech Solutions Inc."
                    {...register('company', { required: 'Company is required' })}
                    error={errors.company?.message}
                  />

                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Job Title
                      </h4>
                      <AITranslateButton
                        sourceText={watchedRoleVi}
                        onTranslate={(val) => setValue('role_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Title (VN)"
                        placeholder="Kỹ sư Backend"
                        {...register('role_vi', { required: 'Vietnamese role is required' })}
                        error={errors.role_vi?.message}
                      />
                      <TextInput
                        label="Title (EN)"
                        placeholder="Backend Engineer"
                        {...register('role_en')}
                        error={errors.role_en?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Location
                      </h4>
                      <AITranslateButton
                        sourceText={watchedLocationVi}
                        onTranslate={(val) =>
                          setValue('location_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Location (VN)"
                        placeholder="Hồ Chí Minh"
                        {...register('location_vi')}
                        error={errors.location_vi?.message}
                      />
                      <TextInput
                        label="Location (EN)"
                        placeholder="Ho Chi Minh City"
                        {...register('location_en')}
                        error={errors.location_en?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Start Date"
                      type="date"
                      {...register('start_date', { required: 'Start date is required' })}
                      error={errors.start_date?.message}
                    />
                    {!isCurrent && (
                      <TextInput label="End Date" type="date" {...register('end_date')} />
                    )}
                  </div>

                  <Controller
                    name="is_current"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        label="I am currently working here"
                        description="Sets end date to 'Present'"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />

                  <TextInput
                    label="Technologies (comma separated)"
                    placeholder="Python, FastAPI, AWS"
                    {...register('technologies')}
                  />
                </div>

                {/* Right Column: Highlights & Description */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Highlights
                      </h4>
                      <AITranslateButton
                        sourceText={watchedHighlightsVi}
                        onTranslate={(val) =>
                          setValue('highlights_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <TextArea
                        label="Highlights (VN)"
                        placeholder="- Tối ưu hóa database..."
                        rows={6}
                        {...register('highlights_vi')}
                        error={errors.highlights_vi?.message}
                      />
                      <TextArea
                        label="Highlights (EN)"
                        placeholder="- Optimized database..."
                        rows={6}
                        {...register('highlights_en')}
                        error={errors.highlights_en?.message}
                      />
                    </div>
                  </div>

                  <TextInput label="Sort Order" type="number" {...register('sort_order')} />
                </div>
              </div>

              {/* Full Width Description Editor */}
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Detailed Description
                  </h4>
                  <AITranslateButton
                    sourceText={watchedDescVi}
                    onTranslate={(val) => setValue('description_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="space-y-6">
                  <Controller
                    name="description_vi"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        label="Description (VN)"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.description_vi?.message}
                      />
                    )}
                  />
                  <Controller
                    name="description_en"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        label="Description (EN)"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.description_en?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-primary-button min-w-[120px]"
                >
                  <Save size={16} />
                  <span>{submitting ? t.admin.saving : t.admin.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
