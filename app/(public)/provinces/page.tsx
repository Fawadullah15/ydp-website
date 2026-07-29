"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';

interface Province {
  id: string;
  name: string;
  capital: string;
  color: string;
  shadow: string;
}

export default function ProvincesIndexPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch('/api/provinces');
        if (res.ok) {
          const data = await res.json();
          setProvinces(Array.isArray(data) ? data : data.provinces || []);
        }
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProvinces();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm text-white/70 mb-4 space-x-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-[#00BCD4]">Provinces</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Regional Presence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-2xl text-white/80"
          >
            Discover the Youth Development Program's initiatives, leadership, and impact across all provinces of Pakistan.
          </motion.p>
        </div>
      </section>

      {/* Provinces Grid */}
      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {provinces.map((prov, idx) => (
            <motion.div
              key={prov.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Link href={`/provinces/${prov.id}`}>
                <div className={`h-64 rounded-2xl bg-gradient-to-br ${prov.color} p-8 flex flex-col justify-end relative overflow-hidden group shadow-xl ${prov.shadow} transition-transform hover:-translate-y-2`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">{prov.name}</h2>
                    <div className="flex items-center text-white/90">
                      <MapPin size={18} className="mr-2" />
                      <span>{prov.capital}</span>
                    </div>
                  </div>
                  
                  <div className="absolute right-6 bottom-8 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
