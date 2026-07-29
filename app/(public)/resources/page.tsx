"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FileArchive, File as FileIcon, Search, Filter } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  type?: string;
  isPublic?: boolean;
  createdAt: string;
}

export default function ResourcesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'DOCUMENT', 'FORM', 'REPORT', 'PRESENTATION', 'OTHER'];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || data || []);
        }
      } catch (err) {
        console.error('Failed to fetch resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(r => {
    const matchFilter = filter === 'All' || r.type === filter || r.fileType === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch && r.isPublic !== false;
  });

  const getIcon = (type?: string) => {
    if (type === 'zip' || type === 'rar') return FileArchive;
    if (type === 'pdf' || type === 'DOCUMENT') return FileText;
    return FileIcon;
  };

  const getColor = (type?: string) => {
    const colors: Record<string, string> = {
      DOCUMENT: 'text-blue-400 bg-blue-500/10',
      FORM: 'text-green-400 bg-green-500/10',
      REPORT: 'text-purple-400 bg-purple-500/10',
      PRESENTATION: 'text-amber-400 bg-amber-500/10',
    };
    return colors[type || ''] || 'text-gray-400 bg-gray-500/10';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <section className="bg-[#1B2A6B] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Resources & Downloads
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Access official documents, forms, reports, and promotional materials.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00BCD4]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === c 
                  ? 'bg-[#00BCD4] text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <FileIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No resources found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, i) => {
              const Icon = getIcon(resource.fileType || resource.type);
              const colorClass = getColor(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#1B2A6B] dark:group-hover:text-[#00BCD4] transition-colors line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  {resource.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {resource.type || resource.fileType || 'DOCUMENT'}
                    </span>
                    {resource.fileUrl ? (
                      <a
                        href={resource.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-[#00BCD4] hover:text-[#00BCD4]/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
