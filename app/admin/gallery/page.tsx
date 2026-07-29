'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Folder, MoreVertical, X } from 'lucide-react';
import Link from 'next/link';

function GalleryAlbumModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setCoverImage('');
      setProvinceId('');
      setIsPublic(true);
      fetch('/api/provinces').then((response) => response.ok ? response.json() : []).then(setProvinces).catch(() => setProvinces([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'album', title, description, coverImage, isPublic, provinceId: provinceId || null }),
      });
      if (res.ok) {
        onSave();
        onClose();
      } else {
        console.error('Failed to save album');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Create Album</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Province</label>
            <select value={provinceId} onChange={(e) => setProvinceId(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none">
              <option value="">General gallery (not province-specific)</option>
              {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
              placeholder="e.g. Summer Camp 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-colors"
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500/20"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
              Publicly visible
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch albums', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (album: any) => {
    if (!confirm(`Delete album "${album.title}" and all its photos? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/gallery/${album.id}`, { method: 'DELETE' });
      if (res.ok) fetchAlbums();
      else alert('Failed to delete album');
    } catch { alert('An error occurred'); }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-gray-400 mt-1">Manage photo and video albums</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading albums...</div>
        ) : albums.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No albums found.</div>
        ) : albums.map((album: any) => (
          <Link href={`/admin/gallery/${album.id}`} key={album.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group cursor-pointer hover:border-gray-700 transition-colors block">
            <div className="aspect-[4/3] bg-gray-800 relative">
              {album.coverImage ? (
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <Folder className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">View Album</span>
              </div>
            </div>
            <div className="p-4 relative">
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album); }}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors"
                title="Delete album"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-white pr-6 truncate">{album.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <ImageIcon className="w-4 h-4 mr-1.5" />
                <span>{album._count?.items || 0} items</span>
                <span className="mx-2">•</span>
                <span>{new Date(album.createdAt).toLocaleDateString()}</span>
              </div>
              {album.province?.name && <p className="mt-1 text-xs text-blue-300">{album.province.name}</p>}
            </div>
          </Link>
        ))}
      </div>

      <GalleryAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchAlbums}
      />
    </div>
  );
}
