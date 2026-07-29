'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors');
      if (res.ok) {
        const data = await res.json();
        setSponsors(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sponsors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/sponsors/${item.id}`, { method: 'DELETE' });
      if (res.ok) fetchSponsors();
      else alert('Failed to delete sponsor');
    } catch { alert('An error occurred'); }
  };

  const columns = [
    {
      header: 'Sponsor',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3 shrink-0 overflow-hidden">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs font-bold text-gray-500">LOGO</span>
            )}
          </div>
          <div className="font-medium text-white">{item.name}</div>
        </div>
      )
    },
    {
      header: 'Tier',
      accessor: (item: any) => {
        const colors: Record<string, string> = {
          PLATINUM: 'bg-purple-900/50 text-purple-300 ring-1 ring-purple-500/30',
          GOLD: 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/30',
          SILVER: 'bg-gray-700/50 text-gray-300 ring-1 ring-gray-500/30',
          BRONZE: 'bg-orange-900/50 text-orange-300 ring-1 ring-orange-500/30'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[item.tier] || 'bg-gray-700/50 text-gray-300 ring-1 ring-gray-500/30'}`}>
            {item.tier}
          </span>
        );
      }
    },
    {
      header: 'Website',
      accessor: (item: any) => item.website ? (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm truncate max-w-[200px] block">
          {item.website.replace('https://', '').replace('http://', '')}
        </a>
      ) : 'N/A'
    },
    {
      header: 'Status',
      accessor: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${item.isActive ? 'bg-green-900/50 text-green-300 ring-green-500/30' : 'bg-red-900/50 text-red-300 ring-red-500/30'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded" 
            title="Edit"
            onClick={() => {
              setSelectedSponsor(item);
              setIsModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-white">Sponsors &amp; Partners</h1>
          <p className="text-gray-400 mt-1">Manage sponsors, partners, and collaborators</p>
        </div>
        <button 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            setSelectedSponsor(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <DataTable columns={columns as any} data={sponsors} isLoading={loading} />
      </div>

      <SponsorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchSponsors} 
        initialData={selectedSponsor} 
      />
    </div>
  );
}

const SponsorModal = ({ isOpen, onClose, onSave, initialData }: { isOpen: boolean, onClose: () => void, onSave: () => void, initialData?: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    tier: 'BRONZE',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        logo: initialData.logo || '',
        website: initialData.website || '',
        tier: initialData.tier || 'BRONZE',
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        logo: '',
        website: '',
        tier: 'BRONZE',
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData?.id ? `/api/sponsors/${initialData.id}` : '/api/sponsors';
      const method = initialData?.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onSave();
        onClose();
      } else {
        console.error('Failed to save');
      }
    } catch (err) {
      console.error('Error saving', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-4">{initialData ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input required type="text" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL</label>
            <input type="url" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
            <input type="url" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tier</label>
            <select className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})}>
              <option value="BRONZE">Bronze</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isActive" className="mr-2 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Active</label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
