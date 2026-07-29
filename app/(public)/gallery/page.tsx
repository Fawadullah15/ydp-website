"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, ImageIcon, Video, Loader2 } from 'lucide-react';

type MediaType = 'Photos' | 'Videos' | 'All';

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  album: string;
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<MediaType>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery?fetchItems=true');
        if (res.ok) {
          const items = await res.json();
          const mappedItems: MediaItem[] = items.map((item: any) => ({
            id: item.id,
            type: item.type === 'VIDEO' ? 'video' : 'photo',
            url: item.url,
            thumbnail: item.url,
            title: item.title || item.album?.title || 'Gallery Item',
            album: item.album?.title || 'Misc'
          }));
          setMedia(mappedItems);
        }
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredMedia = media.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Photos') return item.type === 'photo';
    if (filter === 'Videos') return item.type === 'video';
    return true;
  });

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const nextMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === filteredMedia.length - 1 ? 0 : prev + 1));
  }, [filteredMedia.length]);

  const prevMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? filteredMedia.length - 1 : prev - 1));
  }, [filteredMedia.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextMedia, prevMedia]);

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
            Media Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Visual highlights from our events, programs, and community initiatives.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700">
            {(['All', 'Photos', 'Videos'] as MediaType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                  filter === f
                    ? 'bg-[#00BCD4] text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {f === 'Photos' && <ImageIcon className="w-4 h-4" />}
                  {f === 'Videos' && <Video className="w-4 h-4" />}
                  {f}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#1B2A6B]" />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No media found</h3>
            <p className="text-gray-500 dark:text-gray-500">Gallery content will appear here once added from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredMedia.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
                  onClick={() => openLightbox(index)}
                >
                  {item.type === 'video' ? <video src={item.url} muted playsInline preload="metadata" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />}

                  {/* Video play icon */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center z-10">
                    {item.type === 'video' ? <Play className="w-10 h-10 mb-2" /> : <ImageIcon className="w-8 h-8 mb-2" />}
                    <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-300 mt-1">{item.album}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && filteredMedia[currentIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
              onClick={closeLightbox}
            >
              <button
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
                onClick={closeLightbox}
              >
                <X className="w-8 h-8" />
              </button>

              <div className="absolute top-4 left-4 text-white z-50">
                <p className="font-semibold">{filteredMedia[currentIndex].title}</p>
                <p className="text-sm text-gray-400">{currentIndex + 1} / {filteredMedia.length}</p>
              </div>

              {filteredMedia.length > 1 && (
                <>
                  <button
                    className="absolute left-4 md:left-8 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50"
                    onClick={prevMedia}
                  >
                    <ChevronLeft className="w-10 h-10" />
                  </button>
                  <button
                    className="absolute right-4 md:right-8 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50"
                    onClick={nextMedia}
                  >
                    <ChevronRight className="w-10 h-10" />
                  </button>
                </>
              )}

              <div
                className="w-full max-w-5xl px-16 md:px-28 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {filteredMedia[currentIndex].type === 'photo' ? (
                  <div className="relative w-full" style={{ maxHeight: '80vh' }}>
                    <img
                      src={filteredMedia[currentIndex].url}
                      alt={filteredMedia[currentIndex].title}
                      className="w-full max-h-[80vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <video
                    src={filteredMedia[currentIndex].url}
                    controls
                    className="w-full max-h-[80vh] bg-black rounded-lg outline-none"
                    autoPlay
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
