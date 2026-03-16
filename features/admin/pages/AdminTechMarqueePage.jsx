'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Layers, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { DataTable, TextInput, IconPicker } from '../../../components/admin';

export default function AdminTechMarqueePage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: '',
      icon: '',
      sort_order: 0,
    },
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tech_marquee')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching tech marquee items:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      reset(item);
    } else {
      reset({
        label: '',
        icon: '',
        sort_order: items.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure?')) return;

    try {
      const { error } = await supabase.from('tech_marquee').delete().eq('id', item.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
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
      if (editingItem) {
        const { error: updateError } = await supabase
          .from('tech_marquee')
          .update(payload)
          .eq('id', editingItem.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('tech_marquee').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      // Trigger on-demand revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(editingItem ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchItems();
    } catch (error) {
      console.error('Error saving tech marquee item:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'label',
      label: 'Label',
      render: (val, item) => {
        const Icon = item.icon && Icons[item.icon] ? Icons[item.icon] : Globe;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#1f4f82]" />
            </div>
            <span className="admin-table__primary">{val}</span>
          </div>
        );
      },
    },
    {
      key: 'icon',
      label: 'Icon (Lucide)',
      render: (val) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{val || '--'}</span>
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
          <h2 className="admin-card__title">Tech Marquee</h2>
          <div className="flex gap-2">
            <button onClick={fetchItems} className="admin-card__ghost-button" disabled={loading}>
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
          data={items}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Item Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? t.admin.edit : t.admin.create} Marquee Item
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <TextInput
                label="Label"
                placeholder="React, Node.js, etc."
                {...register('label', { required: 'Label is required' })}
                error={errors.label?.message}
              />

              <div className="grid grid-cols-2 gap-4">
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
                <TextInput
                  label="Sort Order"
                  type="number"
                  {...register('sort_order')}
                  error={errors.sort_order?.message}
                />
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
