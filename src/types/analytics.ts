export interface FleetUtilizationStat {
  name: string;
  count: number;
  color: string;
}

export interface PropulsionDistributionStat {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyFleetDistanceStat {
  day: string;
  totalKm: number;
  peakHoursKm: number;
  offPeakKm: number;
}

export interface DriverPerformanceStat {
  driverId: string;
  driverName: string;
  driverCode: string;
  tripsCompleted: number;
  onTimePercentage: number;
  incidentCount: number;
  averageDelayMinutes: number;
}

export interface RouteAnalyticsStat {
  routeCode: string;
  routeName: string;
  dailyTrips: number;
  scheduledTravelMinutes: number;
  actualAvgTravelMinutes: number;
  delayVarianceMinutes: number;
  passengerRidershipDaily: number;
}

export interface GPSBreadcrumbPoint {
  index: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  speedKmph: number;
  headingDegrees: number;
  stopName?: string;
  isStopArrival?: boolean;
}

export interface HistoricalTripDetail {
  id: string;
  tripCode: string;
  dutyCode: string;
  date: string;
  shift: string;
  routeCode: string;
  routeName: string;
  originStopName: string;
  destinationStopName: string;
  plateNumber: string;
  driverName: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string;
  actualArrival: string;
  delayMinutes: number;
  status: 'completed' | 'cancelled' | 'delayed';
  totalDistanceKm: number;
  averageSpeedKmph: number;
  breadcrumbs: GPSBreadcrumbPoint[];
}
