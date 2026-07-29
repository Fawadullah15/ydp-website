'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Save, AlertTriangle, Check } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [account, setAccount] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [restoring, setRestoring] = useState(false);
  const [refreshingCache, setRefreshingCache] = useState(false);
  const [liveStats, setLiveStats] = useState({ members: 0, provinces: 0, events: 0, volunteers: 0 });

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Media' },
    { id: 'seo', label: 'SEO' },
    { id: 'content', label: 'Public Content' },
    { id: 'stats', label: 'Display Stats' },
    { id: 'email', label: 'Email (SMTP)' },
    { id: 'account', label: 'Admin Login' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
    fetch('/api/admin/account').then((res) => res.ok ? res.json() : null).then((data) => data && setAccount((current) => ({ ...current, email: data.email || '' }))).catch(() => {});
    fetch('/api/public/home').then((res) => res.ok ? res.json() : null).then((data) => data?.stats && setLiveStats(data.stats)).catch(() => {});
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveAccount = async () => {
    if (account.newPassword && account.newPassword !== account.confirmPassword) return alert('New password and confirmation do not match.');
    setAccountSaving(true);
    try {
      const response = await fetch('/api/admin/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: account.email, currentPassword: account.currentPassword, newPassword: account.newPassword || undefined }) });
      const result = await response.json();
      if (!response.ok) return alert(result.error || 'Unable to update login details.');
      setAccount((current) => ({ ...current, email: result.email, currentPassword: '', newPassword: '', confirmPassword: '' }));
      alert('Admin login details updated successfully.');
    } catch { alert('Unable to update login details.'); } finally { setAccountSaving(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        void fetch('/api/admin/revalidate', { method: 'POST' });
      } else {
        alert('Failed to save settings');
      }
    } catch {
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const refreshPublicCache = async () => {
    setRefreshingCache(true);
    try {
      const response = await fetch('/api/admin/revalidate', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to refresh the cache.');
      alert(result.message);
    } catch (error) { alert(error instanceof Error ? error.message : 'Unable to refresh the cache.'); }
    finally { setRefreshingCache(false); }
  };

  const restoreBackup = async (file?: File) => {
    if (!file) return;
    if (!confirm('Restore this backup? This permanently replaces all current database records and signs you out.')) return;
    setRestoring(true);
    try {
      const backup = JSON.parse(await file.text());
      const response = await fetch('/api/admin/backup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(backup) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Restore failed.');
      alert(result.message || 'Backup restored.');
      window.location.href = '/login';
    } catch (error) { alert(error instanceof Error ? error.message : 'Restore failed.'); }
    finally { setRestoring(false); if (restoreInputRef.current) restoreInputRef.current.value = ''; }
  };

  const field = (key: string, label: string, type: string = 'text', placeholder?: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={settings[key] || ''}
        onChange={e => handleChange(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 outline-none"
      />
    </div>
  );

  const textareaField = (key: string, label: string, placeholder?: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <textarea
        rows={4}
        value={settings[key] || ''}
        onChange={e => handleChange(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 outline-none"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage global website configuration</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setActiveTab('account')} className="px-4 py-2 border border-blue-500/60 text-blue-300 rounded-lg hover:bg-blue-500/10">Admin Login & Password</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-900 text-gray-400">Loading settings...</div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                {field('site_name', 'Site Name', 'text', 'Youth Development Program')}
                {field('site_tagline', 'Tagline', 'text', 'Empowering the youth for a better tomorrow')}
                {textareaField('site_description', 'Description', 'YDP is dedicated to...')}
                {field('site_logo', 'Logo URL', 'url', 'https://...')}
                {field('site_favicon', 'Favicon URL', 'url', 'https://...')}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6 max-w-2xl">
                {field('contact_email', 'Contact Email', 'email', 'info@ydp.org')}
                {field('contact_phone', 'Phone Number', 'tel', '+92 300 0000000')}
                {field('contact_address', 'Office Address', 'text', 'Islamabad, Pakistan')}
                {field('contact_hours', 'Office Hours', 'text', 'Mon-Fri 9am-5pm')}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 max-w-2xl">
                {field('social_facebook', 'Facebook URL', 'url', 'https://facebook.com/ydp')}
                {field('social_twitter', 'Twitter URL', 'url', 'https://twitter.com/ydp')}
                {field('social_instagram', 'Instagram URL', 'url', 'https://instagram.com/ydp')}
                {field('social_linkedin', 'LinkedIn URL', 'url', 'https://linkedin.com/company/ydp')}
                {field('social_youtube', 'YouTube URL', 'url', 'https://youtube.com/ydp')}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6 max-w-2xl">
                {field('seo_title', 'Default Meta Title', 'text', 'Youth Development Program | YDP Pakistan')}
                {textareaField('seo_description', 'Default Meta Description', 'YDP - Empowering young leaders across Pakistan...')}
                {field('seo_keywords', 'Meta Keywords', 'text', 'youth development, Pakistan, YDP, leadership')}
                {field('seo_og_image', 'OG Image URL', 'url', 'https://...')}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6 max-w-2xl">
                <p className="text-sm text-gray-400">These pages are published immediately on the public website.</p>
                {textareaField('hwo_content', 'HWO Page Content')}
                {textareaField('partner_content', 'Partner Page Content')}
                {textareaField('privacy_policy', 'Privacy Policy')}
                {textareaField('terms_of_service', 'Terms of Service')}
                <ImageUploadField label="Mission Photo" value={settings.mission_image || ''} onChange={(mission_image) => handleChange('mission_image', mission_image)} />
                <ImageUploadField label="Founder Photo" value={settings.founder_image || ''} onChange={(founder_image) => handleChange('founder_image', founder_image)} />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6 max-w-2xl">
                <p className="text-sm text-gray-400 mb-4">Set the figures shown on the public landing page. Leave a field blank to use the live database count instead.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {field('stat_members', 'Members Count', 'number', String(liveStats.members))}
                  {field('stat_events', 'Events Organized', 'number', String(liveStats.events))}
                  {field('stat_provinces', 'Provinces Reached', 'number', String(liveStats.provinces))}
                  {field('stat_volunteers', 'Active Volunteers', 'number', String(liveStats.volunteers))}
                </div>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">Current live database counts: {liveStats.members} members, {liveStats.events} events, {liveStats.provinces} provinces, and {liveStats.volunteers} volunteers.</div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <strong>Note:</strong> Email settings are read from environment variables for security. To change these, please update your server's <code>.env</code> file and restart the application.
                </div>
                <div className="space-y-4 opacity-70 pointer-events-none">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">SMTP Host</label>
                    <input type="text" value="smtp.gmail.com" readOnly className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">SMTP Port</label>
                    <input type="text" value="587" readOnly className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sender Email</label>
                    <input type="text" value="Configured in .env" readOnly className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-5 max-w-2xl">
                <p className="text-sm text-gray-400">Change the email used to sign in and/or your password. Enter your current password to confirm either change.</p>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Login Email</label><input type="email" value={account.email} onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))} className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label><input type="password" value={account.currentPassword} onChange={(event) => setAccount((current) => ({ ...current, currentPassword: event.target.value }))} className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">New Password <span className="text-gray-500">(optional)</span></label><input type="password" minLength={8} value={account.newPassword} onChange={(event) => setAccount((current) => ({ ...current, newPassword: event.target.value }))} className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label><input type="password" minLength={8} value={account.confirmPassword} onChange={(event) => setAccount((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full px-4 py-2 border bg-gray-800 border-gray-700 text-white rounded-lg" /></div>
                <button type="button" onClick={saveAccount} disabled={accountSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{accountSaving ? 'Updating…' : 'Update Login Details'}</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-red-800 font-bold flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900 border border-red-900/50">
            <div>
              <h4 className="font-medium text-white">Clear Cache</h4>
              <p className="text-sm text-gray-400">Clears the Next.js data cache for all pages.</p>
            </div>
            <button
              onClick={refreshPublicCache}
              disabled={refreshingCache}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              {refreshingCache ? 'Refreshing...' : 'Refresh Public Cache'}
            </button>
          </div>
          <div className="flex items-center justify-between bg-gray-900 border border-red-900/50">
            <div>
              <h4 className="font-medium text-white">Backup Database</h4>
              <p className="text-sm text-gray-400">Download all application records as a portable JSON backup.</p>
            </div>
            <a href="/api/admin/backup" className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
              Download Backup
            </a>
          </div>
          <div className="flex items-center justify-between bg-gray-900 border border-red-900/50">
            <div>
              <h4 className="font-medium text-white">Restore Database</h4>
              <p className="text-sm text-gray-400">Replaces all current records with a YDP backup file. You will be signed out.</p>
            </div>
            <input ref={restoreInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => restoreBackup(event.target.files?.[0])} />
            <button type="button" disabled={restoring} onClick={() => restoreInputRef.current?.click()} className="px-4 py-2 border border-red-500 text-red-300 hover:bg-red-500/10 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
              {restoring ? 'Restoring…' : 'Restore Backup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
