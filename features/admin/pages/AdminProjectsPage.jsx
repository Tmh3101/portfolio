'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Github,
  Star,
  RefreshCcw,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  DataTable,
  TextInput,
  TextArea,
  ImageUploader,
  Switch,
  AITranslateButton,
} from '../../../components/admin';

export default function AdminProjectsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
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
      title_vi: '',
      title_en: '',
      short_description_vi: '',
      short_description_en: '',
      description_vi: '',
      description_en: '',
      thumbnail_url: '',
      images_url: '',
      repo_url: '',
      live_url: '',
      technologies: '',
      features_vi: '',
      features_en: '',
      featured: false,
      sort_order: 0,
    },
  });

  // Watch Vietnamese fields for AI translation
  const watchedTitleVi = watch('title_vi');
  const watchedShortDescVi = watch('short_description_vi');
  const watchedDescVi = watch('description_vi');
  const watchedFeaturesVi = watch('features_vi');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast, t.admin.error]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      reset({
        ...project,
        technologies: project.technologies ? project.technologies.join(', ') : '',
        images_url: project.images_url ? project.images_url.join(', ') : '',
        features_vi: project.features_vi ? project.features_vi.join('\n') : '',
        features_en: project.features_en ? project.features_en.join('\n') : '',
      });
    } else {
      reset({
        title_vi: '',
        title_en: '',
        short_description_vi: '',
        short_description_en: '',
        description_vi: '',
        description_en: '',
        thumbnail_url: '',
        images_url: '',
        repo_url: '',
        live_url: '',
        technologies: '',
        features_vi: '',
        features_en: '',
        featured: false,
        sort_order: projects.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(t.admin.confirmDelete || 'Are you sure you want to delete this project?'))
      return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);

      if (error) throw error;
      showToast(t.admin.deleteSuccess, 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast(t.admin.error, 'error');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Auto-generate slug from title if not editing
      const slug = editingProject
        ? editingProject.slug
        : data.title_vi
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

      const payload = {
        ...data,
        slug,
        technologies: data.technologies
          ? data.technologies
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        images_url: data.images_url
          ? data.images_url
              .split(',')
              .map((url) => url.trim())
              .filter(Boolean)
          : [],
        features_vi: data.features_vi
          ? data.features_vi
              .split('\n')
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        features_en: data.features_en
          ? data.features_en
              .split('\n')
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        sort_order: parseInt(data.sort_order, 10) || 0,
      };

      let error;
      if (editingProject) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      // Trigger on-demand revalidation to update the public page
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      }).catch((err) => console.error('Failed to trigger revalidation:', err));

      showToast(editingProject ? t.admin.updateSuccess : t.admin.addSuccess, 'success');
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      showToast(t.admin.error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'thumbnail_url',
      label: 'Image',
      render: (val) => (
        <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
          {val ? (
            <img src={val} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Plus className="w-4 h-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title_vi',
      label: 'Project Title',
      render: (val, item) => (
        <div>
          <span className="admin-table__primary flex items-center gap-2">
            {val}
            {item.featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
          </span>
        </div>
      ),
    },
    {
      key: 'featured',
      label: 'Status',
      render: (val) => (
        <span className={`admin-list-row__badge ${val ? 'bg-yellow-50 text-yellow-700' : ''}`}>
          {val ? 'Featured' : 'Standard'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (val) => <span className="font-mono text-gray-500">{val}</span>,
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">{t.admin.projectsPageTitle}</h2>
          <div className="flex gap-2">
            <button onClick={fetchProjects} className="admin-card__ghost-button" disabled={loading}>
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
          data={projects}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </section>

      {/* Project Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProject ? t.admin.edit : t.admin.create} Project
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
                  <div className="grid grid-cols-1 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Project Title
                      </h4>
                      <AITranslateButton
                        sourceText={watchedTitleVi}
                        onTranslate={(val) => setValue('title_en', val, { shouldValidate: true })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Title (VN)"
                        placeholder="Tên dự án"
                        {...register('title_vi', { required: 'Vietnamese title is required' })}
                        error={errors.title_vi?.message}
                      />
                      <TextInput
                        label="Title (EN)"
                        placeholder="Project Title"
                        {...register('title_en')}
                        error={errors.title_en?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Short Description
                      </h4>
                      <AITranslateButton
                        sourceText={watchedShortDescVi}
                        onTranslate={(val) =>
                          setValue('short_description_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <TextArea
                        label="Short Description (VN)"
                        placeholder="Mô tả ngắn"
                        {...register('short_description_vi')}
                        error={errors.short_description_vi?.message}
                      />
                      <TextArea
                        label="Short Description (EN)"
                        placeholder="Short Description"
                        {...register('short_description_en')}
                        error={errors.short_description_en?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Repo URL"
                      placeholder="https://github.com/..."
                      {...register('repo_url')}
                      error={errors.repo_url?.message}
                    />
                    <TextInput
                      label="Live URL"
                      placeholder="https://..."
                      {...register('live_url')}
                      error={errors.live_url?.message}
                    />
                  </div>

                  <TextInput
                    label="Technologies (comma separated)"
                    placeholder="React, Supabase, Tailwind"
                    {...register('technologies')}
                  />

                  <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Key Features (one per line)
                      </h4>
                      <AITranslateButton
                        sourceText={watchedFeaturesVi}
                        onTranslate={(val) =>
                          setValue('features_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <TextArea
                        label="Features (VN)"
                        placeholder="Feature 1&#10;Feature 2"
                        {...register('features_vi')}
                        error={errors.features_vi?.message}
                      />
                      <TextArea
                        label="Features (EN)"
                        placeholder="Feature 1&#10;Feature 2"
                        {...register('features_en')}
                        error={errors.features_en?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Sort Order" type="number" {...register('sort_order')} />
                    <div className="pt-6">
                      <Controller
                        name="featured"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            label="Featured Project"
                            description="Highlight on home page"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Visuals & Full Description */}
                <div className="space-y-6">
                  <Controller
                    name="thumbnail_url"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        label="Project Thumbnail"
                        value={field.value}
                        onChange={field.onChange}
                        folder="projects"
                        error={errors.thumbnail_url?.message}
                      />
                    )}
                  />

                  <TextArea
                    label="Gallery Images (comma separated URLs)"
                    placeholder="https://.../img1.png, https://.../img2.png"
                    {...register('images_url')}
                    error={errors.images_url?.message}
                  />

                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Full Description
                      </h4>
                      <AITranslateButton
                        sourceText={watchedDescVi}
                        onTranslate={(val) =>
                          setValue('description_en', val, { shouldValidate: true })
                        }
                      />
                    </div>
                    <div className="space-y-6">
                      <TextArea
                        label="Full Description (VN)"
                        rows={6}
                        {...register('description_vi')}
                        error={errors.description_vi?.message}
                      />
                      <TextArea
                        label="Full Description (EN)"
                        rows={6}
                        {...register('description_en')}
                        error={errors.description_en?.message}
                      />
                    </div>
                  </div>
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
