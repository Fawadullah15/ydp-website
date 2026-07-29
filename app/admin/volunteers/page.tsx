'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Filter, Eye, Check, X, Mail, Trash2 } from 'lucide-react';

function VolunteerViewModal({ volunteer, isOpen, onClose, onUpdateStatus }: any) {
  if (!isOpen || !volunteer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-xl font-bold text-white">Volunteer Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">First Name</p>
              <p className="font-medium text-white">{volunteer.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Name</p>
              <p className="font-medium text-white">{volunteer.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium text-white">{volunteer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium text-white">{volunteer.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Province</p>
              <p className="font-medium text-white">{volunteer.province}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="font-medium text-white">{volunteer.status}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Skills</p>
            <p className="font-medium text-white whitespace-pre-wrap">{volunteer.skills}</p>
          </div>
          {volunteer.experience && (
            <div>
              <p className="text-sm text-gray-400">Experience</p>
              <p className="font-medium text-white whitespace-pre-wrap">{volunteer.experience}</p>
            </div>
          )}
          {volunteer.whyJoin && (
            <div>
              <p className="text-sm text-gray-400">Why Join?</p>
              <p className="font-medium text-white whitespace-pre-wrap">{volunteer.whyJoin}</p>
            </div>
          )}
        </div>
        {volunteer.status === 'PENDING' && (
          <div className="p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900">
            <button
              onClick={() => onUpdateStatus(volunteer._id || volunteer.id, 'REJECTED')}
              className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdateStatus(volunteer._id || volunteer.id, 'APPROVED')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('/api/volunteers?limit=50');
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.volunteers || []);
      }
    } catch (err) {
      console.error('Failed to fetch volunteers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchVolunteers();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer?')) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVolunteers();
        if (selectedVolunteer && (selectedVolunteer._id === id || selectedVolunteer.id === id)) {
          setIsModalOpen(false);
          setSelectedVolunteer(null);
        }
      } else {
        alert('Failed to delete volunteer');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const columns = [
    { header: 'Name', accessor: (item: any) => `${item.firstName} ${item.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Province', accessor: 'province' },
    { 
      header: 'Skills', 
      accessor: (item: any) => (
        <div className="truncate max-w-[200px]" title={item.skills}>{item.skills}</div>
      )
    },
    {
      header: 'Status',
      accessor: (item: any) => {
        const colors: Record<string, string> = {
          APPROVED: 'bg-green-100 text-green-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          REVIEWING: 'bg-blue-100 text-blue-800',
          REJECTED: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${colors[item.status]}`}>
            {item.status}
          </span>
        );
      }
    },
    { header: 'Applied Date', accessor: (item: any) => new Date(item.createdAt || item.appliedAt || Date.now()).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded" 
            title="View Details"
            onClick={() => {
              setSelectedVolunteer(item);
              setIsModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </button>
          {item.status === 'PENDING' && (
            <>
              <button 
                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/30 rounded" 
                title="Approve"
                onClick={() => handleStatusUpdate(item._id || item.id, 'APPROVED')}
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded" 
                title="Reject"
                onClick={() => handleStatusUpdate(item._id || item.id, 'REJECTED')}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title="Send Email">
            <Mail className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded" 
            title="Delete"
            onClick={() => handleDelete(item._id || item.id)}
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
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-500 mt-1">Review and manage volunteer applications</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search volunteers..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns as any} data={volunteers} isLoading={loading} selectable />
      </div>

      <VolunteerViewModal 
        volunteer={selectedVolunteer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}
