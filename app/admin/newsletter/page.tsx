'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Trash2, Mail, Download } from 'lucide-react';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter/subscribers');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      const res = await fetch(`/api/newsletter/subscribers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSubscribers();
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const columns = [
    {
      header: 'Email',
      accessor: (item: any) => (
        <div className="font-medium text-white">{item.email}</div>
      )
    },
    {
      header: 'Subscribed At',
      accessor: (item: any) => new Date(item.createdAt).toLocaleString()
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded" 
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-900/30 rounded" 
            title="Remove"
          >
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
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-gray-500 mt-1">Manage newsletter subscribers</p>
        </div>
        <button 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>
        <DataTable columns={columns as any} data={subscribers} isLoading={loading} selectable />
      </div>
    </div>
  );
}
