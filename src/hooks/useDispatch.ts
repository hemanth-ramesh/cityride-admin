import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DispatchService } from '@/services/dispatchService';
import { Duty, ScheduledTrip, ScheduledTripStatus } from '@/types/dispatch';

export const DISPATCH_KEYS = {
  duties: (date?: string) => ['dispatch', 'duties', date || 'all'] as const,
  trips: (date?: string) => ['dispatch', 'trips', date || 'all'] as const,
};

export function useDuties(date?: string) {
  const queryClient = useQueryClient();

  const dutiesQuery = useQuery({
    queryKey: DISPATCH_KEYS.duties(date),
    queryFn: () => DispatchService.getDuties(date),
  });

  const createDutyMutation = useMutation({
    mutationFn: (data: Omit<Duty, 'id' | 'dutyCode' | 'tripsCount' | 'tripsCompleted' | 'createdAt'>) =>
      DispatchService.createDuty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'duties'] });
    },
  });

  const updateDutyMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Duty> }) =>
      DispatchService.updateDuty(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'duties'] });
    },
  });

  const deleteDutyMutation = useMutation({
    mutationFn: (id: string) => DispatchService.deleteDuty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'duties'] });
    },
  });

  return {
    duties: dutiesQuery.data || [],
    isLoading: dutiesQuery.isLoading,
    isError: dutiesQuery.isError,
    createDuty: createDutyMutation.mutateAsync,
    updateDuty: updateDutyMutation.mutateAsync,
    deleteDuty: deleteDutyMutation.mutateAsync,
    isCreating: createDutyMutation.isPending,
  };
}

export function useScheduledTrips(date?: string) {
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: DISPATCH_KEYS.trips(date),
    queryFn: () => DispatchService.getScheduledTrips(date),
  });

  const generateTripsMutation = useMutation({
    mutationFn: (targetDate: string) => DispatchService.generateTripsForDate(targetDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips'] });
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'duties'] });
    },
  });

  const updateTripStatusMutation = useMutation({
    mutationFn: ({
      tripId,
      status,
      actualTime,
      delayMinutes,
    }: {
      tripId: string;
      status: ScheduledTripStatus;
      actualTime?: string;
      delayMinutes?: number;
    }) => DispatchService.updateTripStatus(tripId, status, actualTime, delayMinutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'trips'] });
    },
  });

  return {
    trips: tripsQuery.data || [],
    isLoading: tripsQuery.isLoading,
    isError: tripsQuery.isError,
    generateTrips: generateTripsMutation.mutateAsync,
    isGenerating: generateTripsMutation.isPending,
    updateTripStatus: updateTripStatusMutation.mutateAsync,
  };
}
