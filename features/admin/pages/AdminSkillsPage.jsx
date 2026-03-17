'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Code2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  TextArea,
  IconPicker,
  AITranslateButton,
} from '../../../components/admin';

export default function AdminSkillsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();

  // Skills State
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [submittingCat, setSubmittingCat] = useState(false);
  const [isCatSectionOpen, setIsCatSectionOpen] = useState(false);

  // Section State
  const [sectionLoading, setSectionLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const supabase = getSupabaseBrowserClient();

  // 1. Form for individual Skills
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      category_id: '',
      level_vi: '',
      level_en: '',
      color: '',
      sort_order: 0,
    },
  });

  const watchedLevelVi = watch('level_vi');

  // 2. Form for Categories (The Cards)
  const {
    register: registerCat,
    handleSubmit: handleSubmitCat,
    reset: resetCat,
    control: controlCat,
    watch: watchCat,
    setValue: setValueCat,
  } = useForm({
    defaultValues: {
      name_vi: '',
      name_en: '',
      description_vi: '',
      description_en: '',
      icon: '',
      sort_order: 0,
    },
  });

  const watchedCatNameVi = watchCat('name_vi');
  const watchedCatDescVi = watchCat('description_vi');

  // 3. Form for Global Section Metadata
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
    },
  });

  const wSectionEyebrowVi = watchSection('eyebrow_vi');
  const wSectionTitle1Vi = watchSection('title1_vi');
  const wSectionTitle2Vi = watchSection('title2_vi');
  const wSectionDescVi = watchSection('description_vi');

  // FETCHERS
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
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

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCatLoading(false);
    }
  }, [supabase]);

  const fetchSection = useCallback(async () => {
    setSectionLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_section')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error && error.code !== '42P01') throw error;
      if (data) resetSection(data);
    } catch (error) {
      console.error('Error fetching skill section:', error);
    } finally {
      setSectionLoading(false);
    }
  }, [supabase, resetSection]);

  useEffect(() => {
    fetchSkills();
    fetchCategories();
    fetchSection();
  }, [fetchSkills, fetchCategories, fetchSection]);

  // HANDLERS: SECTION
  const onSectionSubmit = async (data) => {
    setSavingSection(true);
    try {
      const { error } = await supabase.from('skill_section').upsert({ id: 1, ...data });
      if (error) throw error;
      showToast(t.admin.updateSuccess, 'success');
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error(err));
    } catch (error) {
      console.error('Error saving section:', error.message || error);
      showToast(t.admin.error, 'error');
    } finally {
      setSavingSection(false);
    }
  };

  // HANDLERS: CATEGORIES
  const handleOpenCatModal = (cat = null) => {
    setEditingCat(cat);
    if (cat) {
      resetCat(cat);
    } else {
      resetCat({
        name_vi: '',
        name_en: '',
        description_vi: '',
        description_en: '',
        icon: '',
        sort_order: categories.length,
      });
    }
    setIsCatModalOpen(true);
  };

  const handleCloseCatModal = () => {
    setIsCatModalOpen(false);
    setEditingCat(null);
  };

  const onCatSubmit = async (data) => {
    setSubmittingCat(true);
    try {
      const payload = { ...data, sort_order: parseInt(data.sort_order, 10) || 0 };
      let error;
      if (editingCat) {
        const { error: err } = await supabase
          .from('skill_categories')
          .update(payload)
          .eq('id', editingCat.id);
        error = err;
      } else {
        const { error: err } = await supabase.from('skill_categories').insert([payload]);
        error = err;
      }
      if (error) throw error;
      showToast(editingCat ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseCatModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmittingCat(false);
    }
  };

  const handleDeleteCat = async (cat) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      const { error } = await supabase.from('skill_categories').delete().eq('id', cat.id);
      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast(t.admin.error, 'error');
    }
  };

  // HANDLERS: INDIVIDUAL SKILLS
  const handleOpenModal = (skill = null) => {
    setEditingSkill(skill);
    if (skill) {
      reset(skill);
    } else {
      reset({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        level_vi: '',
        level_en: '',
        color: '',
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
        category_id: data.category_id ? parseInt(data.category_id, 10) : null,
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

      // Trigger revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

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

  // COLUMNS
  const columns = [
    {
      key: 'name',
      label: 'Skill Name',
      render: (val, item) => (
        <div className="flex items-center gap-3">
          <span className="admin-table__primary">{val}</span>
          {item.color && (
            <div
              className="w-2.5 h-2.5 rounded-full border border-gray-200"
              style={{ backgroundColor: item.color }}
              title={item.color}
            />
          )}
        </div>
      ),
    },
    {
      key: 'category_id',
      label: 'Category',
      render: (val) => {
        const cat = categories.find((c) => c.id === val);
        return (
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {cat ? cat.name_vi : '---'}
          </span>
        );
      },
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (val) => <span className="font-mono text-gray-400">{val}</span>,
    },
  ];

  const catColumns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (val) => <IconPicker value={val} readOnly size={18} />,
    },
    {
      key: 'name_vi',
      label: 'Category Name',
      render: (val, item) => (
        <div>
          <div className="font-bold text-gray-900">{val}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{item.description_vi}</div>
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
      {/* 1. Global Section Settings */}
      <section className="admin-card mb-6">
        <div
          className="admin-card__header cursor-pointer"
          onClick={() => setIsSectionOpen(!isSectionOpen)}
        >
          <div className="flex items-center gap-2">
            <h2 className="admin-card__title">Skills Section Headings</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${isSectionOpen ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}
            >
              {isSectionOpen ? 'Editing' : 'Click to edit'}
            </span>
          </div>
          <Plus
            className={`w-5 h-5 transition-transform duration-200 ${isSectionOpen ? 'rotate-45' : ''}`}
          />
        </div>

        {isSectionOpen && (
          <form onSubmit={handleSubmitSection(onSectionSubmit)} className="p-6 space-y-8">
            {sectionLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCcw className="animate-spin text-primary/40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Eyebrow
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionEyebrowVi}
                        onTranslate={(val) =>
                          setValueSection('eyebrow_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('eyebrow_vi')} />
                      <TextInput label="EN" {...registerSection('eyebrow_en')} />
                    </div>
                  </div>
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
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('title1_vi')} />
                      <TextInput label="EN" {...registerSection('title1_en')} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('title2_vi')} />
                      <TextInput label="EN" {...registerSection('title2_en')} />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </h4>
                      <AITranslateButton
                        sourceText={wSectionDescVi}
                        onTranslate={(val) =>
                          setValueSection('description_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <TextArea label="VN" rows={2} {...registerSection('description_vi')} />
                      <TextArea label="EN" rows={2} {...registerSection('description_en')} />
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

      {/* 2. Skill Categories (The Cards) */}
      <section className="admin-card mb-6">
        <div
          className="admin-card__header cursor-pointer"
          onClick={() => setIsCatSectionOpen(!isCatSectionOpen)}
        >
          <div className="flex items-center gap-2">
            <h2 className="admin-card__title">Skill Categories (The Cards)</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${isCatSectionOpen ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}
            >
              {categories.length} Categories
            </span>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleOpenCatModal()}
              className="admin-card__ghost-button p-1 text-primary"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {isCatSectionOpen && (
          <div className="p-6">
            <DataTable
              columns={catColumns}
              data={categories}
              onEdit={handleOpenCatModal}
              onDelete={handleDeleteCat}
              isLoading={catLoading}
            />
          </div>
        )}
      </section>

      {/* 3. Individual Skills */}
      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Individual Skills (Chips)</h2>
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

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCat ? 'Edit' : 'Create'} Category
              </h3>
              <button
                onClick={handleCloseCatModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={handleSubmitCat(onCatSubmit)}
              className="p-6 space-y-6 overflow-y-auto flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <Controller
                    name="icon"
                    control={controlCat}
                    render={({ field }) => (
                      <IconPicker
                        label="Category Icon"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="md:col-span-8 space-y-6">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </h4>
                      <AITranslateButton
                        sourceText={watchedCatNameVi}
                        onTranslate={(val) => setValueCat('name_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerCat('name_vi', { required: true })} />
                      <TextInput label="EN" {...registerCat('name_en')} />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </h4>
                      <AITranslateButton
                        sourceText={watchedCatDescVi}
                        onTranslate={(val) =>
                          setValueCat('description_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <TextArea label="VN" rows={2} {...registerCat('description_vi')} />
                      <TextArea label="EN" rows={2} {...registerCat('description_en')} />
                    </div>
                  </div>
                  <TextInput label="Sort Order" type="number" {...registerCat('sort_order')} />
                </div>
              </div>
            </form>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseCatModal}
                className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmitCat(onCatSubmit)}
                disabled={submittingCat}
                className="admin-primary-button min-w-[120px]"
              >
                <Save size={16} />
                <span>{submittingCat ? 'Saving...' : 'Save Category'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
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

            <form
              id="skill-form"
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-6 overflow-y-auto flex-1"
            >
              <div className="space-y-6">
                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                    Identity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      label="Skill Name"
                      placeholder="Python"
                      {...register('name', { required: true })}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                        Category
                      </label>
                      <select
                        {...register('category_id', { required: true })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name_vi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Level & Style
                    </h4>
                    <AITranslateButton
                      sourceText={watchedLevelVi}
                      onTranslate={(val) => setValue('level_en', val, { shouldValidate: true })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
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
                    <TextInput label="Brand Color" placeholder="#3776AB" {...register('color')} />
                  </div>
                </div>
                <TextInput label="Sort Order" type="number" {...register('sort_order')} />
              </div>
            </form>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="skill-form"
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
