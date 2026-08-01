"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Target,
  Eye,
  BookOpen,
  Users,
  MapPin,
  HeartHandshake,
  Lightbulb,
  Video,
  Calendar,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [stats, setStats] = useState({ members: 0, provinces: 0, events: 0, volunteers: 0 });
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [subscriber, setSubscriber] = useState({ name: '', email: '' });
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  useEffect(() => {
    fetch('/api/public/home', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((data) => {
      if (!data) return;
      setUpcomingEvents(data.events || []);
      setLatestNews(data.news || []);
      setProvinces(data.provinces || []);
      setLeaders(data.leaders || []);
      setGalleryPreview(data.gallery || []);
      setSponsors(data.sponsors || []);
      setStats(data.stats || {});
      setSiteSettings(data.settings || {});
    }).catch(() => {});
  }, []);

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscriptionMessage('');
    const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscriber) });
    const data = await response.json();
    setSubscriptionMessage(response.ok ? data.message : data.error || 'Unable to subscribe.');
    if (response.ok) setSubscriber({ name: '', email: '' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="overflow-hidden bg-[#f8fafc] font-sans dark:bg-slate-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[680px] min-h-screen w-full items-center overflow-hidden bg-[#0c1b4d]">
        <div className="absolute inset-0 bg-[url('/images/hero-bg-v3.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[#081534]/72"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#081534]/94 via-[#081534]/76 to-[#081534]/28"></div>

        <motion.div style={{ y: yHero }} className="relative z-10 mx-auto mt-16 flex w-full max-w-7xl flex-col items-center px-4 pb-32 text-center sm:px-6 md:pb-20 lg:items-start lg:px-8 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white p-1 shadow-[0_8px_22px_rgba(0,0,0,.24)] sm:h-[88px] sm:w-[88px]">
              <Image src="/images/gallery/ydp-logo.jpg" alt="YDP Logo" width={96} height={96} className="object-contain" priority />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-5 max-w-4xl text-5xl font-extrabold leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]"
          >
            Empowering Youth
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-lg font-bold tracking-[0.01em] text-[#f7c948] sm:text-xl md:text-2xl"
          >
            Shaping the Future of Pakistan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10 max-w-xl text-base leading-relaxed text-slate-100 sm:text-lg lg:mx-0"
          >
            YOUTH DEVELOPMENT PROGRAM
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link href="/membership" className="group inline-flex items-center justify-center rounded-lg bg-[#f7c948] px-7 py-3.5 font-bold text-[#0c1b4d] shadow-[0_8px_20px_rgba(0,0,0,.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffda6a] hover:shadow-[0_12px_25px_rgba(0,0,0,.24)]">
              <span className="relative z-10 flex items-center justify-center">
                Join YDP <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center rounded-lg border border-white/80 bg-transparent px-7 py-3.5 font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#0c1b4d]">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/20 bg-[#0c1b4d]">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-px bg-white/20 md:grid-cols-4">
              {[
                { label: "Members", value: stats.members, Icon: Users },
                { label: "Provinces", value: stats.provinces, Icon: MapPin },
                { label: "Events", value: stats.events, Icon: Calendar },
                { label: "Volunteers", value: stats.volunteers, Icon: HeartHandshake },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-center gap-3 bg-[#0c1b4d] px-3 py-2.5 text-left sm:px-4">
                  <stat.Icon className="h-5 w-5 shrink-0 text-[#f7c948]" aria-hidden="true" />
                  <div><div className="text-2xl font-extrabold leading-none text-white">{stat.value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">{stat.label}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION CARDS */}
      <section className="relative z-20 mx-auto mb-24 max-w-7xl px-4 pt-8 sm:px-6 md:pt-12 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#00bcd4] via-[#0096b2] to-[#087487] p-8 text-white shadow-[0_22px_50px_rgba(0,188,212,.22)] md:p-10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
              <Target className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <Target className="w-12 h-12 mb-6 text-[#FFC107]" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg leading-relaxed text-cyan-50">
                To empower young people with the skills, opportunities, and platforms necessary to become active citizens and visionary leaders. We strive to create an environment where youth can realize their full potential and contribute meaningfully to the socio-economic development of Pakistan.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b2a6b] via-[#142157] to-[#0c1438] p-8 text-white shadow-[0_22px_50px_rgba(20,33,87,.25)] md:p-10"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
              <Eye className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <Eye className="w-12 h-12 mb-6 text-[#00BCD4]" />
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg leading-relaxed text-indigo-100">
                To be the leading catalyst for youth development in Pakistan, fostering a generation of innovative, responsible, and globally-minded leaders who will shape a prosperous and equitable future for our nation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. ABOUT OVERVIEW */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/gallery/group-photo-1.jpg"
                  alt="YDP Members"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-[#00BCD4] font-bold tracking-wider uppercase mb-2">Who We Are</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A6B] dark:text-white mb-6">
                A Premier National Organization
              </h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  The Youth Development Program (YDP) is dedicated to empowering the youth of Pakistan. Founded with the vision of creating a prosperous and inclusive society, YDP operates at the national, provincial, and district levels to foster leadership, civic engagement, and social responsibility.
                </p>
                <p>
                  Through capacity building, policy advocacy, and community service, we aim to shape the future leaders of our nation. We proudly also operate the Human Welfare Organization (HWO), our dedicated welfare wing serving humanity.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/about" className="inline-flex items-center px-8 py-4 bg-[#1B2A6B] text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg">
                  Read Our Story <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. KEY PROGRAMMES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h4 className="text-[#00BCD4] font-bold tracking-wider uppercase mb-2">What We Do</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A6B] dark:text-white mb-6">
              Key Programmes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Comprehensive initiatives designed to nurture talent, build capacity, and drive meaningful change across communities.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Users, title: "Leadership Training", desc: "Leadership training workshops, Youth parliaments.", color: "text-[#1B2A6B]", bg: "bg-blue-100" },
              { icon: Lightbulb, title: "Skills Development", desc: "Career counseling, Digital skills, Entrepreneurship training.", color: "text-[#FFC107]", bg: "bg-yellow-100" },
              { icon: BookOpen, title: "Youth Parliament", desc: "Policy dialogues, Civic education, Democratic engagement.", color: "text-[#00BCD4]", bg: "bg-cyan-100" },
              { icon: Target, title: "Social Welfare", desc: "Volunteer programs, Community service, Humanitarian work.", color: "text-[#4CAF50]", bg: "bg-green-100" },
              { icon: HeartHandshake, title: "Human Welfare (HWO)", desc: "Disaster relief, Food distribution, Medical assistance.", color: "text-red-500", bg: "bg-red-100" },
              { icon: Video, title: "Media & Digital", desc: "Digital skills training, Media literacy, Content creation.", color: "text-purple-500", bg: "bg-purple-100" },
            ].map((prog, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 transform hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${prog.bg} dark:bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <prog.icon className={`w-8 h-8 ${prog.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-[#1B2A6B] dark:text-white mb-4">
                  {prog.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {prog.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. PROVINCES SECTION */}
      <section className="py-24 bg-[#1B2A6B] relative overflow-hidden">
        <div className="absolute inset-0  opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Operating Across Pakistan
            </h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Our network spans across all provinces, ensuring inclusive representation and grassroots impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {provinces.length > 0 ? provinces.map((prov: any, idx: number) => (
              <motion.div
                key={prov.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-pointer"
              >
                <MapPin className="w-8 h-8 text-[#FFC107] mb-4" />
                <h3 className="text-2xl font-bold text-white mb-1">{prov.name}</h3>
                <p className="text-cyan-200 text-sm mb-4">{prov.capital || ''}</p>
                <div className="border-t border-white/20 pt-4 mt-auto">
                  <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">Members</p>
                  <p className="text-white font-medium">{prov._count?.members || 0}+ members</p>
                </div>
              </motion.div>
            )) : [
              { prov: "Punjab", cap: "Lahore" },
              { prov: "KPK", cap: "Peshawar" },
              { prov: "Sindh", cap: "Karachi" },
              { prov: "Balochistan", cap: "Quetta" },
              { prov: "Kashmir", cap: "Muzaffarabad" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group cursor-pointer"
              >
                <MapPin className="w-8 h-8 text-[#FFC107] mb-4" />
                <h3 className="text-2xl font-bold text-white mb-1">{item.prov}</h3>
                <p className="text-cyan-200 text-sm mb-4">{item.cap}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP PREVIEW */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-[#00BCD4] font-bold tracking-wider uppercase mb-2">Our Team</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A6B] dark:text-white">
                Our Leadership
              </h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mt-6 md:mt-0"
            >
              <Link href="/leadership" className="inline-flex items-center font-bold text-[#1B2A6B] dark:text-[#00BCD4] hover:underline">
                Meet Full Team <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.length > 0 ? leaders.map((leader: any, idx: number) => (
              <motion.div
                key={leader.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg"
              >
                <div className="aspect-[3/4] relative">
                  <Image src={leader.photo || '/images/fallback-profile.png'} alt={leader.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100"></div>
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{leader.name}</h3>
                    <p className="text-[#FFC107] font-bold mb-2 drop-shadow-md text-sm">{leader.position}</p>
                    {leader.bio && <p className="text-slate-200 text-xs font-medium drop-shadow-md line-clamp-2">{leader.bio}</p>}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-slate-500 py-12">
                <p>Leadership profiles will appear here once added from the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. HWO SECTION */}
      <section className="py-24 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
          <HeartHandshake className="w-[800px] h-[800px] text-white opacity-5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center text-white">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-lg">
                {/* HWO Logo Placeholder */}
                <div className="flex items-center space-x-2 text-[#4CAF50] font-black text-2xl">
                  <HeartHandshake className="w-8 h-8" />
                  <span>HWO</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Human Welfare Organization
              </h2>
              <h3 className="text-2xl text-[#FFC107] font-semibold mb-6">
                United for Humanity — Powered by YDP
              </h3>
              <p className="text-lg text-green-50 mb-10 leading-relaxed">
                HWO is the dedicated social welfare wing of YDP, committed to alleviating suffering and uplifting marginalized communities across Pakistan. Our volunteers are always on the front lines during times of need.
              </p>
              <Link href="/hwo" className="inline-flex items-center px-8 py-4 bg-white text-[#2E7D32] font-bold rounded-full hover:bg-green-50 transition-all shadow-lg">
                Learn About HWO <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                "Disaster Relief",
                "Food Distribution",
                "Education Support",
                "Medical Assistance",
                "Orphan Support",
                "Clean Water",
              ].map((act, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-center"
                >
                  <div className="text-lg font-bold">{act}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. UPCOMING EVENTS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-[#00BCD4] font-bold tracking-wider uppercase mb-2">Get Involved</h4>
              <h2 className="text-4xl font-bold text-[#1B2A6B] dark:text-white">
                Upcoming Events
              </h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/events" className="hidden md:inline-flex items-center font-bold text-[#1B2A6B] dark:text-[#00BCD4] hover:underline">
                View All Events <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((item: any, idx: number) => {
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <Calendar className="w-12 h-12 text-slate-400" />
                  )}
                  <div className="absolute top-4 right-4 bg-[#FFC107] text-[#1B2A6B] text-xs font-bold px-3 py-1 rounded-full">
                    {item.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[#00BCD4] font-semibold text-sm mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-[#1B2A6B] dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-2" /> {item.venue || item.city || 'TBD'}
                  </div>
                  <Link
                    href={`/events/${item.slug}`}
                    className={`w-full py-3 font-semibold rounded-xl block text-center ${
                      item.registrationOpen
                        ? 'bg-[#1B2A6B] text-white hover:bg-[#152054]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.registrationOpen ? 'Register Now' : 'View Details'}
                  </Link>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. LATEST NEWS */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-[#00BCD4] font-bold tracking-wider uppercase mb-2">Stay Updated</h4>
              <h2 className="text-4xl font-bold text-[#1B2A6B] dark:text-white">
                Latest from YDP
              </h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/news" className="hidden md:inline-flex items-center font-bold text-[#1B2A6B] dark:text-[#00BCD4] hover:underline">
                View All News <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((item: any, idx: number) => {
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700"
              >
                <div className="h-56 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-[#00BCD4] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.type || 'News'}
                  </div>
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="text-slate-500 text-sm mb-3">
                    Published on {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B2A6B] dark:text-white mb-4 group-hover:text-[#00BCD4] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                    {item.excerpt || (item.content ? item.content.substring(0, 120) + '...' : '')}
                  </p>
                  <Link href={`/news/${item.slug}`} className="inline-flex items-center font-bold text-[#1B2A6B] dark:text-white group-hover:text-[#00BCD4]">
                    Read More <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. GALLERY PREVIEW */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Gallery</h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">Glimpses of our impactful journey across the nation.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPreview.map((item, idx) => (
              <Link href="/gallery" key={item.id} className="block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square relative rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.url}
                  alt={item.title || item.album?.title || 'Gallery image'}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#00BCD4] flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-slate-900 transition-all">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 12. VOLUNTEER CTA BANNER */}
      <section className="relative py-32 bg-[#1B2A6B] text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00BCD4] to-[#1B2A6B] opacity-90 animate-gradient-xy"></div>
        <div className="absolute inset-0  mix-blend-overlay opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Be the Change. <br/>
            <span className="text-[#FFC107]">Volunteer with YDP</span>
          </h2>
          <p className="text-xl md:text-2xl text-cyan-50 mb-12 font-light">
            Join thousands of young Pakistanis making a difference in communities nationwide.
          </p>
          <Link href="/volunteer" className="inline-block px-10 py-5 bg-white text-[#1B2A6B] font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Apply as Volunteer
          </Link>
        </motion.div>
      </section>

      {/* 13. PARTNERS & SPONSORS */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest mb-12">Our Partners & Sponsors</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale">
            {sponsors.map((sponsor) => (
              <a key={sponsor.id} href={sponsor.website || undefined} target={sponsor.website ? '_blank' : undefined} rel="noreferrer" className="h-12 w-32 relative flex items-center justify-center">
                {sponsor.logo ? <Image src={sponsor.logo} alt={sponsor.name} fill sizes="128px" className="object-contain" /> : <span className="text-xs font-bold text-slate-500">{sponsor.name}</span>}
              </a>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/partner" className="text-[#00BCD4] font-semibold hover:underline">
              Become a Partner &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 14. NEWSLETTER & 15. CONTACT */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Newsletter */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <h3 className="text-3xl font-bold text-[#1B2A6B] dark:text-white mb-4">Stay Connected</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Subscribe to our newsletter to receive the latest updates on programs, events, and opportunities.</p>
              
              <form className="space-y-4" onSubmit={subscribe}>
                <div>
                  <input required value={subscriber.name} onChange={(event) => setSubscriber((current) => ({ ...current, name: event.target.value }))} type="text" placeholder="Your Name" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#00BCD4] dark:text-white transition-colors" />
                </div>
                <div>
                  <input required value={subscriber.email} onChange={(event) => setSubscriber((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="Your Email Address" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#00BCD4] dark:text-white transition-colors" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors">
                  Subscribe Now
                </button>
                <p className="text-xs text-slate-400 text-center mt-4">We respect your privacy. No spam.</p>
                {subscriptionMessage && <p role="status" className="text-xs text-center text-[#00BCD4]">{subscriptionMessage}</p>}
              </form>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="text-3xl font-bold text-[#1B2A6B] dark:text-white mb-8">Get in Touch</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Mail className="w-6 h-6 text-[#00BCD4]" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Email Us</div>
                    <div className="font-bold text-lg dark:text-white">{siteSettings.contact_email || '—'}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Phone className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Call Us</div>
                    <div className="font-bold text-lg dark:text-white">{siteSettings.contact_phone || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.jpg')]"></div>
                <div className="z-10 text-slate-500 font-bold flex items-center">
                  <MapPin className="mr-2" /> Map Integration
                </div>
              </div>

              <Link href="/contact" className="inline-block border-b-2 border-[#1B2A6B] dark:border-white text-[#1B2A6B] dark:text-white font-bold pb-1 hover:text-[#00BCD4] hover:border-[#00BCD4] transition-colors">
                Go to Contact Page &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

