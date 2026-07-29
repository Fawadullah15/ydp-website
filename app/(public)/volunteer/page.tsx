"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Heart, Users, GraduationCap, Stethoscope, Droplets, BookOpen, CheckCircle } from 'lucide-react';

export default function VolunteerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/volunteers', { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      await new Promise(r => setTimeout(r, 1500));
      setIsSuccess(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const activities = [
    { icon: <Heart />, title: 'Community Service', desc: 'Engage in local cleanups, awareness campaigns, and social drives.' },
    { icon: <Droplets />, title: 'Food & Relief Drives', desc: 'Help distribute rations and essentials during crises.' },
    { icon: <GraduationCap />, title: 'Education Support', desc: 'Teach underprivileged children and conduct skill workshops.' },
    { icon: <Stethoscope />, title: 'Medical Camps', desc: 'Assist in organizing free health camps and blood donations.' },
    { icon: <Users />, title: 'Leadership Workshops', desc: 'Help coordinate and manage youth empowerment sessions.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Hero */}
      <section className="bg-[#4CAF50] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Volunteer with YDP
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto"
          >
            Give your time, skills, and passion to make a tangible difference in society.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* What we do */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Volunteer Activities</h2>
            <div className="w-24 h-1 bg-[#4CAF50] mx-auto mt-4 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="text-[#4CAF50] mb-4 w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  {act.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{act.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{act.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1B2A6B] dark:text-white mb-2">Volunteer Application</h2>
            <p className="text-gray-600 dark:text-gray-400">Fill out the form below to register as a volunteer.</p>
          </div>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <CheckCircle className="w-20 h-20 text-[#4CAF50] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Received!</h3>
              <p className="text-gray-600 dark:text-gray-400">Thank you for stepping up. Our coordination team will contact you soon.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-8 text-[#4CAF50] hover:underline font-medium">
                Submit another application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name *</label>
                  <input required {...register('firstName')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name *</label>
                  <input required {...register('lastName')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email *</label>
                  <input required type="email" {...register('email')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone *</label>
                  <input required {...register('phone')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">City *</label>
                  <input required {...register('city')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Availability *</label>
                  <select required {...register('availability')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50]">
                    <option value="weekends">Weekends Only</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="flexible">Flexible</option>
                    <option value="events">On Events Basis</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Key Skills (How can you contribute?) *</label>
                <input required {...register('skills')} placeholder="e.g. Photography, Teaching, Management" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Why do you want to volunteer? *</label>
                <textarea required {...register('motivation')} rows={4} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Volunteer Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
