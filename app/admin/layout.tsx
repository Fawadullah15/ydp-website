'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Calendar, Newspaper, Image as ImageIcon, 
  Crown, Building, Heart, Award, FolderOpen, Mail, Handshake, 
  Settings, Activity, Bell, Menu, X, LogOut, ChevronRight, Rss
} from 'lucide-react';

import { NotificationBell } from '@/components/admin/AdminNavbar';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'News & Blogs', href: '/admin/news', icon: Newspaper },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Province Management', href: '/admin/provinces', icon: Building },
  { name: 'Leadership', href: '/admin/leadership', icon: Crown },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Heart },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Resources', href: '/admin/resources', icon: FolderOpen },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail },
  { name: 'Sponsors', href: '/admin/sponsors', icon: Handshake },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Rss },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Activity Logs', href: '/admin/activity', icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const displayName = !user?.name || user.name === 'Admin User' ? 'Admin Fawadullah Imraj' : user.name;

  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/login', { method: 'DELETE' });
    } catch {}
    localStorage.removeItem('admin_user');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 text-white transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">YDP</span>
            </div>
            <span className="text-lg font-bold text-white">Admin <span className="text-cyan-400">Panel</span></span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href + '/')) ||
              (item.href !== '/admin' && pathname === item.href);
            const isExactDashboard = item.href === '/admin' && pathname === '/admin';
            const active = isExactDashboard || (item.href !== '/admin' && (pathname === item.href || pathname.startsWith(item.href + '/')));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 group
                  ${active 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                  }
                `}
              >
                <item.icon className={`w-4.5 h-4.5 mr-3 flex-shrink-0 ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} style={{width:'18px', height:'18px'}} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {displayName[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <span className="text-gray-600">Admin</span>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-700" />
              <span className="text-gray-200 font-medium capitalize">
                {pathname.split('/')[2]?.replace(/-/g, ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link 
              href="/" 
              className="text-xs text-gray-500 hover:text-gray-300 hidden sm:block transition-colors"
              target="_blank"
            >
              View Site ↗
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
              {displayName[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
