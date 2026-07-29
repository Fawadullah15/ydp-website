'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ImageUp, Mail, Save, Shield, Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type MemberForm = {
  firstName: string; lastName: string; email: string; phone: string; cnic: string;
  dateOfBirth: string; address: string; city: string; province: string; occupation: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'; membershipType: string; photo: string;
};
type MemberResponse = MemberForm & { id: string; memberId: string };
const emptyForm: MemberForm = { firstName: '', lastName: '', email: '', phone: '', cnic: '', dateOfBirth: '', address: '', city: '', province: '', occupation: '', status: 'PENDING', membershipType: 'GENERAL', photo: '' };
const inputClass = 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60';
const uploadUrl = (value: string) => value.startsWith('/uploads/') ? value.replace('/uploads/', '/api/uploads/') : value;

export default function MemberDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const photoInput = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<MemberForm>(emptyForm);
  const [memberId, setMemberId] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setInitialLoading(true);
      try {
        const response = await fetch(`/api/members/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(response.status === 404 ? 'This member could not be found.' : 'Unable to load this member.');
        const member = (await response.json()) as MemberResponse;
        if (!active) return;
        setMemberId(member.memberId);
        setFormData({
          firstName: member.firstName || '', lastName: member.lastName || '', email: member.email || '', phone: member.phone || '', cnic: member.cnic || '',
          dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().slice(0, 10) : '', address: member.address || '', city: member.city || '',
          province: member.province || '', occupation: member.occupation || '', status: member.status || 'PENDING', membershipType: member.membershipType || 'GENERAL', photo: uploadUrl(member.photo || ''),
        });
      } catch (loadError) { if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load this member.'); }
      finally { if (active) setInitialLoading(false); }
    };
    if (id) void load();
    return () => { active = false; };
  }, [id]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setError('Choose an image smaller than 10 MB.'); return; }
    setUploading(true); setError('');
    try {
      const payload = new FormData(); payload.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: payload });
      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error || 'Photo upload failed.');
      setFormData((current) => ({ ...current, photo: body.url as string }));
      setSuccess('Photo uploaded. Save changes to apply it.');
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Photo upload failed.'); }
    finally { setUploading(false); event.target.value = ''; }
  };

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cnic: formData.cnic || null, address: formData.address || null, city: formData.city || null, province: formData.province || null, occupation: formData.occupation || null, photo: formData.photo || null, dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || 'Unable to save member changes.');
      setSuccess('Member details saved successfully.');
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save member changes.'); }
    finally { setSaving(false); }
  };

  if (initialLoading) return <div className="p-6 text-center text-gray-400" role="status">Loading member details…</div>;
  if (error && !memberId) return <div className="space-y-4 p-6"><p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-red-200">{error}</p><Link href="/admin/members" className="text-blue-400 hover:underline">Return to members</Link></div>;

  return <div className="mx-auto max-w-6xl space-y-6 pb-10">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3"><Link href="/admin/members" aria-label="Back to members" className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link><div className="min-w-0"><h1 className="text-2xl font-bold text-white">Member Details</h1><p className="truncate text-sm text-gray-400">{memberId}</p></div></div>
      <div className="flex w-full gap-2 sm:w-auto"><Link href="/admin/members" className="flex-1 rounded-lg border border-gray-700 px-4 py-2.5 text-center text-sm font-semibold text-gray-200 hover:bg-gray-800 sm:flex-none">Cancel</Link><button type="button" onClick={() => void save()} disabled={saving || uploading} className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"><Save className="mr-2 h-4 w-4" />{saving ? 'Saving…' : 'Save changes'}</button></div>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
    {success && <p role="status" className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-200">{success}</p>}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6"><h2 className="mb-5 border-b border-gray-800 pb-3 text-lg font-bold text-white">Personal Information</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {([['firstName','First name','text'],['lastName','Last name','text'],['email','Email','email'],['phone','Phone','tel'],['cnic','CNIC','text'],['dateOfBirth','Date of birth','date']] as const).map(([name,label,type]) => <label key={name} className="block text-sm font-medium text-gray-300">{label}<input required={name !== 'cnic' && name !== 'dateOfBirth'} type={type} name={name} value={formData[name]} onChange={update} className={`${inputClass} mt-1`} /></label>)}</div></section>
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6"><h2 className="mb-5 border-b border-gray-800 pb-3 text-lg font-bold text-white">Address &amp; Location</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-gray-300 sm:col-span-2">Street address<textarea name="address" rows={3} value={formData.address} onChange={update} className={`${inputClass} mt-1 resize-y`} /></label><label className="block text-sm font-medium text-gray-300">City<input name="city" value={formData.city} onChange={update} className={`${inputClass} mt-1`} /></label><label className="block text-sm font-medium text-gray-300">Province<input name="province" value={formData.province} onChange={update} className={`${inputClass} mt-1`} /></label><label className="block text-sm font-medium text-gray-300 sm:col-span-2">Position / occupation<input name="occupation" value={formData.occupation} onChange={update} className={`${inputClass} mt-1`} /></label></div></section>
      </div>
      <aside className="space-y-6">
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6"><div className="mb-5 flex justify-center"><div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-800 shadow-lg">{formData.photo ? <Image src={formData.photo} alt={`${formData.firstName} ${formData.lastName}`} fill sizes="128px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-3xl font-bold text-gray-500">{formData.firstName.slice(0, 1)}{formData.lastName.slice(0, 1)}</div>}</div></div><input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadPhoto} className="hidden" /><button type="button" onClick={() => photoInput.current?.click()} disabled={uploading} className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-800 disabled:opacity-50">{uploading ? <Upload className="h-4 w-4 animate-pulse" /> : <ImageUp className="h-4 w-4" />}{uploading ? 'Uploading…' : 'Upload / replace photo'}</button><div className="space-y-4"><label className="block text-sm font-medium text-gray-300">Status<select name="status" value={formData.status} onChange={update} className={`${inputClass} mt-1`}><option value="ACTIVE">Active</option><option value="PENDING">Pending approval</option><option value="SUSPENDED">Rejected / suspended</option></select></label><label className="block text-sm font-medium text-gray-300">Membership type<input name="membershipType" value={formData.membershipType} onChange={update} className={`${inputClass} mt-1`} /></label></div></section>
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1B2A6B] to-[#00BCD4] p-6 text-white"><Shield className="absolute right-4 top-4 h-16 w-16 opacity-20" /><h2 className="relative mb-4 font-bold">Digital ID Card</h2><div className="relative space-y-2 text-sm"><p><span className="text-white/70">Name:</span> {formData.firstName} {formData.lastName}</p><p className="break-all"><span className="text-white/70">ID:</span> {memberId}</p><p><span className="text-white/70">Type:</span> {formData.membershipType}</p></div><div className="relative mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"><Link href={`/verify/${encodeURIComponent(memberId)}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/30"><ExternalLink className="h-4 w-4" />View public record</Link><a href={`mailto:${encodeURIComponent(formData.email)}?subject=${encodeURIComponent('Your YDP Membership ID')}&body=${encodeURIComponent(`Your YDP Membership ID is ${memberId}. Verify it at ${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${memberId}`)}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm font-semibold hover:bg-black/30"><Mail className="h-4 w-4" />Send by email</a></div></section>
      </aside>
    </div>
  </div>;
}
