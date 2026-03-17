'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Calendar, Star } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  TextArea,
  Switch,
  AITranslateButton,
} from '../../../components/admin';

export default function AdminExperiencesPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();

  // Experiences State
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Section State
  const [sectionLoading, setSectionLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const supabase = getSupabaseBrowserClient();

  // 1. Form for individual Experiences
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
      type: 'work',
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

  // 2. Form for Global Section Metadata
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
      current_role_label_vi: '',
      current_role_label_en: '',
      earlier_roles_label_vi: '',
      earlier_roles_label_en: '',
      earlier_roles_copy_vi: '',
      earlier_roles_copy_en: '',
      education_label_vi: '',
      education_label_en: '',
      highlights_label_vi: '',
      highlights_label_en: '',
    },
  });

  const wSectEyebrowVi = watchSection('eyebrow_vi');
  const wSectTitle1Vi = watchSection('title1_vi');
  const wSectTitle2Vi = watchSection('title2_vi');
  const wSectDescVi = watchSection('description_vi');
  const wSectCurLabelVi = watchSection('current_role_label_vi');
  const wSectEarlierLabelVi = watchSection('earlier_roles_label_vi');
  const wSectEarlierCopyVi = watchSection('earlier_roles_copy_vi');
  const wSectEduLabelVi = watchSection('education_label_vi');
  const wSectHighLabelVi = watchSection('highlights_label_vi');

  // FETCHERS
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

  const fetchSection = useCallback(async () => {
    setSectionLoading(true);
    try {
      const { data, error } = await supabase
        .from('experience_section')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error && error.code !== '42P01') throw error;
      if (data) resetSection(data);
    } catch (error) {
      console.error('Error fetching experience section:', error);
    } finally {
      setSectionLoading(false);
    }
  }, [supabase, resetSection]);

  useEffect(() => {
    fetchExperiences();
    fetchSection();
  }, [fetchExperiences, fetchSection]);

  // HANDLERS: SECTION
  const onSectionSubmit = async (data) => {
    setSavingSection(true);
    try {
      const { error } = await supabase.from('experience_section').upsert({ id: 1, ...data });
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

  // HANDLERS: INDIVIDUAL EXPERIENCES
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
        type: 'work',
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
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure?')) return;

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

      // Trigger revalidation
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

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

  // COLUMNS
  const columns = [
    {
      key: 'company',
      label: 'Company / Org',
      render: (val, item) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="admin-table__primary">{val}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.type === 'education' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}
            >
              {item.type}
            </span>
          </div>
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
      {/* 1. Global Section Settings */}
      <section className="admin-card mb-6">
        <div
          className="admin-card__header cursor-pointer"
          onClick={() => setIsSectionOpen(!isSectionOpen)}
        >
          <div className="flex items-center gap-2">
            <h2 className="admin-card__title">Experience Section Headings & Labels</h2>
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
                        sourceText={wSectEyebrowVi}
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
                        sourceText={wSectTitle1Vi}
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
                        sourceText={wSectTitle2Vi}
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
                        sourceText={wSectDescVi}
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Current Role Label
                      </h4>
                      <AITranslateButton
                        sourceText={wSectCurLabelVi}
                        onTranslate={(val) =>
                          setValueSection('current_role_label_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('current_role_label_vi')} />
                      <TextInput label="EN" {...registerSection('current_role_label_en')} />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Highlights Label
                      </h4>
                      <AITranslateButton
                        sourceText={wSectHighLabelVi}
                        onTranslate={(val) =>
                          setValueSection('highlights_label_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('highlights_label_vi')} />
                      <TextInput label="EN" {...registerSection('highlights_label_en')} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Earlier Roles Label
                      </h4>
                      <AITranslateButton
                        sourceText={wSectEarlierLabelVi}
                        onTranslate={(val) =>
                          setValueSection('earlier_roles_label_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('earlier_roles_label_vi')} />
                      <TextInput label="EN" {...registerSection('earlier_roles_label_en')} />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Earlier Roles Copy
                      </h4>
                      <AITranslateButton
                        sourceText={wSectEarlierCopyVi}
                        onTranslate={(val) =>
                          setValueSection('earlier_roles_copy_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <TextArea label="VN" rows={2} {...registerSection('earlier_roles_copy_vi')} />
                      <TextArea label="EN" rows={2} {...registerSection('earlier_roles_copy_en')} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Education Label
                      </h4>
                      <AITranslateButton
                        sourceText={wSectEduLabelVi}
                        onTranslate={(val) =>
                          setValueSection('education_label_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="VN" {...registerSection('education_label_vi')} />
                      <TextInput label="EN" {...registerSection('education_label_en')} />
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

      {/* 2. Experiences Table */}
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Company / School Name"
                      placeholder="Tech Solutions Inc."
                      {...register('company', { required: 'Company is required' })}
                      error={errors.company?.message}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                        Type
                      </label>
                      <select
                        {...register('type')}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="work">Work Experience</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Job / Study Title
                      </h4>
                      <AITranslateButton
                        sourceText={watchedRoleVi}
                        onTranslate={(val) => setValue('role_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="Title (VN)"
                        {...register('role_vi', { required: true })}
                        error={errors.role_vi?.message}
                      />
                      <TextInput label="Title (EN)" {...register('role_en')} />
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
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput label="Location (VN)" {...register('location_vi')} />
                      <TextInput label="Location (EN)" {...register('location_en')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Start Date"
                      type="date"
                      {...register('start_date', { required: true })}
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
                        label="Currently active here"
                        description="Sets end date to 'Present'"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <TextInput
                    label="Technologies"
                    placeholder="Python, FastAPI, AWS"
                    {...register('technologies')}
                  />
                </div>

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
                    <TextArea label="Highlights (VN)" rows={6} {...register('highlights_vi')} />
                    <TextArea label="Highlights (EN)" rows={6} {...register('highlights_en')} />
                  </div>
                  <TextInput label="Sort Order" type="number" {...register('sort_order')} />
                </div>
              </div>

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
                  <TextArea label="Description (VN)" rows={6} {...register('description_vi')} />
                  <TextArea label="Description (EN)" rows={6} {...register('description_en')} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
                >
                  Cancel
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
