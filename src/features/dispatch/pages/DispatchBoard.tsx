import React, { useState } from 'react';
import { useScheduledTrips } from '@/hooks/useDispatch';
import { ScheduledTrip, ScheduledTripStatus } from '@/types/dispatch';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DispatchNavigationTabs } from '../components/DispatchNavigationTabs';
import { Modal } from '@/components/ui/Modal';
import {
  GanttChartSquare,
  Clock,
  Bus,
  User,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export const DispatchBoard: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const { trips, isLoading, updateTripStatus } = useScheduledTrips(todayStr);

  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTripDetails, setSelectedTripDetails] = useState<ScheduledTrip | null>(null);

  const filteredTrips = trips.filter((t) => {
    const matchesRoute = routeFilter === 'ALL' || t.routeCode === routeFilter;
    const matchesSearch =
      !searchQuery ||
      t.tripCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  const handleQuickDispatch = async (trip: ScheduledTrip) => {
    const nowTime = new Date().toTimeString().slice(0, 5);
    await updateTripStatus({
      tripId: trip.id,
      status: 'active',
      actualTime: nowTime,
      delayMinutes: 0,
    });
  };

  const handleQuickComplete = async (trip: ScheduledTrip) => {
    await updateTripStatus({
      tripId: trip.id,
      status: 'completed',
    });
  };

  // Convert "HH:MM" to minute offset from 05:00 for Gantt positioning
  const timeToOffset = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m;
    const baseMinutes = 5 * 60; // 05:00 AM
    return Math.max(0, totalMinutes - baseMinutes);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <DispatchNavigationTabs />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <GanttChartSquare className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Today's Live Dispatch Board
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Timeline monitoring comparing planned schedule departure benchmarks against actual vehicle release.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-2.5">
          <div className="relative w-48 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plate, driver..."
              className="w-full rounded-full border border-slate-200/80 bg-slate-100/80 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 shadow-xs focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
            />
          </div>

          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="rounded-full border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs focus:bg-white focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
          >
            <option value="ALL">All Routes</option>
            <option value="R01">Route R01</option>
            <option value="R02">Route R02</option>
            <option value="R03">Route R03</option>
            <option value="R04">Route R04</option>
            <option value="R05">Route R05</option>
          </select>
        </div>
      </div>

      {/* Timeline Gantt / Operations Stack */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-occ-darkCard">
        {/* Board Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100/80 p-5 dark:border-slate-800/80">
          <div className="flex items-center space-x-3">
            <span className="flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500" />
            <span className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
              Active Dispatch Stream ({filteredTrips.length} scheduled lines)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>On Schedule</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Delayed (+3m)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Timeline Items Stack */}
        <div className="divide-y divide-slate-100/80 p-3 dark:divide-slate-800/80">
          {filteredTrips.map((trip) => {
            const isDelayed = trip.delayMinutes > 2 || trip.status === 'delayed';
            const progress =
              trip.status === 'completed'
                ? 100
                : trip.status === 'active'
                ? 60
                : trip.status === 'ready'
                ? 10
                : 0;

            return (
              <div
                key={trip.id}
                className="group flex flex-col justify-between gap-3 rounded-2xl p-4 transition hover:bg-slate-50/90 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center"
              >
                {/* Left: Trip Info */}
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300">
                    {trip.routeCode}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                        {trip.tripCode}
                      </span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {trip.plateNumber}
                      </span>
                      <StatusBadge status={trip.status} size="sm" pulse={trip.status === 'active'} />
                    </div>

                    <div className="mt-0.5 flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{trip.driverName}</span>
                      <span>•</span>
                      <span>{trip.originStopName.split(' ')[0]} → {trip.destinationStopName.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Planned vs Actual Dispatch Times & Delay */}
                <div className="flex flex-col sm:items-center">
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Planned</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {trip.scheduledDeparture}
                      </span>
                    </div>

                    <ArrowRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Actual / Status</span>
                      <span className={`font-bold ${isDelayed ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {trip.actualDeparture || 'Pending'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Variance</span>
                      <span className={`font-bold ${isDelayed ? 'text-amber-600' : 'text-slate-500'}`}>
                        {trip.delayMinutes > 0 ? `+${trip.delayMinutes}m` : '0m'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        trip.status === 'completed'
                          ? 'bg-blue-500'
                          : isDelayed
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex items-center space-x-2">
                  {trip.status === 'scheduled' || trip.status === 'ready' ? (
                    <button
                      onClick={() => handleQuickDispatch(trip)}
                      className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Dispatch Bus</span>
                    </button>
                  ) : trip.status === 'active' ? (
                    <button
                      onClick={() => handleQuickComplete(trip)}
                      className="inline-flex items-center space-x-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Complete Trip</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 italic">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
