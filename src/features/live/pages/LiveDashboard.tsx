import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveVehicleTracking } from '@/hooks/useLiveVehicleTracking';
import { LiveFleetMap } from '../components/LiveFleetMap';
import { TripSidebar } from '../components/TripSidebar';
import { VehicleDetailDrawer } from '../components/VehicleDetailDrawer';
import { Radio } from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const plateParam = searchParams.get('plate');
  const processedParamRef = useRef<string | null>(null);

  const {
    vehicles,
    allVehicles,
    selectedVehicle,
    activeFilter,
    isLiveTrackingActive,
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
    selectVehicle(null);
    processedParamRef.current = 'CLOSED';
    if (searchParams.has('plate') || searchParams.has('vehicleId')) {
      setSearchParams({}, { replace: true });
    }
  };

  // Auto-select and fly to vehicle if specified in query params (runs once per query param)
  useEffect(() => {
    const currentParam = `${plateParam || ''}_${vehicleIdParam || ''}`;
    if (currentParam === '_') return;

    if (processedParamRef.current !== currentParam && allVehicles.length > 0) {
      const match = allVehicles.find(
        (v) =>
          (plateParam &&
            v.plateNumber?.toLowerCase().replace(/\s+/g, '') ===
              plateParam.toLowerCase().replace(/\s+/g, '')) ||
          (vehicleIdParam &&
            (v.vehicleId?.toLowerCase() === vehicleIdParam.toLowerCase() ||
              v.fleetNumber?.toLowerCase() === vehicleIdParam.toLowerCase()))
      );
      if (match) {
        processedParamRef.current = currentParam;
        handleSelectVehicle(match.vehicleId);
      }
    }
  }, [vehicleIdParam, plateParam, allVehicles]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-xs">
          <Radio className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Live Operations Command Center
        </h1>
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

        {/* Right Pane: Live Trip Monitoring Stream */}
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

      {/* Pop-up Modal when clicked on the list or map */}
      {selectedVehicle && (
        <VehicleDetailDrawer
          isOpen={isDetailOpen}
          vehicle={selectedVehicle}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};
