'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Code2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { DataTable, TextInput, ImageUploader, AITranslateButton } from '../../../components/admin';

export default function AdminSkillsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
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
      name_vi: '',
      name_en: '',
      category_vi: '',
      category_en: '',
      level_vi: '',
      level_en: '',
      icon_url: '',
      sort_order: 0,
    },
  });

  const watchedNameVi = watch('name_vi');
  const watchedCategoryVi = watch('category_vi');
  const watchedLevelVi = watch('level_vi');

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category_vi', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenModal = (skill = null) => {
    setEditingSkill(skill);
    if (skill) {
      reset(skill);
    } else {
      reset({
        name_vi: '',
        name_en: '',
        category_vi: '',
        category_en: '',
        level_vi: '',
        level_en: '',
        icon_url: '',
        sort_order: skills.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = async (skill) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure?')) return;

    try {
      const { error } = await supabase.from('skills').delete().eq('id', skill.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
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
      if (editingSkill) {
        const { error: updateError } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', editingSkill.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('skills').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      showToast(editingSkill ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'icon_url',
      label: 'Icon',
      render: (val) => (
        <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 p-1">
          {val ? (
            <img src={val} alt="" className="w-full h-full object-contain" />
          ) : (
            <Code2 className="w-full h-full text-gray-300" />
          )}
        </div>
      ),
    },
    {
      key: 'name_vi',
      label: 'Skill Name',
      render: (val) => <span className="admin-table__primary">{val}</span>,
    },
    {
      key: 'category_vi',
      label: 'Category',
      render: (val) => (
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {val || 'General'}
        </span>
      ),
    },
    {
      key: 'level_vi',
      label: 'Level',
      render: (val) => <span className="text-sm text-gray-600">{val}</span>,
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
          <h2 className="admin-card__title">{t.admin.skillsPageTitle}</h2>
          <div className="flex gap-2">
            <button onClick={fetchSkills} className="admin-card__ghost-button" disabled={loading}>
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
          data={skills}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Skill Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSkill ? t.admin.edit : t.admin.create} Skill
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Skill Name
                      </h4>
                      <AITranslateButton
                        sourceText={watchedNameVi}
                        onTranslate={(val) => setValue('name_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Name (VN)"
                        placeholder="Python"
                        {...register('name_vi', { required: 'Vietnamese name is required' })}
                        error={errors.name_vi?.message}
                      />
                      <TextInput
                        label="Name (EN)"
                        placeholder="Python"
                        {...register('name_en')}
                        error={errors.name_en?.message}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </h4>
                      <AITranslateButton
                        sourceText={watchedCategoryVi}
                        onTranslate={(val) =>
                          setValue('category_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Category (VN)"
                        placeholder="Ngôn ngữ"
                        {...register('category_vi')}
                        error={errors.category_vi?.message}
                      />
                      <TextInput
                        label="Category (EN)"
                        placeholder="Languages"
                        {...register('category_en')}
                        error={errors.category_en?.message}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-1 space-y-6">
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Level
                          </h4>
                          <AITranslateButton
                            sourceText={watchedLevelVi}
                            onTranslate={(val) =>
                              setValue('level_en', val, { shouldValidate: true })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <TextInput
                            label="Level (VN)"
                            placeholder="Trung cấp"
                            {...register('level_vi')}
                          />
                          <TextInput
                            label="Level (EN)"
                            placeholder="Intermediate"
                            {...register('level_en')}
                          />
                        </div>
                      </div>

                      <TextInput label="Sort Order" type="number" {...register('sort_order')} />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-48 pt-1">
                  <Controller
                    name="icon_url"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        label="Icon"
                        value={field.value}
                        onChange={field.onChange}
                        folder="skills"
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
