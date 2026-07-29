'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/news/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setNews(prev => prev.filter((n: any) => n.slug !== slug));
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const columns = [
    {
      header: 'Article',
      accessor: (item: any) => (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded bg-gray-800 mr-3 shrink-0 overflow-hidden relative">{item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}</div>
          <div>
            <div className="font-medium text-white line-clamp-1">{item.title}</div>
            <div className="text-gray-400 text-xs mt-1">
              By {item.author?.name ?? 'Unknown'} • {item.category?.name ?? item.category ?? '-'}
            </div>
          </div>
        </div>
      )
    },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: (item: any) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${
            item.status === 'PUBLISHED'
              ? 'bg-green-900/50 text-green-300 ring-green-500/30'
              : 'bg-gray-800 text-gray-400 ring-gray-600/30'
          }`}
        >
          {item.status}
        </span>
      )
    },
    { header: 'Views', accessor: 'views' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <Link href={`/admin/news/${item.slug}`} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </Link>
          <button onClick={() => handleDelete(item.slug)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">News &amp; Blogs</h1>
          <p className="text-gray-400 mt-1">Manage articles, press releases, and blog posts</p>
        </div>
        <Link href="/admin/news/create" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Article
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 outline-none focus:border-blue-500 transition-colors">
              <option value="">All Types</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
              <option value="Press Release">Press Release</option>
            </select>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 outline-none focus:border-blue-500 transition-colors">
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns as any}
          data={news}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
