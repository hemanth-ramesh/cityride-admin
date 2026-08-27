export type GpsReliability = 'LIVE' | 'UPDATING' | 'DELAYED' | 'OFFLINE';

export type LiveVehicleStatus = 
  | 'on_time'
  | 'delayed'
  | 'severely_delayed'
  | 'offline'
  | 'emergency'
  | 'at_stop';

export interface LiveVehicleTelemetry {
  vehicleId: string;
  plateNumber: string;
  fleetNumber: string;
  fleetType: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  colorHex: string;
  latitude: number;
  longitude: number;
  speedKmph: number;
  headingDegrees: number;
  status: LiveVehicleStatus;
  gpsReliability: GpsReliability;
  currentStopIndex: number;
  totalStops: number;
  currentStopName: string;
  nextStopName: string;
  distanceToNextStopKm: number;
  etaToNextStopMinutes: number;
  delayMinutes: number;
  routeProgressPercent: number;
  isSosActive: boolean;
  passengerOccupancyPercent: number;
  lastUpdated: string;
}

export interface SystemHealthStatus {
  gpsStream: 'healthy' | 'degraded' | 'offline';
  supabaseRealtime: 'connected' | 'reconnecting' | 'disconnected';
  databaseLatencyMs: number;
  activeVehiclesCount: number;
  lastSyncTimestamp: string;
}
