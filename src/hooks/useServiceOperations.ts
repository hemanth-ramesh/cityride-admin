import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceOperationsService } from '@/services/serviceOperationsService';
import {
  PassengerProfile,
  PassengerComplaint,
  LostAndFoundItem,
  PushNotification,
} from '@/types/service';

export const SERVICE_KEYS = {
  passengers: ['service', 'passengers'] as const,
  complaints: ['service', 'complaints'] as const,
  lostItems: ['service', 'lost-items'] as const,
  notifications: ['service', 'notifications'] as const,
};

export function usePassengers() {
  const queryClient = useQueryClient();

  const passengersQuery = useQuery({
    queryKey: SERVICE_KEYS.passengers,
    queryFn: () => ServiceOperationsService.getPassengers(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PassengerProfile['status'] }) =>
      ServiceOperationsService.updatePassengerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.passengers });
    },
  });

  return {
    passengers: passengersQuery.data || [],
    isLoading: passengersQuery.isLoading,
    updatePassengerStatus: updateStatusMutation.mutateAsync,
  };
}

export function useComplaints() {
  const queryClient = useQueryClient();

  const complaintsQuery = useQuery({
    queryKey: SERVICE_KEYS.complaints,
    queryFn: () => ServiceOperationsService.getComplaints(),
  });

  const assignComplaintMutation = useMutation({
    mutationFn: ({ id, assignedOfficer, assignedDepot }: { id: string; assignedOfficer: string; assignedDepot?: string }) =>
      ServiceOperationsService.assignComplaint(id, assignedOfficer, assignedDepot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.complaints });
    },
  });

  const resolveComplaintMutation = useMutation({
    mutationFn: ({ id, officialResponse, resolvedBy }: { id: string; officialResponse: string; resolvedBy: string }) =>
      ServiceOperationsService.resolveComplaint(id, officialResponse, resolvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.complaints });
    },
  });

  return {
    complaints: complaintsQuery.data || [],
    isLoading: complaintsQuery.isLoading,
    assignComplaint: assignComplaintMutation.mutateAsync,
    resolveComplaint: resolveComplaintMutation.mutateAsync,
  };
}

export function useLostAndFound() {
  const queryClient = useQueryClient();

  const lostItemsQuery = useQuery({
    queryKey: SERVICE_KEYS.lostItems,
    queryFn: () => ServiceOperationsService.getLostItems(),
  });

  const createLostItemMutation = useMutation({
    mutationFn: (data: Omit<LostAndFoundItem, 'id' | 'itemCode' | 'reportedAt'>) =>
      ServiceOperationsService.createLostItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lostItems });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LostAndFoundItem['status'] }) =>
      ServiceOperationsService.updateItemStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lostItems });
    },
  });

  const claimAndReturnMutation = useMutation({
    mutationFn: ({
      id,
      claimantName,
      claimantPhone,
      verifiedBy,
      notes,
    }: {
      id: string;
      claimantName: string;
      claimantPhone: string;
      verifiedBy: string;
      notes: string;
    }) => ServiceOperationsService.claimAndReturnItem(id, claimantName, claimantPhone, verifiedBy, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lostItems });
    },
  });

  return {
    lostItems: lostItemsQuery.data || [],
    isLoading: lostItemsQuery.isLoading,
    createLostItem: createLostItemMutation.mutateAsync,
    updateItemStatus: updateStatusMutation.mutateAsync,
    claimAndReturn: claimAndReturnMutation.mutateAsync,
  };
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: SERVICE_KEYS.notifications,
    queryFn: () => ServiceOperationsService.getNotifications(),
  });

  const sendNotificationMutation = useMutation({
    mutationFn: (data: Omit<PushNotification, 'id' | 'sentAt' | 'estimatedRecipients' | 'deliverySuccessCount'>) =>
      ServiceOperationsService.sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.notifications });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    sendNotification: sendNotificationMutation.mutateAsync,
    isSending: sendNotificationMutation.isPending,
  };
}
