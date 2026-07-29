'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Activity, User, Clock } from 'lucide-react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/activity?limit=50');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error('Failed to fetch activity logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    {
      header: 'User',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center text-xs font-bold mr-3">
            {item.user?.name?.[0] || 'S'}
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{item.user?.name || 'System'}</div>
            <div className="text-gray-500 text-xs">{item.user?.email || ''}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Action',
      accessor: (item: any) => (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-[#1B2A6B]">
          {item.action}
        </span>
      )
    },
    { header: 'Entity', accessor: (item: any) => item.entity || '-' },
    { header: 'Details', accessor: (item: any) => (
      <div className="truncate max-w-[250px] text-gray-600 text-sm" title={item.details || ''}>
        {item.details || '-'}
      </div>
    )},
    { header: 'IP Address', accessor: (item: any) => item.ipAddress || '-' },
    {
      header: 'Timestamp',
      accessor: (item: any) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {new Date(item.createdAt).toLocaleString()}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500 mt-1">Track all system activity and user actions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCD4] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white">
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns as any} data={logs} isLoading={loading} />
      </div>
    </div>
  );
}
