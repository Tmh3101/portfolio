'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Lightbulb } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { DataTable, TextInput, TextArea, AITranslateButton } from '../../../components/admin';

export default function AdminApproachesPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [approaches, setApproaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApproach, setEditingApproach] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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

  const watchedTitleVi = watch('title_vi');
  const watchedSubtitleVi = watch('subtitle_vi');
  const watchedDescVi = watch('description_vi');

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

  useEffect(() => {
    fetchApproaches();
  }, [fetchApproaches]);

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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
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

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Title
                  </h4>
                  <AITranslateButton
                    sourceText={watchedTitleVi}
                    onTranslate={(val) => setValue('title_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="space-y-4">
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
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Subtitle
                  </h4>
                  <AITranslateButton
                    sourceText={watchedSubtitleVi}
                    onTranslate={(val) => setValue('subtitle_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="space-y-4">
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
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </h4>
                  <AITranslateButton
                    sourceText={watchedDescVi}
                    onTranslate={(val) => setValue('description_en', val, { shouldValidate: true })}
                  />
                </div>
                <div className="space-y-4">
                  <TextArea
                    label="Description (VN)"
                    placeholder="Mô tả cách tiếp cận"
                    rows={3}
                    {...register('description_vi')}
                    error={errors.description_vi?.message}
                  />
                  <TextArea
                    label="Description (EN)"
                    placeholder="How do you approach this part of your work?"
                    rows={3}
                    {...register('description_en')}
                    error={errors.description_en?.message}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Icon Identifier"
                  placeholder="code / search / database"
                  {...register('icon')}
                />
                <TextInput label="Sort Order" type="number" {...register('sort_order')} />
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
