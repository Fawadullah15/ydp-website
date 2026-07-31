'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';

type Leader = { id: string; name: string; position: string; photo: string | null; bio: string | null };
type ProvinceResponse = { leadership?: Leader[] };

export function ProvinceLeadership({ slug, provinceName, accentClass }: { slug: string; provinceName: string; accentClass: string }) {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/provinces/${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: ProvinceResponse | null) => setLeaders(data?.leadership || []))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <section aria-busy="true" className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"><p className="text-gray-500 dark:text-gray-400">Loading provincial cabinet…</p></section>;
  if (!leaders.length) return <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"><div className="flex items-center gap-3"><Users className={`h-7 w-7 ${accentClass}`} /><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Province Cabinet</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Cabinet members will appear here when they are assigned to {provinceName} from the admin panel.</p></div></div></section>;

  const president = leaders.find((leader) => leader.position.toLowerCase().includes('president')) || leaders[0];
  const cabinet = leaders.filter((leader) => leader.id !== president.id);
  const photo = (leader: Leader) => leader.photo || '/images/fallback-profile.png';

  return <section>
    <div className="mb-8 flex items-center gap-4"><Users className={`h-8 w-8 ${accentClass}`} /><h2 className="text-3xl font-bold text-gray-900 dark:text-white">Provincial Leadership</h2></div>
    <article className="mb-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 md:grid md:grid-cols-[220px_1fr]"><div className="relative h-72 md:h-full md:min-h-[280px]"><Image src={photo(president)} alt={`${president.name} profile photo`} fill sizes="(max-width: 768px) 100vw, 220px" className="object-cover object-top" /></div><div className="flex flex-col justify-center p-7"><p className="mb-3 inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">Province President</p><h3 className="text-2xl font-bold text-gray-900 dark:text-white">{president.name}</h3><p className={`mt-1 font-semibold ${accentClass}`}>{president.position}</p>{president.bio && <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{president.bio}</p>}</div></article>
    <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Cabinet Members</h3>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{cabinet.map((leader) => <article key={leader.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full"><Image src={photo(leader)} alt={`${leader.name} profile photo`} fill sizes="64px" className="object-cover object-top" /></div><div className="min-w-0"><h4 className="truncate font-bold text-gray-900 dark:text-white">{leader.name}</h4><p className={`mt-1 text-sm font-medium ${accentClass}`}>{leader.position}</p></div></article>)}</div>
  </section>;
}
