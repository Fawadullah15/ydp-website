"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const PROVINCES = [
  { name: 'Punjab', href: '/provinces/punjab' },
  { name: 'KPK', href: '/provinces/kpk' },
  { name: 'Sindh', href: '/provinces/sindh' },
  { name: 'Balochistan', href: '/provinces/balochistan' },
  { name: 'Kashmir', href: '/provinces/kashmir' },
];


const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Leadership', href: '/leadership' },
  { name: 'Events', href: '/events' },
  { name: 'News', href: '/news' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [branding, setBranding] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    fetch('/api/settings').then((response) => response.ok ? response.json() : {}).then(setBranding).catch(() => {});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!branding.site_favicon) return;
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = branding.site_favicon;
  }, [branding.site_favicon]);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-[#0c1b4d] shadow-[0_4px_16px_rgba(0,0,0,.18)] py-3' : 'bg-[#0c1b4d]/88 py-4'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={closeMenu} prefetch={false} className="flex items-center gap-2 group">
            <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/70 bg-white p-1 shadow-sm transition duration-200 group-hover:scale-[1.03]">
              <img src={branding.site_logo || '/images/gallery/ydp-logo.jpg'} alt="YDP Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight leading-tight text-white">
              {branding.site_name || 'YDP'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
            <div className="flex items-center">
              {/* Main Links */}
              {NAV_LINKS.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className={`relative px-3 py-2 text-sm font-semibold transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#f7c948] ${
                    pathname === link.href
                      ? 'text-[#f7c948] font-bold after:scale-x-100'
                      : 'text-white/90 hover:text-[#f7c948] after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Provinces Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('provinces')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center px-3 py-2 text-sm font-semibold transition-colors ${
                    pathname.startsWith('/provinces')
                      ? 'text-[#FFC107] font-bold'
                      : 'text-white hover:text-[#FFC107]'
                  }`}>
                  Provinces <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'provinces' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                    >
                      <div className="py-1">
                        {PROVINCES.map((province) => (
                          <Link prefetch={false}
                            key={province.name}
                            href={province.href}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {province.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining Links */}
              {NAV_LINKS.slice(3).map((link) => (
                <Link prefetch={false}
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? 'text-[#FFC107] font-bold'
                      : 'text-white hover:text-[#FFC107]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-2 border-l border-border/30 pl-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-full transition-colors ${
                  scrolled ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent/10 dark:text-white'
                }`}
                aria-label="Toggle Dark Mode"
              >
                {mounted ? (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
              </button>
              <Link prefetch={false}
                href="/membership"
                className="rounded-lg bg-[#f7c948] px-5 py-2.5 text-sm font-extrabold text-[#0c1b4d] shadow-sm transition duration-200 hover:bg-[#ffda6a]"
              >
                Join Us
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-full ${scrolled ? 'text-white' : 'text-foreground dark:text-white'}`}
            >
              {mounted ? (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-white' : 'text-foreground dark:text-white'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-[#0c1b4d]/98 backdrop-blur-2xl lg:hidden pb-12"
          >
            <div className="container-custom flex flex-col gap-4 py-4 px-4">
              {/* Primary Action Button at Top */}
              <Link prefetch={false}
                href="/membership"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#f7c948] py-2.5 px-4 text-sm font-extrabold text-[#0c1b4d] shadow-md transition duration-200 hover:bg-[#ffda6a]"
              >
                Join Us
              </Link>

              {/* Compact Nav Links Grid */}
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link prefetch={false}
                      key={link.name}
                      href={link.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#f7c948]/15 text-[#f7c948] border border-[#f7c948]/30 font-bold'
                          : 'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Provinces Section */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Provinces
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PROVINCES.map((p) => {
                    const isActive = pathname === p.href;
                    return (
                      <Link prefetch={false}
                        key={p.name}
                        href={p.href}
                        onClick={closeMenu}
                        className={`text-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? 'bg-[#f7c948] text-[#0c1b4d] font-bold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        {p.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
