'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Filter, Download, Plus, MoreVertical, Eye, Check, X, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

function MemberModal({ isOpen, onClose, member, onSave }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    city: '',
    status: 'PENDING',
    membershipType: 'GENERAL',
    photo: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phone: member.phone || '',
        cnic: member.cnic || '',
        city: member.city || '',
        status: member.status || 'PENDING',
        membershipType: member.membershipType || 'GENERAL',
        photo: member.photo || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cnic: '',
        city: '',
        status: 'ACTIVE',
        membershipType: 'GENERAL',
        photo: ''
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        const json = await res.json();
        setFormData(prev => ({ ...prev, photo: json.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = member ? `/api/members/${member.id}` : '/api/members';
      const method = member ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert('Failed to save member');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-semibold text-white">{member ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shrink-0">
              {formData.photo ? (
                <img src={formData.photo} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Photo</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upload Photo</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20" />
              {uploading && <span className="text-xs text-blue-400 ml-2">Uploading...</span>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input required type="email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input required type="tel" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CNIC (Optional)</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Membership Type</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.membershipType} onChange={e => setFormData({...formData, membershipType: e.target.value})}>
                <option value="GENERAL">General</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="HONORARY">Honorary</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/members?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        
        const active = (data.members || []).filter((m: any) => m.status === 'ACTIVE').length;
        const pending = (data.members || []).filter((m: any) => m.status === 'PENDING').length;
        const suspended = (data.members || []).filter((m: any) => m.status === 'SUSPENDED').length;
        setStats({ total: data.pagination?.total || (data.members || []).length, active, pending, suspended });
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(prev => prev.filter((m: any) => m.id !== id));
        fetchMembers();
      } else {
        alert('Failed to delete member');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchMembers();
      } else alert('Unable to update the membership application.');
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const records: any[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const params = new URLSearchParams({ page: String(page), limit: '100' });
        if (search.trim()) params.set('search', search.trim());
        if (statusFilter) params.set('status', statusFilter);
        const response = await fetch(`/api/members?${params}`);
        if (!response.ok) throw new Error('Unable to load member records for export.');
        const data = await response.json();
        records.push(...(data.members || []));
        totalPages = data.pagination?.totalPages || 1;
        page += 1;
      } while (page <= totalPages);

      const columns = [
        ['Member ID', 'memberId'], ['First Name', 'firstName'], ['Last Name', 'lastName'], ['Email', 'email'], ['Phone', 'phone'], ['CNIC', 'cnic'], ['Status', 'status'], ['Membership Type', 'membershipType'], ['City', 'city'], ['Province', 'province'], ['Joined At', 'joinedAt'], ['Approved At', 'approvedAt'], ['Expires At', 'expiresAt'],
      ] as const;
      const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const csv = [columns.map(([label]) => escape(label)).join(','), ...records.map((record) => columns.map(([, key]) => escape(record[key])).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `ydp-members-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) { alert(error instanceof Error ? error.message : 'Unable to export members.'); }
    finally { setExporting(false); }
  };

  const columns = [
    {
      header: 'Member',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-700 mr-3 flex items-center justify-center overflow-hidden shrink-0">
            {item.photo ? (
              <img src={item.photo} alt={item.firstName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-medium text-sm">{item.firstName[0]}{item.lastName[0]}</span>
            )}
          </div>
          <div>
            <Link href={`/admin/members/${item.id}`} className="font-medium text-white hover:text-blue-400">
              {item.firstName} {item.lastName}
            </Link>
            <div className="text-gray-400 text-xs mt-0.5">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Member ID',
      accessor: (item: any) => <span className="font-mono text-gray-300 text-sm">{item.memberId || 'N/A'}</span>
    },
    { header: 'City', accessor: (item: any) => <span className="text-gray-300">{item.city || 'N/A'}</span> },
    {
      header: 'Status',
      accessor: (item: any) => {
        const styles = {
          ACTIVE: 'bg-green-900/50 text-green-300 ring-1 ring-green-500/30',
          PENDING: 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/30',
          SUSPENDED: 'bg-red-900/50 text-red-300 ring-1 ring-red-500/30'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[item.status as keyof typeof styles] || styles.PENDING}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      header: 'Joined',
      accessor: (item: any) => <span className="text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          {item.status === 'PENDING' && (
            <>
              <button onClick={() => handleUpdateStatus(item.id, 'ACTIVE')} className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/30 rounded" title="Accept application"><Check className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm(`Reject ${item.firstName} ${item.lastName}'s application?`)) handleUpdateStatus(item.id, 'SUSPENDED'); }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded" title="Reject application"><X className="w-4 h-4" /></button>
            </>
          )}
          <button onClick={() => { setEditingMember(item); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <Link href={`/admin/members/${item.id}`} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded" title="View Details">
            <Eye className="w-4 h-4" />
          </Link>
          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded" title="Delete">
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
          <h1 className="text-2xl font-bold text-white">Members Directory</h1>
          <p className="text-gray-400 mt-1">Manage YDP members, approve registrations, and view profiles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void exportCsv()} disabled={exporting} className="flex items-center px-4 py-2 border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => { setEditingMember(null); setIsModalOpen(true); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="text-sm text-gray-400">Total Members</div>
          <div className="text-2xl font-bold text-white mt-1">{loading ? '...' : stats.total}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{loading ? '...' : stats.active}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="text-sm text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">{loading ? '...' : stats.pending}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="text-sm text-gray-400">Suspended</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{loading ? '...' : stats.suspended}</div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns as any}
          data={members}
          isLoading={loading}
          selectable={true}
        />
      </div>

      <MemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={editingMember}
        onSave={fetchMembers}
      />
    </div>
  );
}
