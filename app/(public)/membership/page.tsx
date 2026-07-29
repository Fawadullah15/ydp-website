"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Award, CreditCard, Users, Globe, BookOpen, Shield, QrCode, Search } from 'lucide-react';
import Link from 'next/link';

const membershipSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  cnic: z.string().regex(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, 'Format: 00000-0000000-0'),
  dob: z.string().min(1, 'Date of birth required'),
  gender: z.enum(['male', 'female', 'other']),
  province: z.string().min(1, 'Province required'),
  city: z.string().min(1, 'City required'),
  address: z.string().min(5, 'Full address required'),
  education: z.string().min(1, 'Education required'),
  occupation: z.string().min(1, 'Occupation required'),
  skills: z.string(),
  bio: z.string().max(500, 'Max 500 characters'),
  membershipType: z.string().min(1, 'Select a membership type')
});

type FormValues = z.infer<typeof membershipSchema>;

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<FormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: { membershipType: 'general' },
    mode: 'onTouched'
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'cnic', 'dob', 'gender', 'membershipType'];
    if (step === 2) fieldsToValidate = ['province', 'city', 'address'];
    if (step === 3) fieldsToValidate = ['education', 'occupation'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dateOfBirth: data.dob,
          gender: data.gender.toUpperCase(),
          membershipType: data.membershipType.toUpperCase(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit your application.');
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: <Award className="w-6 h-6" />, title: 'Leadership Training', desc: 'Access exclusive workshops and seminars.' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Digital ID Card', desc: 'Unique verifiable membership card.' },
    { icon: <Users className="w-6 h-6" />, title: 'Networking', desc: 'Connect with youth leaders nationwide.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Event Participation', desc: 'Priority access to parliaments and events.' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Certifications', desc: 'Earn recognized certificates for programs.' },
    { icon: <Shield className="w-6 h-6" />, title: 'Community Projects', desc: 'Lead and participate in welfare initiatives.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Hero */}
      <section className="bg-[#1B2A6B] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Join the Movement
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Become a part of Pakistan's premier youth organization and shape the future.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Benefits Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Membership Benefits</h2>
            <div className="w-24 h-1 bg-[#00BCD4] mx-auto mt-4 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-[#1B2A6B] dark:text-[#00BCD4] rounded-lg flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Registration Form Area */}
        <div className="grid lg:grid-cols-3 gap-12" id="register">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Membership Application</h2>
                {/* Stepper */}
                {!isSuccess && (
                  <div className="flex items-center mt-6">
                    {[1, 2, 3, 4].map((s) => (
                      <React.Fragment key={s}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          step >= s ? 'bg-[#00BCD4] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {s}
                        </div>
                        {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-[#00BCD4]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <CheckCircle className="w-20 h-20 text-[#4CAF50] mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Application Submitted!</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                      Thank you for applying to YDP. We will review your application and send a confirmation to your email shortly.
                    </p>
                    <button onClick={() => {setIsSuccess(false); setStep(1);}} className="text-[#00BCD4] font-medium hover:underline">
                      Submit another application
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Step 1 */}
                    <div className={step === 1 ? 'block' : 'hidden'}>
                      <h3 className="text-xl font-semibold mb-6 text-[#1B2A6B] dark:text-[#00BCD4]">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name *</label>
                          <input {...register('firstName')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name *</label>
                          <input {...register('lastName')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email *</label>
                          <input type="email" {...register('email')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone *</label>
                          <input {...register('phone')} placeholder="03XX XXXXXXX" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">CNIC *</label>
                          <input {...register('cnic')} placeholder="XXXXX-XXXXXXX-X" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.cnic && <span className="text-red-500 text-sm">{errors.cnic.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Date of Birth *</label>
                          <input type="date" {...register('dob')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gender *</label>
                          <select {...register('gender')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Membership Type *</label>
                          <select {...register('membershipType')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                            <option value="general">General Member (Free)</option>
                            <option value="associate">Associate Member</option>
                            <option value="life">Life Member</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className={step === 2 ? 'block' : 'hidden'}>
                      <h3 className="text-xl font-semibold mb-6 text-[#1B2A6B] dark:text-[#00BCD4]">Location Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Province *</label>
                          <select {...register('province')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Select Province</option>
                            <option value="punjab">Punjab</option>
                            <option value="sindh">Sindh</option>
                            <option value="kpk">KPK</option>
                            <option value="balochistan">Balochistan</option>
                            <option value="islamabad">Islamabad Capital Territory</option>
                            <option value="gilgit">Gilgit Baltistan</option>
                            <option value="ajk">AJK</option>
                          </select>
                          {errors.province && <span className="text-red-500 text-sm">{errors.province.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">City *</label>
                          <input {...register('city')} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                          {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Complete Address *</label>
                          <textarea {...register('address')} rows={3} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"></textarea>
                          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={step === 3 ? 'block' : 'hidden'}>
                      <h3 className="text-xl font-semibold mb-6 text-[#1B2A6B] dark:text-[#00BCD4]">Professional Background</h3>
                      <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Highest Education *</label>
                            <input {...register('education')} placeholder="e.g. BS Computer Science" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                            {errors.education && <span className="text-red-500 text-sm">{errors.education.message}</span>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Current Occupation *</label>
                            <input {...register('occupation')} placeholder="Student / Professional" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                            {errors.occupation && <span className="text-red-500 text-sm">{errors.occupation.message}</span>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Key Skills (comma separated)</label>
                          <input {...register('skills')} placeholder="e.g. Public Speaking, Writing, Management" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Short Bio / Why do you want to join? (Max 500 chars)</label>
                          <textarea {...register('bio')} rows={4} className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"></textarea>
                          {errors.bio && <span className="text-red-500 text-sm">{errors.bio.message}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Review */}
                    <div className={step === 4 ? 'block' : 'hidden'}>
                      <h3 className="text-xl font-semibold mb-6 text-[#1B2A6B] dark:text-[#00BCD4]">Review & Submit</h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl mb-6 text-sm">
                        <p className="mb-4">Please review your details before submitting. By clicking submit, you agree to abide by the rules and regulations of the Youth Development Program.</p>
                        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                          <div><strong>Name:</strong> {getValues('firstName')} {getValues('lastName')}</div>
                          <div><strong>Email:</strong> {getValues('email')}</div>
                          <div><strong>Location:</strong> {getValues('city')}, {getValues('province')}</div>
                          <div><strong>Type:</strong> <span className="capitalize">{getValues('membershipType')}</span></div>
                        </div>
                      </div>
                    </div>

                    {submitError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{submitError}</p>}
                    <div className="flex justify-between pt-6 border-t dark:border-gray-700">
                      {step > 1 ? (
                        <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-md font-medium dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Back
                        </button>
                      ) : <div></div>}
                      
                      {step < 4 ? (
                        <button type="button" onClick={nextStep} className="px-6 py-2 bg-[#00BCD4] text-white rounded-md font-medium hover:bg-[#0097A7]">
                          Next Step
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#1B2A6B] text-white rounded-md font-medium hover:bg-[#152054] flex items-center">
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <QrCode className="text-[#00BCD4]" /> Verify Membership
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Already a member? Enter your unique ID or scan your card to verify status.
              </p>
              <form className="flex" onSubmit={(event) => {
                event.preventDefault();
                const code = verifyId.trim().toUpperCase();
                if (!code) { setVerifyError('Enter your membership ID to verify it.'); return; }
                setVerifyError('');
                window.location.assign(`/verify/${encodeURIComponent(code)}`);
              }}>
                <input 
                  type="text" 
                  value={verifyId}
                  onChange={(e) => { setVerifyId(e.target.value); if (verifyError) setVerifyError(''); }}
                  placeholder="YDP-XXXXXXXX" 
                  aria-describedby={verifyError ? 'verify-membership-error' : undefined}
                  className="w-full px-3 py-2 rounded-l-md border dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-[#00BCD4]"
                />
                <button type="submit" aria-label="Verify membership" className="bg-[#1B2A6B] text-white px-4 py-2 rounded-r-md flex items-center hover:bg-[#152054] focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              {verifyError && <p id="verify-membership-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{verifyError}</p>}
            </div>

            <div className="bg-[#1B2A6B] text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-[#FFC107]">Membership Types</h3>
              <ul className="space-y-4">
                <li>
                  <strong className="block text-white">General Member</strong>
                  <span className="text-sm text-blue-200">Free. Access to general events and updates.</span>
                </li>
                <li>
                  <strong className="block text-white">Associate Member</strong>
                  <span className="text-sm text-blue-200">PKR 1000/yr. Priority registration, voting rights in local chapters.</span>
                </li>
                <li>
                  <strong className="block text-white">Life Member</strong>
                  <span className="text-sm text-blue-200">One-time fee. All associate benefits for life + special recognition.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
