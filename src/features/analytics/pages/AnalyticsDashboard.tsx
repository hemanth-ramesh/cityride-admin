import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsNavigationTabs } from '../components/AnalyticsNavigationTabs';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const {
    fleetUtilization,
    dailyDistance,
    isLoading,
  } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <AnalyticsNavigationTabs />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Fleet Performance Analytics
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Historical fleet operations intelligence: utilization metrics, EV propulsion distribution, and daily travel span.
          </p>
        </div>
      </div>

      {/* Fleet Operations Analytics View */}
      <div className="space-y-6">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Fleet Utilization</span>
            <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">88.9%</p>
            <span className="text-[10px] text-slate-500">8 of 9 buses active</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">EV Fleet Ratio</span>
            <p className="mt-1 text-2xl font-black text-brand-700 dark:text-brand-400">44.4%</p>
            <span className="text-[10px] text-slate-500">4 Electric Buses in service</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg Daily Fleet Span</span>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">1,467 km</p>
            <span className="text-[10px] text-slate-500">Combined network daily</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">GPS Signal Reliability</span>
            <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">99.4%</p>
            <span className="text-[10px] text-slate-500">Telemetry packet health</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Daily Distance Traveled AreaChart (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily Distance Traveled (km) — Past 7 Days
                </h3>
                <p className="text-xs text-slate-400">Electric Vehicle (EV) vs Eco BS-VI Diesel comparison</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Total: 10,270 km
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyDistance}>
                  <defs>
                    <linearGradient id="colorEv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, backgroundColor: '#0f172a', color: '#fff' }} />
                  <Area type="monotone" dataKey="electricKm" name="Electric Fleet (km)" stroke="#059669" fillOpacity={1} fill="url(#colorEv)" />
                  <Area type="monotone" dataKey="dieselKm" name="Diesel Fleet (km)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorDiesel)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fleet Status Donut PieChart (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fleet Status Distribution
              </h3>
              <p className="text-xs text-slate-400">Current availability & maintenance split</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetUtilization}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {fleetUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, backgroundColor: '#0f172a', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
              {fleetUtilization.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span style={{ backgroundColor: item.color }} className="h-2.5 w-2.5 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.count} buses</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
