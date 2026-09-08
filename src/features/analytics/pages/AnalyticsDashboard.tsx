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
import { BarChart3, Bus, CheckCircle2, Navigation, Activity } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';

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
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-xs">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Buses & Operations Analytics
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Historical transit operations intelligence: utilization metrics, schedule adherence, and daily travel span.
            </p>
          </div>
        </div>
      </div>

      {/* Transit Operations Analytics View */}
      <div className="space-y-6">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="BUS UTILIZATION"
            value="88.9%"
            subtext="8 of 9 buses active"
            status="teal"
            icon={Bus}
          />
          <KPICard
            title="SCHEDULE ADHERENCE"
            value="96.8%"
            subtext="On-time corridor departures"
            status="info"
            icon={CheckCircle2}
          />
          <KPICard
            title="AVG DAILY BUS SPAN"
            value="1,467 km"
            subtext="Combined network daily"
            status="dark"
            icon={Navigation}
          />
          <KPICard
            title="GPS TELEMETRY HEALTH"
            value="99.4%"
            subtext="Telemetry packet reliability"
            status="orange"
            icon={Activity}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Daily Distance Traveled AreaChart (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily Distance Traveled (km) — Past 7 Days
                </h3>
                <p className="text-xs text-slate-400">Peak operational rush hours vs regular transit distance comparison</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563eb] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  ● Peak Hours: 6,120 km
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                  ● Regular Hours: 4,150 km
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  Total: 10,270 km
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyDistance}>
                  <defs>
                    <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOffPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      fontSize: 12,
                      backgroundColor: '#0f172a',
                      border: 'none',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="peakHoursKm"
                    name="Peak Hours (km)"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPeak)"
                  />
                  <Area
                    type="monotone"
                    dataKey="offPeakKm"
                    name="Regular Hours (km)"
                    stroke="#64748b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorOffPeak)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bus Status Donut PieChart (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bus Status Distribution
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
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {fleetUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, fontSize: 12, backgroundColor: '#0f172a', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
              {fleetUtilization.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span style={{ backgroundColor: item.color }} className="h-2.5 w-2.5 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
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
