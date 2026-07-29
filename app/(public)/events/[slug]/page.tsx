"use client";

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2, Tag, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema)
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        reset();
      } else {
        const result = await res.json();
        setErrorMsg(result.error || 'Failed to register');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="container-custom">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you are looking for does not exist or has been removed.</p>
            <Link href="/events" className="inline-flex items-center text-primary font-medium hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isUpcoming = event.status === 'UPCOMING' && new Date(event.startDate) > new Date();
  const registrationMode = event.registrationMode || (event.registrationOpen ? 'INTERNAL' : 'CLOSED');
  let parsedSpeakers: any[] = [];
  let parsedSchedule: any[] = [];
  
  try {
    if (event.speakers) parsedSpeakers = JSON.parse(event.speakers);
    if (event.schedule) parsedSchedule = JSON.parse(event.schedule);
  } catch (e) {
    console.error("Error parsing speakers or schedule", e);
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container-custom">
        <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl overflow-hidden shadow-md border border-border"
            >
              <div className="h-[300px] sm:h-[400px] relative bg-gray-200 dark:bg-gray-800">
                {event.coverImage || event.image ? (
                  <Image src={event.coverImage || event.image} alt={event.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Calendar className="w-16 h-16 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  {event.status}
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
                  <Tag className="w-4 h-4" />
                  {event.type}
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">{event.title}</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-muted p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{new Date(event.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium text-foreground">{event.venue || event.city || 'TBD'}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                  {event.content ? (
                     <div dangerouslySetInnerHTML={{ __html: event.content }} />
                  ) : (
                     <p>{event.description || 'No description available for this event.'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Schedule Section */}
            {parsedSchedule && parsedSchedule.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 sm:p-8 shadow-md border border-border"
              >
                <h3 className="text-2xl font-bold mb-6 text-foreground">Event Schedule</h3>
                <div className="space-y-6">
                  {parsedSchedule.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-24 shrink-0 font-bold text-primary">{item.time}</div>
                      <div className="w-3 shrink-0 relative flex justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary z-10" />
                        {index !== parsedSchedule.length - 1 && (
                          <div className="absolute top-3 bottom-[-24px] w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium text-foreground">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Speakers Section */}
            {parsedSpeakers && parsedSpeakers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 sm:p-8 shadow-md border border-border"
              >
                <h3 className="text-2xl font-bold mb-6 text-foreground">Speakers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {parsedSpeakers.map((speaker: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                        {speaker.image ? (
                          <Image src={speaker.image} alt={speaker.name} width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                            {speaker.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{speaker.name}</h4>
                        <p className="text-sm text-muted-foreground">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 shadow-md border border-border sticky top-24"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">Registration</h3>
              
              {!isUpcoming ? (
                <div className="bg-muted p-4 rounded-xl text-center">
                  <p className="text-muted-foreground font-medium">This event has already ended.</p>
                </div>
              ) : registrationMode === 'EXTERNAL' && event.registrationLink ? (
                <a href={event.registrationLink} target="_blank" rel="noreferrer" className="w-full btn-primary py-3 flex justify-center items-center">
                  Apply Now
                </a>
              ) : registrationMode === 'CLOSED' ? (
                <div className="bg-muted p-4 rounded-xl text-center">
                  <p className="text-muted-foreground font-medium">Registration is closed.</p>
                </div>
              ) : isSuccess ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-200 dark:border-green-800">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">Registration Successful!</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We have sent a confirmation email with details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                      {errorMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      {...register('name')}
                      type="text"
                      className={`w-full px-4 py-2 rounded-lg bg-background border ${errors.name ? 'border-red-500' : 'border-input'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-2 rounded-lg bg-background border ${errors.email ? 'border-red-500' : 'border-input'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`w-full px-4 py-2 rounded-lg bg-background border ${errors.phone ? 'border-red-500' : 'border-input'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                      placeholder="+92 300 1234567"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !event.registrationOpen}
                    className="w-full btn-primary py-3 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : event.registrationOpen ? (
                      'Register Now'
                    ) : (
                      'Registration Closed'
                    )}
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By registering, you agree to our terms and conditions.
                  </p>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-border flex justify-center">
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share this event
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
