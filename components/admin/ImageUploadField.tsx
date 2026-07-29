'use client';

import Image from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

export function ImageUploadField({ value, onChange, label = 'Featured Thumbnail Image' }: { value: string; onChange: (url: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setFailed(false);
    try {
      const data = new FormData(); data.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Image upload failed');
      onChange(result.url);
    } catch (error) { alert(error instanceof Error ? error.message : 'Image upload failed'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };
  return <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
    <h3 className="font-bold text-white mb-4">{label}</h3>
    {value && !failed ? <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-700 mb-3"><Image src={value} alt="Thumbnail preview" fill sizes="(max-width: 1024px) 100vw, 320px" className="object-cover" onError={() => setFailed(true)} /></div> : <button type="button" onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:bg-gray-800"><ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-400">Upload featured image</p></button>}
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="sr-only" onChange={(event) => upload(event.target.files?.[0])} />
    <div className="flex gap-2"><button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="px-3 py-2 text-sm text-blue-300 border border-blue-700 rounded-lg">{uploading ? 'Uploading…' : value ? 'Replace image' : 'Choose image'}</button>{value && <button type="button" onClick={() => { setFailed(false); onChange(''); }} className="px-3 py-2 text-sm text-red-300 border border-red-700 rounded-lg"><Trash2 className="w-4 h-4 inline mr-1" />Remove</button>}</div>
  </div>;
}
