"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, HeartHandshake, ShieldAlert, Utensils, Stethoscope, BookOpen, Users, Droplets } from 'lucide-react';

const HWO_INITIATIVES = [
  {
    title: "Disaster Relief and Emergency Response",
    icon: ShieldAlert,
    desc: "Rapid deployment of resources and aid to communities affected by natural disasters and emergencies.",
    color: "text-red-500",
    bg: "bg-red-100"
  },
  {
    title: "Food Distribution Drives",
    icon: Utensils,
    desc: "Ensuring food security by organizing regular distribution of nutritious meals to vulnerable populations.",
    color: "text-orange-500",
    bg: "bg-orange-100"
  },
  {
    title: "Medical Assistance and Health Camps",
    icon: Stethoscope,
    desc: "Providing free healthcare checkups, essential medicines, and medical support to those in need.",
    color: "text-blue-500",
    bg: "bg-blue-100"
  },
  {
    title: "Education Support",
    icon: BookOpen,
    desc: "Offering educational resources, scholarships, and support for underprivileged communities.",
    color: "text-purple-500",
    bg: "bg-purple-100"
  },
  {
    title: "Orphan, Widow, and Elderly Support",
    icon: Users,
    desc: "Dedicated programs focused on the wellbeing, financial assistance, and emotional support of vulnerable groups.",
    color: "text-pink-500",
    bg: "bg-pink-100"
  },
  {
    title: "Clean Water and Sanitation",
    icon: Droplets,
    desc: "Installing water pumps and sanitation facilities in remote areas to ensure access to safe drinking water.",
    color: "text-cyan-500",
    bg: "bg-cyan-100"
  }
];

export default function HwoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-repeat bg-[url('/images/hero-pattern.svg')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm text-white/70 mb-4 space-x-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-[#00BCD4]">Human Welfare</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-4"
          >
            <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
              <HeartHandshake className="w-8 h-8 text-[#00BCD4]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Human Welfare Organization
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-3xl text-white/80 leading-relaxed"
          >
            The Human Welfare Organisation operates as a registered wing under the Youth Development Program (YDP). It focuses on humanitarian assistance and social development with the objective of serving humanity beyond boundaries.
          </motion.p>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HWO_INITIATIVES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full group"
            >
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Call to Action */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1B2A6B] to-[#00BCD4] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <HeartHandshake className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Our Cause</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Join hands with the Human Welfare Organization to make a tangible difference in the lives of those who need it most.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/volunteer" 
                className="bg-[#FFC107] text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
              >
                Become a Volunteer
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/20 backdrop-blur-md text-white font-bold py-3 px-8 rounded-full hover:bg-white/30 transition-colors shadow-lg border border-white/30"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
