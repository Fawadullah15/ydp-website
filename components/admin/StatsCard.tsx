import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  badge?: {
    text: string;
    color?: string;
  };
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', ring: 'ring-cyan-500/20' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'ring-green-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-rose-500/20' },
};

export function StatsCard({ label, value, icon: Icon, trend, badge, color = 'blue' }: StatsCardProps) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col gap-4 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 ${c.bg} rounded-lg ring-1 ${c.ring}`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color || 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/30'}`}>
            {badge.text}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <span className={`text-sm font-medium flex items-center gap-0.5 ${trend.isUp ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
