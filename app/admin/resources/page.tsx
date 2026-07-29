'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Plus, Download, FileText, Trash2, ExternalLink, Edit2, X } from 'lucide-react';

function ResourceModal({ isOpen, onClose, resource, onSave }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: '',
    type: 'DOCUMENT',
    isPublic: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        fileUrl: resource.fileUrl || '',
        fileType: resource.fileType || '',
        type: resource.type || 'DOCUMENT',
        isPublic: resource.isPublic ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        fileUrl: '',
        fileType: '',
        type: 'DOCUMENT',
        isPublic: true,
      });
    }
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = resource ? `/api/resources/${resource.id}` : '/api/resources';
      const method = resource ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        onSave();
        onClose();
      }
    } catch (err) {
      console.error('Failed to save resource', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">{resource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">File URL</label>
            <input required type="url" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">File Type (e.g. pdf)</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.fileType} onChange={e => setFormData({...formData, fileType: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Resource Type</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="DOCUMENT">Document</option>
                <option value="LINK">Link</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isPublic" className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">Make Public</label>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources?limit=50');
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openAddModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource: any) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/resources/${item.id}`, { method: 'DELETE' });
      if (res.ok) fetchResources();
      else alert('Failed to delete resource');
    } catch { alert('An error occurred'); }
  };

  const columns = [
    {
      header: 'Resource',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center mr-3 shrink-0">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-gray-500 text-xs">{item.fileType?.toUpperCase()} • {item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</div>
          </div>
        </div>
      )
    },
    { header: 'Type', accessor: 'type' },
    { header: 'Downloads', accessor: (item: any) => item.downloads || 0 },
    {
      header: 'Visibility',
      accessor: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${item.isPublic ? 'bg-green-900/50 text-green-300 ring-green-500/30' : 'bg-gray-700/50 text-gray-400 ring-gray-500/30'}`}>
          {item.isPublic ? 'Public' : 'Private'}
        </span>
      )
    },
    { header: 'Added', accessor: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded" title="Open">
            <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Resources</h1>
          <p className="text-gray-400 mt-1">Manage downloadable documents and files</p>
        </div>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Upload Resource
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <DataTable columns={columns as any} data={resources} isLoading={loading} />
      </div>

      <ResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={editingResource}
        onSave={fetchResources}
      />
    </div>
  );
}
