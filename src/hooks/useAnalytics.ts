import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analyticsService';

export const ANALYTICS_KEYS = {
  fleetUtilization: ['analytics', 'fleet-utilization'] as const,
  propulsionDistribution: ['analytics', 'propulsion-distribution'] as const,
  dailyDistance: ['analytics', 'daily-distance'] as const,
  driverPerformance: ['analytics', 'driver-performance'] as const,
  routeAnalytics: ['analytics', 'route-analytics'] as const,
  historicalTrips: ['analytics', 'historical-trips'] as const,
  tripBreadcrumbs: (tripId: string) => ['analytics', 'trip-breadcrumbs', tripId] as const,
};

export function useAnalytics() {
  const fleetUtilizationQuery = useQuery({
    queryKey: ANALYTICS_KEYS.fleetUtilization,
    queryFn: () => AnalyticsService.getFleetUtilization(),
  });

  const propulsionQuery = useQuery({
    queryKey: ANALYTICS_KEYS.propulsionDistribution,
    queryFn: () => AnalyticsService.getPropulsionDistribution(),
  });

  const dailyDistanceQuery = useQuery({
    queryKey: ANALYTICS_KEYS.dailyDistance,
    queryFn: () => AnalyticsService.getDailyFleetDistance(),
  });

  const driverPerformanceQuery = useQuery({
    queryKey: ANALYTICS_KEYS.driverPerformance,
    queryFn: () => AnalyticsService.getDriverPerformance(),
  });

  const routeAnalyticsQuery = useQuery({
    queryKey: ANALYTICS_KEYS.routeAnalytics,
    queryFn: () => AnalyticsService.getRouteAnalytics(),
  });

  const historicalTripsQuery = useQuery({
    queryKey: ANALYTICS_KEYS.historicalTrips,
    queryFn: () => AnalyticsService.getHistoricalTrips(),
  });

  return {
    fleetUtilization: fleetUtilizationQuery.data || [],
    propulsionDistribution: propulsionQuery.data || [],
    dailyDistance: dailyDistanceQuery.data || [],
    driverPerformance: driverPerformanceQuery.data || [],
    routeAnalytics: routeAnalyticsQuery.data || [],
    historicalTrips: historicalTripsQuery.data || [],
    isLoading:
      fleetUtilizationQuery.isLoading ||
      propulsionQuery.isLoading ||
      dailyDistanceQuery.isLoading ||
      driverPerformanceQuery.isLoading ||
      routeAnalyticsQuery.isLoading ||
      historicalTripsQuery.isLoading,
  };
}

export function useTripBreadcrumbs(tripId: string) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.tripBreadcrumbs(tripId),
    queryFn: () => AnalyticsService.getTripBreadcrumbs(tripId),
    enabled: Boolean(tripId),
  });
}
