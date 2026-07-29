"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Search, AlertCircle, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

type EventType = 'All' | 'Upcoming' | 'Past';
type ProvinceType = 'All' | 'Punjab' | 'KPK' | 'Sindh' | 'Balochistan' | 'Kashmir';

interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  province: string;
  type: string;
  excerpt: string;
  imageUrl: string;
  status: 'Upcoming' | 'Past';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventType>('All');
  const [provinceFilter, setProvinceFilter] = useState<ProvinceType>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          const mapped = (Array.isArray(data) ? data : []).map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            date: item.startDate,
            location: item.venue || item.city || 'TBD',
            province: item.province?.name || item.city || '',
            type: item.type || 'EVENT',
            excerpt: item.description || (item.content ? item.content.substring(0, 150) + '...' : ''),
            imageUrl: item.image || '',
            status: (item.status === 'UPCOMING' ? 'Upcoming' : 'Past') as 'Upcoming' | 'Past'
          }));
          setEvents(mapped);
        } else {
          setEvents([]);
        }
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
    const matchesProvince = provinceFilter === 'All' || event.province === provinceFilter;

    return matchesSearch && matchesStatus && matchesProvince;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Events & Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Discover and participate in youth empowerment initiatives across Pakistan.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EventType)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] outline-none"
              >
                <option value="All">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
              </select>

              <select 
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value as ProvinceType)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] outline-none"
              >
                <option value="All">All Provinces</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Kashmir">Kashmir</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B2A6B]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Required</h3>
            <p className="text-gray-500 dark:text-gray-400">No events found matching your criteria. Please check back later.</p>
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                    {event.imageUrl ? <Image src={event.imageUrl} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400"><Calendar className="w-10 h-10" /></div>}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow">
                      {event.status}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 text-[#00BCD4] text-sm font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      {event.type}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1B2A6B] dark:text-[#00BCD4]" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1B2A6B] dark:text-[#00BCD4]" />
                        <span>{event.location}, {event.province}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
                      {event.excerpt}
                    </p>
                    
                    <Link 
                      href={`/events/${event.slug}`}
                      className="mt-auto inline-flex justify-center items-center px-4 py-2 bg-[#1B2A6B] hover:bg-[#152054] text-white rounded-md transition-colors w-full font-medium"
                    >
                      {event.status === 'Upcoming' ? 'Register Now' : 'View Details'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
