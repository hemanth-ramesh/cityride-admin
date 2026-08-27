import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MasterDataService } from '@/services/masterDataService';
import { Driver, Vehicle, BusStop, TransitRoute, RouteSchedule } from '@/types/masterData';

// QUERY KEYS
export const MASTER_DATA_KEYS = {
  drivers: ['master-data', 'drivers'] as const,
  vehicles: ['master-data', 'vehicles'] as const,
  stops: ['master-data', 'stops'] as const,
  routes: ['master-data', 'routes'] as const,
  schedules: ['master-data', 'schedules'] as const,
};

// ====================
// DRIVER HOOKS
// ====================
export function useDrivers() {
  const queryClient = useQueryClient();

  const driversQuery = useQuery({
    queryKey: MASTER_DATA_KEYS.drivers,
    queryFn: () => MasterDataService.getDrivers(),
  });

  const createDriverMutation = useMutation({
    mutationFn: (data: Omit<Driver, 'id' | 'totalTripsCompleted' | 'onTimeRating' | 'incidentCount' | 'joinedDate'>) =>
      MasterDataService.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.drivers });
    },
  });

  const updateDriverMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Driver> }) =>
      MasterDataService.updateDriver(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.drivers });
    },
  });

  const deleteDriverMutation = useMutation({
    mutationFn: (id: string) => MasterDataService.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.drivers });
    },
  });

  return {
    drivers: driversQuery.data || [],
    isLoading: driversQuery.isLoading,
    isError: driversQuery.isError,
    createDriver: createDriverMutation.mutateAsync,
    updateDriver: updateDriverMutation.mutateAsync,
    deleteDriver: deleteDriverMutation.mutateAsync,
    isCreating: createDriverMutation.isPending,
    isUpdating: updateDriverMutation.isPending,
  };
}

// ====================
// VEHICLE HOOKS
// ====================
export function useVehicles() {
  const queryClient = useQueryClient();

  const vehiclesQuery = useQuery({
    queryKey: MASTER_DATA_KEYS.vehicles,
    queryFn: () => MasterDataService.getVehicles(),
  });

  const createVehicleMutation = useMutation({
    mutationFn: (data: Omit<Vehicle, 'id' | 'normalizedNumber' | 'lastOdometerKm'>) =>
      MasterDataService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.vehicles });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Vehicle> }) =>
      MasterDataService.updateVehicle(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.vehicles });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (id: string) => MasterDataService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.vehicles });
    },
  });

  return {
    vehicles: vehiclesQuery.data || [],
    isLoading: vehiclesQuery.isLoading,
    isError: vehiclesQuery.isError,
    createVehicle: createVehicleMutation.mutateAsync,
    updateVehicle: updateVehicleMutation.mutateAsync,
    deleteVehicle: deleteVehicleMutation.mutateAsync,
    isCreating: createVehicleMutation.isPending,
    isUpdating: updateVehicleMutation.isPending,
  };
}

// ====================
// BUS STOP HOOKS
// ====================
export function useStops() {
  const queryClient = useQueryClient();

  const stopsQuery = useQuery({
    queryKey: MASTER_DATA_KEYS.stops,
    queryFn: () => MasterDataService.getStops(),
  });

  const createStopMutation = useMutation({
    mutationFn: (data: Omit<BusStop, 'id' | 'createdAt' | 'updatedAt'>) =>
      MasterDataService.createStop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.stops });
    },
  });

  const updateStopMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BusStop> }) =>
      MasterDataService.updateStop(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.stops });
    },
  });

  const deleteStopMutation = useMutation({
    mutationFn: (id: string) => MasterDataService.deleteStop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.stops });
    },
  });

  return {
    stops: stopsQuery.data || [],
    isLoading: stopsQuery.isLoading,
    isError: stopsQuery.isError,
    createStop: createStopMutation.mutateAsync,
    updateStop: updateStopMutation.mutateAsync,
    deleteStop: deleteStopMutation.mutateAsync,
    isCreating: createStopMutation.isPending,
    isUpdating: updateStopMutation.isPending,
  };
}

// ====================
// ROUTE HOOKS
// ====================
export function useRoutes() {
  const queryClient = useQueryClient();

  const routesQuery = useQuery({
    queryKey: MASTER_DATA_KEYS.routes,
    queryFn: () => MasterDataService.getRoutes(),
  });

  const createRouteMutation = useMutation({
    mutationFn: (data: Omit<TransitRoute, 'id' | 'createdAt' | 'updatedAt' | 'activeBusesCount'>) =>
      MasterDataService.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.routes });
    },
  });

  const updateRouteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TransitRoute> }) =>
      MasterDataService.updateRoute(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.routes });
    },
  });

  const deleteRouteMutation = useMutation({
    mutationFn: (id: string) => MasterDataService.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.routes });
    },
  });

  return {
    routes: routesQuery.data || [],
    isLoading: routesQuery.isLoading,
    isError: routesQuery.isError,
    createRoute: createRouteMutation.mutateAsync,
    updateRoute: updateRouteMutation.mutateAsync,
    deleteRoute: deleteRouteMutation.mutateAsync,
    isCreating: createRouteMutation.isPending,
    isUpdating: updateRouteMutation.isPending,
  };
}

// ====================
// SCHEDULE HOOKS
// ====================
export function useSchedules() {
  const queryClient = useQueryClient();

  const schedulesQuery = useQuery({
    queryKey: MASTER_DATA_KEYS.schedules,
    queryFn: () => MasterDataService.getSchedules(),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RouteSchedule> }) =>
      MasterDataService.updateSchedule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.schedules });
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: (data: Omit<RouteSchedule, 'id'>) =>
      MasterDataService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_DATA_KEYS.schedules });
    },
  });

  return {
    schedules: schedulesQuery.data || [],
    isLoading: schedulesQuery.isLoading,
    isError: schedulesQuery.isError,
    updateSchedule: updateScheduleMutation.mutateAsync,
    createSchedule: createScheduleMutation.mutateAsync,
  };
}
