'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, X, Upload, Video } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function UploadModal({
  isOpen,
  onClose,
  albumId,
  onUpload
}: {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  onUpload: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: data });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Upload failed');
        }
        const { url } = await uploadRes.json();
        const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          type: 'item', mediaType: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE', url, title: title || file.name, albumId, isPublic: true,
        }) });
        if (!res.ok) throw new Error('Failed to save media to album');
      }
      onUpload();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Upload Media</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Media Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
              placeholder="Title for the image"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Select files</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              disabled={uploading}
              onChange={handleFileUpload}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 transition-colors"
            />
          </div>
          {uploading && (
            <div className="text-sm text-blue-400 text-center py-2 animate-pulse">
            Uploading media... please wait.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  const [album, setAlbum] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlbumData = async () => {
    try {
      const albumRes = await fetch('/api/gallery');
      if (albumRes.ok) {
        const albums = await albumRes.json();
        const curr = albums.find((a: any) => a.id === albumId);
        if (curr) setAlbum(curr);
      }

      const itemsRes = await fetch(`/api/gallery?albumId=${albumId}`);
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData || []);
      }
    } catch (err) {
      console.error('Failed to fetch album data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) fetchAlbumData();
  }, [albumId]);

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      // Re-using the same delete endpoint logic:
      // However the gallery endpoint handles DELETE by id? Let's check. 
      // Yes, DELETE /api/gallery/[id] can delete an item or album. 
      // Actually we need to make sure the endpoint deletes an item if it's an item ID.
      // We'll call `DELETE /api/gallery/${itemId}?type=item` if needed, but normally it just deletes.
      const res = await fetch(`/api/gallery/${itemId}?type=item`, { method: 'DELETE' });
      if (res.ok) {
        fetchAlbumData();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Link href="/admin/gallery" className="flex items-center text-sm text-gray-400 hover:text-white w-fit transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Gallery
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{album?.title || 'Loading Album...'}</h1>
            <p className="text-gray-400 mt-1">{items.length} items in this album</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No images in this album.</div>
        ) : items.map((item) => (
          <div key={item.id} className="group relative aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {item.type === 'VIDEO' ? <video src={item.url} className="h-full w-full object-cover" muted preload="metadata" /> : <Image src={item.url} alt={item.title || 'Gallery image'} fill className="object-cover" />}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
              <span className="text-white text-sm font-medium text-center truncate w-full mb-3">
                {item.title}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full transition-colors"
                title="Delete media"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumId={albumId}
        onUpload={fetchAlbumData}
      />
    </div>
  );
}
