"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  Eye,
  ShieldCheck,
  Globe,
  HeartHandshake,
  MessageSquare,
  Landmark,
  Scale,
} from "lucide-react";

export default function AboutPage() {
  const [images, setImages] = useState({ mission: '/images/gallery/group-photo-1.jpg', founder: '/images/hamza-rehman.jpg' });
  useEffect(() => {
    fetch('/api/settings').then((response) => response.ok ? response.json() : {}).then((settings: Record<string, string>) => setImages({
      mission: settings.mission_image || '/images/gallery/group-photo-1.jpg',
      founder: settings.founder_image || '/images/hamza-rehman.jpg',
    })).catch(() => {});
  }, []);
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* 1. Hero Banner */}
      <section className="relative h-[30vh] min-h-[220px] md:h-[40vh] md:min-h-[320px] flex items-center justify-center bg-[#1B2A6B] overflow-hidden">
        <div className="absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A6B] to-[#00BCD4] opacity-80" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 md:mb-4"
          >
            About YDP
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-2 text-xs md:text-base font-medium"
          >
            <Link href="/" className="hover:text-[#FFC107] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#00BCD4]">About Us</span>
          </motion.div>
        </div>
      </section>

      {/* 2. What is YDP */}
      <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-3 md:mb-6">
            What is YDP?
          </h2>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The Youth Development Program (YDP) is a premier national organization dedicated to
            empowering the youth of Pakistan. Founded with the vision of creating a prosperous
            and inclusive society, YDP operates at the national, provincial, and district levels
            to foster leadership, civic engagement, and social responsibility among young people.
            Through capacity building, policy advocacy, and community service, we aim to shape
            the future leaders of our nation.
          </p>
        </motion.div>
      </section>


      {/* 3. History & Timeline */}
      <section className="py-10 md:py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-2 md:mb-4">
              Our Journey
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              The milestones that shape our history and drive our future.
            </p>
          </motion.div>

          {/* Historical Background — Bullet Point Format */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto mb-8 md:mb-16 bg-slate-50 dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-12 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <ul className="space-y-4 md:space-y-7">
              {[
                {
                  year: "2020",
                  title: "YDP Established",
                  desc: "Founded as a youth-led initiative under the Human Welfare Organization (HWO), with a vision to empower young Pakistanis through leadership, education, and civic engagement.",
                },
                {
                  year: "2021",
                  title: "HWO Partnership Formalized",
                  desc: "Human Welfare Organization officially launched as the parent organization, broadening YDP's community service reach and institutional support.",
                },
                {
                  year: "2022",
                  title: "Capacity-Building Programs Launched",
                  desc: "Rolled out workshops, leadership training, career guidance, digital skills development, health awareness campaigns, and environmental initiatives nationwide.",
                },
                {
                  year: "2023",
                  title: "National Provincial Expansion",
                  desc: "Successfully expanded operations across all 5 provinces of Pakistan — Punjab, Khyber Pakhtunkhwa, Sindh, Balochistan, and Kashmir — with dedicated provincial teams and councils.",
                },
                {
                  year: "2024",
                  title: "Institutional Partnerships",
                  desc: "Established partnerships with public institutions, civil society organizations, and community leaders, amplifying impact through conferences, seminars, and policy dialogues.",
                },
                {
                  year: "2026 – Present",
                  title: "1000+ Members & Growing",
                  desc: "Achieved a milestone of 1000+ registered members nationwide, with YDP continuing to grow as Pakistan's premier dynamic youth empowerment platform.",
                },
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 md:gap-4">
                  <div className="mt-1.5 shrink-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#00BCD4]" />
                  <div>
                    <span className="inline-block mb-0.5 md:mb-1 text-xs font-bold uppercase tracking-widest text-[#00BCD4]">
                      {point.year}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-[#1B2A6B] dark:text-white mb-0.5 md:mb-1">
                      {point.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>




      {/* 4. Mission & Vision — side by side on mobile */}
      <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-3 md:mb-6 flex items-center gap-2 md:gap-4">
              <Target className="w-6 h-6 md:w-10 md:h-10 text-[#00BCD4] shrink-0" />
              Our Mission
            </h2>
            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-300 mb-4 md:mb-8 leading-relaxed">
              To empower young people with the skills, opportunities, and platforms
              necessary to become active citizens and visionary leaders. We strive to
              create an environment where youth can realize their full potential and
              contribute meaningfully to the socio-economic development of Pakistan.
            </p>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[
                "Youth Empowerment",
                "Skill Development",
                "Civic Engagement",
                "Policy Advocacy",
                "Social Welfare",
                "Global Integration",
              ].map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2 py-2 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CAF50] shrink-0" />
                  <span className="font-medium text-xs md:text-base text-slate-800 dark:text-slate-200 leading-tight">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-52 sm:h-72 md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-slate-200 dark:bg-slate-700 mt-4 md:mt-0"
          >
            <Image src={images.mission} alt="YDP mission in action" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 5. Vision */}
      <section className="py-10 md:py-20 bg-[#1B2A6B] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Eye className="w-10 h-10 md:w-16 md:h-16 text-[#FFC107] mx-auto mb-3 md:mb-6" />
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-8">Our Vision</h2>
            <p className="text-base md:text-2xl font-light leading-relaxed text-slate-200">
              "To be the leading catalyst for youth development in Pakistan, fostering a
              generation of innovative, responsible, and globally-minded leaders who will
              shape a prosperous and equitable future for our nation."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6. Core Values */}
      <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-2 md:mb-4">
            Our Core Values
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            The principles that guide our actions and decisions.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 lg:gap-8"
        >
          {[
            { icon: Users, title: "Youth Leadership", color: "text-[#00BCD4]", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
            { icon: ShieldCheck, title: "Transparency & Accountability", color: "text-[#4CAF50]", bg: "bg-green-50 dark:bg-green-900/20" },
            { icon: Globe, title: "Inclusive Growth", color: "text-[#FFC107]", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
            { icon: HeartHandshake, title: "Social Responsibility", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
            { icon: MessageSquare, title: "Civic Engagement", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
            { icon: Landmark, title: "National Unity", color: "text-[#1B2A6B]", bg: "bg-blue-50 dark:bg-blue-900/20" },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="p-3 md:p-8 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 text-center"
            >
              <div className={`w-9 h-9 md:w-16 md:h-16 mx-auto rounded-full ${value.bg} flex items-center justify-center mb-2 md:mb-6`}>
                <value.icon className={`w-5 h-5 md:w-8 md:h-8 ${value.color}`} />
              </div>
              <h3 className="text-[10px] leading-tight sm:text-sm md:text-xl font-bold text-[#1B2A6B] dark:text-white">
                {value.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. Organisational Structure */}
      <section className="py-10 md:py-20 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-5 md:mb-8">
              Organisational Structure
            </h2>
            <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl max-w-4xl mx-auto border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center space-y-3 md:space-y-6">
                <div className="w-full max-w-xs bg-[#1B2A6B] text-white p-3 md:p-4 rounded-lg md:rounded-xl font-bold shadow-md text-sm md:text-base">
                  Founder & President
                </div>
                <div className="h-5 md:h-8 w-1 bg-slate-300 dark:bg-slate-600"></div>
                <div className="w-full max-w-xs bg-[#00BCD4] text-white p-3 md:p-4 rounded-lg md:rounded-xl font-bold shadow-md text-sm md:text-base">
                  Central Executive Committee
                </div>
                <div className="h-5 md:h-8 w-1 bg-slate-300 dark:bg-slate-600"></div>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 w-full">
                  <div className="bg-[#4CAF50] text-white p-2 md:p-4 rounded-lg md:rounded-xl font-semibold shadow-md text-xs md:text-base">Provincial Chapters</div>
                  <div className="bg-[#FFC107] text-slate-900 p-2 md:p-4 rounded-lg md:rounded-xl font-semibold shadow-md text-xs md:text-base">HWO Wing</div>
                  <div className="bg-purple-500 text-white p-2 md:p-4 rounded-lg md:rounded-xl font-semibold shadow-md text-xs md:text-base">Specialized Councils</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Governance */}
      <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#1B2A6B] dark:text-white mb-2 md:mb-4">
            Our Governance
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            YDP is committed to maintaining the highest standards of democratic governance,
            transparency, and ethical conduct.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
          {[
            { title: "Democratic Processes", desc: "Regular elections and consensus-based decision making." },
            { title: "Financial Transparency", desc: "Strict auditing and open financial reporting." },
            { title: "Merit-based Selection", desc: "Equal opportunities for all members based on merit." },
            { title: "Code of Conduct", desc: "Adherence to ethical standards and organizational values." },
            { title: "Constitutional Compliance", desc: "Operations governed by a comprehensive constitution." },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <Scale className="w-5 h-5 md:w-8 md:h-8 text-[#00BCD4] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm md:text-lg font-bold text-[#1B2A6B] dark:text-white mb-0.5 md:mb-2">{item.title}</h4>
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. Founder Message */}
      <section className="py-10 md:py-20 bg-[#1B2A6B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-64 sm:h-96 md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border-4 border-[#FFC107]/20 bg-slate-700"
            >
              <Image src={images.founder} alt="Hamza Rehman, Founder and President" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1B2A6B] to-transparent p-4 md:p-8">
                <h3 className="text-lg md:text-3xl font-bold text-[#FFC107]">Hamza Rehman</h3>
                <p className="text-sm md:text-xl">Founder & President, YDP</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-8">Message from the Founder</h2>
              <div className="space-y-3 md:space-y-6 text-sm md:text-lg text-slate-200 font-light leading-relaxed">
                <p>
                  "The youth of Pakistan represent our greatest asset and our most profound
                  hope for the future. When we founded the Youth Development Program, we
                  envisioned a platform that would not just echo the voices of the youth,
                  but amplify them into actionable change."
                </p>
                <p>
                  "We believe that true leadership is not about holding power, but about
                  empowering others. Through YDP and our welfare wing HWO, we are cultivating
                  a generation that is deeply rooted in empathy, driven by innovation, and
                  committed to national progress."
                </p>
                <p>
                  "I invite every passionate young Pakistani to join us on this transformative
                  journey. Together, we can and will shape a future that we can all be proud of."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="py-14 md:py-24 bg-gradient-to-br from-[#00BCD4] to-[#1B2A6B] text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-6">Ready to Make an Impact?</h2>
          <p className="text-sm md:text-xl mb-6 md:mb-10 text-slate-200">
            Join our network of young leaders and be part of Pakistan's premier youth organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link
              href="/membership"
              className="px-6 py-3 md:px-8 md:py-4 bg-[#FFC107] text-[#1B2A6B] font-bold rounded-full hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors text-sm md:text-base"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

