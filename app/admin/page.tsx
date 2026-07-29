'use client';
import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, Calendar, Newspaper, Heart, Plus, CheckCircle, MessageSquare, TrendingUp, Activity, Award } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#a855f7'];

interface DashboardStats {
  members: { total: number; pending: number };
  events: { total: number; upcoming: number };
  news: { total: number };
  volunteers: { total: number; pending: number };
  contacts: { total: number };
  memberGrowth: Array<{ name: string; members: number }>;
  provinceData: Array<{ name: string; value: number }>;
  recentActivity: Array<{ id: string; action: string; details: string; date: string; user?: { name: string } }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    window.addEventListener('focus', fetchStats);
    return () => window.removeEventListener('focus', fetchStats);
  }, []);
  const lineData = stats?.memberGrowth || [];
  const provinceData = stats?.provinceData || [];

  const CustomTooltipStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#f3f4f6',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back. Here's what's happening with YDP.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events/create" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="Total Members" 
          value={loading ? "..." : (stats?.members?.total ?? 0).toString()} 
          icon={Users} 
          color="blue"
          badge={stats?.members?.pending ? { text: `${stats.members.pending} Pending` } : undefined}
        />
        <StatsCard 
          label="Upcoming Events" 
          value={loading ? "..." : (stats?.events?.upcoming ?? 0).toString()} 
          icon={Calendar} 
          color="cyan"
        />
        <StatsCard 
          label="Published Articles" 
          value={loading ? "..." : (stats?.news?.total ?? 0).toString()} 
          icon={Newspaper} 
          color="green"
        />
        <StatsCard 
          label="Pending Volunteers" 
          value={loading ? "..." : (stats?.volunteers?.pending ?? 0).toString()} 
          icon={Heart} 
          color="rose"
          badge={stats?.volunteers?.pending ? { text: 'Action Needed', color: 'bg-rose-900/50 text-rose-300 ring-1 ring-rose-500/30' } : undefined}
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Events" value={loading ? "..." : (stats?.events?.total ?? 0).toString()} icon={Calendar} color="amber" />
        <StatsCard label="Contact Messages" value={loading ? "..." : (stats?.contacts?.total ?? 0).toString()} icon={MessageSquare} color="purple" />
        <StatsCard label="Total Volunteers" value={loading ? "..." : (stats?.volunteers?.total ?? 0).toString()} icon={Award} color="green" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-6">Member Growth (Last 7 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Line type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2.5} dot={{r: 3, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col">
          <h3 className="text-base font-semibold text-white mb-6">Members by Province</h3>
          <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={provinceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {provinceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CustomTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-1.5 mt-4">
            {provinceData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-400">{entry.name}</span>
                </div>
                <span className="text-gray-300 font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <Link href="/admin/activity" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse flex gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : stats?.recentActivity?.length ? (
              stats.recentActivity.slice(0, 6).map((activity, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-3 hover:bg-gray-800/40 transition-colors">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{activity.details || activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user?.name || 'System'} • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded flex-shrink-0">{activity.action}</span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-gray-500 text-sm">No recent activity</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-5">Quick Actions</h3>
          <div className="space-y-2.5">
            <Link href="/admin/news/create" className="w-full flex items-center p-3 text-left border border-gray-800 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Newspaper className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Add News Article</span>
            </Link>
            <Link href="/admin/events/create" className="w-full flex items-center p-3 text-left border border-gray-800 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Add Event</span>
            </Link>
            <Link href="/admin/members" className="w-full flex items-center p-3 text-left border border-gray-800 rounded-lg hover:border-green-500/50 hover:bg-green-500/5 transition-all group">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Approve Members</span>
            </Link>
            <Link href="/admin/contacts" className="w-full flex items-center p-3 text-left border border-gray-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group relative">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">View Messages</span>
              {stats?.contacts?.total ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.contacts.total > 9 ? '9+' : stats.contacts.total}</span>
              ) : null}
            </Link>
            <Link href="/admin/volunteers" className="w-full flex items-center p-3 text-left border border-gray-800 rounded-lg hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Review Volunteers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
