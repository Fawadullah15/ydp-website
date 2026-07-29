'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, CalendarDays, FolderOpen, Save, Users } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

type Province = {
  id: string; name: string; slug: string; capital: string | null; description: string | null; image: string | null; isActive: boolean;
  _count: { members: number; leadership: number };
};

export default function ProvinceManagementPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const selected = useMemo(() => provinces.find((province) => province.id === selectedId) ?? null, [provinces, selectedId]);

  useEffect(() => {
    fetch('/api/provinces').then((response) => response.ok ? response.json() : []).then((data: Province[]) => {
      setProvinces(data);
      setSelectedId(data[0]?.id ?? '');
    }).catch(() => setMessage('Unable to load provinces.'));
  }, []);

  const update = (patch: Partial<Province>) => selected && setProvinces((items) => items.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true); setMessage('');
    try {
      const response = await fetch(`/api/provinces/${selected.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: selected.name, capital: selected.capital || null, description: selected.description || null, image: selected.image || null, isActive: selected.isActive,
      }) });
      if (!response.ok) throw new Error((await response.json()).error || 'Unable to save province.');
      const updated = await response.json() as Province;
      update(updated); setMessage('Province profile saved. Public pages now use the updated content.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save province.'); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 pb-12">
    <div><h1 className="text-2xl font-bold text-white">Province Management</h1><p className="mt-1 text-gray-400">Manage each province using the existing leadership, event, and gallery records.</p></div>
    {message && <p role="status" className="rounded-lg border border-blue-800 bg-blue-950/30 px-4 py-3 text-sm text-blue-200">{message}</p>}
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border border-gray-800 bg-gray-900 p-3"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Select province</p>{provinces.map((province) => <button key={province.id} onClick={() => { setSelectedId(province.id); setMessage(''); }} className={`mb-1 w-full rounded-lg px-3 py-3 text-left transition ${province.id === selectedId ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}><span className="block font-medium">{province.name}</span><span className="text-xs opacity-75">{province.isActive ? 'Active' : 'Inactive'}</span></button>)}</aside>
      {selected ? <div className="space-y-6">
        <form onSubmit={save} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">Province Information</h2><p className="text-sm text-gray-400">This content is shown on the public province page.</p></div><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save changes'}</button></div>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-gray-300">Province name<input required value={selected.name} onChange={(e) => update({ name: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" /></label><label className="text-sm text-gray-300">Capital<input value={selected.capital || ''} onChange={(e) => update({ capital: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" /></label></div>
          <label className="mt-5 block text-sm text-gray-300">Description<textarea value={selected.description || ''} onChange={(e) => update({ description: e.target.value })} rows={5} className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" /></label>
          <div className="mt-5"><ImageUploadField label="Province cover image" value={selected.image || ''} onChange={(image) => update({ image: image || null })} /></div>
          <label className="mt-5 flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={selected.isActive} onChange={(e) => update({ isActive: e.target.checked })} /> Publicly active</label>
        </form>
        <section className="grid gap-4 sm:grid-cols-3">
          <Link href={`/admin/leadership?provinceId=${selected.id}`} className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-blue-600"><Users className="mb-3 text-blue-400" /><h2 className="font-bold text-white">Cabinet members</h2><p className="mt-1 text-sm text-gray-400">{selected._count.leadership} leadership records. Add, edit, order, or deactivate cabinet members.</p></Link>
          <Link href={`/admin/events?provinceId=${selected.id}`} className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-blue-600"><CalendarDays className="mb-3 text-blue-400" /><h2 className="font-bold text-white">Province events</h2><p className="mt-1 text-sm text-gray-400">Create or publish events using the existing Events module.</p></Link>
          <Link href={`/admin/gallery?provinceId=${selected.id}`} className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-blue-600"><FolderOpen className="mb-3 text-blue-400" /><h2 className="font-bold text-white">Province gallery</h2><p className="mt-1 text-sm text-gray-400">Create albums and assign them to this province.</p></Link>
        </section>
      </div> : <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-gray-400">No provinces are available.</div>}
    </div>
  </div>;
}
