'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Plus, Edit, Trash2, GripVertical, X, Upload } from 'lucide-react';

function LeadershipModal({ isOpen, onClose, leader, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    photo: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    level: 'NATIONAL',
    sortOrder: 0,
    isActive: true,
    provinceId: '',
  });
  const [saving, setSaving] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);

  useEffect(() => { fetch('/api/provinces').then((response) => response.ok ? response.json() : []).then(setProvinces).catch(() => {}); }, []);

  useEffect(() => {
    if (leader) {
      setFormData({
        name: leader.name || '',
        position: leader.position || '',
        bio: leader.bio || '',
        photo: leader.photo || '',
        email: leader.email || '',
        phone: leader.phone || '',
        facebook: leader.facebook || '',
        twitter: leader.twitter || '',
        linkedin: leader.linkedin || '',
        instagram: leader.instagram || '',
        level: leader.level || 'NATIONAL',
        sortOrder: leader.sortOrder || 0,
        isActive: leader.isActive ?? true,
        provinceId: leader.provinceId || '',
      });
    } else {
      setFormData({
        name: '',
        position: '',
        bio: '',
        photo: '',
        email: '',
        phone: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        level: 'NATIONAL',
        sortOrder: 0,
        isActive: true,
        provinceId: '',
      });
    }
  }, [leader, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to upload photo');
      setFormData((current) => ({ ...current, photo: result.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to upload photo');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = leader ? `/api/leadership/${leader.id}` : '/api/leadership';
      const method = leader ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        onSave();
        onClose();
      } else {
        const result = await res.json().catch(() => ({}));
        alert(result.error || 'Failed to save leadership profile');
      }
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-semibold text-white">{leader ? 'Edit Profile' : 'Add Profile'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Position/Role</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                <option value="NATIONAL">National Board</option>
                <option value="HWO">Human Welfare Organization</option>
                <option value="PROVINCIAL">Provincial Executive</option>
                <option value="DISTRICT">District Representative</option>
                <option value="AMBASSADOR">Ambassador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Province Cabinet</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.provinceId} onChange={e => setFormData({...formData, provinceId: e.target.value})}>
                <option value="">National / not province-specific</option>
                {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select a province for its president and cabinet members.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Profile photo</label>
              <div className="flex items-center gap-3">
                {formData.photo && <img src={formData.photo} alt="Profile preview" className="w-10 h-10 rounded-full object-cover border border-gray-700" />}
                <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700">
                  <Upload className="w-4 h-4" /> Upload image
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="sr-only" onChange={handlePhotoUpload} disabled={saving} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display order</label>
              <input type="number" min="0" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input type="tel" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Facebook URL</label>
              <input type="url" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Twitter URL</label>
              <input type="url" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
              <input type="url" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Instagram URL</label>
              <input type="url" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="isActive" className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">Active Profile</label>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-800">
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

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [filterLevel, setFilterLevel] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [provinces, setProvinces] = useState<any[]>([]);

  const fetchLeaders = async () => {
    try {
      const res = await fetch('/api/leadership?includeInactive=true', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // data is grouped by level, flatten it for the table
        const flatData = Object.values(data).flat();
        setLeaders(flatData as any);
      }
    } catch (err) {
      console.error('Failed to fetch leaders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
    fetch('/api/provinces').then((response) => response.ok ? response.json() : []).then(setProvinces).catch(() => {});
  }, []);

  const openAddModal = () => {
    setEditingLeader(null);
    setIsModalOpen(true);
  };

  const openEditModal = (leader: any) => {
    setEditingLeader(leader);
    setIsModalOpen(true);
  };

  const handleDelete = async (leader: any) => {
    if (!confirm(`Delete "${leader.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/leadership/${leader.id}`, { method: 'DELETE' });
      if (res.ok) fetchLeaders();
      else alert('Failed to delete leader');
    } catch { alert('An error occurred'); }
  };

  const columns = [
    {
      header: '',
      accessor: () => (
        <GripVertical className="w-4 h-4 text-gray-500 cursor-move" />
      )
    },
    {
      header: 'Leader',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 shrink-0 overflow-hidden">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="font-medium text-white">{item.name}</div>
          </div>
        </div>
      )
    },
    { header: 'Position', accessor: 'position' },
    { header: 'Level', accessor: 'level' },
    { header: 'Province', accessor: (item: any) => item.province?.name || 'National' },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredLeaders = leaders.filter((leader: any) => (!filterLevel || leader.level === filterLevel) && (!provinceFilter || leader.provinceId === provinceFilter));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leadership Profiles</h1>
          <p className="text-gray-400 mt-1">Manage board members and executive committees</p>
        </div>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-2">
          <select 
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg outline-none"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="NATIONAL">National Board</option>
            <option value="HWO">Human Welfare Organization</option>
            <option value="PROVINCIAL">Provincial Executive</option>
            <option value="DISTRICT">District Representative</option>
            <option value="AMBASSADOR">Ambassador</option>
          </select>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg outline-none" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
            <option value="">All Provinces</option>
            {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
          </select>
        </div>
        <DataTable columns={columns as any} data={filteredLeaders} isLoading={loading} />
      </div>

      <LeadershipModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leader={editingLeader}
        onSave={fetchLeaders}
      />
    </div>
  );
}
