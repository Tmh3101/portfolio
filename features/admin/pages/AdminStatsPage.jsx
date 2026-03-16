'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, BarChart3, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  AITranslateButton,
  IconPicker,
  TextArea,
} from '../../../components/admin';

export default function AdminStatsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

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
      label_vi: '',
      label_en: '',
      value: '',
      suffix: '',
      copy_vi: '',
      copy_en: '',
      icon: '',
      sort_order: 0,
    },
  });

  const watchedLabelVi = watch('label_vi');
  const watchedCopyVi = watch('copy_vi');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleOpenModal = (stat = null) => {
    setEditingStat(stat);
    if (stat) {
      reset(stat);
    } else {
      reset({
        label_vi: '',
        label_en: '',
        value: '',
        suffix: '',
        copy_vi: '',
        copy_en: '',
        icon: '',
        sort_order: stats.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStat(null);
  };

  const handleDelete = async (stat) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure?')) return;

    try {
      const { error } = await supabase.from('stats').delete().eq('id', stat.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      showToast(t.admin.error, 'error');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        value: parseFloat(data.value) || 0,
        sort_order: parseInt(data.sort_order, 10) || 0,
      };

      let error;
      if (editingStat) {
        const { error: updateError } = await supabase
          .from('stats')
          .update(payload)
          .eq('id', editingStat.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('stats').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      // Trigger on-demand revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(editingStat ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchStats();
    } catch (error) {
      console.error('Error saving stat:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'label_vi',
      label: 'Stat Label',
      render: (val, item) => {
        const Icon = item.icon && Icons[item.icon] ? Icons[item.icon] : Globe;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600">
              <Icon size={16} />
            </div>
            <span className="admin-table__primary">{val}</span>
          </div>
        );
      },
    },
    {
      key: 'value',
      label: 'Value',
      render: (val, item) => (
        <span className="font-mono font-bold text-blue-600">
          {val}
          {item.suffix}
        </span>
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
          <h2 className="admin-card__title">{t.admin.statsPageTitle}</h2>
          <div className="flex gap-2">
            <button onClick={fetchStats} className="admin-card__ghost-button" disabled={loading}>
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
          data={stats}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Stat Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {editingStat ? t.admin.edit : t.admin.create} Stat
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
            >
              {/* Core Data Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                <TextInput
                  label="Numeric Value"
                  type="number"
                  step="any"
                  placeholder="20"
                  {...register('value', { required: 'Value is required' })}
                  error={errors.value?.message}
                />
                <TextInput label="Suffix" placeholder="+" {...register('suffix')} />
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

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">
                  Multilingual Content
                </h3>

                {/* Labels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div className="space-y-4">
                    <TextInput
                      label="Label (VN)"
                      placeholder="Dự án hoàn thành"
                      {...register('label_vi', { required: 'Vietnamese label is required' })}
                      error={errors.label_vi?.message}
                    />
                  </div>
                  <div className="space-y-4 relative pt-8 md:pt-2">
                    <div className="absolute -top-1 right-0 z-10 md:top-0">
                      <AITranslateButton
                        sourceText={watchedLabelVi}
                        onTranslate={(val) => setValue('label_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <TextInput
                      label="Label (EN)"
                      placeholder="Projects Completed"
                      {...register('label_en')}
                      error={errors.label_en?.message}
                    />
                  </div>
                </div>

                {/* Copy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div>
                    <TextArea
                      label="Copy (VN)"
                      rows={3}
                      placeholder="Brief description of the stat"
                      {...register('copy_vi')}
                      error={errors.copy_vi?.message}
                    />
                  </div>
                  <div className="relative pt-6 md:pt-2">
                    <div className="absolute -top-1 right-0 z-10 md:top-0">
                      <AITranslateButton
                        sourceText={watchedCopyVi}
                        onTranslate={(val) => setValue('copy_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <TextArea
                      label="Copy (EN)"
                      rows={3}
                      placeholder="Brief description of the stat"
                      {...register('copy_en')}
                      error={errors.copy_en?.message}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 shrink-0">
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
