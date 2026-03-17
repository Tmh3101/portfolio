'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Lightbulb } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  TextArea,
  AITranslateButton,
  IconPicker,
} from '../../../components/admin';

export default function AdminApproachesPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [approaches, setApproaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApproach, setEditingApproach] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const supabase = getSupabaseBrowserClient();

  // Form for individual items
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title_vi: '',
      title_en: '',
      subtitle_vi: '',
      subtitle_en: '',
      description_vi: '',
      description_en: '',
      icon: '',
      sort_order: 0,
    },
  });

  // Form for section metadata
  const {
    register: registerSection,
    handleSubmit: handleSubmitSection,
    reset: resetSection,
    watch: watchSection,
    setValue: setValueSection,
  } = useForm({
    defaultValues: {
      eyebrow_vi: '',
      eyebrow_en: '',
      title1_vi: '',
      title1_en: '',
      title2_vi: '',
      title2_en: '',
      description_vi: '',
      description_en: '',
      note_label_vi: '',
      note_label_en: '',
      note_vi: '',
      note_en: '',
    },
  });

  const watchedTitleVi = watch('title_vi');
  const watchedSubtitleVi = watch('subtitle_vi');
  const watchedDescVi = watch('description_vi');

  // Watchers for section translation
  const wSectionEyebrowVi = watchSection('eyebrow_vi');
  const wSectionTitle1Vi = watchSection('title1_vi');
  const wSectionTitle2Vi = watchSection('title2_vi');
  const wSectionDescVi = watchSection('description_vi');
  const wSectionNoteLabelVi = watchSection('note_label_vi');
  const wSectionNoteVi = watchSection('note_vi');

  const fetchApproaches = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('approaches')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setApproaches(data || []);
    } catch (error) {
      console.error('Error fetching approaches:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  const fetchSection = useCallback(async () => {
    setSectionLoading(true);
    try {
      const { data, error } = await supabase
        .from('approach_section')
        .select('*')
        .eq('id', 1)
        .maybeSingle(); // Use maybeSingle to avoid PGRST116 when empty

      if (error) {
        // Only log if it's not a missing table error (which will be fixed by migration)
        if (error.code !== '42P01') {
          console.error('Error fetching approach section:', error.message || error);
        }
        return;
      }

      if (data) resetSection(data);
    } catch (err) {
      console.error('Unexpected error in fetchSection:', err);
    } finally {
      setSectionLoading(false);
    }
  }, [supabase, resetSection]);

  useEffect(() => {
    fetchApproaches();
    fetchSection();
  }, [fetchApproaches, fetchSection]);

  const onSectionSubmit = async (data) => {
    setSavingSection(true);
    try {
      const { error } = await supabase.from('approach_section').upsert({ id: 1, ...data });

      if (error) throw error;
      showToast(t.admin.updateSuccess, 'success');

      // Trigger revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));
    } catch (error) {
      console.error('Error saving approach section:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSavingSection(false);
    }
  };

  const handleOpenModal = (appr = null) => {
    setEditingApproach(appr);
    if (appr) {
      reset(appr);
    } else {
      reset({
        title_vi: '',
        title_en: '',
        subtitle_vi: '',
        subtitle_en: '',
        description_vi: '',
        description_en: '',
        icon: '',
        sort_order: approaches.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApproach(null);
  };

  const handleDelete = async (appr) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure?')) return;

    try {
      const { error } = await supabase.from('approaches').delete().eq('id', appr.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchApproaches();
    } catch (error) {
      console.error('Error deleting approach:', error);
      showToast(t.admin.error, 'error');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        sort_order: parseInt(data.sort_order, 10) || 0,
      };

      let error;
      if (editingApproach) {
        const { error: updateError } = await supabase
          .from('approaches')
          .update(payload)
          .eq('id', editingApproach.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('approaches').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      // Trigger on-demand revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(editingApproach ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchApproaches();
    } catch (error) {
      console.error('Error saving approach:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'title_vi',
      label: 'Title',
      render: (val, item) => (
        <div>
          <span className="admin-table__primary">{val}</span>
          <span className="text-xs text-gray-500">{item.subtitle_vi}</span>
        </div>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (val) => <span className="text-xs font-mono text-gray-500">{val || '--'}</span>,
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (val) => <span className="font-mono text-gray-400">{val}</span>,
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Section Global Settings */}
      <section className="admin-card mb-6">
        <div
          className="admin-card__header cursor-pointer select-none"
          onClick={() => setIsSectionOpen(!isSectionOpen)}
        >
          <div className="flex items-center gap-2">
            <h2 className="admin-card__title">Section Headings & Bio</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${isSectionOpen ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}
            >
              {isSectionOpen ? 'Editing' : 'Click to edit'}
            </span>
          </div>
          <button type="button" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus
              className={`w-5 h-5 transition-transform duration-200 ${isSectionOpen ? 'rotate-45' : ''}`}
            />
          </button>
        </div>

        {isSectionOpen && (
          <form
            onSubmit={handleSubmitSection(onSectionSubmit)}
            className="p-6 space-y-8 animate-in slide-in-from-top-2 duration-200"
          >
            {sectionLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCcw className="w-6 h-6 animate-spin text-primary/40" />
              </div>
            ) : (
              <>
                {/* Eyebrow & Title */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Eyebrow */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Eyebrow (About)
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionEyebrowVi}
                        onTranslate={(val) =>
                          setValueSection('eyebrow_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('eyebrow_vi')} />
                      <TextInput label="EN" {...registerSection('eyebrow_en')} />
                    </div>
                  </div>

                  {/* Title Part 1 */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Title Part 1
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionTitle1Vi}
                        onTranslate={(val) =>
                          setValueSection('title1_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('title1_vi')} />
                      <TextInput label="EN" {...registerSection('title1_en')} />
                    </div>
                  </div>
                </div>

                {/* Title Part 2 (Gradient) & Description */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Title Part 2 */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Title Part 2 (Gradient)
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionTitle2Vi}
                        onTranslate={(val) =>
                          setValueSection('title2_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('title2_vi')} />
                      <TextInput label="EN" {...registerSection('title2_en')} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Main Description
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionDescVi}
                        onTranslate={(val) =>
                          setValueSection('description_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextArea label="VN" rows={3} {...registerSection('description_vi')} />
                      <TextArea label="EN" rows={3} {...registerSection('description_en')} />
                    </div>
                  </div>
                </div>

                {/* Note Label & Note Content */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Note Label */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Note Label
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionNoteLabelVi}
                        onTranslate={(val) =>
                          setValueSection('note_label_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('note_label_vi')} />
                      <TextInput label="EN" {...registerSection('note_label_en')} />
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Note Content
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionNoteVi}
                        onTranslate={(val) =>
                          setValueSection('note_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextArea label="VN" rows={3} {...registerSection('note_vi')} />
                      <TextArea label="EN" rows={3} {...registerSection('note_en')} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={savingSection}
                    className="admin-primary-button min-w-[140px]"
                  >
                    <Save size={16} />
                    <span>{savingSection ? t.admin.saving : t.admin.save}</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Work Approaches</h2>
          <div className="flex gap-2">
            <button
              onClick={fetchApproaches}
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
          data={approaches}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Approach Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {editingApproach ? t.admin.edit : t.admin.create} Approach
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form
              id="approach-form"
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-6 overflow-y-auto flex-1"
            >
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Title
                  </h4>
                  <AITranslateButton
                    sourceText={watchedTitleVi}
                    onTranslate={(val) => setValue('title_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="Title (VN)"
                    placeholder="API-First Design"
                    {...register('title_vi', { required: 'Vietnamese title is required' })}
                    error={errors.title_vi?.message}
                  />
                  <TextInput
                    label="Title (EN)"
                    placeholder="API-First Design"
                    {...register('title_en')}
                    error={errors.title_en?.message}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Subtitle
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSubtitleVi}
                    onTranslate={(val) => setValue('subtitle_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="Subtitle (VN)"
                    placeholder="Thiết kế hướng API"
                    {...register('subtitle_vi')}
                    error={errors.subtitle_vi?.message}
                  />
                  <TextInput
                    label="Subtitle (EN)"
                    placeholder="API-First Design"
                    {...register('subtitle_en')}
                    error={errors.subtitle_en?.message}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </h4>
                  <AITranslateButton
                    sourceText={watchedDescVi}
                    onTranslate={(val) => setValue('description_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextArea
                    label="Description (VN)"
                    placeholder="Mô tả cách tiếp cận"
                    rows={4}
                    {...register('description_vi')}
                    error={errors.description_vi?.message}
                  />
                  <TextArea
                    label="Description (EN)"
                    placeholder="How do you approach this part of your work?"
                    rows={4}
                    {...register('description_en')}
                    error={errors.description_en?.message}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <IconPicker
                      label="Icon"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.icon?.message}
                    />
                  )}
                />
                <TextInput label="Sort Order" type="number" {...register('sort_order')} />
              </div>
            </form>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t.admin.cancel}
              </button>
              <button
                type="submit"
                form="approach-form"
                disabled={submitting}
                className="admin-primary-button min-w-[120px]"
              >
                <Save size={16} />
                <span>{submitting ? t.admin.saving : t.admin.save}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
