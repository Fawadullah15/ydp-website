'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, MapPin, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    provinceId: '',
    type: 'Workshop',
    status: 'UPCOMING',
    maxAttendees: 0,
    registrationDeadline: '',
    description: '',
    isRegistrationOpen: true,
    image: '', coverImage: '', registrationMode: 'INTERNAL', registrationLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/provinces').then((response) => response.ok ? response.json() : []).then(setProvinces).catch(() => setProvinces([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title || 'Untitled Event',
        description: formData.description || 'No description',
        startDate: formData.date ? new Date(`${formData.date}T${formData.time || '00:00'}:00`).toISOString() : new Date().toISOString(),
        venue: formData.venue || 'TBA',
        city: formData.city,
        provinceId: formData.provinceId || null,
        type: formData.type,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees as any) : undefined,
        image: formData.image,
        coverImage: formData.coverImage,
        registrationMode: formData.registrationMode,
        registrationLink: formData.registrationLink,
        registrationDeadline: formData.registrationDeadline || undefined,
        status: formData.status,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/events');
      } else {
        const errorData = await res.json();
        let errMsg = errorData.error || 'Validation failed';
        if (errorData.details) {
          const issues = Object.entries(errorData.details)
            .filter(([key]) => key !== '_errors')
            .map(([key, val]: [string, any]) => `- ${key}: ${val._errors?.join(', ')}`)
            .join('\n');
          if (issues) errMsg += '\n\n' + issues;
        }
        alert(errMsg);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Event</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events" className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800">
            Cancel
          </Link>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <RichTextEditor value={formData.description} onChange={(val) => setFormData(p => ({...p, description: val}))} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-gray-800 pb-2">Location</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Venue Name & Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea name="venue" value={formData.venue} onChange={handleChange} rows={2} className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg"></textarea>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Province</label>
                <select name="provinceId" value={formData.provinceId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                  <option value="">National / no province</option>
                  {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-gray-800 pb-2">Event Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Summit">Summit</option>
                <option value="Community Service">Community Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <option value="UPCOMING">Upcoming</option>
                <option value="DRAFT">Draft</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-gray-800 pb-2">Registration</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Open for Registration</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isRegistrationOpen" checked={formData.isRegistrationOpen} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-900 after:border-gray-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Registration Mode</label>
              <select name="registrationMode" value={formData.registrationMode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900"><option value="INTERNAL">Internal Registration</option><option value="EXTERNAL">External Registration</option><option value="CLOSED">Registration Closed</option></select>
            </div>
            {formData.registrationMode === 'EXTERNAL' && <div><label className="block text-sm font-medium text-gray-300 mb-1">Registration Link</label><input required type="url" pattern="https://.*" name="registrationLink" value={formData.registrationLink} onChange={handleChange} placeholder="https://forms.google.com/..." className="w-full px-4 py-2 border border-gray-700 rounded-lg" /></div>}
            {formData.registrationMode === 'INTERNAL' && <div><label className="block text-sm font-medium text-gray-300 mb-1">Registration Closing Date & Time</label><input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg" /></div>}
          </div>
          <ImageUploadField value={formData.image} onChange={(image) => setFormData((current) => ({ ...current, image }))} />
          <ImageUploadField label="Event Cover Image" value={formData.coverImage} onChange={(coverImage) => setFormData((current) => ({ ...current, coverImage }))} />
        </div>
      </div>
    </div>
  );
}
