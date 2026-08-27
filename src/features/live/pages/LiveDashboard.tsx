import React, { useState } from 'react';
import { useLiveVehicleTracking } from '@/hooks/useLiveVehicleTracking';
import { LiveFleetMap } from '../components/LiveFleetMap';
import { TripSidebar } from '../components/TripSidebar';
import { VehicleDetailDrawer } from '../components/VehicleDetailDrawer';
import { Radio, Play, Pause } from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  const {
    vehicles,
    allVehicles,
    selectedVehicle,
    activeFilter,
    isLiveTrackingActive,
    health,
    selectVehicle,
    setActiveFilter,
    toggleLiveTracking,
  } = useLiveVehicleTracking();

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSelectVehicle = (vehicleId: string | null) => {
    selectVehicle(vehicleId);
    if (vehicleId) {
      setIsDetailOpen(true);
    } else {
      setIsDetailOpen(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Telemetry Controller */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="h-6 w-6 text-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Live Operations Command Center
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-occ-muted dark:text-slate-400">
            Real-time Tumakuru transit network monitoring with 2.5s Driver GPS telemetry and route delay tracking.
          </p>
        </div>

        {/* Real-time Telemetry Status Pill & Stream Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Supabase Realtime: Connected ({health.databaseLatencyMs}ms)
            </span>
          </div>

          <button
            onClick={toggleLiveTracking}
            className={`inline-flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
              isLiveTrackingActive
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isLiveTrackingActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isLiveTrackingActive ? 'Pause Feed' : 'Resume Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Dual-Pane Command Center View: 70% Map / 30% Live Fleet Stream */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-170px)] min-h-[640px]">
        {/* Left Pane: Interactive Live Map (70% frame width) */}
        <div className="w-full lg:w-[70%] h-full">
          <LiveFleetMap
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            className="h-full"
          />
        </div>

        {/* Right Pane: Active Trip Monitoring Sidebar (30% frame width) */}
        <div className="w-full lg:w-[30%] h-full">
          <TripSidebar
            vehicles={allVehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
            className="h-full"
          />
        </div>
      </div>

      {/* Slide-in Detail Inspection Drawer on Vehicle Card / Marker Click */}
      {isDetailOpen && selectedVehicle && (
        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};
