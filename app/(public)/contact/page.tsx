"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  MapPin, Phone, Mail, ChevronRight, Facebook, Twitter, 
  Instagram, Linkedin, CheckCircle, AlertCircle, ChevronDown 
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const faqs = [
  { q: "How to join YDP?", a: "You can join YDP by filling out the membership form available on our website. Our team will review your application and contact you." },
  { q: "Is YDP free to join?", a: "Yes, basic membership is free. We believe in providing equal opportunities for all youth regardless of their financial background." },
  { q: "What provinces does YDP operate in?", a: "YDP operates across all major provinces including Punjab, Khyber Pakhtunkhwa, Sindh, Balochistan, and Kashmir." },
  { q: "How can I volunteer?", a: "You can select 'Volunteering' in the contact form subject below, or look out for volunteer calls on our social media pages." },
  { q: "How to contact a specific provincial office?", a: "You can reach out via this main contact form and specify the province in your message, and we will route it to the respective provincial president." },
  { q: "What is the Human Welfare Organization?", a: "The Human Welfare Organization (HWO) is our parent/partner organization dedicated to broader community service initiatives." },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <section className="bg-[#1B2A6B] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10  bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center text-sm text-white/70 mb-4 space-x-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-[#00BCD4]">Contact Us</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-2xl mx-auto text-white/80"
          >
            Have a question, suggestion, or want to collaborate? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info & FAQs */}
          <div className="lg:col-span-1 space-y-10">
            {/* Info Cards */}
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
                <div className="bg-[#00BCD4]/10 p-3 rounded-lg text-[#00BCD4]">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                  <a href="mailto:infoyda2024@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-[#00BCD4] transition-colors">infoyda2024@gmail.com</a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
                <div className="bg-[#4CAF50]/10 p-3 rounded-lg text-[#4CAF50]">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Phone</h3>
                  <a href="tel:+923119250771" className="text-gray-600 dark:text-gray-400 hover:text-[#4CAF50] transition-colors">+92 311 9250771</a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start space-x-4">
                <div className="bg-[#FFC107]/10 p-3 rounded-lg text-[#FFC107]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">Pakistan</p>
                </div>
              </motion.div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, href: 'https://www.facebook.com/YDPPakistan', label: 'Facebook' },
                  { Icon: Twitter, href: 'https://twitter.com/YDPPakistan', label: 'Twitter' },
                  { Icon: Instagram, href: 'https://www.instagram.com/YDPPakistan', label: 'Instagram' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/company/ydp-pakistan', label: 'LinkedIn' },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-[#1B2A6B] dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-[#1B2A6B] hover:text-white transition-all duration-300">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">FAQs</h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center border border-green-200 dark:border-green-800">
                  <CheckCircle className="mr-3 w-5 h-5" />
                  Your message has been sent successfully. We will get back to you soon!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center border border-red-200 dark:border-red-800">
                  <AlertCircle className="mr-3 w-5 h-5" />
                  There was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input 
                      {...register('name')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent transition-all outline-none`}
                      placeholder="eg : Ahmad Ali"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                      {...register('email')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent transition-all outline-none`}
                      placeholder="abc@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      {...register('phone')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent transition-all outline-none`}
                      placeholder="+92 3XX XXXXXXX"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                    <select 
                      {...register('subject')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent transition-all outline-none`}
                    >
                      <option value="">Select a subject...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Membership">Membership</option>
                      <option value="Volunteering">Volunteering</option>
                      <option value="Media">Media & Press</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    {...register('message')}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent transition-all outline-none`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-[#1B2A6B] hover:bg-blue-900 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}

