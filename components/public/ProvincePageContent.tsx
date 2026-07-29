'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronRight, ImageIcon, MapPin } from 'lucide-react';
import { ProvinceLeadership } from '@/components/public/ProvinceLeadership';

type Province = {
  id: string;
  name: string;
  slug: string;
  capital: string | null;
  description: string | null;
  image: string | null;
  districts: { id: string; name: string }[];
  events: { id: string; slug: string; title: string; startDate: string; venue: string; city: string | null; image: string | null }[];
  galleryAlbums: { id: string; title: string; slug: string; coverImage: string | null; _count: { items: number } }[];
};

export function ProvincePageContent({ slug }: { slug: string }) {
  const [province, setProvince] = useState<Province | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/provinces/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setProvince(data))
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [slug]);

  if (error) return <main className="container mx-auto min-h-[50vh] px-4 py-24 text-center"><h1 className="text-3xl font-bold">Province not found</h1><Link className="mt-4 inline-block text-blue-600" href="/provinces">View all provinces</Link></main>;
  if (!province) return <main aria-busy="true" className="container mx-auto min-h-[50vh] animate-pulse px-4 py-24"><div className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800" /></main>;

  return <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900">
    <section className="relative overflow-hidden bg-[#112565] py-20 text-white">
      {province.image && <Image src={province.image} alt="" fill priority sizes="100vw" className="object-cover opacity-20" />}
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-6 flex items-center gap-2 text-sm text-white/75"><Link href="/">Home</Link><ChevronRight size={16} /><Link href="/provinces">Provinces</Link><ChevronRight size={16} /><span>{province.name}</span></div>
        <h1 className="text-4xl font-bold md:text-6xl">{province.name}</h1>
        {province.capital && <p className="mt-4 flex items-center gap-2 text-lg text-white/90"><MapPin size={20} /> Capital: {province.capital}</p>}
        {province.description && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/90">{province.description}</p>}
      </div>
    </section>

    <main className="container mx-auto grid gap-12 px-4 pt-14 lg:grid-cols-3">
      <div className="space-y-14 lg:col-span-2">
        <ProvinceLeadership slug={province.slug} provinceName={province.name} accentClass="text-[#00a9c2]" />

        <section>
          <div className="mb-6 flex items-center gap-3"><CalendarDays className="text-[#00a9c2]" /><h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2></div>
          {province.events.length ? <div className="grid gap-5 sm:grid-cols-2">{province.events.map((event) => <Link key={event.id} href={`/events/${event.slug}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative h-44 bg-gray-100 dark:bg-gray-700">{event.image && <Image src={event.image} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />}</div>
            <div className="p-5"><p className="text-sm font-semibold text-[#00a9c2]">{new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(event.startDate))}</p><h3 className="mt-1 font-bold text-gray-900 dark:text-white">{event.title}</h3><p className="mt-2 text-sm text-gray-500">{[event.venue, event.city].filter(Boolean).join(', ')}</p></div>
          </Link>)}</div> : <p className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-500 dark:border-gray-700">No upcoming events have been published for this province.</p>}
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3"><ImageIcon className="text-[#00a9c2]" /><h2 className="text-3xl font-bold text-gray-900 dark:text-white">Photo Gallery</h2></div>
          {province.galleryAlbums.length ? <div className="grid gap-5 sm:grid-cols-2">{province.galleryAlbums.map((album) => <Link key={album.id} href={`/gallery/${album.slug}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="relative h-44 bg-gray-100 dark:bg-gray-700">{album.coverImage && <Image src={album.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-300 group-hover:scale-105" />}</div>
            <div className="p-5"><h3 className="font-bold text-gray-900 dark:text-white">{album.title}</h3><p className="mt-1 text-sm text-gray-500">{album._count.items} photo{album._count.items === 1 ? '' : 's'}</p></div>
          </Link>)}</div> : <p className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-500 dark:border-gray-700">No gallery albums have been published for this province.</p>}
        </section>
      </div>

      <aside><div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"><h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"><MapPin className="h-5 w-5 text-[#00a9c2]" /> Districts Covered ({province.districts.length})</h2><div className="mt-5 flex flex-wrap gap-2">{province.districts.map((district) => <span key={district.id} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-200">{district.name}</span>)}</div></div></aside>
    </main>
  </div>;
}
