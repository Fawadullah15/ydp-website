'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, Download, Mail, XCircle, X } from 'lucide-react';

function CertificateModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    type: 'Certificate of Participation',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        recipientName: '',
        recipientEmail: '',
        type: 'Certificate of Participation',
        description: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert('Failed to issue certificate');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Issue Certificate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
            <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2A6B]" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2A6B]" value={formData.recipientEmail} onChange={e => setFormData({...formData, recipientEmail: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
            <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2A6B]" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B2A6B]" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#1B2A6B] text-white rounded-lg hover:bg-[#1B2A6B]/90 font-medium disabled:opacity-50">
              {saving ? 'Issuing...' : 'Issue Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates?limit=50');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error('Failed to fetch certificates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleRevoke = async (item: any) => {
    if (!confirm(`Are you sure you want to revoke certificate ${item.certificateId}?`)) return;
    try {
      const res = await fetch(`/api/certificates/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REVOKED' }),
      });
      if (res.ok) fetchCertificates();
      else alert('Failed to revoke certificate');
    } catch { alert('An error occurred'); }
  };

  const columns = [
    { header: 'Certificate ID', accessor: 'certificateId' },
    { header: 'Recipient', accessor: 'recipientName' },
    { header: 'Type', accessor: (item: any) => item.title || 'General' },
    { header: 'Issued Date', accessor: (item: any) => new Date(item.issuedAt).toLocaleDateString() },
    {
      header: 'Status',
      accessor: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'VALID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <a href={item.verifyUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-[#00BCD4] hover:bg-cyan-50 rounded" title="View/Verify">
            <Search className="w-4 h-4" />
          </a>
          <button className="p-1.5 text-gray-500 hover:text-[#1B2A6B] hover:bg-blue-50 rounded" title="Email Certificate">
            <Mail className="w-4 h-4" />
          </button>
          {item.status === 'VALID' && (
            <button onClick={() => handleRevoke(item)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Revoke">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 mt-1">Issue and manage digital certificates</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-[#1B2A6B] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A6B]/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Issue Certificate
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable columns={columns as any} data={certificates} isLoading={loading} />
      </div>

      <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchCertificates} />
    </div>
  );
}
