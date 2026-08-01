"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, ChevronRight, Mail, Phone, X } from 'lucide-react';

const LeaderCard = ({ leader, delay, onSelect }: { leader: any, delay: number, onSelect: (leader: any) => void }) => {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && leader.photo ? leader.photo : '/images/fallback-profile.png';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onClick={() => onSelect(leader)}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(leader); } }}
      role="button"
      tabIndex={0}
      aria-label={`View ${leader.name}'s profile`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative flex h-48 w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B2A6B] to-[#00BCD4] sm:h-80 lg:h-[22rem]">
        <Image
          src={imageSrc}
          alt={`${leader.name} profile photo`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 space-x-3">
          {leader.facebook && <a onClick={(event) => event.stopPropagation()} href={leader.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-[#00BCD4] transition-colors" aria-label={`${leader.name} on Facebook`}><Facebook size={20} /></a>}
          {leader.twitter && <a onClick={(event) => event.stopPropagation()} href={leader.twitter} target="_blank" rel="noreferrer" className="text-white hover:text-[#00BCD4] transition-colors" aria-label={`${leader.name} on X`}><Twitter size={20} /></a>}
          {leader.instagram && <a onClick={(event) => event.stopPropagation()} href={leader.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-[#00BCD4] transition-colors" aria-label={`${leader.name} on Instagram`}><Instagram size={20} /></a>}
          {leader.linkedin && <a onClick={(event) => event.stopPropagation()} href={leader.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-[#00BCD4] transition-colors" aria-label={`${leader.name} on LinkedIn`}><Linkedin size={20} /></a>}
        </div>
      </div>
      <div className="flex min-h-[140px] sm:min-h-[178px] flex-col p-4 sm:p-6">
        {leader.province && <div className="text-[10px] sm:text-xs font-semibold text-[#00BCD4] mb-1 uppercase tracking-wider">{leader.province}</div>}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">{leader.name}</h3>
        <p className="mb-2 sm:mb-3 min-h-6 text-sm sm:text-base text-[#1B2A6B] font-medium dark:text-[#4CAF50] leading-tight">{leader.role}</p>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-3">{leader.bio}</p>
      </div>
    </motion.div>
  );
};

export default function LeadershipPage() {
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeader, setSelectedLeader] = useState<any | null>(null);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const response = await fetch('/api/leadership', { cache: 'no-store' });
        if (response.ok) {
          const apiData = await response.json();
          if (apiData && typeof apiData === 'object' && !apiData.error) {
            const keys = Object.keys(apiData);
            if (keys.length > 0) {
              // Map level keys to human readable titles
              const titleMap: Record<string, string> = {
                NATIONAL: 'Central Executive Committee',
                CEC: 'Central Executive Committee',
                HWO: 'Human Welfare Organization',
                AMBASSADOR: 'Brand Ambassadors',
                AMBASSADORS: 'Brand Ambassadors',
                PROVINCIAL: 'Provincial Presidents',
                REGIONAL: 'Regional Directors',
                cec: 'Central Executive Committee',
                ambassadors: 'Brand Ambassadors',
                provincial: 'Provincial Presidents',
                regional: 'Regional Directors',
              };
              // map leader fields from DB to what LeaderCard expects
              const mapLeader = (l: any) => ({
                id: l.id,
                name: l.name,
                role: l.position || l.role,
                bio: l.bio || '',
                photo: l.photo || '',
                province: l.province?.name || '',
                email: l.email || '', phone: l.phone || '',
                facebook: l.facebook || '', twitter: l.twitter || '', linkedin: l.linkedin || '', instagram: l.instagram || '',
              });
              const newSections = keys.map(key => ({
                title: titleMap[key] || key,
                data: Array.isArray(apiData[key]) ? apiData[key].map(mapLeader) : [],
              }));
              setSections(newSections);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch leadership data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10  bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm text-white/70 mb-4 space-x-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-[#00BCD4]">Leadership</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Leadership
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-2xl text-white/80"
          >
            Meet the dedicated individuals driving the Youth Development Program forward, committed to empowering the next generation of leaders.
          </motion.p>
        </div>
      </section>

      {/* Leadership Sections */}
      <div className="container mx-auto px-4 mt-12 space-y-24">
        {loading ? <p className="text-center text-gray-500 dark:text-gray-400">Loading leadership profiles…</p> : sections.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400">Leadership profiles will appear here once they are published.</p> : sections.map((section, idx) => (
          <section key={idx}>
            <div className="flex items-center space-x-4 mb-10">
              <div className="h-10 w-2 bg-[#00BCD4] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {(section.data || []).map((leader: any, i: number) => (
                <LeaderCard key={leader.id} leader={leader} delay={i * 0.1} onSelect={setSelectedLeader} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {selectedLeader && <div className="fixed inset-0 z-[60] flex items-end bg-black/65 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${selectedLeader.name} profile`} onClick={() => setSelectedLeader(null)}>
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900 sm:rounded-2xl">
          <div className="grid md:grid-cols-[minmax(220px,0.8fr)_1.2fr]"><div className="relative min-h-[300px] bg-[#1B2A6B]"><Image src={selectedLeader.photo || '/images/fallback-profile.png'} alt={`${selectedLeader.name} profile photo`} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover object-top" /></div><div className="relative p-7 sm:p-9"><button type="button" onClick={() => setSelectedLeader(null)} className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white" aria-label="Close profile"><X className="h-5 w-5" /></button>{selectedLeader.province && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00BCD4]">{selectedLeader.province}</p>}<h2 className="pr-8 text-3xl font-bold text-gray-900 dark:text-white">{selectedLeader.name}</h2><p className="mt-2 font-semibold text-[#1B2A6B] dark:text-[#4CAF50]">{selectedLeader.role}</p><p className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300">{selectedLeader.bio || 'Profile information will be available soon.'}</p><div className="mt-6 space-y-2 text-sm">{selectedLeader.email && <a href={`mailto:${selectedLeader.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#00BCD4] dark:text-gray-300"><Mail className="h-4 w-4" />{selectedLeader.email}</a>}{selectedLeader.phone && <a href={`tel:${selectedLeader.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#00BCD4] dark:text-gray-300"><Phone className="h-4 w-4" />{selectedLeader.phone}</a>}</div><div className="mt-6 flex gap-4 text-[#1B2A6B] dark:text-[#00BCD4]">{selectedLeader.facebook && <a href={selectedLeader.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>}{selectedLeader.twitter && <a href={selectedLeader.twitter} target="_blank" rel="noreferrer" aria-label="X"><Twitter /></a>}{selectedLeader.instagram && <a href={selectedLeader.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>}{selectedLeader.linkedin && <a href={selectedLeader.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>}</div></div></div>
        </motion.article>
      </div>}
    </div>
  );
}

