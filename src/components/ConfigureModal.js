'use client';

import { useState, useEffect } from 'react';

export default function ConfigureModal({ project, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    url: '',
    tags: [],
    thumbnail: '',
    configurable: false,
    visible: true,
    uploads: [],
    ...project
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: '',
        description: '',
        version: '',
        url: '',
        tags: [],
        thumbnail: '',
        configurable: false,
        visible: true,
        uploads: [],
        ...project
      });
      setIsDeleting(false);
    }
  }, [project]);

  if (!isOpen) return null;

  const isNew = project?.isNew;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(t => t !== '');
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleAddUploadRow = () => {
    setFormData(prev => ({
      ...prev,
      uploads: [...(prev.uploads || []), { label: '', url: '', fileName: '' }]
    }));
  };

  const handleUploadLabelChange = (index, value) => {
    const newUploads = [...(formData.uploads || [])];
    newUploads[index].label = value;
    setFormData(prev => ({ ...prev, uploads: newUploads }));
  };

  const handleFileChange = async (index, file) => {
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      
      if (data.url) {
        const newUploads = [...(formData.uploads || [])];
        newUploads[index].url = data.url;
        newUploads[index].fileName = data.name;
        // Auto-label if label is empty
        if (!newUploads[index].label) {
          const originalName = data.name.split('-').slice(1).join('-') || data.name;
          newUploads[index].label = originalName;
        }
        setFormData(prev => ({ ...prev, uploads: newUploads }));
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUpload = (index) => {
    const newUploads = (formData.uploads || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, uploads: newUploads }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    delete submissionData.isNew; // Remove UI helper flag
    onSave(submissionData);
  };

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(formData.id);
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {isNew ? 'Add New' : 'Configure'} <span className="text-blue-600">Project</span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title ?? ''}
                  onChange={handleChange}
                  placeholder="e.g. Project Cluster"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Version</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version ?? ''}
                  onChange={handleChange}
                  placeholder="1.0.0"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Description</label>
              <textarea
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                placeholder="Describe what this project is all about..."
                rows="3"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url ?? ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={(formData.tags ?? []).join(', ')}
                  onChange={handleTagsChange}
                  placeholder="react, nextjs, tailwind"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest pl-1">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail ?? ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-sm"
              />
            </div>

            {/* Uploads Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Project Assets & Files</label>
                <button
                  type="button"
                  onClick={handleAddUploadRow}
                  className="text-[10px] font-black uppercase px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                >
                  + Add File
                </button>
              </div>

              <div className="space-y-3">
                {(formData.uploads || []).map((upload, index) => (
                  <div key={index} className="flex gap-3 items-end group bg-zinc-50/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex-[2] space-y-1">
                      <label className="text-[8px] font-bold uppercase text-zinc-500 ml-1">Label</label>
                      <input
                        type="text"
                        placeholder="e.g. .env, Docs"
                        value={upload.label}
                        onChange={(e) => handleUploadLabelChange(index, e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none text-xs font-bold"
                      />
                    </div>
                    <div className="flex-[3] space-y-1">
                      <label className="text-[8px] font-bold uppercase text-zinc-500 ml-1">File</label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full px-3 py-2 border border-dashed rounded-lg text-xs flex items-center justify-between transition-colors ${upload.url ? 'bg-green-500/5 border-green-500/50 text-green-600 dark:text-green-400' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400'}`}>
                          <span className="truncate max-w-[120px]">{upload.fileName || 'Chose File'}</span>
                          {upload.url && (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUpload(index)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mb-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {(!formData.uploads || formData.uploads.length === 0) && (
                  <p className="text-[10px] text-center text-zinc-400 py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    No files uploaded. Click "+ Add File" to start.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="configurable"
                  id="configurable"
                  checked={formData.configurable}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="configurable" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Configurable
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="visible"
                  id="visible"
                  checked={formData.visible}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="visible" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Visible to Public
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 premium-gradient text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all"
                >
                  {isNew ? 'Add Project' : 'Save Changes'}
                </button>
              </div>

              {!isNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`w-full px-6 py-4 font-black uppercase tracking-widest rounded-2xl transition-all ${
                    isDeleting 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  {isDeleting ? 'Click again to Confirm Delete' : 'Delete Project'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

