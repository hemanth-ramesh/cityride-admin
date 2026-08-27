import { create } from 'zustand';
import { LiveVehicleTelemetry, SystemHealthStatus } from '@/types/telemetry';

interface LiveFleetState {
  vehicles: LiveVehicleTelemetry[];
  selectedVehicleId: string | null;
  selectedRouteCode: string | null;
  activeFilter: 'ALL' | 'ON_TIME' | 'DELAYED' | 'EMERGENCY' | 'OFFLINE';
  isLiveTrackingActive: boolean;
  health: SystemHealthStatus;
  
  // Actions
  setVehicles: (vehicles: LiveVehicleTelemetry[]) => void;
  updateVehiclePosition: (vehicleId: string, telemetryUpdate: Partial<LiveVehicleTelemetry>) => void;
  selectVehicle: (vehicleId: string | null) => void;
  selectRoute: (routeCode: string | null) => void;
  setActiveFilter: (filter: 'ALL' | 'ON_TIME' | 'DELAYED' | 'EMERGENCY' | 'OFFLINE') => void;
  toggleLiveTracking: () => void;
  setHealth: (health: Partial<SystemHealthStatus>) => void;
}

export const useLiveFleetStore = create<LiveFleetState>((set) => ({
  vehicles: [],
  selectedVehicleId: null,
  selectedRouteCode: null,
  activeFilter: 'ALL',
  isLiveTrackingActive: true,
  health: {
    gpsStream: 'healthy',
    supabaseRealtime: 'connected',
    databaseLatencyMs: 42,
    activeVehiclesCount: 0,
    lastSyncTimestamp: new Date().toISOString(),
  },

  setVehicles: (vehicles) =>
    set((state) => ({
      vehicles,
      health: {
        ...state.health,
        activeVehiclesCount: vehicles.length,
        lastSyncTimestamp: new Date().toISOString(),
      },
    })),

  updateVehiclePosition: (vehicleId, telemetryUpdate) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.vehicleId === vehicleId ? { ...v, ...telemetryUpdate, lastUpdated: new Date().toISOString() } : v
      ),
      health: {
        ...state.health,
        lastSyncTimestamp: new Date().toISOString(),
      },
    })),

  selectVehicle: (vehicleId) => set({ selectedVehicleId: vehicleId }),
  selectRoute: (routeCode) => set({ selectedRouteCode: routeCode }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  toggleLiveTracking: () => set((state) => ({ isLiveTrackingActive: !state.isLiveTrackingActive })),
  setHealth: (healthUpdate) =>
    set((state) => ({
      health: { ...state.health, ...healthUpdate },
    })),
}));
