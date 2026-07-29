'use client';
import React, { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function CreateArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    type: 'News',
    category: 'Programs',
    status: 'PUBLISHED',
    image: '', coverImage: '',
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (status: string) => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title || 'Untitled Article',
        content: content || 'No content provided.',
        category: formData.category,
        type: formData.type,
        status,
        image: formData.image,
        coverImage: formData.coverImage,
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/news');
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
          <Link href="/admin/news" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Article</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave('DRAFT')} disabled={loading} className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={loading} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            <Globe className="w-4 h-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Article Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title..." 
                className="w-full px-4 py-2 text-lg border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-white">Publishing Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Article Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <option value="News">News</option>
                <option value="Blog Post">Blog Post</option>
                <option value="Press Release">Press Release</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <option value="Programs">Programs</option>
                <option value="Events">Events</option>
                <option value="Impact Stories">Impact Stories</option>
              </select>
            </div>
          </div>

          <ImageUploadField value={formData.image} onChange={(image) => setFormData((current) => ({ ...current, image }))} />
          <ImageUploadField label="Article Cover Image" value={formData.coverImage} onChange={(coverImage) => setFormData((current) => ({ ...current, coverImage }))} />
        </div>
      </div>
    </div>
  );
}
