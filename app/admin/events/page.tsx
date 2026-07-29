'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, MapPin, Calendar, Users, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(prev => prev.filter((e: any) => e.slug !== slug));
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const columns = [
    {
      header: 'Event',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded bg-gray-800 mr-3 shrink-0 overflow-hidden relative">{item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}</div>
          {!item.image && <div className="w-12 h-12 rounded bg-gray-800 mr-3 shrink-0 flex items-center justify-center"><Calendar className="w-5 h-5 text-gray-400" /></div>}
          <div>
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-gray-400 text-xs mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {[item.venue, item.province?.name || 'National'].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: (item: any) => {
        const colors: Record<string, string> = {
          UPCOMING: 'bg-blue-900/50 text-blue-300 ring-1 ring-blue-500/30',
          COMPLETED: 'bg-green-900/50 text-green-300 ring-1 ring-green-500/30',
          CANCELLED: 'bg-red-900/50 text-red-300 ring-1 ring-red-500/30'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[item.status]}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      header: 'Attendees',
      accessor: (item: any) => (
        <div className="flex items-center text-gray-300">
          <Users className="w-4 h-4 mr-1.5 text-gray-400" />
          {item.attendees}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/events/${item.slug}`} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </Link>
          <button onClick={() => handleDelete(item.slug)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors">
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
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-gray-400 mt-1">Manage YDP events, workshops, and summits</p>
        </div>
        <Link href="/admin/events/create" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 outline-none focus:border-blue-500 transition-colors">
              <option value="">All Provinces</option>
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="KZN">KwaZulu-Natal</option>
            </select>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 outline-none focus:border-blue-500 transition-colors">
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns as any} data={events} isLoading={loading} />
      </div>
    </div>
  );
}
