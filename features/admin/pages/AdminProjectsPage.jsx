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
  MarkdownEditor,
  Switch,
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      thumbnail_url: '',
      repo_url: '',
      live_url: '',
      tags: '',
      featured: false,
      sort_order: 0,
    },
  });

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
        tags: project.tags ? project.tags.join(', ') : '',
      });
    } else {
      reset({
        title: '',
        slug: '',
        short_description: '',
        description: '',
        thumbnail_url: '',
        repo_url: '',
        live_url: '',
        tags: '',
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
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((tag) => tag.trim())
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
      key: 'title',
      label: 'Project Title',
      render: (val, item) => (
        <div>
          <span className="admin-table__primary flex items-center gap-2">
            {val}
            {item.featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
          </span>
          <span className="text-xs text-gray-500 font-mono">{item.slug}</span>
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
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Project Title"
                      placeholder="My Awesome App"
                      {...register('title', { required: 'Title is required' })}
                      error={errors.title?.message}
                    />
                    <TextInput
                      label="Slug (URL ID)"
                      placeholder="my-awesome-app"
                      {...register('slug', { required: 'Slug is required' })}
                      error={errors.slug?.message}
                    />
                  </div>

                  <TextArea
                    label="Short Description"
                    placeholder="Brief intro for the project card"
                    {...register('short_description')}
                    error={errors.short_description?.message}
                  />

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
                    label="Tags (comma separated)"
                    placeholder="React, Supabase, Tailwind"
                    {...register('tags')}
                  />

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

                {/* Right Column: Visuals */}
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
                </div>
              </div>

              {/* Full Width Editor */}
              <div className="space-y-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      label="Full Description"
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
