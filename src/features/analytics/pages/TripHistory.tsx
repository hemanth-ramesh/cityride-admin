import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { HistoricalTripDetail } from '@/types/analytics';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { GPSReplay } from '../components/GPSReplay';
import { AnalyticsNavigationTabs } from '../components/AnalyticsNavigationTabs';
import { TableColumn } from '@/types';
import {
  Navigation,
  Play,
  Clock,
  Bus,
  User,
  Calendar,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const TripHistory: React.FC = () => {
  const { historicalTrips, isLoading } = useAnalytics();
  const [selectedTripForReplay, setSelectedTripForReplay] = useState<HistoricalTripDetail | null>(null);

  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTrips = historicalTrips.filter((t) => {
    const matchesRoute = routeFilter === 'ALL' || t.routeCode === routeFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesRoute && matchesStatus;
  });

  const columns: TableColumn<HistoricalTripDetail>[] = [
    {
      key: 'tripCode',
      header: 'Trip # / Code',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.tripCode}</span>
          <span className="text-[10px] text-slate-400">
            {row.date} ({row.shift})
          </span>
        </div>
      ),
    },
    {
      key: 'routeCode',
      header: 'Corridor Route',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span className="rounded bg-brand-100 px-2 py-0.5 font-mono text-xs font-black text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            {row.routeCode}
          </span>
          <div className="flex flex-col text-xs">
            <span className="font-bold text-slate-900 dark:text-white">{row.routeName}</span>
            <span className="text-[10px] text-slate-400">
              {row.originStopName.split(' ')[0]} → {row.destinationStopName.split(' ')[0]}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'plateNumber',
      header: 'Vehicle & Driver',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-brand-800 dark:text-brand-300">{row.plateNumber}</span>
          <span className="text-[10px] text-slate-500">{row.driverName}</span>
        </div>
      ),
    },
    {
      key: 'scheduledDeparture',
      header: 'Times & Variance',
      render: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {row.actualDeparture} → {row.actualArrival}
          </span>
          <span className={`text-[10px] ${row.delayMinutes > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {row.delayMinutes > 0 ? `+${row.delayMinutes}m Late` : 'On Schedule'} (Plan: {row.scheduledDeparture})
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trip Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'GPS Breadcrumbs',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedTripForReplay(row)}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition"
        >
          <Play className="h-3 w-3" />
          <span>GPS Replay</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <AnalyticsNavigationTabs />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Trip History & GPS Breadcrumb Playback
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Query past completed transit runs, analyze schedule deviations, and replay historical GPS trajectories.
          </p>
        </div>

        {/* Route Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-occ-darkCard dark:text-slate-200"
          >
            <option value="ALL">All Route Corridors</option>
            <option value="R01">Route R01</option>
            <option value="R02">Route R02</option>
            <option value="R03">Route R03</option>
            <option value="R04">Route R04</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search trip code, route, plate number, driver..."
      />

      {/* GPS Replay Player Modal */}
      <Modal
        isOpen={Boolean(selectedTripForReplay)}
        onClose={() => setSelectedTripForReplay(null)}
        title="Historical GPS Breadcrumb Playback"
        description="Scrub through historical waypoints, route trajectory, and station stop arrivals."
        size="2xl"
      >
        {selectedTripForReplay && (
          <GPSReplay trip={selectedTripForReplay} />
        )}
      </Modal>
    </div>
  );
};
