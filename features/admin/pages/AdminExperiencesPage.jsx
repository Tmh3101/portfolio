'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, RefreshCcw, Save, X, Briefcase, Calendar } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { DataTable, TextInput, TextArea, MarkdownEditor, Switch } from '../../../components/admin';

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      highlights: '',
      technologies: '',
      sort_order: 0,
    },
  });

  const isCurrent = watch('is_current');

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
        highlights: exp.highlights ? exp.highlights.join('\n') : '',
        technologies: exp.technologies ? exp.technologies.join(', ') : '',
      });
    } else {
      reset({
        company: '',
        role: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        highlights: '',
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
        highlights: data.highlights
          ? data.highlights
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
          <span className="text-xs text-gray-500">{item.location}</span>
        </div>
      ),
    },
    {
      key: 'role',
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
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Company Name"
                      placeholder="Tech Solutions Inc."
                      {...register('company', { required: 'Company is required' })}
                      error={errors.company?.message}
                    />
                    <TextInput
                      label="Job Title"
                      placeholder="Senior Backend Engineer"
                      {...register('role', { required: 'Role is required' })}
                      error={errors.role?.message}
                    />
                  </div>

                  <TextInput
                    label="Location"
                    placeholder="Remote / Ho Chi Minh City"
                    {...register('location')}
                  />

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

                {/* Right Column: Highlights */}
                <div className="space-y-6">
                  <TextArea
                    label="Bullet Highlights (One per line)"
                    placeholder="- Optimized database queries by 40%&#10;- Led a team of 3 developers"
                    rows={8}
                    {...register('highlights')}
                  />
                  <TextInput label="Sort Order" type="number" {...register('sort_order')} />
                </div>
              </div>

              {/* Full Width Description Editor */}
              <div className="space-y-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      label="Detailed Description"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.description?.message}
                    />
                  )}
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
