import React, { useState } from 'react';
import { LiveVehicleTelemetry } from '@/types/telemetry';
import {
  Bus,
  Search,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronRight,
  X,
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

  const onTimeCount = vehicles.filter((v) => !v.isSosActive && v.delayMinutes <= 2).length;
  const delayedCount = vehicles.filter((v) => !v.isSosActive && v.delayMinutes > 2).length;
  const sosCount = vehicles.filter((v) => v.isSosActive).length;

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.fleetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nextStopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.currentStopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={clsx('flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-slate-900 overflow-hidden', className)}>
      {/* Header & Search */}
      <div className="space-y-3 border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Live Fleet Stream
            </h2>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60">
            {filteredVehicles.length} Active
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bus plate, unit #, route, driver..."
            className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs - Segmented Control with Live Counters */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 dark:bg-slate-800/90 dark:border-slate-700/80">
          {[
            { key: 'ALL', label: 'All', count: vehicles.length },
            { key: 'ON_TIME', label: 'On Time', count: onTimeCount },
            { key: 'DELAYED', label: 'Delayed', count: delayedCount },
            { key: 'EMERGENCY', label: 'SOS', count: sosCount },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onChangeFilter(tab.key as any)}
                className={`rounded-full py-1.5 text-center text-[11px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm font-bold dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1 text-[10px] font-bold ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicles List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/40 dark:bg-slate-950/20">
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
                className={clsx(
                  'group relative cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 shadow-xs hover:shadow-md',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/25 dark:bg-brand-950/30 dark:border-brand-500'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                )}
              >
                {/* Top Row: Route Badge, Vehicle Plate, and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      style={{ backgroundColor: v.colorHex || '#059669' }}
                      className="flex h-7 min-w-9 items-center justify-center rounded-xl px-2 font-mono text-xs font-black text-white shadow-xs tracking-tight"
                    >
                      {v.routeCode}
                    </span>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white tracking-wide">
                          {v.plateNumber}
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="block font-mono text-[10px] text-slate-400 font-semibold leading-tight">
                        {v.fleetNumber}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  {v.isSosActive ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs animate-pulse">
                      <Flame className="h-3 w-3 shrink-0" />
                      <span>SOS ACTIVE</span>
                    </span>
                  ) : isDelayed ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>+{v.delayMinutes}m Late</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <span>On-Time</span>
                    </span>
                  )}
                </div>

                {/* Middle Box: Next Waypoint */}
                <div className="mt-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/50">
                  <div className="flex items-center space-x-2 min-w-0">
                    <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-medium text-slate-400 block leading-tight">Next Stop</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {v.nextStopName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Driver */}
                <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-[11px] truncate">
                    {v.driverName}
                  </span>
                </div>

                {/* Progress Milestone Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Stop {v.currentStopIndex || 1} of {v.totalStops || 8}</span>
                    <span>{v.routeProgressPercent}% completed</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all duration-300',
                        v.isSosActive
                          ? 'bg-rose-500'
                          : isDelayed
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-brand-600 to-emerald-500'
                      )}
                      style={{ width: `${v.routeProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

