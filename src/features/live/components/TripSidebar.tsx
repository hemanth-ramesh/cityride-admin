import React, { useState } from 'react';
import { LiveVehicleTelemetry } from '@/types/telemetry';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Bus,
  Search,
  Navigation,
  Clock,
  Gauge,
  Phone,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronRight,
  Filter,
  Radio,
} from 'lucide-react';
import { clsx } from 'clsx';

interface TripSidebarProps {
  vehicles: LiveVehicleTelemetry[];
  selectedVehicle: LiveVehicleTelemetry | null;
  onSelectVehicle: (vehicleId: string) => void;
  activeFilter: 'ALL' | 'ON_TIME' | 'DELAYED' | 'EMERGENCY' | 'OFFLINE';
  onChangeFilter: (filter: 'ALL' | 'ON_TIME' | 'DELAYED' | 'EMERGENCY' | 'OFFLINE') => void;
  className?: string;
}

export const TripSidebar: React.FC<TripSidebarProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  activeFilter,
  onChangeFilter,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.currentStopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={clsx('flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-occ-darkCard', className)}>
      {/* Header & Search */}
      <div className="space-y-3 border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase dark:text-white">
              Live Fleet Stream ({filteredVehicles.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">2.5s Telemetry</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by route, bus, driver, stop..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
          {(['ALL', 'ON_TIME', 'DELAYED', 'EMERGENCY'] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => onChangeFilter(filter)}
                className={`rounded-lg px-2.5 py-1 font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-brand-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicles List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 dark:divide-slate-800/80">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No live vehicles match the selected filter criteria.
          </div>
        ) : (
          filteredVehicles.map((v) => {
            const isSelected = selectedVehicle?.vehicleId === v.vehicleId;
            const isDelayed = v.delayMinutes > 2;

            return (
              <div
                key={v.vehicleId}
                onClick={() => onSelectVehicle(v.vehicleId)}
                className={`group cursor-pointer rounded-xl p-3 transition ${
                  isSelected
                    ? 'border border-brand-500 bg-brand-50/60 dark:bg-brand-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Top Line: Route & Plate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      style={{ backgroundColor: v.colorHex }}
                      className="flex h-6 w-8 items-center justify-center rounded-md font-mono text-[11px] font-black text-white shadow-xs"
                    >
                      {v.routeCode}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {v.plateNumber}
                    </span>
                  </div>

                  {v.isSosActive ? (
                    <span className="flex items-center space-x-1 rounded-md bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white animate-pulse">
                      <Flame className="h-3 w-3" />
                      <span>SOS ACTIVE</span>
                    </span>
                  ) : isDelayed ? (
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      +{v.delayMinutes}m Late
                    </span>
                  ) : (
                    <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      On-Time
                    </span>
                  )}
                </div>

                {/* Driver & Occupancy Strip */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {v.driverName}
                  </span>
                  <div className="flex items-center space-x-1 font-mono text-[10px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {v.passengerOccupancyPercent}% Occ
                    </span>
                  </div>
                </div>

                {/* Next Stop & ETA */}
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate max-w-[140px]">
                    Next: <strong className="text-slate-700 dark:text-slate-200">{v.nextStopName}</strong>
                  </span>
                  <span className="font-mono font-bold text-brand-700 dark:text-brand-400">
                    ETA {v.etaToNextStopMinutes} mins
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDelayed ? 'bg-amber-500' : 'bg-brand-600'
                    }`}
                    style={{ width: `${v.routeProgressPercent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
