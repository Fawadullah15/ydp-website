"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, AlertCircle, ArrowRight, User, Calendar } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ['All', 'Announcements', 'Activities', 'Press Release', 'Interviews'];



export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          // Map backend schema to what the frontend expects
          const mappedData = data.map((item: any) => ({
            ...item,
            excerpt: item.excerpt || (item.content ? item.content.substring(0, 150) + '...' : 'No content'),
            category: item.category?.name || item.type || 'News',
            date: item.publishedAt || item.createdAt,
            author: item.author?.name || 'YDP Media',
            imageUrl: item.image || '',
            featured: false
          }));
          if (mappedData.length > 0) mappedData[0].featured = true;
          setAllNews(mappedData);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
  
  const filteredNews = allNews.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredNews.find(p => p.featured) || filteredNews[0];
  const regularPosts = filteredNews.filter(p => p.id !== featuredPost?.id);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            News & Updates
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Stay informed with the latest activities, announcements, and achievements from YDP.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-[#00BCD4] text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow text-center border border-gray-100 dark:border-gray-700">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
            <p className="text-gray-500 dark:text-gray-400">No articles found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (Only on page 1 and if exists) */}
            {currentPage === 1 && featuredPost && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row group"
              >
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  {featuredPost.imageUrl ? (
                    <Image src={featuredPost.imageUrl} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Feature Image
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-[#1B2A6B]/10 dark:bg-[#1B2A6B]/30 text-[#1B2A6B] dark:text-[#00BCD4] rounded-full text-sm font-semibold mb-4 w-fit">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#1B2A6B] dark:group-hover:text-[#00BCD4] transition-colors">
                    <Link href={`/news/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" /> {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Link href={`/news/${featuredPost.slug}`} className="text-[#00BCD4] hover:text-[#0097A7] font-semibold flex items-center gap-1">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {post.imageUrl ? (
                      <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Image</div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-[#1B2A6B] dark:text-[#00BCD4]">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#1B2A6B] dark:group-hover:text-[#00BCD4] transition-colors line-clamp-2">
                      <Link href={`/news/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-grow">
                      {post.excerpt}
                    </p>
                    <Link href={`/news/${post.slug}`} className="text-[#1B2A6B] dark:text-[#00BCD4] hover:underline font-medium text-sm flex items-center gap-1 mt-auto">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-md font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#1B2A6B] text-white' 
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
