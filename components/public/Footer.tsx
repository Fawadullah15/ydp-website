"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { fetch('/api/settings').then((response) => response.ok ? response.json() : {}).then(setSettings).catch(() => {}); }, []);
  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await response.json();
    setMessage(response.ok ? data.message : data.error || 'Unable to subscribe.');
    if (response.ok) setEmail('');
  };
  const socialLinks = [
    { key: 'social_facebook', label: 'Facebook', Icon: Facebook },
    { key: 'social_twitter', label: 'Twitter', Icon: Twitter },
    { key: 'social_instagram', label: 'Instagram', Icon: Instagram },
    { key: 'social_linkedin', label: 'LinkedIn', Icon: Linkedin },
    { key: 'social_youtube', label: 'YouTube', Icon: Youtube },
  ];
  return (
    <footer className="relative overflow-hidden bg-[#091333] pb-8 pt-20 text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffc107] to-[#ffcf4a] text-xs font-extrabold text-primary shadow-lg">
                YDP
              </div>
              <div>
                <h3 className="font-heading text-xl font-extrabold tracking-tight">{settings.site_name || 'YOUTH DEVELOPMENT PROGRAM'}</h3>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              {settings.site_description || settings.site_tagline || 'Youth Development Program'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ key, label, Icon }) => settings[key] && <a key={key} href={settings[key]} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-secondary" aria-label={label}><Icon className="w-5 h-5" /></a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-6 text-lg font-bold text-[#ffd25b]">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link prefetch={false} href="/about" className="text-white/80 hover:text-white transition-colors text-sm">About YDP</Link></li>
              <li><Link prefetch={false} href="/leadership" className="text-white/80 hover:text-white transition-colors text-sm">Leadership</Link></li>
              <li><Link prefetch={false} href="/events" className="text-white/80 hover:text-white transition-colors text-sm">Events</Link></li>
              <li><Link prefetch={false} href="/news" className="text-white/80 hover:text-white transition-colors text-sm">News & Updates</Link></li>
              <li><Link prefetch={false} href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <div>
            <h4 className="mb-6 text-lg font-bold text-[#ffd25b]">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  {settings.contact_email && <a href={`mailto:${settings.contact_email}`} className="text-white/80 hover:text-white text-sm">{settings.contact_email}</a>}
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  {settings.contact_phone && <a href={`tel:${settings.contact_phone}`} className="text-white/80 hover:text-white text-sm">{settings.contact_phone}</a>}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm">{settings.contact_address || ''}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <h4 className="mb-3 text-sm font-bold">Subscribe to Newsletter</h4>
              <form className="flex gap-2" onSubmit={subscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="Email address" 
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-200 focus:outline-none"
                />
                <button type="submit" className="btn-secondary whitespace-nowrap">Subscribe</button>
              </form>
              {message && <p role="status" className="mt-2 text-xs text-secondary">{message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-white/60 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Youth Development Program (YDP). All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link prefetch={false} href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link prefetch={false} href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
          <p className="text-white/60 text-sm flex items-center gap-1">
            Made by Fawadullah Imraj
          </p>
        </div>
      </div>
    </footer>
  );
}
