import {
  FleetUtilizationStat,
  PropulsionDistributionStat,
  DailyFleetDistanceStat,
  DriverPerformanceStat,
  RouteAnalyticsStat,
  HistoricalTripDetail,
  GPSBreadcrumbPoint,
} from '@/types/analytics';
import { SEED_ROUTES } from './masterDataService';

const TODAY_STR = new Date().toISOString().split('T')[0];

// ==========================================
// 1. FLEET ANALYTICS METRICS
// ==========================================
export const FLEET_UTILIZATION_DATA: FleetUtilizationStat[] = [
  { name: 'Active in Revenue Service', count: 8, color: '#059669' },
  { name: 'Depot Maintenance Inspection', count: 1, color: '#f59e0b' },
  { name: 'Standby Reserve', count: 0, color: '#64748b' },
];

export const PROPULSION_DISTRIBUTION_DATA: PropulsionDistributionStat[] = [
  { type: 'Electric (Zero Emission EV)', count: 4, percentage: 44.4, color: '#10b981' },
  { type: 'Eco City Diesel (BS-VI)', count: 5, percentage: 55.6, color: '#3b82f6' },
];

export const DAILY_FLEET_DISTANCE_DATA: DailyFleetDistanceStat[] = [
  { day: 'Mon (18 Aug)', totalKm: 1420, peakHoursKm: 860, offPeakKm: 560 },
  { day: 'Tue (19 Aug)', totalKm: 1460, peakHoursKm: 890, offPeakKm: 570 },
  { day: 'Wed (20 Aug)', totalKm: 1390, peakHoursKm: 840, offPeakKm: 550 },
  { day: 'Thu (21 Aug)', totalKm: 1490, peakHoursKm: 910, offPeakKm: 580 },
  { day: 'Fri (22 Aug)', totalKm: 1540, peakHoursKm: 940, offPeakKm: 600 },
  { day: 'Sat (23 Aug)', totalKm: 1610, peakHoursKm: 980, offPeakKm: 630 },
  { day: 'Sun (24 Aug)', totalKm: 1350, peakHoursKm: 780, offPeakKm: 570 },
];

// ==========================================
// 2. DRIVER PERFORMANCE METRICS
// ==========================================
export const DRIVER_PERFORMANCE_DATA: DriverPerformanceStat[] = [
  { driverId: 'drv-001', driverName: 'Rajesh Kumar', driverCode: 'TUM-DRV-1042', tripsCompleted: 42, onTimePercentage: 96, incidentCount: 0, averageDelayMinutes: 1.2 },
  { driverId: 'drv-002', driverName: 'Basavaraj Hiremath', driverCode: 'TUM-DRV-1055', tripsCompleted: 38, onTimePercentage: 88, incidentCount: 1, averageDelayMinutes: 3.8 },
  { driverId: 'drv-003', driverName: 'Manjunath Swamy', driverCode: 'TUM-DRV-1089', tripsCompleted: 40, onTimePercentage: 94, incidentCount: 0, averageDelayMinutes: 1.5 },
  { driverId: 'drv-004', driverName: 'Siddaraju B. N.', driverCode: 'TUM-DRV-1021', tripsCompleted: 36, onTimePercentage: 91, incidentCount: 1, averageDelayMinutes: 2.1 },
  { driverId: 'drv-005', driverName: 'Chandrashekariah', driverCode: 'TUM-DRV-1102', tripsCompleted: 35, onTimePercentage: 95, incidentCount: 0, averageDelayMinutes: 1.1 },
  { driverId: 'drv-006', driverName: 'Lokesh Murthy', driverCode: 'TUM-DRV-1077', tripsCompleted: 33, onTimePercentage: 92, incidentCount: 0, averageDelayMinutes: 1.9 },
  { driverId: 'drv-007', driverName: 'Girish Gowda', driverCode: 'TUM-DRV-1033', tripsCompleted: 30, onTimePercentage: 86, incidentCount: 0, averageDelayMinutes: 4.2 },
  { driverId: 'drv-008', driverName: 'Ananda Kumar', driverCode: 'TUM-DRV-1099', tripsCompleted: 32, onTimePercentage: 97, incidentCount: 0, averageDelayMinutes: 0.9 },
];

// ==========================================
// 3. ROUTE CORRIDOR ANALYTICS
// ==========================================
export const ROUTE_ANALYTICS_DATA: RouteAnalyticsStat[] = [
  { routeCode: 'R01', routeName: 'KSRTC ↔ SIT Gate', dailyTrips: 18, scheduledTravelMinutes: 18, actualAvgTravelMinutes: 19.5, delayVarianceMinutes: 1.5, passengerRidershipDaily: 1420 },
  { routeCode: 'R02', routeName: 'KSRTC ↔ Siddaganga', dailyTrips: 16, scheduledTravelMinutes: 26, actualAvgTravelMinutes: 29.8, delayVarianceMinutes: 3.8, passengerRidershipDaily: 1650 },
  { routeCode: 'R03', routeName: 'Univ ↔ Heggere', dailyTrips: 14, scheduledTravelMinutes: 22, actualAvgTravelMinutes: 23.2, delayVarianceMinutes: 1.2, passengerRidershipDaily: 980 },
  { routeCode: 'R04', routeName: 'KSRTC ↔ Melekote Ind', dailyTrips: 15, scheduledTravelMinutes: 24, actualAvgTravelMinutes: 26.5, delayVarianceMinutes: 2.5, passengerRidershipDaily: 1350 },
  { routeCode: 'R05', routeName: 'Belagumba ↔ Badrama', dailyTrips: 12, scheduledTravelMinutes: 17, actualAvgTravelMinutes: 17.8, delayVarianceMinutes: 0.8, passengerRidershipDaily: 760 },
  { routeCode: 'R06', routeName: 'KSRTC ↔ Gulur', dailyTrips: 12, scheduledTravelMinutes: 20, actualAvgTravelMinutes: 21.4, delayVarianceMinutes: 1.4, passengerRidershipDaily: 820 },
  { routeCode: 'R07', routeName: 'KSRTC ↔ Gangasandra', dailyTrips: 10, scheduledTravelMinutes: 19, actualAvgTravelMinutes: 23.1, delayVarianceMinutes: 4.1, passengerRidershipDaily: 640 },
  { routeCode: 'R08', routeName: 'Univ ↔ Bellavi Hub', dailyTrips: 10, scheduledTravelMinutes: 28, actualAvgTravelMinutes: 28.9, delayVarianceMinutes: 0.9, passengerRidershipDaily: 710 },
];

// ==========================================
// 4. HISTORICAL TRIPS & GPS BREADCRUMBS
// ==========================================
export const SEED_HISTORICAL_TRIPS: HistoricalTripDetail[] = [
  {
    id: 'hist-001',
    tripCode: 'TRP-R01-0600',
    dutyCode: 'DUTY-20260824-01',
    date: TODAY_STR,
    shift: 'MORNING',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'SIT Back Gate',
    plateNumber: 'KA 06 F 8558',
    driverName: 'Rajesh Kumar',
    scheduledDeparture: '06:00',
    scheduledArrival: '06:18',
    actualDeparture: '06:01',
    actualArrival: '06:19',
    delayMinutes: 1,
    status: 'completed',
    totalDistanceKm: 6.2,
    averageSpeedKmph: 34.5,
    breadcrumbs: [
      { index: 0, timestamp: '06:01:00', latitude: 13.3395, longitude: 77.1005, speedKmph: 0, headingDegrees: 140, stopName: 'KSRTC Bus Stand Tumakuru', isStopArrival: true },
      { index: 1, timestamp: '06:03:30', latitude: 13.3375, longitude: 77.1025, speedKmph: 32, headingDegrees: 135 },
      { index: 2, timestamp: '06:05:00', latitude: 13.3360, longitude: 77.1042, speedKmph: 15, headingDegrees: 130, stopName: 'Ashoka Road Circle', isStopArrival: true },
      { index: 3, timestamp: '06:08:15', latitude: 13.3340, longitude: 77.1065, speedKmph: 38, headingDegrees: 125 },
      { index: 4, timestamp: '06:10:00', latitude: 13.3325, longitude: 77.1080, speedKmph: 0, headingDegrees: 125, stopName: 'Town Hall Tumakuru', isStopArrival: true },
      { index: 5, timestamp: '06:13:00', latitude: 13.3300, longitude: 77.1110, speedKmph: 42, headingDegrees: 120 },
      { index: 6, timestamp: '06:15:00', latitude: 13.3280, longitude: 77.1140, speedKmph: 10, headingDegrees: 115, stopName: 'SS Puram Circle', isStopArrival: true },
      { index: 7, timestamp: '06:17:00', latitude: 13.3255, longitude: 77.1180, speedKmph: 35, headingDegrees: 110 },
      { index: 8, timestamp: '06:19:00', latitude: 13.3235, longitude: 77.1215, speedKmph: 0, headingDegrees: 110, stopName: 'SIT Main Campus', isStopArrival: true },
    ],
  },
  {
    id: 'hist-002',
    tripCode: 'TRP-R02-0700',
    dutyCode: 'DUTY-20260824-02',
    date: TODAY_STR,
    shift: 'MORNING',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'Siddaganga Mutt',
    plateNumber: 'KA 06 FA 1234',
    driverName: 'Basavaraj Hiremath',
    scheduledDeparture: '07:00',
    scheduledArrival: '07:26',
    actualDeparture: '07:04',
    actualArrival: '07:31',
    delayMinutes: 5,
    status: 'completed',
    totalDistanceKm: 8.8,
    averageSpeedKmph: 29.0,
    breadcrumbs: [
      { index: 0, timestamp: '07:04:00', latitude: 13.3395, longitude: 77.1005, speedKmph: 0, headingDegrees: 120, stopName: 'KSRTC Bus Stand', isStopArrival: true },
      { index: 1, timestamp: '07:09:00', latitude: 13.3360, longitude: 77.1042, speedKmph: 22, headingDegrees: 118, stopName: 'Ashoka Road Circle', isStopArrival: true },
      { index: 2, timestamp: '07:14:00', latitude: 13.3310, longitude: 77.1160, speedKmph: 28, headingDegrees: 115, stopName: 'Mandi Pete Gate', isStopArrival: true },
      { index: 3, timestamp: '07:20:00', latitude: 13.3250, longitude: 77.1420, speedKmph: 36, headingDegrees: 110, stopName: 'Batawadi Junction', isStopArrival: true },
      { index: 4, timestamp: '07:26:00', latitude: 13.3210, longitude: 77.1550, speedKmph: 30, headingDegrees: 105, stopName: 'Kyathsandra', isStopArrival: true },
      { index: 5, timestamp: '07:31:00', latitude: 13.3180, longitude: 77.1680, speedKmph: 0, headingDegrees: 100, stopName: 'Siddaganga Mutt', isStopArrival: true },
    ],
  },
  {
    id: 'hist-003',
    tripCode: 'TRP-R03-0845',
    dutyCode: 'DUTY-20260824-03',
    date: TODAY_STR,
    shift: 'MORNING',
    routeCode: 'R03',
    routeName: 'Tumkur Univ ↔ Heggere',
    originStopName: 'Tumkur University',
    destinationStopName: 'Heggere',
    plateNumber: 'KA 06 G 4321',
    driverName: 'Manjunath Swamy',
    scheduledDeparture: '08:45',
    scheduledArrival: '09:07',
    actualDeparture: '08:45',
    actualArrival: '09:07',
    delayMinutes: 0,
    status: 'completed',
    totalDistanceKm: 7.4,
    averageSpeedKmph: 35.2,
    breadcrumbs: [
      { index: 0, timestamp: '08:45:00', latitude: 13.3440, longitude: 77.0980, speedKmph: 0, headingDegrees: 180, stopName: 'Tumkur University', isStopArrival: true },
      { index: 1, timestamp: '08:50:00', latitude: 13.3350, longitude: 77.0920, speedKmph: 38, headingDegrees: 190, stopName: 'Gubbi Gate Circle', isStopArrival: true },
      { index: 2, timestamp: '08:56:00', latitude: 13.3290, longitude: 77.0860, speedKmph: 40, headingDegrees: 195, stopName: 'Shettyhalli Cross', isStopArrival: true },
      { index: 3, timestamp: '09:01:00', latitude: 13.3180, longitude: 77.0780, speedKmph: 35, headingDegrees: 200, stopName: 'Dibbur Gate', isStopArrival: true },
      { index: 4, timestamp: '09:07:00', latitude: 13.3050, longitude: 77.0700, speedKmph: 0, headingDegrees: 200, stopName: 'Heggere Suburb', isStopArrival: true },
    ],
  },
];

export const AnalyticsService = {
  async getFleetUtilization(): Promise<FleetUtilizationStat[]> {
    return FLEET_UTILIZATION_DATA;
  },

  async getPropulsionDistribution(): Promise<PropulsionDistributionStat[]> {
    return PROPULSION_DISTRIBUTION_DATA;
  },

  async getDailyFleetDistance(): Promise<DailyFleetDistanceStat[]> {
    return DAILY_FLEET_DISTANCE_DATA;
  },

  async getDriverPerformance(): Promise<DriverPerformanceStat[]> {
    return DRIVER_PERFORMANCE_DATA;
  },

  async getRouteAnalytics(): Promise<RouteAnalyticsStat[]> {
    return ROUTE_ANALYTICS_DATA;
  },

  async getHistoricalTrips(): Promise<HistoricalTripDetail[]> {
    return SEED_HISTORICAL_TRIPS;
  },

  async getTripBreadcrumbs(tripId: string): Promise<HistoricalTripDetail | undefined> {
    return SEED_HISTORICAL_TRIPS.find((t) => t.id === tripId);
  },
};
