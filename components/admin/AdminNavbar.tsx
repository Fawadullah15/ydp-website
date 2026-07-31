'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ExternalLink, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Menu,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface NotificationItem {
  id: string;
  title: string;
  description?: string | null;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | string;
  isRead: boolean;
  link?: string | null;
  relatedId?: string | null;
  metadata?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, mutate } = useSWR<{
    notifications: NotificationItem[];
    unreadCount: number;
  }>('/api/admin/notifications', fetcher, {
    refreshInterval: 30000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount ?? 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI Update
    mutate(
      (current) => {
        if (!current) return current;
        return {
          ...current,
          unreadCount: Math.max(0, current.unreadCount - 1),
          notifications: current.notifications.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
          ),
        };
      },
      false
    );

    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      mutate();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      mutate();
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    // Optimistic UI Update
    mutate(
      (current) => {
        if (!current) return current;
        return {
          ...current,
          unreadCount: 0,
          notifications: current.notifications.map((item) => ({ ...item, isRead: true })),
        };
      },
      false
    );

    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      mutate();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      mutate();
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded">URGENT</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded">MEDIUM</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category?: string, priority?: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') {
      return <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
    }
    switch (category?.toUpperCase()) {
      case 'EVENT':
      case 'REGISTRATION':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  const formatTime = (dateInput: string | Date) => {
    try {
      return formatDistanceToNow(new Date(dateInput), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-gray-900 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Body / List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 min-h-[120px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-400" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400 text-xs">
                Failed to load notifications.
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Bell className="w-8 h-8 mx-auto text-gray-600 mb-2 opacity-50" />
                <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((item) => {
                const ContentWrapper = item.link ? Link : 'div';
                const wrapperProps = item.link ? { href: item.link, onClick: () => setIsOpen(false) } : {};

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors flex gap-3 group relative ${
                      !item.isRead ? 'bg-blue-950/20 hover:bg-blue-900/30' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    {/* Category / Icon */}
                    {getCategoryIcon(item.category, item.priority)}

                    {/* Notification Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <ContentWrapper {...(wrapperProps as any)}>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span
                            className={`text-xs font-semibold truncate ${
                              !item.isRead ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {item.title}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>

                        {item.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-1.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span>{formatTime(item.createdAt)}</span>
                          {item.link && (
                            <span className="inline-flex items-center gap-0.5 text-blue-400">
                              View <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </ContentWrapper>
                    </div>

                    {/* Unread indicator dot & Mark as read button */}
                    <div className="absolute right-3 top-3.5 flex items-center gap-1.5">
                      {!item.isRead && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <button
                            onClick={(e) => markAsRead(item.id, e)}
                            title="Mark as read"
                            className="p-1 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-gray-800 bg-gray-900/90 text-center sticky bottom-0 z-10">
              <span className="text-[11px] text-gray-500">
                Showing latest {notifications.length} notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminNavbar({
  setSidebarOpen,
  displayName,
  pathname = '',
}: {
  setSidebarOpen?: (open: boolean) => void;
  displayName?: string;
  pathname?: string;
}) {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
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
        {displayName && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
            {displayName[0]?.toUpperCase() || 'A'}
          </div>
        )}
      </div>
    </header>
  );
}
