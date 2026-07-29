"use client";

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, Tag, Share2, Facebook, Twitter, Linkedin, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle({
            ...data,
            category: data.category?.name || data.type || 'News',
            date: data.publishedAt || data.createdAt,
            author: data.author?.name || 'YDP Media',
            imageUrl: data.coverImage || data.image || '',
            tags: data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags) : [],
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B2A6B]"></div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This article may have been removed or does not exist.</p>
        <Link href="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A6B] text-white rounded-lg font-medium hover:bg-[#152054] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/news" className="inline-flex items-center text-sm text-gray-500 hover:text-[#1B2A6B] dark:text-gray-400 dark:hover:text-[#00BCD4] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Link>
        </nav>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 md:p-12 pb-8">
            <div className="flex items-center gap-3 mb-6 text-sm">
              <span className="bg-[#1B2A6B]/10 dark:bg-[#1B2A6B]/30 text-[#1B2A6B] dark:text-[#00BCD4] px-3 py-1 rounded-full font-semibold">
                {article.category}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              {article.title}
            </h1>

            <div className="flex items-center justify-between border-t border-b border-gray-100 dark:border-gray-700 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2A6B] flex items-center justify-center text-white font-bold text-sm">
                  {article.author?.charAt(0) || 'Y'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{article.author}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">YDP Media Team</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Share:</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative h-64 md:h-96 w-full bg-gray-200 dark:bg-gray-700">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {article.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed border-l-4 border-[#00BCD4] pl-6">
                {article.excerpt}
              </p>
            )}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-[#1B2A6B] dark:prose-a:text-[#00BCD4]"
              dangerouslySetInnerHTML={{ __html: article.content || article.excerpt || '<p>No content available.</p>' }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400" />
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/news" className="inline-flex items-center gap-2 text-[#1B2A6B] dark:text-[#00BCD4] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
